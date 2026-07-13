# 3D Heart Anatomy Image Tracking WebAR System

A state-of-the-art, interactive, clinical-grade medical Augmented Reality (WebAR) dashboard demonstrating human heart anatomy, cardiac hemodynamics (blood flow), and pathology simulations. Built using pure front-end WebGL technologies (Three.js and MindAR) with complete responsive browser support.


---

## Project Overview

**CardioSense AR** is a production-ready WebXR-compatible application designed to run entirely in modern mobile and desktop web browsers without external installations. It delivers:
- **Marker-Based Augmented Reality**: Utilizes **MindAR.js** to track a reference target card and anchor a complex 3D heart in real space.
- **Desktop/Mobile touch Simulator**: Automatically falls back to a 3D orbit viewer when camera streams are unavailable or permissions are denied.
- **Double-Pump Contraction Physics**: Programmatically deforms heart muscle geometry to simulate atrial systole followed by ventricular contraction.
- **Interactive Multi-lingual Voice Assistant**: Integrates the **Web Speech API** to read out complex clinical data and interesting facts in English, Hindi, and Kannada.
- **Dynamic Synthesized Audio**: Synthesizes organic *lub-dub* heartbeats in real-time matching the BPM slider using the **Web Audio API**.

---

## Technical Features

1. **Precision 3D Geometry Representation**: Programmatically renders **13 distinct anatomical components**:
   - Chambers: Left/Right Ventricle, Left/Right Atrium.
   - Major Vessels: Aorta, Pulmonary Artery, Pulmonary Veins, Superior/Inferior Vena Cava.
   - Valves: Mitral, Tricuspid, Aortic, Pulmonary Valves.
2. **Glassmorphism Medical Dashboard UI**: Modern responsive design using custom CSS variables (Dark/Light themes), frosted background blur effects, and clinical telemetry statistics (FPS monitoring, AR tracking status).
3. **Cardiovascular Pathology Simulation (5 Cardiac States)**:
   - **Coronary Artery Disease (CAD)**: Visualizes clogged pathways on the coronary artery meshes and slows blood flow speeds.
   - **Myocardial Infarction (Heart Attack)**: Darkens the Left Ventricle wall (ischemic dead tissue) and halts contraction movements.
   - **Valvular Heart Disease (Stenosis)**: Colors valves yellow/calcified and constricts their opening clearances.
   - **Dilated Cardiomyopathy**: Expands the heart scale (dilated state) and weakens pumping deformations.
   - **Cardiac Arrhythmia**: Irregular rhythm cycles containing PVC (premature ventricular contractions) spikes.
4. **Hemodynamics Particle flow**: Staggers oxygenated (red) and deoxygenated (blue) particles flowing along bezier spline vectors representing blood direction.
5. **Billboarding 2D Labels**: Projects 3D node endpoints onto screen space coordinates, keeping text overlays centered above the rotating model.

---

## Project Folder Structure

```
Heart-AR/
│
├── index.html           # Main DOM Layout & Import Map scripts loader
├── README.md            # Comprehensive documentation
│
├── css/
│      style.css         # Clinical theme design tokens and keyframes
│      ui.css            # Responsive layout sheets, sliders, sidebars
│
├── js/
│      app.js            # App orchestrator & click Raycaster intersections
│      ar.js             # MindAR tracking wrappers & OrbitControls fallbacks
│      ui.js             # UI controls bindings and theme updates
│      speech.js         # Voice synthesizer data (EN, HI, KN)
│      animation.js      # Beating physics & blood flow paths
│      labels.js         # Projected billboard label overlays
│      loader.js         # Custom GLTF parser and procedural generator
│      utils.js          # Web Audio synth, FPS counters, screenshots
│
└── assets/
       target.mind       # Compiled MindAR image feature pattern database
       card.png          # Visual target reference card for testing
```

---

## Installation & Local Run

No build tools or compilers are required. The project is built entirely on ES Modules.

### 1. Clone or Place the Workspace Files
Ensure the project structure is arranged as shown in the folder layout.

### 2. Launch a Local Web Server
Because the browser blocks camera access and file fetching on simple file paths (`file:///`), you **must** serve the files using a local server.

Using Node (`npx`):
```bash
# Run a simple static web server
npx http-server ./
```

Using Python:
```bash
# Python 3
python -m http-server 8000
```

### 3. Open in Browser
- Open `http://localhost:8080` (or `http://localhost:8000` depending on the port).
- **For Mobile Testing**: Open your phone browser and connect using your computer's local IP address (e.g., `http://192.168.1.50:8080`). Ensure both devices are connected to the same local Wi-Fi network.

---

## AR Tracking Target Card

To test the Augmented Reality tracking:
1. Click the **"Target Image"** button on the toolbar of the dashboard.
2. A modal will open displaying the target card (`assets/card.png`).
3. Position your webcam or hold your mobile device camera to scan this card.
4. The 3D anatomical heart will immediately anchor to the card.
5. **Alternative**: If you don't have a camera, click **"Open Desktop Simulator"** in the error prompts to rotate and test the model in desktop mode immediately.

---

## Customization Guide

### Altering the 3D Heart Model
To load a custom 3D model instead of the procedural generator, replace `assets/heart.glb` with your custom GLB. The `loader.js` class will automatically load it. Ensure your custom model contains child meshes named after the keys in `ANATOMY_DATABASE` if you want clicks and descriptions to match!

### Modifying Heartbeat Frequencies
To adjust frequency properties of the Audio synth, open `js/utils.js` and modify the parameters in `playLubDub()`. You can adjust the frequencies of oscillators:
```javascript
// Change pitch of the LUB sound
this.synthesizeTone(58, 42, 0.12, now, 0.35); // (Start freq, End freq, duration, time, volume)
```

---

## Dependencies

The project loads standard CDN dependencies via import maps:
* **Three.js (v0.160.0)** - WebGL graphics rendering
* **MindAR-image-three (v1.2.5)** - Computer vision tracking
* **OrbitControls.js & GLTFLoader.js** - Included as standard Three.js add-on modules

---

## License

This project is licensed under the MIT License - see the LICENSE details for info.

---

## Future Scope

1. **Physics-based Valve Flow Simulations**: Add fluid dynamics shaders inside the chambers to show true vortex formations of blood.
2. **Volumetric CT Scan Import**: Allow medical students to drag and drop DICOM CT scans of patient hearts and generate custom tracking meshes dynamically.
3. **WebXR Headset integration**: Incorporate Apple Vision Pro or Meta Quest controllers to explore the heart in absolute VR immersion.
