/* ==========================================================================
   CARDIOSENSE AR - SYSTEM CENTRAL ORCHESTRATOR
   ========================================================================== */

import * as THREE from 'three';
import { ARManager } from './ar.js';
import { AnatomyLoader } from './loader.js';
import { HeartAnimator } from './animation.js';
import { AnatomyLabels } from './labels.js';
import { FPSCounter, captureScreenshot, triggerUINotification } from './utils.js';
import { ClinicalSpeechManager } from './speech.js';

class AppOrchestrator {
    constructor() {
        this.arManager = new ARManager('ar-container');
        this.loader = new AnatomyLoader();
        this.animator = new HeartAnimator();
        this.labels = new AnatomyLabels('labels-container');
        this.fpsCounter = new FPSCounter('fps-counter');
        this.speechManager = new ClinicalSpeechManager();

        this.heartModel = null;
        this.isolatedModel = null;
        this.clock = new THREE.Clock();
    }

    init() {
        console.log("CardioSense App Initializing...");

        // Setup Toolbar buttons
        this.bindUIEvents();

        // Load 3D Asset
        const progressBarFill = document.getElementById('progress-bar-fill');
        const progressText = document.getElementById('progress-text');
        const loaderOverlay = document.getElementById('loader-overlay');

        this.loader.loadHeartModel(
            this.arManager.renderer,
            (model) => {
                this.heartModel = model;

                
                // Hide Loader
                if (loaderOverlay) {
                    loaderOverlay.style.opacity = '0';
                    setTimeout(() => loaderOverlay.classList.add('hidden'), 500);
                }

                // Check if developer wants to export procedural meshes as GLB assets
                const urlParams = new URLSearchParams(window.location.search);
                if (urlParams.has('export_assets')) {
                    this.exportProceduralAssets(model);
                }

                // Start AR Engine
                this.startARFlow();
            },
            (pct) => {
                if (progressBarFill) progressBarFill.style.width = `${pct}%`;
                if (progressText) progressText.textContent = `${pct}%`;
            }
        );

        // Window resize hook
        window.addEventListener('resize', () => {
            if (this.arManager) this.arManager.handleResize();
        });
    }

    /**
     * Development utility to export and download each procedural mesh as an individual GLB asset file
     */
    exportProceduralAssets(model) {
        console.log('Exporting procedural meshes as GLB files...');
        import('./utils.js').then(({ exportGLB }) => {
            model.traverse((child) => {
                if (child.isMesh && child.userData && child.userData.partKey) {
                    const key = child.userData.partKey;
                    exportGLB(child, `${key}.glb`);
                }
            });
        });
        triggerUINotification("Asset downloads triggered", "success");
    }

    startARFlow() {
        const errorScreen = document.getElementById('permission-error-screen');
        const retryBtn = document.getElementById('btn-retry-permission');
        const bypassBtn = document.getElementById('btn-bypass-to-sim');

        const onTargetFound = () => {
            if (this.modelContainer) this.modelContainer.visible = true;
        };

        const onTargetLost = () => {
            if (this.modelContainer) this.modelContainer.visible = false;
        };

        const onInitFinished = (success) => {
            if (success) {
                // Initialize modelContainer and add to tracking anchor group
                this.modelContainer = new THREE.Group();
                this.arManager.heartAnchorGroup.add(this.modelContainer);

                // Center the heartModel and add to modelContainer
                this.heartModelCenterOffset = this.centerModel(this.heartModel);
                this.modelContainer.add(this.heartModel);

                // Init labels overlay map (triggers isolation mode on click)
                this.labels.init(this.heartModel, this.arManager.camera, (partKey) => {
                    this.enterIsolationMode(partKey);
                });

                // Init animation tracks
                this.animator.init(this.heartModel);

                // Setup touch/mouse drag-to-rotate events
                this.setupDragToRotate();

                // Start WebGL rendering frames
                this.startRenderLoop();

                const statusPill = document.getElementById('tracking-status');
                if (statusPill) {
                    statusPill.textContent = "SCANNING";
                    statusPill.className = "value status-pill text-amber";
                }
            } else {
                if (errorScreen) errorScreen.classList.remove('hidden');
            }
        };

        // Start MindAR
        this.arManager.startAR(onTargetFound, onTargetLost, onInitFinished);

        // Permission error button actions
        if (retryBtn) {
            retryBtn.onclick = () => {
                if (errorScreen) errorScreen.classList.add('hidden');
                this.arManager.startAR(onTargetFound, onTargetLost, onInitFinished);
            };
        }

        if (bypassBtn) {
            bypassBtn.onclick = () => {
                if (errorScreen) errorScreen.classList.add('hidden');
                this.activateSimulatorFlow(onTargetFound, onInitFinished);
            };
        }

        // Simulator button in card target modal
        const simFallbackBtn = document.getElementById('btn-sim-fallback');
        if (simFallbackBtn) {
            simFallbackBtn.onclick = () => {
                const targetModal = document.getElementById('target-modal');
                if (targetModal) targetModal.classList.add('hidden');
                this.activateSimulatorFlow(onTargetFound, onInitFinished);
            };
        }
    }

