# 3D Heart Anatomy Image Tracking WebAR System

A state-of-the-art, interactive, clinical-grade medical Augmented Reality (WebAR) dashboard demonstrating human heart anatomy, cardiac hemodynamics (blood flow), and pathology simulations. Built using pure front-end WebGL technologies (Three.js and MindAR) with complete responsive browser support.

---

## Project Overview

**CardioSense AR** is a production-ready WebXR-compatible application designed to run entirely in modern mobile and desktop web browsers without external installations. It delivers:
- **Marker-Based Augmented Reality**: Utilizes **MindAR.js** to track a reference target card and anchor a complex 3D heart in real space.
- **Desktop/Mobile Touch Simulator**: Automatically falls back to a 3D orbit viewer when camera streams are unavailable or permissions are denied.
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
4. **Hemodynamics Particle Flow**: Staggers oxygenated (red) and deoxygenated (blue) particles flowing along bezier spline vectors representing blood direction.
5. **Billboarding 2D Labels**: Projects 3D node endpoints onto screen space coordinates, keeping text overlays centered above the rotating model.

---

## Project Folder Structure

```
image_tracking/
│
├── index.html               # Main DOM layout & import map scripts loader
├── README.md                # Comprehensive documentation
├── package.json             # Node dependencies & npm scripts
├── package-lock.json        # Locked dependency versions
├── key.pem                  # SSL private key (for HTTPS local server)
├── cert.pem                 # SSL certificate (for HTTPS local server)
│
├── css/
│   ├── style.css            # Clinical theme design tokens and keyframes
│   └── ui.css               # Responsive layout sheets, sliders, sidebars
│
├── js/
│   ├── app.js               # App orchestrator & click Raycaster intersections
│   ├── ar.js                # MindAR tracking wrappers & OrbitControls fallbacks
│   ├── speech.js            # Voice synthesizer data (EN, HI, KN)
│   ├── animation.js         # Beating physics & blood flow paths
│   ├── labels.js            # Projected billboard label overlays
│   ├── loader.js            # Custom GLTF parser and procedural generator
│   ├── fallback_assets.js   # Procedural geometry fallback assets
│   └── utils.js             # Web Audio synth, FPS counters, screenshots
│
├── assets/
│   ├── target.mind          # Compiled MindAR image feature pattern database
│   ├── card.png             # Visual target reference card for testing
│   ├── heart.glb            # Full heart 3D model (GLTF binary)
│   ├── aorta.glb            # Aorta 3D model
│   ├── left_ventricle.glb   # Left ventricle 3D model
│   ├── right_ventricle.glb  # Right ventricle 3D model
│   └── parts/               # Additional anatomy part models
│
├── fonts/                   # Custom web fonts
├── icons/                   # UI icon assets
└── textures/                # Material texture maps
```

---

## Prerequisites

Before running the project, ensure you have the following installed:

