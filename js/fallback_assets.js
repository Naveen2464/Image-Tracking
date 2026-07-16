/* ==========================================================================
   CARDIOSENSE AR - HIGH-QUALITY MEDICAL SCHEMATIC SVG FALLBACKS
   ========================================================================== */

export const SVG_FALLBACKS = {
    left_ventricle: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
        <defs>
            <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="%23ff3860" stop-opacity="0.25"/>
                <stop offset="100%" stop-color="%23020813" stop-opacity="0"/>
            </radialGradient>
            <linearGradient id="lvGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="%23ff3860"/>
                <stop offset="100%" stop-color="%237e1823"/>
            </linearGradient>
        </defs>
        <rect width="200" height="200" fill="url(%23bgGlow)"/>
        <!-- Muscular Left Ventricle Wall -->
        <path d="M70,80 C60,110 70,160 100,180 C115,160 115,130 110,80 Z" fill="url(%23lvGrad)" stroke="%23ff3860" stroke-width="2" opacity="0.95"/>
        <!-- Inner Chamber highlight -->
        <path d="M78,90 C72,110 80,145 100,165 C108,145 108,120 102,90 Z" fill="%23ff3860" opacity="0.3"/>
        <!-- Directional Flow arrow -->
        <path d="M100,150 L100,100 M95,110 L100,100 L105,110" fill="none" stroke="%2300f2fe" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <text x="100" y="30" fill="%23f0f7ff" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle" letter-spacing="1">LEFT VENTRICLE</text>
        <text x="100" y="45" fill="%238da2bd" font-family="sans-serif" font-size="8" text-anchor="middle">Systemic Pump</text>
    </svg>`,

    right_ventricle: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
        <defs>
            <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="%2300f2fe" stop-opacity="0.25"/>
                <stop offset="100%" stop-color="%23020813" stop-opacity="0"/>
            </radialGradient>
            <linearGradient id="rvGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="%2300f2fe"/>
                <stop offset="100%" stop-color="%23124765"/>
            </linearGradient>
        </defs>
        <rect width="200" height="200" fill="url(%23bgGlow)"/>
        <!-- Right Ventricle Wall (Thinner, crescent shape) -->
        <path d="M90,80 C95,120 95,150 100,180 C130,160 140,110 130,80 Z" fill="url(%23rvGrad)" stroke="%2300f2fe" stroke-width="2" opacity="0.95"/>
        <path d="M98,90 C102,120 102,145 100,165 C120,145 128,110 122,90 Z" fill="%2300f2fe" opacity="0.3"/>
        <!-- Flow Arrow to lungs -->
        <path d="M110,145 L110,95 M105,105 L110,95 L115,105" fill="none" stroke="%2300f2fe" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <text x="100" y="30" fill="%23f0f7ff" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle" letter-spacing="1">RIGHT VENTRICLE</text>
        <text x="100" y="45" fill="%238da2bd" font-family="sans-serif" font-size="8" text-anchor="middle">Pulmonary Pump</text>
    </svg>`,

    left_atrium: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
        <defs>
            <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="%23ff3860" stop-opacity="0.25"/>
                <stop offset="100%" stop-color="%23020813" stop-opacity="0"/>
            </radialGradient>
            <linearGradient id="laGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="%23ff3860"/>
                <stop offset="100%" stop-color="%23ab263c"/>
            </linearGradient>
        </defs>
        <rect width="200" height="200" fill="url(%23bgGlow)"/>
        <!-- Left Atrium Upper chamber -->
        <path d="M75,100 C70,70 90,60 110,70 C125,75 130,95 125,120 C105,115 90,115 75,100 Z" fill="url(%23laGrad)" stroke="%23ff3860" stroke-width="2" opacity="0.95"/>
        <path d="M82,90 C80,75 92,68 105,75 C115,80 120,92 118,108 C105,105 92,102 82,90 Z" fill="%23ff3860" opacity="0.3"/>
        <text x="100" y="30" fill="%23f0f7ff" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle" letter-spacing="1">LEFT ATRIUM</text>
        <text x="100" y="45" fill="%238da2bd" font-family="sans-serif" font-size="8" text-anchor="middle">Oxygenated Blood Receiver</text>
    </svg>`,

    right_atrium: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
        <defs>
            <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="%2300f2fe" stop-opacity="0.25"/>
                <stop offset="100%" stop-color="%23020813" stop-opacity="0"/>
            </radialGradient>
            <linearGradient id="raGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="%2300f2fe"/>
                <stop offset="100%" stop-color="%231b5d85"/>
            </linearGradient>
        </defs>
        <rect width="200" height="200" fill="url(%23bgGlow)"/>
        <!-- Right Atrium Upper chamber -->
        <path d="M75,120 C70,95 75,75 90,70 C110,60 130,70 125,100 C110,115 95,115 75,120 Z" fill="url(%23raGrad)" stroke="%2300f2fe" stroke-width="2" opacity="0.95"/>
        <path d="M82,108 C80,92 85,80 95,75 C108,68 120,75 118,90 C108,102 95,105 82,108 Z" fill="%2300f2fe" opacity="0.3"/>
        <text x="100" y="30" fill="%23f0f7ff" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle" letter-spacing="1">RIGHT ATRIUM</text>
        <text x="100" y="45" fill="%238da2bd" font-family="sans-serif" font-size="8" text-anchor="middle">Deoxygenated Blood Receiver</text>
    </svg>`,

    aorta: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
        <defs>
            <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="%23ff3860" stop-opacity="0.25"/>
                <stop offset="100%" stop-color="%23020813" stop-opacity="0"/>
            </radialGradient>
            <linearGradient id="aortaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="%23ff3860"/>
                <stop offset="100%" stop-color="%23a01020"/>
            </linearGradient>
        </defs>
        <rect width="200" height="200" fill="url(%23bgGlow)"/>
        <!-- Curved Aortic Arch -->
        <path d="M80,180 L80,110 C80,60 150,60 150,110 L150,180" fill="none" stroke="url(%23aortaGrad)" stroke-width="24" stroke-linecap="round"/>
        <!-- Branching arteries (Brachiocephalic, Common Carotid, Subclavian) -->
        <path d="M100,75 L100,50 M115,70 L115,45 M130,75 L130,50" fill="none" stroke="%23ff3860" stroke-width="8" stroke-linecap="round"/>
        <!-- Glowing center line -->
        <path d="M80,180 L80,110 C80,68 150,68 150,110 L150,180" fill="none" stroke="%23ffb020" stroke-width="2" stroke-dasharray="4,4"/>
        <text x="100" y="30" fill="%23f0f7ff" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle" letter-spacing="1">AORTA</text>
        <text x="100" y="45" fill="%238da2bd" font-family="sans-serif" font-size="8" text-anchor="middle">Main Systemic Artery</text>
    </svg>`,

    pulmonary_artery: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
        <defs>
            <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="%2300f2fe" stop-opacity="0.25"/>
                <stop offset="100%" stop-color="%23020813" stop-opacity="0"/>
            </radialGradient>
            <linearGradient id="paGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="%2300f2fe"/>
                <stop offset="100%" stop-color="%23055e8a"/>
            </linearGradient>
        </defs>
        <rect width="200" height="200" fill="url(%23bgGlow)"/>
        <!-- Trunk splitting into Left/Right branches -->
        <path d="M100,180 L100,110 C100,90 70,80 50,80 M100,110 C100,90 130,80 150,80" fill="none" stroke="url(%23paGrad)" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M100,180 L100,110 C100,92 70,82 50,82 M100,110 C100,92 130,82 150,82" fill="none" stroke="%2323d160" stroke-width="2" stroke-dasharray="3,3"/>
        <text x="100" y="30" fill="%23f0f7ff" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle" letter-spacing="1">PULMONARY ARTERY</text>
        <text x="100" y="45" fill="%238da2bd" font-family="sans-serif" font-size="8" text-anchor="middle">Lungs Delivery Trunk</text>
    </svg>`,

    superior_vena_cava: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
        <defs>
            <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="%2300f2fe" stop-opacity="0.25"/>
                <stop offset="100%" stop-color="%23020813" stop-opacity="0"/>
            </radialGradient>
            <linearGradient id="vesselGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="%2300f2fe"/>
                <stop offset="100%" stop-color="%231b5d85"/>
            </linearGradient>
        </defs>
        <rect width="200" height="200" fill="url(%23bgGlow)"/>
        <!-- Large vertical tube -->
        <path d="M100,50 L100,160" fill="none" stroke="url(%23vesselGrad)" stroke-width="20" stroke-linecap="round"/>
        <!-- Flow markers -->
        <path d="M100,60 L100,140" fill="none" stroke="%23ffffff" stroke-width="1.5" stroke-dasharray="5,5"/>
        <path d="M100,130 L100,140 M95,135 L100,140 L105,135" fill="none" stroke="%23ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <text x="100" y="30" fill="%23f0f7ff" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle" letter-spacing="1">SUPERIOR VENA CAVA</text>
        <text x="100" y="45" fill="%238da2bd" font-family="sans-serif" font-size="8" text-anchor="middle">Upper Body Deoxygenated Return</text>
    </svg>`,

    inferior_vena_cava: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
        <defs>
            <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="%2300f2fe" stop-opacity="0.25"/>
                <stop offset="100%" stop-color="%23020813" stop-opacity="0"/>
            </radialGradient>
            <linearGradient id="vesselGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="%2300f2fe"/>
                <stop offset="100%" stop-color="%231b5d85"/>
            </linearGradient>
        </defs>
        <rect width="200" height="200" fill="url(%23bgGlow)"/>
        <!-- Large vertical tube -->
        <path d="M100,50 L100,160" fill="none" stroke="url(%23vesselGrad)" stroke-width="20" stroke-linecap="round"/>
        <!-- Flow markers up to atrium -->
        <path d="M100,150 L100,70" fill="none" stroke="%23ffffff" stroke-width="1.5" stroke-dasharray="5,5"/>
        <path d="M100,80 L100,70 M95,75 L100,70 L105,75" fill="none" stroke="%23ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <text x="100" y="30" fill="%23f0f7ff" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle" letter-spacing="1">INFERIOR VENA CAVA</text>
        <text x="100" y="45" fill="%238da2bd" font-family="sans-serif" font-size="8" text-anchor="middle">Lower Body Deoxygenated Return</text>
    </svg>`,

    mitral_valve: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
        <defs>
            <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="%23ffb020" stop-opacity="0.25"/>
                <stop offset="100%" stop-color="%23020813" stop-opacity="0"/>
            </radialGradient>
        </defs>
        <rect width="200" height="200" fill="url(%23bgGlow)"/>
        <!-- Torus Ring -->
        <circle cx="100" cy="110" r="40" fill="none" stroke="%23ffb020" stroke-width="6" opacity="0.8"/>
        <!-- Bicuspid Valve Leaflets (2 flaps) -->
        <path d="M100,70 C100,110 60,110 60,110 M100,150 C100,110 140,110 140,110" fill="none" stroke="%23ffffff" stroke-width="3" stroke-linecap="round"/>
        <path d="M60,110 L140,110" fill="none" stroke="%23ffffff" stroke-width="1.5" stroke-dasharray="3,3"/>
        <text x="100" y="30" fill="%23f0f7ff" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle" letter-spacing="1">MITRAL VALVE</text>
        <text x="100" y="45" fill="%238da2bd" font-family="sans-serif" font-size="8" text-anchor="middle">Bicuspid Left AV Valve</text>
    </svg>`,

    tricuspid_valve: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
        <defs>
            <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="%23ffb020" stop-opacity="0.25"/>
                <stop offset="100%" stop-color="%23020813" stop-opacity="0"/>
            </radialGradient>
        </defs>
        <rect width="200" height="200" fill="url(%23bgGlow)"/>
        <!-- Torus Ring -->
        <circle cx="100" cy="110" r="40" fill="none" stroke="%23ffb020" stroke-width="6" opacity="0.8"/>
        <!-- Tricuspid Valve Leaflets (3 flaps radiating from center) -->
        <path d="M100,110 L100,70 M100,110 L70,130 M100,110 L130,130" fill="none" stroke="%23ffffff" stroke-width="3" stroke-linecap="round"/>
        <circle cx="100" cy="110" r="4" fill="%23ffb020"/>
        <text x="100" y="30" fill="%23f0f7ff" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle" letter-spacing="1">TRICUSPID VALVE</text>
        <text x="100" y="45" fill="%238da2bd" font-family="sans-serif" font-size="8" text-anchor="middle">Right AV Valve</text>
    </svg>`,

    aortic_valve: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
        <defs>
            <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="%23ffb020" stop-opacity="0.25"/>
                <stop offset="100%" stop-color="%23020813" stop-opacity="0"/>
            </radialGradient>
        </defs>
        <rect width="200" height="200" fill="url(%23bgGlow)"/>
        <!-- Outer Ring -->
        <circle cx="100" cy="110" r="35" fill="none" stroke="%23ffb020" stroke-width="5" opacity="0.8"/>
        <!-- Semilunar Mercedes-Star flaps (Closed) -->
        <path d="M100,110 L100,75 M100,110 L68,127 M100,110 L132,127" fill="none" stroke="%23ffffff" stroke-width="2.5" stroke-linecap="round"/>
        <text x="100" y="30" fill="%23f0f7ff" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle" letter-spacing="1">AORTIC VALVE</text>
        <text x="100" y="45" fill="%238da2bd" font-family="sans-serif" font-size="8" text-anchor="middle">Left Semilunar Outflow Valve</text>
    </svg>`,

    pulmonary_valve: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
        <defs>
            <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="%23ffb020" stop-opacity="0.25"/>
                <stop offset="100%" stop-color="%23020813" stop-opacity="0"/>
            </radialGradient>
        </defs>
        <rect width="200" height="200" fill="url(%23bgGlow)"/>
        <!-- Outer Ring -->
        <circle cx="100" cy="110" r="35" fill="none" stroke="%23ffb020" stroke-width="5" opacity="0.8"/>
        <!-- Semilunar Mercedes-Star flaps (Open/Half-Open state) -->
        <path d="M100,110 L100,85 M100,110 L75,123 M100,110 L125,123" fill="none" stroke="%23ffffff" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="100" cy="110" r="6" fill="none" stroke="%23ffffff" stroke-width="1.5"/>
        <text x="100" y="30" fill="%23f0f7ff" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle" letter-spacing="1">PULMONARY VALVE</text>
        <text x="100" y="45" fill="%238da2bd" font-family="sans-serif" font-size="8" text-anchor="middle">Right Semilunar Outflow Valve</text>
    </svg>`,

    pulmonary_vein: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
        <defs>
            <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="%23ff3860" stop-opacity="0.25"/>
                <stop offset="100%" stop-color="%23020813" stop-opacity="0"/>
            </radialGradient>
            <linearGradient id="pvGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="%23ff3860"/>
                <stop offset="100%" stop-color="%23b81d33"/>
            </linearGradient>
        </defs>
        <rect width="200" height="200" fill="url(%23bgGlow)"/>
        <!-- Four horizontal returning pulmonary vessels -->
        <g stroke="url(%23pvGrad)" stroke-width="10" stroke-linecap="round">
            <path d="M40,80 L90,80"/>
            <path d="M40,110 L90,110"/>
            <path d="M160,80 L110,80"/>
            <path d="M160,110 L110,110"/>
        </g>
        <path d="M70,80 L80,80 M70,110 L80,110 M130,80 L120,80 M130,110 L120,110" fill="none" stroke="%23ffffff" stroke-width="1.5" stroke-linecap="round"/>
        <text x="100" y="30" fill="%23f0f7ff" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle" letter-spacing="1">PULMONARY VEINS</text>
        <text x="100" y="45" fill="%238da2bd" font-family="sans-serif" font-size="8" text-anchor="middle">Oxygenated Return from Lungs</text>
    </svg>`
};
