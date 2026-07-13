/* ==========================================================================
   CARDIOSENSE AR - SIMPLIFIED BEATING ENGINE (NO PARTICLES)
   ========================================================================== */

import * as THREE from 'three';

export class HeartAnimator {
    constructor() {
        this.heartGroup = null;
        this.bpm = 72;
        this.timeAccumulator = 0;

        this.atriaGroup = [];
        this.ventriclesGroup = [];
        this.valves = {};
    }

    init(heartGroup) {
        this.heartGroup = heartGroup;

        this.atriaGroup = [];
        this.ventriclesGroup = [];
        this.valves = {};

        heartGroup.traverse((child) => {
            if (child.isMesh && child.userData && child.userData.partKey) {
                const key = child.userData.partKey;
                if (key.includes('atrium')) {
                    this.atriaGroup.push(child);
                } else if (key.includes('ventricle')) {
                    this.ventriclesGroup.push(child);
                } else if (key.includes('valve')) {
                    this.valves[key] = child;
                }
            }
        });
    }

    update(deltaTime) {
        const cycleDuration = 60 / this.bpm;
        this.timeAccumulator += deltaTime;
        const progress = (this.timeAccumulator % cycleDuration) / cycleDuration;

        this.performCardiacCycle(progress);
    }

    performCardiacCycle(progress) {
        let atrialScale = 1.0;
        let ventricleScaleX = 1.0;
        let ventricleScaleY = 1.0;
        let ventricleScaleZ = 1.0;

        let mitralTricuspidOpen = true;
        let aorticPulmonaryOpen = false;

        if (progress < 0.25) {
            // Atrial Systole (Atria contract, AV valves open)
            const t = progress / 0.25;
            atrialScale = 1.0 - 0.10 * Math.sin(t * Math.PI);
            mitralTricuspidOpen = true;
            aorticPulmonaryOpen = false;
        } else if (progress >= 0.25 && progress < 0.55) {
            // Ventricular Systole (Ventricles contract, AV valves close, Semilunars open)
            const t = (progress - 0.25) / 0.30;
            const contraction = Math.sin(t * Math.PI);
            ventricleScaleX = 1.0 - 0.15 * contraction;
            ventricleScaleZ = 1.0 - 0.15 * contraction;
            ventricleScaleY = 1.0 + 0.05 * contraction;
            mitralTricuspidOpen = false;
            aorticPulmonaryOpen = true;
        } else {
            // Diastole (Filling)
            mitralTricuspidOpen = true;
            aorticPulmonaryOpen = false;
        }

        // Apply scale
        this.atriaGroup.forEach(m => m.scale.set(atrialScale, atrialScale, atrialScale));
        this.ventriclesGroup.forEach(m => m.scale.set(ventricleScaleX, ventricleScaleY, ventricleScaleZ));

        // Animate valves
        const mtScale = mitralTricuspidOpen ? 1.2 : 0.4;
        const mtOpacity = mitralTricuspidOpen ? 0.7 : 0.2;
        const apScale = aorticPulmonaryOpen ? 1.2 : 0.4;
        const apOpacity = aorticPulmonaryOpen ? 0.7 : 0.2;

        if (this.valves['mitral_valve']) {
            this.valves['mitral_valve'].scale.set(mtScale, 1.0, mtScale);
            this.valves['mitral_valve'].material.opacity = mtOpacity;
        }
        if (this.valves['tricuspid_valve']) {
            this.valves['tricuspid_valve'].scale.set(mtScale, 1.0, mtScale);
            this.valves['tricuspid_valve'].material.opacity = mtOpacity;
        }
        if (this.valves['aortic_valve']) {
            this.valves['aortic_valve'].scale.set(apScale, 1.0, apScale);
            this.valves['aortic_valve'].material.opacity = apOpacity;
        }
        if (this.valves['pulmonary_valve']) {
            this.valves['pulmonary_valve'].scale.set(apScale, 1.0, apScale);
            this.valves['pulmonary_valve'].material.opacity = apOpacity;
        }
    }
}
