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
            "right_ventricular_wall": "The Right Ventricular Wall is the outer muscular boundary of the right ventricle, designed to pump blood under low pressure to the pulmonary system.",
            "brachiocephalic_artery": "The Brachiocephalic Artery is the first branch of the aortic arch, carrying blood to the head, neck, and right arm.",
            "ascending_aorta": "The Ascending Aorta is the portion of the aorta that starts from the aortic valve and rises up to the aortic arch.",
            "aortic_root": "The Aortic Root is the section of the aorta attached to the heart, containing the aortic valve and opening to the coronary arteries.",
            "left_common_carotid_artery": "The Left Common Carotid Artery is the second branch of the aortic arch, supplying blood to the left side of the head and neck.",
            "left_subclavian_artery": "The Left Subclavian Artery is the third branch of the aortic arch, distributing blood to the left arm.",
            "aortic_arch": "The Aortic Arch is the curved segment of the aorta that loops over the heart and gives rise to major upper-body arteries.",
            "descending_thoracic_aorta": "The Descending Thoracic Aorta is the part of the aorta that runs down through the chest cavity before reaching the abdomen.",
            "abdominal_aorta": "The Abdominal Aorta is the final segment of the aorta that runs through the abdominal cavity, supplying oxygenated blood to lower body systems."
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
