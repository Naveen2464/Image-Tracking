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

                // Determine category stroke color matching the label dots
                let strokeColor = '#00f2fe'; // Cyan (default deoxygenated)
                if (partKey.includes('aorta') || partKey.includes('left_ventricle') || partKey.includes('left_atrium') || partKey.includes('pulmonary_vein')) {
                    strokeColor = '#ff3860'; // Red (oxygenated)
                } else if (partKey.includes('valve')) {
                    strokeColor = '#ffb020'; // Amber (valves)
                }

                // Create SVG line element for dynamic connection
                const lineElement = document.createElementNS("http://www.w3.org/2000/svg", "line");
                lineElement.setAttribute("stroke", strokeColor);
                lineElement.setAttribute("stroke-width", "1.0");
                this.svgContainer.appendChild(lineElement);

                // Create SVG outer glow circle for anchor point on heart
                const glowCircleElement = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                glowCircleElement.setAttribute("fill", strokeColor);
                glowCircleElement.setAttribute("r", "4.0");
                glowCircleElement.setAttribute("opacity", "0");
                this.svgContainer.appendChild(glowCircleElement);

                // Create SVG inner solid circle for anchor point on heart
                const anchorDotElement = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                anchorDotElement.setAttribute("fill", strokeColor);
                anchorDotElement.setAttribute("r", "1.8");
                anchorDotElement.setAttribute("opacity", "0");
                this.svgContainer.appendChild(anchorDotElement);

                this.labels.push({
                    element: element,
                    object3d: child,
                    anchorOffset: anchorOffset,
                    partKey: partKey,
                    lineElement: lineElement,
                    glowCircleElement: glowCircleElement,
                    anchorDotElement: anchorDotElement,
                    strokeColor: strokeColor
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

        // Bind click & touch handlers to trigger isolation study mode responsive on mobile
        const handleInteraction = (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (this.onClickCallback) {
                this.onClickCallback(partKey);
            }
        };

        const bubble = div.querySelector('.label-bubble');
        bubble.addEventListener('click', handleInteraction);
        bubble.addEventListener('touchend', handleInteraction);

        return div;
    }

    isolate(partKey) {
        this.isolatedPartKey = partKey;
        this.labels.forEach((label) => {
            if (label.partKey !== partKey) {
                label.element.classList.add('hidden');
                if (label.lineElement) label.lineElement.setAttribute("display", "none");
                if (label.glowCircleElement) label.glowCircleElement.setAttribute("display", "none");
                if (label.anchorDotElement) label.anchorDotElement.setAttribute("display", "none");
            } else {
                label.element.classList.remove('hidden');
                if (label.lineElement) label.lineElement.setAttribute("display", "inline");
                if (label.glowCircleElement) label.glowCircleElement.setAttribute("display", "inline");
                if (label.anchorDotElement) label.anchorDotElement.setAttribute("display", "inline");
            }
        });
    }

    restore() {
        this.isolatedPartKey = null;
        this.labels.forEach((label) => {
            label.element.classList.remove('hidden');
            if (label.lineElement) label.lineElement.setAttribute("display", "inline");
            if (label.glowCircleElement) label.glowCircleElement.setAttribute("display", "inline");
            if (label.anchorDotElement) label.anchorDotElement.setAttribute("display", "inline");
        });
    }

    updateIsolatedAnchor(partKey, newAnchor) {
        this.labels.forEach((label) => {
            if (label.partKey === partKey) {
                if (!label.originalObject3d) {
                    label.originalObject3d = label.object3d;
                }
                label.object3d = newAnchor;
            }
        });
    }

    restoreAnchors() {
        this.labels.forEach((label) => {
            if (label.originalObject3d) {
                label.object3d = label.originalObject3d;
                delete label.originalObject3d;
            }
        });
    }

    setVisible(visible) {
        this.visible = visible;
        if (!visible) {
            this.labels.forEach(l => {
                l.element.classList.add('hidden');
                if (l.lineElement) l.lineElement.setAttribute("display", "none");
                if (l.glowCircleElement) l.glowCircleElement.setAttribute("display", "none");
                if (l.anchorDotElement) l.anchorDotElement.setAttribute("display", "none");
            });
        } else {
            if (this.isolatedPartKey) {
                this.isolate(this.isolatedPartKey);
            } else {
                this.labels.forEach(l => {
                    l.element.classList.remove('hidden');
                    if (l.lineElement) l.lineElement.setAttribute("display", "inline");
                    if (l.glowCircleElement) l.glowCircleElement.setAttribute("display", "inline");
                    if (l.anchorDotElement) l.anchorDotElement.setAttribute("display", "inline");
                });
            }
        }
    }

    clear() {
        this.labels.forEach(l => {
            l.element.remove();
            if (l.lineElement) l.lineElement.remove();
            if (l.glowCircleElement) l.glowCircleElement.remove();
            if (l.anchorDotElement) l.anchorDotElement.remove();
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
                if (label.glowCircleElement) label.glowCircleElement.setAttribute("display", "none");
                if (label.anchorDotElement) label.anchorDotElement.setAttribute("display", "none");
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

            // Back-face culling check: check if the anchor normal points away from the camera
            const normalWorld = label.anchorOffset.clone().applyQuaternion(worldQuat).normalize();
            const dirToCamera = this.camera.position.clone().sub(partWorldPos).normalize();
            const dot = normalWorld.dot(dirToCamera);
            
            // Temporary log to check culling values
            if (window.logThrottle % 100 === 0) {
                console.log(`[Culling] ${label.partKey}: dot=${dot.toFixed(4)}, normalWorldZ=${normalWorld.z.toFixed(4)}`);
            }

            // Hide back-facing anchors when in general overview (not in isolation study mode)
            const isOccluded = !this.isolatedPartKey && (dot < 0.15);

            const isBehindCamera = tempV.z > 1 || partV.z > 1;
            const isOffScreen = tempV.x < -1.1 || tempV.x > 1.1 || tempV.y < -1.1 || tempV.y > 1.1;
            const isOtherPartIsolated = this.isolatedPartKey && label.partKey !== this.isolatedPartKey;

            if (isBehindCamera || isOffScreen || isOtherPartIsolated || isOccluded) {
                label.element.classList.add('hidden');
                if (label.lineElement) label.lineElement.setAttribute("display", "none");
                if (label.glowCircleElement) label.glowCircleElement.setAttribute("display", "none");
                if (label.anchorDotElement) label.anchorDotElement.setAttribute("display", "none");
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

        // Separate active labels into left and right columns dynamically based on target X coordinate
        const leftColumn = [];
        const rightColumn = [];

        activeLabels.forEach((al) => {
            if (al.px < width / 2) {
                leftColumn.push(al);
            } else {
                rightColumn.push(al);
            }
        });

        // Sort each column based on its target Y coordinate on the heart to prevent crossing lines dynamically
        leftColumn.sort((a, b) => a.py - b.py);
        rightColumn.sort((a, b) => a.py - b.py);

        // Run vertical relaxation/spacing within each column to prevent overlaps while moving dynamically
        const minSpacing = 36; // px between adjacent label centers

        const spaceColumn = (column) => {
            if (column.length === 0) return;
            
            // Pass 1: Push down from top to bottom
            for (let i = 1; i < column.length; i++) {
                if (column[i].y < column[i - 1].y + minSpacing) {
                    column[i].y = column[i - 1].y + minSpacing;
                }
            }

            // Pass 2: Push up from bottom to top and clamp bottom
            const maxScaleY = height - 70;
            if (column[column.length - 1].y > maxScaleY) {
                column[column.length - 1].y = maxScaleY;
            }
            for (let i = column.length - 2; i >= 0; i--) {
                if (column[i].y > column[i + 1].y - minSpacing) {
                    column[i].y = column[i + 1].y - minSpacing;
                }
            }

            // Pass 3: Clamp top and push down
            const minScaleY = 70;
            if (column[0].y < minScaleY) {
                column[0].y = minScaleY;
                for (let i = 1; i < column.length; i++) {
                    if (column[i].y < column[i - 1].y + minSpacing) {
                        column[i].y = column[i - 1].y + minSpacing;
                    }
                }
            }
        };

        spaceColumn(leftColumn);
        spaceColumn(rightColumn);

        // Apply updated coordinates and draw SVG lines
        this.labels.forEach((label) => {
            const leftItem = leftColumn.find(item => item.label === label);
            const rightItem = rightColumn.find(item => item.label === label);
            const al = leftItem || rightItem;

            
            if (!al) {
                // Not active or culled
                label.element.classList.add('hidden');
                if (label.lineElement) label.lineElement.setAttribute("display", "none");
                if (label.glowCircleElement) label.glowCircleElement.setAttribute("display", "none");
                if (label.anchorDotElement) label.anchorDotElement.setAttribute("display", "none");
                return;
            }

            label.element.classList.remove('hidden');
            if (label.lineElement) label.lineElement.setAttribute("display", "inline");
            if (label.glowCircleElement) label.glowCircleElement.setAttribute("display", "inline");
            if (label.anchorDotElement) label.anchorDotElement.setAttribute("display", "inline");

            // Calculate precise bubble width dynamically to position line starting point exactly on the dot
            const bubbleWidth = label.element.offsetWidth || (label.partKey.length * 6 + 40);
            let lineX = 0;

            if (leftItem) {
                label.element.classList.add('align-right');
                label.element.classList.remove('align-left');
                
                // Position bubble to the left of the heart target (moving along with it)
                const x = Math.max(15 + bubbleWidth, al.px - 60);
                label.element.style.left = `${x - bubbleWidth}px`;
                label.element.style.right = 'auto';
                lineX = x;
            } else {
                label.element.classList.add('align-left');
                label.element.classList.remove('align-right');
                
                // Position bubble to the right of the heart target (moving along with it)
                const x = Math.min(width - 15 - bubbleWidth, al.px + 60);
                label.element.style.left = `${x}px`;
                label.element.style.right = 'auto';
                lineX = x;
            }

            label.element.style.top = `${al.y}px`;
            label.element.style.opacity = al.opacity.toString();

            // Draw SVG connection line from the dot edge of bubble to target point on part
            if (label.lineElement) {
                label.lineElement.setAttribute("x1", lineX.toString());
                label.lineElement.setAttribute("y1", al.y.toString());
                label.lineElement.setAttribute("x2", al.px.toString());
                label.lineElement.setAttribute("y2", al.py.toString());
                label.lineElement.setAttribute("opacity", (al.opacity * 0.9).toString());
            }

            // Draw SVG outer glow circle on heart target
            if (label.glowCircleElement) {
                label.glowCircleElement.setAttribute("cx", al.px.toString());
                label.glowCircleElement.setAttribute("cy", al.py.toString());
                label.glowCircleElement.setAttribute("opacity", (al.opacity * 0.35).toString());
            }

            // Draw SVG inner solid circle on heart target
            if (label.anchorDotElement) {
                label.anchorDotElement.setAttribute("cx", al.px.toString());
                label.anchorDotElement.setAttribute("cy", al.py.toString());
                label.anchorDotElement.setAttribute("opacity", (al.opacity * 0.9).toString());
            }
        });
    }
}
