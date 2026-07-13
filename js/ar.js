/* ==========================================================================
   CARDIOSENSE AR - CAMERA TRACKING & SIMULATOR
   ========================================================================== */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { MindARThree } from 'mindar-image-three';
import { triggerUINotification } from './utils.js';

export class ARManager {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.heartAnchorGroup = null;
        this.orbitControls = null;

        this.isARActive = false;
        this.trackingActive = false;
        this.mindarThree = null;

        this.onTrackingFound = null;
        this.onTrackingLost = null;
        this.onInitialized = null;
    }

    /**
     * Start WebAR target tracking via camera
     */
    async startAR(onFound, onLost, onInitComplete) {
        this.onTrackingFound = onFound;
        this.onTrackingLost = onLost;
        this.onInitialized = onInitComplete;

        this.cleanup();

        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error("Browser camera API missing.");
            }

            this.mindarThree = new MindARThree({
                container: this.container,
                imageTargetSrc: 'assets/target.mind',
                filterMinCF: 0.0001,
                filterBeta: 0.001
            });

            const { scene, camera, renderer } = this.mindarThree;
            this.scene = scene;
            this.camera = camera;
            this.renderer = renderer;

            const webglRenderer = this.renderer;
            webglRenderer.setClearColor(0x000000, 0); // transparent background for camera view
            
            const canvas = webglRenderer.domElement;
            canvas.setAttribute('style', 'position: absolute; top:0; left:0; width:100%; height:100%;');

            const anchor = this.mindarThree.addAnchor(0);
            this.heartAnchorGroup = anchor.group;

            // Tracking hooks
            anchor.onTargetFound = () => {
                this.trackingActive = true;
                if (this.onTrackingFound) this.onTrackingFound();
                triggerUINotification("Card Target Detected", "success");
            };

            anchor.onTargetLost = () => {
                this.trackingActive = false;
                if (this.onTrackingLost) this.onTrackingLost();
                triggerUINotification("Tracking Lost", "warning");
            };

            triggerUINotification("Opening Camera...", "info");
            await this.mindarThree.start();
            
            this.isARActive = true;
            this.trackingActive = false;

            this.setupSceneLighting();

            if (this.onInitialized) this.onInitialized(true);
            triggerUINotification("Align Target Card", "info");

        } catch (error) {
            console.error("Camera AR failed, switching to Simulator:", error);
            if (this.onInitialized) this.onInitialized(false);
            this.startSimulator(onFound, onInitComplete);
        }
    }

    /**
     * Start local 3D Simulator view (Bypasses camera)
     */
    startSimulator(onFound, onInitComplete) {
        this.cleanup();

        this.isARActive = false;
        this.trackingActive = true;

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(document.body.classList.contains('theme-light') ? 0xf4f8fc : 0x020813);

        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
        this.camera.position.set(0, 0, 3.2);

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, preserveDrawingBuffer: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        this.container.appendChild(this.renderer.domElement);

        this.heartAnchorGroup = new THREE.Group();
        this.scene.add(this.heartAnchorGroup);

        this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
        this.orbitControls.enableDamping = true;
        this.orbitControls.dampingFactor = 0.05;
        this.orbitControls.minDistance = 1.5;
        this.orbitControls.maxDistance = 6.0;
        this.orbitControls.target.set(0, 0, 0);
        this.orbitControls.enableRotate = false; // direct model rotation will be used instead
        this.orbitControls.enablePan = false; // lock model position

        const grid = new THREE.GridHelper(10, 20, 0x00f2fe, 0x00416a);
        grid.position.y = -2.0;
        grid.material.opacity = 0.15;
        grid.material.transparent = true;
        this.scene.add(grid);

        this.setupSceneLighting();

        if (onFound) onFound();
        if (onInitComplete) onInitComplete(true);

        triggerUINotification("Simulator Mode Active", "info");
    }

    setupSceneLighting() {
        const ambient = new THREE.AmbientLight(0xffffff, 1.2);
        this.scene.add(ambient);

        const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
        dirLight.position.set(3, 5, 4);
        this.scene.add(dirLight);

        const pointLight = new THREE.PointLight(0x00f2fe, 2.0, 10);
        pointLight.position.set(-2, 1, 2);
        this.scene.add(pointLight);
    }

    updateControls() {
        if (this.orbitControls) {
            this.orbitControls.update();
        }
    }

    handleResize() {
        if (this.mindarThree) return; // Let MindAR handle resizing in AR mode to prevent overwriting camera projection and canvas layout matrices
        
        if (this.camera && this.renderer) {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }

    cleanup() {
        if (this.mindarThree) {
            try {
                this.mindarThree.stop();
                const video = this.container.querySelector('video');
                if (video) {
                    const stream = video.srcObject;
                    if (stream) {
                        stream.getTracks().forEach(t => t.stop());
                    }
                    video.remove();
                }
            } catch (e) {
                console.warn(e);
            }
            this.mindarThree = null;
        }

        if (this.orbitControls) {
            this.orbitControls.dispose();
            this.orbitControls = null;
        }

        // Remove MindAR injected UI scanning overlay elements
        const mindarUIElements = document.querySelectorAll('.mindar-ui-overlay, .mindar-ui-loading, .mindar-ui-scanning, .mindar-ui-compatibility');
        mindarUIElements.forEach((el) => {
            el.remove();
        });

        this.container.innerHTML = '';
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.heartAnchorGroup = null;
        this.isARActive = false;
        this.trackingActive = false;
    }
}
