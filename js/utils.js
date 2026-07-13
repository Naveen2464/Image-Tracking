/* ==========================================================================
   CARDIOSENSE AR - SIMPLIFIED TELEMETRY & SCREEN UTILITIES
   ========================================================================== */

/**
 * Diagnostic Frame Rate Counter
 */
export class FPSCounter {
    constructor(displayElementId) {
        this.element = document.getElementById(displayElementId);
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.fps = 60;
    }

    tick() {
        this.frameCount++;
        const now = performance.now();
        if (now >= this.lastTime + 1000) {
            this.fps = Math.round((this.frameCount * 1000) / (now - this.lastTime));
            this.frameCount = 0;
            this.lastTime = now;
            if (this.element) {
                this.element.textContent = this.fps;
                if (this.fps < 30) {
                    this.element.className = 'value text-red';
                } else if (this.fps < 50) {
                    this.element.className = 'value text-amber';
                } else {
                    this.element.className = 'value text-cyan';
                }
            }
        }
    }
}

/**
 * Capture WebGL Canvas Screenshot
 */
export function captureScreenshot(renderer, scene, camera) {
    renderer.render(scene, camera);
    const canvas = renderer.domElement;
    const dataUrl = canvas.toDataURL('image/png');

    const link = document.createElement('a');
    link.download = `cardiosense-capture-${Date.now()}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    triggerUINotification('Screenshot saved to downloads', 'success');
}

/**
 * Temporary floating notification banner trigger
 */
export function triggerUINotification(message, type = 'info') {
    const guideElement = document.getElementById('ar-interaction-guide');
    const guideText = document.getElementById('guide-text');
    if (!guideElement || !guideText) return;

    guideText.textContent = message;
    
    const indicator = guideElement.querySelector('.guide-icon');
    if (indicator) {
        indicator.className = 'guide-icon pulse-indicator';
        if (type === 'success') indicator.classList.add('bg-green');
        else if (type === 'error') indicator.classList.add('bg-red');
        else if (type === 'warning') indicator.classList.add('bg-amber');
        else indicator.classList.add('bg-cyan');
    }

    // Reset animation
    guideElement.classList.remove('animate-fade-in');
    void guideElement.offsetWidth; // Trigger reflow
    guideElement.classList.add('animate-fade-in');
}

/**
 * Dynamically imports GLTFExporter to export a 3D node as a binary GLB file
 */
export function exportGLB(node, fileName) {
    import('three/addons/exporters/GLTFExporter.js').then(({ GLTFExporter }) => {
        const exporter = new GLTFExporter();
        exporter.parse(
            node,
            (result) => {
                const blob = new Blob([result], { type: 'application/octet-stream' });
                
                // Try saving directly to the workspace via local receiver script
                fetch(`http://127.0.0.1:8445/upload?name=${fileName}`, {
                    method: 'POST',
                    body: blob
                }).then(() => {
                    console.log(`Successfully saved directly: ${fileName}`);
                }).catch((err) => {
                    // Fallback to standard browser download
                    console.warn('Local receiver not active, downloading via browser...', err);
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = fileName;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(link.href);
                });
            },
            (error) => {
                console.error(`GLB export failed for ${fileName}:`, error);
            },
            { binary: true } // Export as GLB binary
        );
    }).catch(err => console.error('Failed to import GLTFExporter:', err));
}