| Tool | Version | Purpose |
|------|---------|---------|
| [Node.js](https://nodejs.org/) | v14+ | Required to run `npm` and `npx` commands |
| A modern browser | Chrome / Edge / Safari | WebGL & WebRTC camera support |

> **Why HTTPS?** The Web camera API (`getUserMedia`) and many WebXR features are **only available on secure origins** (HTTPS or localhost). This project uses self-signed SSL certificates (`cert.pem` / `key.pem`) to serve locally over HTTPS.

---

## Installation & Local Run

No build tools or compilers are required. The project is built entirely on ES Modules.

### Step 1 — Clone or Place the Workspace Files

Clone the repository or download and unzip it so your folder structure matches the layout shown above:

```bash
git clone https://github.com/your-username/image_tracking.git
cd image_tracking
```

Or simply place the project folder anywhere on your system and navigate into it.

---

### Step 2 — Install Dependencies

Install the required Node packages (includes `http-server`):

```bash
npm install
```

> This reads `package.json` and installs everything into `node_modules/`. Only needed once.

---

### Step 3 — Launch the Local HTTPS Server

The project is pre-configured with SSL certificates. Use one of the following methods:

#### ✅ Method A — Using npm (Recommended)

```bash
npm start
```

or equivalently:

```bash
npm run dev
```

This runs the following command internally (as defined in `package.json`):

```bash
npx http-server -c-1 -S -K key.pem -C cert.pem -p 8443
```

| Flag | Meaning |
|------|---------|
| `-c-1` | Disables caching (always serves fresh files) |
| `-S` | Enables HTTPS/SSL mode |
| `-K key.pem` | Path to SSL private key |
| `-C cert.pem` | Path to SSL certificate |
| `-p 8443` | Port to listen on |

#### ✅ Method B — Using npx directly (No install needed)

```bash
npx http-server -c-1 -S -K key.pem -C cert.pem -p 8443
```

#### ✅ Method C — Plain HTTP (Desktop only, camera may not work)

If you only need to test the 3D viewer without AR camera features:

```bash
npx http-server -c-1 -p 8080
```

> ⚠️ Camera access will be **blocked** in plain HTTP mode on most browsers. Use HTTPS methods above for full AR functionality.

#### ✅ Method D — Python (Plain HTTP, Desktop only)

```bash
# Python 3
python -m http.server 8000
```

> ⚠️ Same limitation as Method C — camera access requires HTTPS.

---

### Step 4 — Open in Browser

#### Desktop

Open your browser and navigate to:

```
https://localhost:8443
```

> **Self-signed certificate warning**: Your browser will show a security warning because the SSL certificate is self-signed (not issued by a public CA). This is **safe for local development**.
> - **Chrome / Edge**: Click **Advanced** → **Proceed to localhost (unsafe)**
> - **Firefox**: Click **Advanced** → **Accept the Risk and Continue**
> - **Safari**: Click **Show Details** → **visit this website**

#### Mobile Testing

To test AR on a real phone camera:

1. Find your computer's local IP address:
   - **Windows**: Open Command Prompt → run `ipconfig` → look for `IPv4 Address` (e.g., `192.168.1.50`)
   - **Mac/Linux**: Run `ifconfig` or `ip addr` in Terminal

2. On your phone browser, navigate to:
   ```
   https://192.168.1.50:8443
   ```
   *(Replace `192.168.1.50` with your actual local IP)*

3. Accept the self-signed certificate warning on your phone (same steps as desktop above).

4. Ensure **both your computer and phone are connected to the same Wi-Fi network**.

---

## AR Tracking Target Card

To test the Augmented Reality tracking:
1. Click the **"Target Image"** button on the toolbar of the dashboard.
2. A modal will open displaying the target card (`assets/card.png`).
3. Print the card or display it on a second screen.
4. Position your webcam or hold your mobile device camera to scan this card.
5. The 3D anatomical heart will immediately anchor to the card.
6. **Alternative**: If you don't have a camera, click **"Open Desktop Simulator"** in the error prompts to rotate and test the model in desktop mode immediately.

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

| Library | Version | Purpose |
|---------|---------|---------|
| **Three.js** | v0.160.0 | WebGL 3D graphics rendering |
| **MindAR-image-three** | v1.2.5 | Computer vision image tracking |
| **OrbitControls.js** | (Three.js add-on) | Desktop orbit / drag controls |
| **GLTFLoader.js** | (Three.js add-on) | Loading `.glb` / `.gltf` 3D models |

Local Node dependency (for the dev server):

| Package | Version | Purpose |
|---------|---------|---------|
| **http-server** | ^14.1.1 | Local HTTPS static file server |
| **three** | ^0.160.0 | Three.js (also used via CDN) |

---

## Troubleshooting

| Problem | Solution |
|---------|---------|
| Camera not working | Ensure you are on HTTPS (`https://localhost:8443`), not plain HTTP |
| Browser shows "Not Secure" warning | Click **Advanced → Proceed** — this is expected for self-signed certs |
| Port 8443 already in use | Change the `-p` value in `package.json` scripts to another port |
| `npm install` fails | Ensure Node.js v14+ is installed: run `node -v` to verify |
| AR model not appearing | Hold the target card flat and well-lit; ensure camera permission is granted |
| Mobile cannot connect | Verify both devices are on the same Wi-Fi; use your PC's IPv4 address |

---

## License

This project is licensed under the MIT License - see the LICENSE details for info.

---

## Future Scope

1. **Physics-based Valve Flow Simulations**: Add fluid dynamics shaders inside the chambers to show true vortex formations of blood.
2. **Volumetric CT Scan Import**: Allow medical students to drag and drop DICOM CT scans of patient hearts and generate custom tracking meshes dynamically.
3. **WebXR Headset Integration**: Incorporate Apple Vision Pro or Meta Quest controllers to explore the heart in absolute VR immersion.
