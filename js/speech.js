/* ==========================================================================
   CARDIOSENSE AR - CLINICAL SPEECH ASSISTANT MODULE
   ========================================================================== */

export class ClinicalSpeechManager {
    constructor() {
        this.synth = window.speechSynthesis;
        this.isEnabled = true;
        this.currentUtterance = null;
        
        this.descriptions = {
            "left_ventricle": "The Left Ventricle is the thickest chamber of the heart. It pumps oxygen-rich blood to the entire body through the aorta.",
            "right_ventricle": "The Right Ventricle pumps deoxygenated blood to the lungs through the pulmonary artery for oxygenation.",
            "left_atrium": "The Left Atrium receives oxygen-rich blood from the lungs via the pulmonary veins and pumps it into the left ventricle.",
            "right_atrium": "The Right Atrium receives oxygen-poor blood returning from the body via the vena cava and pumps it into the right ventricle.",
            "aorta": "The Aorta is the largest artery in the human body, carrying oxygen-rich blood away from the heart to the systemic circulation.",
            "pulmonary_artery": "The Pulmonary Artery carries oxygen-poor blood from the right ventricle of the heart to the lungs.",
            "superior_vena_cava": "The Superior Vena Cava is a large vein that carries deoxygenated blood from the upper body to the right atrium.",
            "inferior_vena_cava": "The Inferior Vena Cava is a large vein that carries deoxygenated blood from the lower body to the right atrium.",
            "mitral_valve": "The Mitral Valve, also known as the bicuspid valve, prevents blood from flowing backward from the left ventricle into the left atrium.",
            "tricuspid_valve": "The Tricuspid Valve prevents blood from flowing backward from the right ventricle into the right atrium.",
            "aortic_valve": "The Aortic Valve prevents blood from flowing backward from the aorta into the left ventricle.",
            "pulmonary_valve": "The Pulmonary Valve prevents blood from flowing backward from the pulmonary artery into the right ventricle.",
            "pulmonary_vein": "The Pulmonary Veins carry oxygen-rich blood from the lungs back to the left atrium of the heart.",
            "left_auricle": "The Left Auricle, or left atrial appendage, is a small, muscular pouch-like extension of the left atrium that acts as a reservoir.",
            "pulmonary_trunk": "The Pulmonary Trunk is a major vessel that branches into the right and left pulmonary arteries to carry deoxygenated blood to the lungs.",
            "pulmonary_semilunar_valve": "The Pulmonary Semilunar Valve regulates blood flow from the right ventricle into the pulmonary trunk, preventing backflow.",
            "chordae_tendineae": "The Chordae Tendineae, or heart strings, are fibrous cords that connect the papillary muscles to the tricuspid valve leaflets to keep them closed under pressure.",
            "papillary_muscles": "The Papillary Muscles contract to pull on the chordae tendineae, preventing inversion of the tricuspid valve during ventricular contraction.",
            "trabeculae_carneae": "The Trabeculae Carneae are muscular ridges on the internal walls of the ventricles that prevent suction and assist in efficient pumping.",
            "right_ventricular_wall": "The Right Ventricular Wall is the outer muscular boundary of the right ventricle, designed to pump blood under low pressure to the pulmonary system."
        };

        // Preload voices (Web Speech API requires this to populating voices list on some browsers)
        if (this.synth && this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = () => {};
        }
    }

    toggleSpeech() {
        this.isEnabled = !this.isEnabled;
        if (!this.isEnabled) {
            this.stop();
        }
        return this.isEnabled;
    }

    speak(partKey) {
        this.stop();

        if (!this.isEnabled) return;
        
        const text = this.descriptions[partKey];
        if (!text) return;

        if (this.synth) {
            this.currentUtterance = new SpeechSynthesisUtterance(text);
            
            // Try to find a nice English speaking voice
            const voices = this.synth.getVoices();
            const preferredVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Google')) ||
                                  voices.find(v => v.lang.startsWith('en') && v.name.includes('Natural')) ||
                                  voices.find(v => v.lang.startsWith('en')) ||
                                  voices[0];
            
            if (preferredVoice) {
                this.currentUtterance.voice = preferredVoice;
            }

            this.currentUtterance.rate = 0.95; // Slightly slower for clear medical guidance
            this.currentUtterance.pitch = 1.0;
            
            this.synth.speak(this.currentUtterance);
        }
    }

    stop() {
        if (this.synth) {
            this.synth.cancel();
        }
        this.currentUtterance = null;
    }
}
