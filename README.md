# CardioSense AR: 3D Heart Anatomy Image Tracking WebAR System

CardioSense AR is a state-of-the-art, interactive, clinical-grade medical Augmented Reality (WebAR) dashboard demonstrating human heart anatomy, cardiac hemodynamics (blood flow), and pathology simulations. Built using pure front-end WebGL technologies (Three.js and MindAR) with complete responsive browser support.

---

## Project Overview

CardioSense AR runs entirely in modern mobile and desktop web browsers without external software installations. It delivers:
- **Marker-Based Augmented Reality**: Utilizes **MindAR.js** to track a reference target card and anchor a complex 3D heart in real space.
- **Desktop/Mobile Touch Simulator**: Automatically falls back to a 3D orbit viewer when camera streams are unavailable or camera permissions are denied.
- **Anatomy Isolation Modes**: Allows medical students to isolate and inspect the three main parts of the heart, rendering a total of **22 interactive anatomical subparts** with detailed descriptions.
- **Dynamic Target Tracking Labels**: Text overlays dynamically track the rotating model, automatically switching sides and layout relaxation to prevent overlaps.
- **Double-Pump Contraction Physics**: Programmatically deforms heart muscle geometry to simulate atrial systole followed by ventricular contraction.
- **Interactive Multi-lingual Voice Assistant**: Integrates the **Web Speech API** to read out complex clinical data and descriptions in English, Hindi, and Kannada.
- **Dynamic Synthesized Audio**: Synthesizes organic *lub-dub* heartbeats in real-time matching the BPM slider using the **Web Audio API**.

---

## Technical Features

### 1. Primary Heart Overview
The main heart model features **3 primary interactive components**:
*   **Aorta**: The main artery carrying oxygenated blood from the heart to the rest of the body.
*   **Left Ventricle**: The thickest pumping chamber responsible for pushing blood into systemic circulation.
*   **Right Ventricle**: The pumping chamber responsible for pushing deoxygenated blood into the lungs.

---

### 2. Isolated Anatomical Subpart Mappings
When a primary component is selected, the application transitions into isolated anatomical study view and loads its dedicated GLB asset, exposing its detailed sub-structure:

#### A. Isolated Aorta (`aorta.glb` — 8 subparts)
1.  **Brachiocephalic artery** — First branch of the aortic arch, carrying blood to the head, neck, and right arm.
2.  **Left common carotid artery** — Second branch of the aortic arch, supplying blood to the left side of the head and neck.
3.  **Left subclavian artery** — Third branch of the aortic arch, distributing blood to the left arm.
4.  **Ascending aorta** — Portion of the aorta starting from the aortic valve and rising to the aortic arch.
5.  **Aortic arch** — Curved segment of the aorta looping over the heart.
6.  **Aortic root** — Section of the aorta attached to the heart, containing the aortic valve.
7.  **Descending thoracic aorta** — Part of the aorta running down through the chest cavity.
8.  **Abdominal aorta** — Final segment of the aorta running through the abdominal cavity.

#### B. Isolated Left Ventricle (`left_ventricle.glb` — 5 subparts)
1.  **Left auricle (appendage)** — Muscular pouch-like extension acting as a reservoir.
2.  **Left atrium** — Chamber receiving oxygenated blood from the lungs.
3.  **Pulmonary veins** — Vessels carrying oxygenated blood from the lungs back to the left atrium.
4.  **Mitral (bicuspid) valve** — Prevents blood backflow from the left ventricle into the left atrium.
5.  **Left ventricle** — Pumping cavity driving systemic circulation.