    activateSimulatorFlow(onFound, onInit) {
        this.arManager.startSimulator(onFound, (success) => {
            onInit(success);
            
            const statusPill = document.getElementById('tracking-status');
            if (statusPill) {
                statusPill.textContent = "SIM ACTIVE";
                statusPill.className = "value status-pill tracking-sim";
            }

            // Initialize gyroscope tilt controls for simulator mode
            this.initGyroscope();
        });
    }

    /**
     * Isolate a clicked anatomical structure.
     * Attempts to load a dedicated GLB model (e.g. assets/aorta.glb).
     * If not found, falls back to sub-mesh filtering of the loaded heart model.
     */
    enterIsolationMode(partKey) {
        if (!this.heartModel) return;

        const partNames = {
            "left_ventricle": "Left Ventricle",
            "right_ventricle": "Right Ventricle",
            "aorta": "Aorta",
            "left_auricle": "Left auricle (appendage)",
            "pulmonary_trunk": "Pulmonary trunk",
            "pulmonary_semilunar_valve": "Pulmonary (semilunar) valve",
            "right_atrium": "Right atrium",
            "tricuspid_valve": "Tricuspid valve",
            "chordae_tendineae": "Chordae tendineae",
            "papillary_muscles": "Papillary muscles",
            "trabeculae_carneae": "Trabeculae carneae",
            "right_ventricular_wall": "Right ventricular wall"
        };
        const displayName = partNames[partKey] || partKey;

        // Try to load dedicated isolated GLB model
        this.loader.loadIsolatedPartModel(
            partKey,
            (isolatedScene) => {
                // Hide full heart model
                this.heartModel.visible = false;

                // Clean up any existing isolated model
                if (this.isolatedModel) {
                    this.modelContainer.remove(this.isolatedModel);
                    this.disposeModelHierarchy(this.isolatedModel);
                }

                this.isolatedModel = isolatedScene;
                
                // Center the isolated model
                this.centerModel(this.isolatedModel);
                
                // Add to model container
                this.modelContainer.add(this.isolatedModel);

                 if (partKey === 'left_ventricle') {
                    // Inject 5 subpart anchors into the isolated scene
                    this.loader.mapLeftVentricleGLBParts(this.isolatedModel);
                    
                    // Re-initialize labels overlay with the isolated scene containing the 5 subparts
                    if (this.labels) {
                        this.labels.init(this.isolatedModel, this.arManager.camera, null);
                    }
                } else if (partKey === 'right_ventricle') {
                    // Inject 9 subpart anchors into the isolated scene
                    this.loader.mapRightVentricleGLBParts(this.isolatedModel);
                    
                    // Re-initialize labels overlay with the isolated scene containing the 9 subparts
                    if (this.labels) {
                        this.labels.init(this.isolatedModel, this.arManager.camera, null);
                    }
                } else {
                    // Create a temporary anchor object on the isolated model
                    const anchorObj = new THREE.Object3D();
                    anchorObj.position.set(0, 0, 0);
                    anchorObj.name = `anchor_isolated_${partKey}`;
                    isolatedScene.add(anchorObj);

                    // Update the active label's target anchor
                    if (this.labels) {
                        this.labels.updateIsolatedAnchor(partKey, anchorObj);
                    }
                }

                this.finalizeIsolationUI(partKey, displayName);
            },
            (error) => {
                console.warn(`Fallback to sub-mesh isolation for ${partKey} due to:`, error);
                this.applySubMeshIsolation(partKey, displayName);
            }
        );
    }

