/* ==========================================================================
   CARDIOSENSE AR - CORE PROCEDURAL ANATOMY LOADER
   ========================================================================== */

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class AnatomyLoader {
    constructor() {
        this.loader = new GLTFLoader();
        this.materials = {};
        this.heartGroup = new THREE.Group();
        this.initMaterials();
    }

    /**
     * Helper to dynamically generate a realistic organic muscle fiber texture
     */
    createOrganicTexture(baseColor, fiberColor, shadowColor) {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');

        // Draw base tissue color
        ctx.fillStyle = baseColor;
        ctx.fillRect(0, 0, 512, 512);

        // Draw fine muscle fibers
        ctx.strokeStyle = fiberColor;
        for (let i = 0; i < 400; i++) {
            ctx.beginPath();
            const x = Math.random() * 512;
            const y = Math.random() * 512;
            const len = 50 + Math.random() * 100;
            const angle = (Math.random() - 0.5) * 0.35; // Parallel muscle strands
            ctx.lineWidth = 0.5 + Math.random() * 1.5;
            ctx.moveTo(x, y);
            ctx.lineTo(x + len * Math.cos(angle), y + len * Math.sin(angle));
            ctx.stroke();
        }

        // Draw darker interstitial gaps/shadows
        ctx.strokeStyle = shadowColor;
        for (let i = 0; i < 200; i++) {
            ctx.beginPath();
            const x = Math.random() * 512;
            const y = Math.random() * 512;
            const len = 40 + Math.random() * 80;
            const angle = (Math.random() - 0.5) * 0.35;
            ctx.lineWidth = 1.0 + Math.random() * 2.0;
            ctx.moveTo(x, y);
            ctx.lineTo(x + len * Math.cos(angle), y + len * Math.sin(angle));
            ctx.stroke();
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(2, 2);
        return texture;
    }

    /**
     * Set up premium medical glassmorphism and organic textured shaders
     */
    initMaterials() {
        const oxyTex = this.createOrganicTexture('#7e1823', '#ba3444', '#3c060b');
        const deoxyTex = this.createOrganicTexture('#124765', '#2480b0', '#0a1d29');

        // Oxygenated System (Vibrant Crimson Red with Muscle Textures)
        this.materials.oxygenated = new THREE.MeshPhysicalMaterial({
            map: oxyTex,
            bumpMap: oxyTex,
            bumpScale: 0.04,
            roughness: 0.3,
            metalness: 0.05,
            clearcoat: 0.8,
            clearcoatRoughness: 0.15,
            transmission: 0.2, // Adds a subtle fleshy light transmission
            transparent: true,
            opacity: 0.95
        });

        // Deoxygenated System (Vibrant Cyan Blue with Muscle Textures)
        this.materials.deoxygenated = new THREE.MeshPhysicalMaterial({
            map: deoxyTex,
            bumpMap: deoxyTex,
            bumpScale: 0.04,
            roughness: 0.3,
            metalness: 0.05,
            clearcoat: 0.8,
            clearcoatRoughness: 0.15,
            transmission: 0.2,
            transparent: true,
            opacity: 0.95
        });

        // Valves (Translucent Frosted White)
        this.materials.valves = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            emissive: 0x333333,
            roughness: 0.4,
            metalness: 0.1,
            transmission: 0.8,
            transparent: true,
            opacity: 0.6,
            side: THREE.DoubleSide
        });
    }

    /**
     * Load heart model. If GLB loading fails, programmatically generate a beautiful medical model.
     */
    loadHeartModel(renderer, onLoadCallback, onProgressCallback) {
        this.loader.load(
            'assets/heart.glb',
            (gltf) => {
                console.log('Successfully loaded assets/heart.glb');
                let hasPartKeys = false;
                gltf.scene.traverse((child) => {
                    if (child.userData && child.userData.partKey) {
                        hasPartKeys = true;
                    }
                });
                if (!hasPartKeys) {
                    this.mapCustomGLBParts(gltf.scene);
                }
                onProgressCallback(100);
                this.heartGroup = gltf.scene;
                onLoadCallback(gltf.scene);
            },
            (xhr) => {
                if (xhr.total > 0) {
                    onProgressCallback(Math.round((xhr.loaded / xhr.total) * 100));
                }
            },
            (error) => {
                console.warn('heart.glb not found, generating procedural heart...');
                this.generateProceduralHeart(onLoadCallback, onProgressCallback);
            }
        );
    }

    /**
     * Attempts to load a dedicated isolated 3D GLB model for a clicked structure
     * (e.g. loads assets/aorta.glb if the user clicks on Aorta)
     */
    loadIsolatedPartModel(partKey, onLoadCallback, onErrorCallback) {
        this.loader.load(
            `assets/${partKey}.glb`,
            (gltf) => {
                console.log(`Successfully loaded isolated part model: assets/${partKey}.glb`);
                onLoadCallback(gltf.scene);
            },
            undefined,
            (error) => {
                console.warn(`Dedicated isolated model assets/${partKey}.glb not found or failed to load:`, error.message);
                onErrorCallback(error);
            }
        );
    }

    generateProceduralHeart(onLoad, onProgress) {
        this.heartGroup = new THREE.Group();
        this.heartGroup.name = "HeartGroup";

        let progress = 0;
        const progressTimer = setInterval(() => {
            progress += 20;
            onProgress(progress);
            if (progress >= 100) {
                clearInterval(progressTimer);
                
                this.assembleChambers();
                this.assembleVessels();
                this.assembleValves();

                this.heartGroup.rotation.y = Math.PI / 4;
                this.heartGroup.scale.set(1.2, 1.2, 1.2);
                
                onLoad(this.heartGroup);
            }
        }, 80);
    }

    setupPartData(mesh, key, displayName, labelAnchor) {
        mesh.userData = {
            partKey: key,
            displayName: displayName,
            labelAnchor: labelAnchor
        };
    }

    assembleChambers() {
        // Left Ventricle (Beating) - Offset Right-Down-Forward (Anatomical Left)
        const lvGeo = new THREE.SphereGeometry(0.48, 32, 32);
        lvGeo.scale(1, 1.5, 0.95);
        const lv = new THREE.Mesh(lvGeo, this.materials.oxygenated);
        lv.position.set(0.25, -1.0, 0.0);
        this.setupPartData(lv, "left_ventricle", "Left Ventricle", new THREE.Vector3(0.7, 0.2, 0.4));
        this.heartGroup.add(lv);

        // Right Ventricle (Beating) - Offset Left-Down-Forward (Anatomical Right)
        const rvGeo = new THREE.SphereGeometry(0.44, 32, 32);
        rvGeo.scale(1.1, 1.3, 0.85);
        const rv = new THREE.Mesh(rvGeo, this.materials.deoxygenated);
        rv.position.set(-0.20, -0.9, 0.12);
        this.setupPartData(rv, "right_ventricle", "Right Ventricle", new THREE.Vector3(-0.7, 0.2, 0.4));
        this.heartGroup.add(rv);

        // Left Atrium (Beating) - Offset Right-Up-Back (Anatomical Left)
        const laGeo = new THREE.SphereGeometry(0.32, 32, 32);
        laGeo.scale(1.1, 1.0, 1.1);
        const la = new THREE.Mesh(laGeo, this.materials.oxygenated);
        la.position.set(0.24, -0.3, -0.15);
        this.setupPartData(la, "left_atrium", "Left Atrium", new THREE.Vector3(0.7, 0.4, -0.3));
        this.heartGroup.add(la);

        // Right Atrium (Beating) - Offset Left-Up-Back (Anatomical Right)
        const raGeo = new THREE.SphereGeometry(0.34, 32, 32);
        raGeo.scale(1.1, 1.1, 1.0);
        const ra = new THREE.Mesh(raGeo, this.materials.deoxygenated);
        ra.position.set(-0.26, -0.25, -0.1);
        this.setupPartData(ra, "right_atrium", "Right Atrium", new THREE.Vector3(-0.7, 0.4, -0.2));
        this.heartGroup.add(ra);
    }

    assembleVessels() {
        const buildTube = (points, radius, material, key, displayName, anchor) => {
            const curve = new THREE.CatmullRomCurve3(points);
            const geom = new THREE.TubeGeometry(curve, 24, radius, 12, false);
            const mesh = new THREE.Mesh(geom, material);
            this.setupPartData(mesh, key, displayName, anchor);
            this.heartGroup.add(mesh);
        };

        // Aorta - Offset Far Up-Center (Arches to Anatomical Left / Screen Right)
        const aortaPoints = [
            new THREE.Vector3(0.15, -0.6, 0.0),
            new THREE.Vector3(0.1, 0.2, 0.1),
            new THREE.Vector3(0.08, 0.8, 0.15),
            new THREE.Vector3(0.0, 1.3, 0.0),
            new THREE.Vector3(-0.12, 1.2, -0.3),
            new THREE.Vector3(-0.18, 0.5, -0.6),
            new THREE.Vector3(-0.2, -0.5, -0.7)
        ];
        buildTube(aortaPoints, 0.12, this.materials.oxygenated, "aorta", "Aorta", new THREE.Vector3(0.1, 1.7, 0.2));

        // Pulmonary Artery - Offset Right-Up-Forward (Anatomical Right / Screen Left)
        const paPoints = [
            new THREE.Vector3(-0.12, -0.5, 0.2),
            new THREE.Vector3(-0.08, 0.0, 0.3),
            new THREE.Vector3(0.05, 0.4, 0.4),
            new THREE.Vector3(0.4, 0.55, 0.25)
        ];
        buildTube(paPoints, 0.10, this.materials.deoxygenated, "pulmonary_artery", "Pulmonary Artery", new THREE.Vector3(0.8, 0.7, 0.5));

        // Superior Vena Cava - Offset Left-Far Up-Back (Anatomical Right)
        const svcGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.7, 12);
        const svc = new THREE.Mesh(svcGeo, this.materials.deoxygenated);
        svc.position.set(-0.38, 0.25, -0.2);
        this.setupPartData(svc, "superior_vena_cava", "SVC", new THREE.Vector3(-0.8, 0.6, -0.3));
        this.heartGroup.add(svc);

        // Inferior Vena Cava - Offset Left-Down-Back (Anatomical Right)
        const ivcGeo = new THREE.CylinderGeometry(0.085, 0.085, 0.6, 12);
        const ivc = new THREE.Mesh(ivcGeo, this.materials.deoxygenated);
        ivc.position.set(-0.40, -1.0, -0.3);
        this.setupPartData(ivc, "inferior_vena_cava", "IVC", new THREE.Vector3(-0.8, -1.3, -0.4));
        this.heartGroup.add(ivc);

        // Pulmonary Veins (Four small red cylinders) - Offset Right-Down-Back (Anatomical Left)
        const pvLocations = [
            { pos: new THREE.Vector3(0.7, -0.2, -0.3), rot: [0, 0, -0.4] },
            { pos: new THREE.Vector3(0.7, -0.4, -0.25), rot: [0, 0, -0.2] },
            { pos: new THREE.Vector3(0.4, -0.1, -0.6), rot: [-0.4, 0, 0.2] },
            { pos: new THREE.Vector3(0.4, -0.3, -0.6), rot: [-0.2, 0, 0.1] }
        ];
        const pvGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.3, 8);
        pvLocations.forEach((loc, index) => {
            const pv = new THREE.Mesh(pvGeo, this.materials.oxygenated);
            pv.position.copy(loc.pos);
            pv.rotation.set(loc.rot[0], loc.rot[1], loc.rot[2]);
            if (index === 0) {
                this.setupPartData(pv, "pulmonary_vein", "Pulmonary Vein", new THREE.Vector3(0.9, -0.3, -0.3));
            }
            this.heartGroup.add(pv);
        });
    }

    assembleValves() {
        const valveGeo = new THREE.TorusGeometry(0.12, 0.018, 8, 24);
        valveGeo.rotateX(Math.PI / 2);

        const createValve = (pos, key, displayName, anchor) => {
            const v = new THREE.Mesh(valveGeo, this.materials.valves);
            v.position.copy(pos);
            this.setupPartData(v, key, displayName, anchor);
            this.heartGroup.add(v);
        };

        // Offset valves inwards but distribute tags clearly
        createValve(new THREE.Vector3(0.22, -0.65, -0.05), "mitral_valve", "Mitral Valve", new THREE.Vector3(0.4, -0.5, 0.3));
        createValve(new THREE.Vector3(-0.21, -0.60, 0.06), "tricuspid_valve", "Tricuspid Valve", new THREE.Vector3(-0.4, -0.5, 0.3));
        createValve(new THREE.Vector3(0.11, -0.45, 0.05), "aortic_valve", "Aortic Valve", new THREE.Vector3(0.25, -0.35, 0.35));
        createValve(new THREE.Vector3(-0.08, -0.25, 0.22), "pulmonary_valve", "Pulmonary Valve", new THREE.Vector3(-0.25, -0.15, 0.45));
    }

    dispose() {
        this.heartGroup.traverse((child) => {
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
        this.heartGroup = null;
    }

    /**
     * Post-processes custom single-mesh GLB files, injecting relative spatial nodes
     * so that floating clinical labels anchor to their correct spatial coordinates.
     * Uses wider offsets to space out the HTML labels nicely.
     */
    mapCustomGLBParts(scene) {
        console.log('Post-processing GLB: Injecting 3D spatial label anchors...');
        
        let heartMesh = null;
        scene.traverse((child) => {
            if (child.isMesh && !heartMesh) {
                heartMesh = child;
            }
        });
        
        const targetNode = heartMesh || scene;
        console.log('Targeting node for anchors:', targetNode.name || targetNode.type);

        const anchors = [
            { key: "left_ventricle", name: "Left Ventricle", pos: new THREE.Vector3(0.25, -1.0, 0.0), offset: new THREE.Vector3(0.6, 0.1, 0.3) },
            { key: "right_ventricle", name: "Right Ventricle", pos: new THREE.Vector3(-0.20, -0.9, 0.12), offset: new THREE.Vector3(-0.6, 0.1, 0.3) },
            { key: "aorta", name: "Aorta", pos: new THREE.Vector3(0.02, 1.2, -0.1), offset: new THREE.Vector3(0.1, 0.6, 0.2) }
        ];

        anchors.forEach((anc) => {
            const anchorObj = new THREE.Object3D();
            anchorObj.position.copy(anc.pos);
            anchorObj.name = `anchor_${anc.key}`;
            
            this.setupPartData(anchorObj, anc.key, anc.name, anc.offset);
            targetNode.add(anchorObj);
        });
    }

    /**
     * Post-processes the isolated Left Ventricle GLB to inject anchors for its subparts
     */
    mapLeftVentricleGLBParts(scene) {
        console.log('Post-processing Left Ventricle GLB: Injecting 3D spatial label anchors...');
        
        let mesh = null;
        scene.traverse((child) => {
            if (child.isMesh && !mesh) {
                mesh = child;
            }
        });
        
        const targetNode = mesh || scene;

        const anchors = [
            { key: "left_auricle", name: "Left auricle (appendage)", pos: new THREE.Vector3(-0.4, 0.35, 0.1), offset: new THREE.Vector3(-0.85, 0.4, 0.2) },
            { key: "left_atrium", name: "Left atrium", pos: new THREE.Vector3(0.22, 0.38, 0.1), offset: new THREE.Vector3(0.55, 0.5, 0.2) },
            { key: "pulmonary_vein", name: "Pulmonary veins", pos: new THREE.Vector3(0.56, 0.3, -0.1), offset: new THREE.Vector3(0.9, 0.4, -0.1) },
            { key: "mitral_valve", name: "Mitral (bicuspid) valve", pos: new THREE.Vector3(0.12, -0.12, 0.2), offset: new THREE.Vector3(0.7, -0.1, 0.3) },
            { key: "left_ventricle", name: "Left ventricle", pos: new THREE.Vector3(0.35, -0.58, 0.2), offset: new THREE.Vector3(0.65, -0.4, 0.3) }
        ];

        anchors.forEach((anc) => {
            const anchorObj = new THREE.Object3D();
            anchorObj.position.copy(anc.pos);
            anchorObj.name = `anchor_isolated_${anc.key}`;
            
            this.setupPartData(anchorObj, anc.key, anc.name, anc.offset);
            targetNode.add(anchorObj);
        });
    }

    /**
     * Post-processes the isolated Right Ventricle GLB to inject anchors for its subparts
     */
    mapRightVentricleGLBParts(scene) {
        console.log('Post-processing Right Ventricle GLB: Injecting 3D spatial label anchors...');
        
        let mesh = null;
        scene.traverse((child) => {
            if (child.isMesh && !mesh) {
                mesh = child;
            }
        });
        
        const targetNode = mesh || scene;

        const anchors = [
            { key: "pulmonary_trunk", name: "Pulmonary trunk", pos: new THREE.Vector3(0.08, 0.65, 0.1), offset: new THREE.Vector3(0.65, 0.65, 0.1) },
            { key: "pulmonary_semilunar_valve", name: "Pulmonary (semilunar) valve", pos: new THREE.Vector3(0.05, 0.44, 0.25), offset: new THREE.Vector3(0.65, 0.4, 0.25) },
            { key: "right_atrium", name: "Right atrium", pos: new THREE.Vector3(-0.45, 0.4, 0.1), offset: new THREE.Vector3(-0.85, 0.4, 0.1) },
            { key: "tricuspid_valve", name: "Tricuspid valve", pos: new THREE.Vector3(-0.35, -0.1, 0.2), offset: new THREE.Vector3(-0.85, -0.1, 0.2) },
            { key: "chordae_tendineae", name: "Chordae tendineae", pos: new THREE.Vector3(-0.25, -0.28, 0.25), offset: new THREE.Vector3(-0.85, -0.28, 0.25) },
            { key: "papillary_muscles", name: "Papillary muscles", pos: new THREE.Vector3(-0.24, -0.44, 0.25), offset: new THREE.Vector3(-0.85, -0.44, 0.25) },
            { key: "trabeculae_carneae", name: "Trabeculae carneae", pos: new THREE.Vector3(-0.15, -0.65, 0.2), offset: new THREE.Vector3(-0.7, -0.65, 0.2) },
            { key: "right_ventricle", name: "Right ventricle", pos: new THREE.Vector3(0.3, -0.25, 0.2), offset: new THREE.Vector3(0.7, -0.25, 0.2) },
            { key: "right_ventricular_wall", name: "Right ventricular wall", pos: new THREE.Vector3(0.48, -0.72, 0.1), offset: new THREE.Vector3(0.7, -0.72, 0.1) }
        ];

        anchors.forEach((anc) => {
            const anchorObj = new THREE.Object3D();
            anchorObj.position.copy(anc.pos);
            anchorObj.name = `anchor_isolated_${anc.key}`;
            
            this.setupPartData(anchorObj, anc.key, anc.name, anc.offset);
            targetNode.add(anchorObj);
        });
    }
}