#### C. Isolated Right Ventricle (`right_ventricle.glb` — 9 subparts)
1.  **Pulmonary trunk** — Major vessel branching to carry deoxygenated blood to the lungs.
2.  **Pulmonary (semilunar) valve** — Regulates blood flow from the right ventricle into the pulmonary trunk.
3.  **Right atrium** — Chamber receiving deoxygenated blood from the body.
4.  **Tricuspid valve** — Prevents blood backflow from the right ventricle into the right atrium.
5.  **Chordae tendineae** — Heart strings connecting papillary muscles to valve leaflets.
6.  **Papillary muscles** — Contract to pull on chordae tendineae during ventricular contraction.
7.  **Trabeculae carneae** — Muscular ridges preventing suction on ventricle walls.
8.  **Right ventricle** — Pumping cavity driving pulmonary circulation.
9.  **Right ventricular wall** — Outer muscular boundary pumping blood under low pressure to the lungs.

---

### 3. Glassmorphism Medical Dashboard UI
Modern responsive design using custom CSS variables (Dark/Light themes), frosted background blur effects, and clinical telemetry statistics (FPS monitoring, AR tracking status).

---

### 4. Cardiovascular Pathology Simulation (5 Cardiac States)
*   **Coronary Artery Disease (CAD)**: Visualizes clogged pathways on the coronary artery meshes and slows blood flow speeds.
*   **Myocardial Infarction (Heart Attack)**: Darkens the Left Ventricle wall (ischemic dead tissue) and halts contraction movements.
*   **Valvular Heart Disease (Stenosis)**: Colors valves yellow/calcified and constricts their opening clearances.
*   **Dilated Cardiomyopathy**: Expands the heart scale (dilated state) and weakens pumping deformations.
*   **Cardiac Arrhythmia**: Irregular rhythm cycles containing PVC (premature ventricular contractions) spikes.

---

### 5. Hemodynamics Particle Flow
Staggers oxygenated (red) and deoxygenated (blue) particles flowing along bezier spline vectors representing blood direction.

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
│   ├── speech.js            # Voice synthesizer descriptions (EN, HI, KN)
│   ├── animation.js         # Beating physics & blood flow paths
│   ├── labels.js            # Projected billboard label overlays (dynamic)
│   ├── loader.js            # GLTF loader and procedural coordinate injector
│   ├── fallback_assets.js   # Procedural geometry fallback assets
│   └── utils.js             # Web Audio heartbeat synth, FPS counters, screenshots
│
├── assets/
│   ├── target.mind          # Compiled MindAR image feature pattern database
│   ├── card.png             # Visual target reference card for testing
│   ├── heart.glb            # Full heart 3D model overview
│   ├── aorta.glb            # Isolated Aorta 3D model
│   ├── left_ventricle.glb   # Isolated Left Ventricle 3D model
│   └── right_ventricle.glb  # Isolated Right Ventricle 3D model
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
Place the project folder anywhere on your system and navigate into it:
```bash
cd image_tracking
```

### Step 2 — Install Dependencies
Install the required Node packages (includes `http-server`):
```bash
npm install
```

### Step 3 — Launch the Local HTTPS Server
The project is pre-configured with SSL certificates. Use the recommended npm script:
```bash
npm run dev
```
This runs the HTTPS server internally:
```bash
npx http-server -c-1 -S -K key.pem -C cert.pem -p 8443
```

### Step 4 — Open in Browser
#### Desktop
Open your browser and navigate to:
```
https://localhost:8443
```
*Note: Your browser will show a security warning because the SSL certificate is self-signed. Click **Advanced** → **Proceed to localhost (unsafe)**.*

#### Mobile Testing
To test AR on a real phone camera:
1. Ensure both your computer and phone are connected to the same Wi-Fi network.
2. Find your computer's local IP address (e.g. `192.168.1.50`).
3. On your phone browser, navigate to:
   ```
   https://192.168.1.50:8443
   ```
4. Bypass the certificate warning as described above.

---

## AR Tracking Target Card

To test the Augmented Reality tracking:
1. Click the **"Target Image"** button on the toolbar of the dashboard.
2. Scan the displayed card (`assets/card.png`) with your webcam or phone.
3. The 3D anatomical heart will immediately anchor to the card.
4. **Alternative**: If you don't have a camera, click **"Enter Simulator Mode"** on the dashboard target modal to rotate and test the model in desktop mode immediately.

---

## License

This project is licensed under the MIT License.