    /**
     * Sub-mesh visibility filtering fallback
     */
    applySubMeshIsolation(partKey, displayName) {
        let meshCount = 0;
        this.heartModel.traverse((child) => {
            if (child.isMesh) meshCount++;
        });

        this.heartModel.traverse((child) => {
            if (child.isMesh) {
                if (child.userData && child.userData.partKey) {
                    if (child.userData.partKey === partKey) {
                        child.visible = true;
                    } else {
                        if (meshCount > 1) child.visible = false;
                    }
                } else {
                    if (meshCount === 1) {
                        child.visible = true;
                    } else {
                        child.visible = false;
                    }
                }
            }
        });

        this.finalizeIsolationUI(partKey, displayName);
    }

    finalizeIsolationUI(partKey, displayName) {
        // Set Title
        const titleEl = document.getElementById('isolated-part-title');
        if (titleEl) {
            titleEl.textContent = displayName;
        }

        // Hide other labels (only if not left_ventricle/right_ventricle, which need all subparts visible)
        if (this.labels && partKey !== 'left_ventricle' && partKey !== 'right_ventricle') {
            this.labels.isolate(partKey);
        }

        // Show isolation overlay dashboard, hide standard guide
        const overlay = document.getElementById('isolation-overlay');
        if (overlay) overlay.classList.remove('hidden');

        const guide = document.getElementById('ar-interaction-guide');
        if (guide) guide.classList.add('hidden');

        // Speak the clinical description of the isolated anatomical part
        if (this.speechManager) {
            this.speechManager.speak(partKey);
        }

        triggerUINotification(`${displayName} Isolated View`, "success");
    }

    /**
     * Restore full heart visual state
     */
    exitIsolationMode() {
        if (!this.heartModel) return;

        // Stop clinical narration if speaking
        if (this.speechManager) {
            this.speechManager.stop();
        }

        // Clean up loaded isolated GLB model if active
        if (this.isolatedModel) {
            this.modelContainer.remove(this.isolatedModel);
            this.disposeModelHierarchy(this.isolatedModel);
            this.isolatedModel = null;
        }

        // Clear the illustration image source
        const imgEl = document.getElementById('isolated-part-image');
        if (imgEl) {
            imgEl.src = "";
        }

        // Restore all meshes of the full heart model
        this.heartModel.visible = true;
        this.heartModel.traverse((child) => {
            if (child.isMesh) {
                child.visible = true;
            }
        });

        // Restore overview labels
        if (this.labels) {
            this.labels.init(this.heartModel, this.arManager.camera, (partKey) => {
                this.enterIsolationMode(partKey);
            });
        }

        // Hide isolation overlay dashboard, show standard guide
        const overlay = document.getElementById('isolation-overlay');
        if (overlay) overlay.classList.add('hidden');

        const guide = document.getElementById('ar-interaction-guide');
        if (guide) guide.classList.remove('hidden');

        triggerUINotification(`Heart Overview Restored`, "info");
    }

