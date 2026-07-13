/* ==========================================================================
   CARDIOSENSE AR - INTERACTIVE LABELS OVERLAY
   ========================================================================== */

import * as THREE from 'three';

/**
 * Projects 3D heart coordinates to 2D HTML/CSS labels
 */
export class AnatomyLabels {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.camera = null;
        this.labels = []; // Array of { element, object3d, anchorOffset, partKey, lineElement }
        this.visible = true;
        this.onClickCallback = null;
        this.isolatedPartKey = null;
        this.svgContainer = null;
        this.modelContainer = null;
    }

    /**
     * Parse heart group meshes and construct HTML tags
     */
    init(heartGroup, camera, onClickCallback) {
        this.camera = camera;
        this.onClickCallback = onClickCallback;
        
        // Ensure SVG overlay container exists for connecting lines
        if (!this.svgContainer) {
            this.svgContainer = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            this.svgContainer.setAttribute('style', 'position: absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:90;');
            this.svgContainer.id = 'labels-lines-svg';
            this.container.appendChild(this.svgContainer);
        }

        this.clear();

        // Get a reference to modelContainer (which is rotated manually by user)
        this.modelContainer = heartGroup.parent;

        heartGroup.traverse((child) => {
            if (child.userData && child.userData.partKey) {
                const partKey = child.userData.partKey;
                const displayName = child.userData.displayName;
                const anchorOffset = child.userData.labelAnchor ? child.userData.labelAnchor.clone() : new THREE.Vector3(0, 0, 0);

                const element = this.createLabelDOM(partKey, displayName);
                this.container.appendChild(element);

                // Create SVG line element for dynamic connection
                const lineElement = document.createElementNS("http://www.w3.org/2000/svg", "line");
                lineElement.setAttribute("stroke", "rgba(0, 242, 254, 0.4)");
                lineElement.setAttribute("stroke-width", "1.5");
                lineElement.setAttribute("stroke-dasharray", "3,3");
                this.svgContainer.appendChild(lineElement);

                this.labels.push({
                    element: element,
                    object3d: child,
                    anchorOffset: anchorOffset,
                    partKey: partKey,
                    lineElement: lineElement
                });
            }
        });
    }

    createLabelDOM(partKey, displayName) {
        const div = document.createElement('div');
        div.className = 'ar-billboard-label';
        
        let dotColor = 'bg-cyan';
        if (partKey.includes('aorta') || partKey.includes('left_ventricle') || partKey.includes('left_atrium') || partKey.includes('pulmonary_vein')) {
            dotColor = 'bg-red';
        } else if (partKey.includes('valve')) {
            dotColor = 'bg-amber';
        }

        // Removed static pointer line, using dynamic SVG lines instead
        div.innerHTML = `
            <div class="label-bubble" style="cursor: pointer;">
                <span class="label-dot ${dotColor}"></span>
                <span class="label-text">${displayName}</span>
            </div>
        `;

        // Bind click handler to trigger isolation study mode
        div.querySelector('.label-bubble').addEventListener('click', (e) => {
            e.stopPropagation();
            if (this.onClickCallback) {
                this.onClickCallback(partKey);
            }
        });

        return div;
    }

    isolate(partKey) {
        this.isolatedPartKey = partKey;
        this.labels.forEach((label) => {
            if (label.partKey !== partKey) {
                label.element.classList.add('hidden');
                if (label.lineElement) label.lineElement.setAttribute("display", "none");
            } else {
                label.element.classList.remove('hidden');
                if (label.lineElement) label.lineElement.setAttribute("display", "inline");
            }
        });
    }

    restore() {
        this.isolatedPartKey = null;
        this.labels.forEach((label) => {
            label.element.classList.remove('hidden');
            if (label.lineElement) label.lineElement.setAttribute("display", "inline");
        });
    }

    setVisible(visible) {
        this.visible = visible;
        if (!visible) {
            this.labels.forEach(l => {
                l.element.classList.add('hidden');
                if (l.lineElement) l.lineElement.setAttribute("display", "none");
            });
        } else {
            if (this.isolatedPartKey) {
                this.isolate(this.isolatedPartKey);
            } else {
                this.labels.forEach(l => {
                    l.element.classList.remove('hidden');
                    if (l.lineElement) l.lineElement.setAttribute("display", "inline");
                });
            }
        }
    }

    clear() {
        this.labels.forEach(l => {
            l.element.remove();
            if (l.lineElement) l.lineElement.remove();
        });
        this.labels = [];
        this.isolatedPartKey = null;
        if (this.svgContainer) {
            this.svgContainer.innerHTML = '';
        }
    }

    /**
     * Compute projection offsets inside render loop
     */
    update(trackingActive) {
        if (!this.visible || !this.camera || this.labels.length === 0) return;

        // Force update the world matrix starting from the root scene to ensure tracking changes propagate fully
        let modelContainer = this.modelContainer;
        if (!modelContainer && this.labels[0]) {
            const p = this.labels[0].object3d.parent;
            if (p && p.parent) {
                modelContainer = p.parent;
            }
        }
        if (modelContainer) {
            let root = modelContainer;
            while (root.parent) {
                root = root.parent;
            }
            root.updateMatrixWorld(true);
        }

        const width = window.innerWidth;
        const height = window.innerHeight;

        const activeLabels = [];

        this.labels.forEach((label) => {
            if (!trackingActive) {
                label.element.classList.add('hidden');
                if (label.lineElement) label.lineElement.setAttribute("display", "none");
                return;
            }

            // Obtain mesh world coordinates (rotated as modelContainer rotates)
            const partWorldPos = new THREE.Vector3();
            label.object3d.getWorldPosition(partWorldPos);

            // Compute rotated bubble position in world space
            const bubbleWorldPos = partWorldPos.clone();
            const offset = label.anchorOffset.clone();
            
            // Rotate the offset by the world rotation of the part so it spins with the heart
            const worldQuat = new THREE.Quaternion();
            label.object3d.getWorldQuaternion(worldQuat);
            offset.applyQuaternion(worldQuat);
            
            bubbleWorldPos.add(offset);

            // Project rotated part position to screen
            const partV = partWorldPos.clone();
            partV.project(this.camera);

            // Project rotated bubble position to screen
            const tempV = bubbleWorldPos.clone();
            tempV.project(this.camera);

            const isBehindCamera = tempV.z > 1 || partV.z > 1;
            const isOffScreen = tempV.x < -1.1 || tempV.x > 1.1 || tempV.y < -1.1 || tempV.y > 1.1;
            const isOtherPartIsolated = this.isolatedPartKey && label.partKey !== this.isolatedPartKey;

            if (isBehindCamera || isOffScreen || isOtherPartIsolated) {
                label.element.classList.add('hidden');
                if (label.lineElement) label.lineElement.setAttribute("display", "none");
            } else {
                // Map standard WebGL coordinates (-1 to +1) to screen pixels
                const x = (tempV.x * 0.5 + 0.5) * width;
                const y = (-(tempV.y * 0.5) + 0.5) * height;

                const px = (partV.x * 0.5 + 0.5) * width;
                const py = (-(partV.y * 0.5) + 0.5) * height;

                const dist = label.object3d.position.distanceTo(this.camera.position);
                const opacity = Math.max(0.3, Math.min(1.0, 1.2 - (dist / 6.0)));

                activeLabels.push({
                    label: label,
                    x: x,
                    y: y,
                    px: px,
                    py: py,
                    opacity: opacity
                });
            }
        });

        // Run screen-space vertical relaxation to prevent label clubbing/overlapping
        // Width of a label is approx 140px, height is approx 35px.
        for (let pass = 0; pass < 8; pass++) {
            for (let i = 0; i < activeLabels.length; i++) {
                for (let j = 0; j < activeLabels.length; j++) {
                    if (i === j) continue;
                    const dx = activeLabels[i].x - activeLabels[j].x;
                    const dy = activeLabels[i].y - activeLabels[j].y;
                    const distX = Math.abs(dx);
                    const distY = Math.abs(dy);

                    // If they overlap vertically (<38px) and horizontally (<140px)
                    if (distY < 38 && distX < 140) {
                        const overlapY = 38 - distY;
                        const push = overlapY * 0.5;
                        if (dy >= 0) {
                            activeLabels[i].y += push;
                            activeLabels[j].y -= push;
                        } else {
                            activeLabels[i].y -= push;
                            activeLabels[j].y += push;
                        }
                    }
                }
            }
        }

        // Apply updated coordinates and draw SVG lines
        this.labels.forEach((label) => {
            const al = activeLabels.find(item => item.label === label);
            if (!al) {
                // Not active or culled
                return;
            }

            label.element.classList.remove('hidden');
            if (label.lineElement) label.lineElement.setAttribute("display", "inline");

            // Apply screen coordinates to bubble (transform translate(-50%, -100%) places bubble bottom-center at (x, y))
            label.element.style.transform = `translate(-50%, -100%)`;
            label.element.style.left = `${al.x}px`;
            label.element.style.top = `${al.y}px`;
            label.element.style.opacity = al.opacity.toString();

            // Draw SVG connection line from bottom-center of bubble to target point on part
            if (label.lineElement) {
                label.lineElement.setAttribute("x1", al.x.toString());
                label.lineElement.setAttribute("y1", al.y.toString());
                label.lineElement.setAttribute("x2", al.px.toString());
                label.lineElement.setAttribute("y2", al.py.toString());
                label.lineElement.setAttribute("opacity", (al.opacity * 0.55).toString());
            }
        });
    }
}