    /**
     * Disposes geometries and materials of a model node recursively
     */
    disposeModelHierarchy(model) {
        model.traverse((child) => {
            if (child.isMesh) {
                if (child.geometry) child.geometry.dispose();
                if (child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach(m => m.dispose());
                    } else {
                        child.material.dispose();
                    }
                }
            }
        });
    }

    startRenderLoop() {
        const renderer = this.arManager.renderer;
        
        renderer.setAnimationLoop(() => {
            const deltaTime = this.clock.getDelta();
            
            // Diagnostics FPS tick
            this.fpsCounter.tick();

            // Track OrbitControls
            this.arManager.updateControls();

            // Update Beating
            if (this.animator) {
                this.animator.update(deltaTime);
            }

            // Project coordinate labels
            if (this.labels) {
                this.labels.update(this.arManager.trackingActive);
            }

            // Render view
            if (this.arManager.scene && this.arManager.camera) {
                renderer.render(this.arManager.scene, this.arManager.camera);
            }

            // Sync visual tracking dot
            const dot = document.getElementById('status-pulse-dot');
            if (dot) {
                if (this.arManager.trackingActive) {
                    dot.className = 'pulse-indicator status-pulse bg-green';
                    const statusPill = document.getElementById('tracking-status');
                    if (statusPill && this.arManager.isARActive) {
                        statusPill.textContent = "LOCKED";
                        statusPill.className = "value status-pill tracking-active";
                    }
                } else {
                    dot.className = 'pulse-indicator status-pulse bg-red';
                    const statusPill = document.getElementById('tracking-status');
                    if (statusPill) {
                        statusPill.textContent = "SCANNING";
                        statusPill.className = "value status-pill text-amber";
                    }
                }
            }
        });
    }

    bindUIEvents() {
        // Theme (Light vs Dark mode)
        const themeBtn = document.getElementById('btn-theme-toggle');
        const sunIcon = document.getElementById('theme-icon-sun');
        const moonIcon = document.getElementById('theme-icon-moon');
        
        if (themeBtn) {
            themeBtn.addEventListener('click', () => {
                const body = document.body;
                if (body.classList.contains('theme-dark')) {
                    body.classList.remove('theme-dark');
                    body.classList.add('theme-light');
                    sunIcon.classList.remove('hidden');
                    moonIcon.classList.add('hidden');
                    
                    if (this.arManager && !this.arManager.isARActive && this.arManager.scene) {
                        this.arManager.scene.background = new THREE.Color(0xf4f8fc);
                    }
                } else {
                    body.classList.remove('theme-light');
                    body.classList.add('theme-dark');
                    sunIcon.classList.add('hidden');
                    moonIcon.classList.remove('hidden');
                    
                    if (this.arManager && !this.arManager.isARActive && this.arManager.scene) {
                        this.arManager.scene.background = new THREE.Color(0x020813);
                    }
                }
            });
        }

        // Fullscreen
        const fullBtn = document.getElementById('btn-fullscreen');
        if (fullBtn) {
            fullBtn.addEventListener('click', () => {
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen().catch(err => console.error(err));
                } else {
                    document.exitFullscreen();
                }
            });
        }

        // Screenshot
        const snapBtn = document.getElementById('btn-screenshot');
        if (snapBtn) {
            snapBtn.addEventListener('click', () => {
                if (this.arManager && this.arManager.renderer) {
                    captureScreenshot(this.arManager.renderer, this.arManager.scene, this.arManager.camera);
                }
            });
        }

        // Speech Assistant Toggle
        const speechBtn = document.getElementById('btn-speech-toggle');
        const speechIconOn = document.getElementById('speech-icon-on');
        const speechIconOff = document.getElementById('speech-icon-off');

        if (speechBtn) {
            speechBtn.addEventListener('click', () => {
                const isEnabled = this.speechManager.toggleSpeech();
                if (isEnabled) {
                    speechIconOn.classList.remove('hidden');
                    speechIconOff.classList.add('hidden');
                    triggerUINotification("Voice Assistant Enabled", "success");
                } else {
                    speechIconOn.classList.add('hidden');
                    speechIconOff.classList.remove('hidden');
                    triggerUINotification("Voice Assistant Muted", "info");
                }
            });
        }

        // Exit Isolation mode button
        const exitIsoBtn = document.getElementById('btn-exit-isolation');
        if (exitIsoBtn) {
            exitIsoBtn.addEventListener('click', () => {
                this.exitIsolationMode();
            });
        }

        // Reference target card modal show / close
        const showTargetBtn = document.getElementById('btn-show-target');
        const targetModal = document.getElementById('target-modal');
        const closeTargetBtn = document.getElementById('btn-close-target');
        const targetOverlay = document.getElementById('target-modal-overlay');

        if (showTargetBtn) {
            showTargetBtn.onclick = () => targetModal.classList.remove('hidden');
        }
        if (closeTargetBtn) {
            closeTargetBtn.onclick = () => targetModal.classList.add('hidden');
        }
        if (targetOverlay) {
            targetOverlay.onclick = () => targetModal.classList.add('hidden');
        }
    }

    centerModel(model) {
        const box = new THREE.Box3().setFromObject(model);
        const center = new THREE.Vector3();
        box.getCenter(center);
        model.position.sub(center);
        return center;
    }

    setupDragToRotate() {
        const domElement = this.arManager.renderer.domElement;
        let isDragging = false;
        let previousPointerPosition = { x: 0, y: 0 };

        const onPointerMove = (e) => {
            if (!isDragging) return;

            const deltaX = e.clientX - previousPointerPosition.x;
            const deltaY = e.clientY - previousPointerPosition.y;

            if (this.modelContainer) {
                // Dragging horizontally rotates around Y-axis
                this.modelContainer.rotation.y += deltaX * 0.007;
                // Dragging vertically rotates around X-axis
                this.modelContainer.rotation.x += deltaY * 0.007;
                
                // Clamp X rotation to avoid flipping upside down
                this.modelContainer.rotation.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, this.modelContainer.rotation.x));
            }

            previousPointerPosition = { x: e.clientX, y: e.clientY };
        };

        const onPointerUp = () => {
            isDragging = false;
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', onPointerUp);
            window.removeEventListener('pointercancel', onPointerUp);
        };

        domElement.addEventListener('pointerdown', (e) => {
            isDragging = true;
            previousPointerPosition = { x: e.clientX, y: e.clientY };
            window.addEventListener('pointermove', onPointerMove);
            window.addEventListener('pointerup', onPointerUp);
            window.addEventListener('pointercancel', onPointerUp);
        });
    }

    initGyroscope() {
        const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
        if (!isMobile) return;

        if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
            // iOS 13+ require explicit user gesture to request sensor permissions
            const btn = document.createElement('button');
            btn.id = 'btn-gyro-permission';
            btn.className = 'btn btn-primary';
            btn.style.position = 'absolute';
            btn.style.bottom = '85px';
            btn.style.left = '50%';
            btn.style.transform = 'translateX(-50%)';
            btn.style.zIndex = '999';
            btn.textContent = 'Enable Gyro Tilt';
            
            btn.onclick = () => {
                DeviceOrientationEvent.requestPermission()
                    .then(response => {
                        if (response === 'granted') {
                            window.addEventListener('deviceorientation', (e) => this.handleOrientation(e));
                            btn.remove();
                        } else {
                            triggerUINotification("Gyroscope Access Denied", "warning");
                        }
                    })
                    .catch(err => {
                        console.error("Gyroscope error:", err);
                        btn.remove();
                    });
            };
            document.body.appendChild(btn);
        } else {
            // Android/Chrome
            window.addEventListener('deviceorientation', (e) => this.handleOrientation(e));
        }
    }

    handleOrientation(e) {
        if (this.arManager.isARActive) return; // Only run in simulator mode
        
        const beta = e.beta;
        const gamma = e.gamma;
        
        if (beta === null || gamma === null) return;
        
        // Map tilt angles to rotation limits smoothly.
        // User naturally holds device at a ~60 degree vertical angle.
        const targetRotX = ((beta - 60) * Math.PI) / 180;
        const targetRotY = (gamma * Math.PI) / 180;
        
        if (this.modelContainer) {
            // Smoothly interpolate (lerp) current rotation to target rotation
            this.modelContainer.rotation.x += (targetRotX - this.modelContainer.rotation.x) * 0.1;
            this.modelContainer.rotation.y += (targetRotY - this.modelContainer.rotation.y) * 0.1;
            
            // Clamp X rotation to avoid flipping upside down
            this.modelContainer.rotation.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, this.modelContainer.rotation.x));
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.app = new AppOrchestrator();
    window.app.init();
});

