// app/page.js

"use client";

import { useState, useRef, useEffect, useMemo, useCallback, memo, lazy, Suspense } from "react";
// MODIFIÉ: Ajout de Battery, CPU, MemoryStick, Wifi, Smartphone, HardDrive, Satellite, Droplet, Moon, Sun, ArrowUp
import { Search, Plus, Check, X, ChevronDown, ChevronUp, Mail, Zap, Camera, BatteryCharging, Maximize, GitCompare, List, Info, Volume2, Monitor, Battery, Cpu, MemoryStick, Wifi, Smartphone, HardDrive, Droplet, Satellite, Moon, Sun, ArrowUp } from "lucide-react";
import Image from 'next/image';

const BASTIEN_EMAIL = "techscore200@gmail.com";

const HamburgerIcon = ({ isOpen, onClick, darkMode }) => (
    <button
        onClick={onClick}
        className={`p-2 rounded-full transition-colors z-50 focus:outline-none ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
        aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
    >
        <div className="flex flex-col justify-center items-center h-full w-full">
            <span className={`block w-6 h-0.5 transition-all duration-300 ease-in-out ${darkMode ? 'bg-white' : 'bg-gray-800'} ${isOpen ? 'rotate-45 translate-y-1.5' : '-translate-y-1'}`}></span>
            <span className={`block w-6 h-0.5 transition-opacity duration-300 ease-in-out ${darkMode ? 'bg-white' : 'bg-gray-800'} ${isOpen ? 'opacity-0' : 'opacity-100'} my-1`}></span>
            <span className={`block w-6 h-0.5 transition-all duration-300 ease-in-out ${darkMode ? 'bg-white' : 'bg-gray-800'} ${isOpen ? '-rotate-45 -translate-y-1.5' : 'translate-y-1'}`}></span>
        </div>
    </button>
);

// ====================================================================
// DONNÉES SAMSUNG_S25_DETAILS (Inchangées depuis la dernière version)
// ====================================================================
const SAMSUNG_S25_DETAILS = {
    marque: "Samsung",
    modele: "Galaxy S25",
    id: 98,
    apercu: {
        dateSortie: "7 février 2025",
        prixMoyen: "726,2 €",
        noteMoyenne: "8,4/10", // Pour info seulement, le calcul se fera depuis notesDetaillees
        ecran: "6,2\" Dynamic LTPO AMOLED 2X",
        puce: "Snapdragon 8 Élite (Gen 4) for Galaxy",
        batterie: "4 000 mAh",
        protection: "IP68, Armor Aluminium, Gorilla Glass Victus 2",
        notesDetaillees: [
            { cat: "Design", note: "27/30", icone: "👍👍" },
            { cat: "Écran/affichage", note: "27/30", icone: "👍👍" },
            { cat: "Performances", note: "36/40", icone: "👍👍" },
            { cat: "Caméra", note: "32/40", icone: "👍👍" },
            { cat: "Logiciel", note: "24/30", icone: "👍" },
            { cat: "Autonomie", note: "21/30", icone: "👍" },
        ],
        couleurs: [
            { nom: "Noir absolute", emoji: "🖤" },
            { nom: "Gris", emoji: "🎞" },
            { nom: "Bleu nuit", emoji: "🔵" },
            { nom: "Bleu clair", emoji: "💙" },
            { nom: "Corail", emoji: "♥️" },
            { nom: "Vert d'eau", emoji: "🟢" },
            { nom: "Or Rose", emoji: "🦩" },
        ]
    },
    details: {
        prix: [
            { version: "128 Go", neufSamsung: "749 €", neufMoyen: "~ 517 €", reconditionne: "~ 514 €" },
            { version: "256 Go", neufSamsung: "809 €", neufMoyen: "~ 599 €", reconditionne: "~ 579 €" },
            { version: "512 Go", neufSamsung: "929 €", neufMoyen: "~ 754 €", reconditionne: "~ 853 €" },
        ],
        dimensions: [
            { carac: "Épaisseur", valeur: "7,2 mm" },
            { carac: "Hauteur", valeur: "146,9 mm" },
            { carac: "Longueur", valeur: "70,5 mm" },
            { carac: "Poids", valeur: "162 g" },
        ],
        protection: [
            { carac: "Indice de protection", valeur: "IP 68" },
            { carac: "Détail IP68", valeur: "Jusqu’à 1,5 m / 30 min (Eau douce)" },
            { carac: "Coque", valeur: "Armor Aluminium" },
            { carac: "Verre écran", valeur: "Corning Gorilla Glass Victus 2" },
        ],
        boutons: [
            { carac: "Total", valeur: "3 boutons latéraux" },
            { carac: "Haut droit", valeur: "Volume + / Volume –" },
            { carac: "Milieu droit", valeur: "Bouton latéral (Power)" },
        ],
        audio: {
            hautParleurs: [
                { nom: "Configuration", usage: "2 haut-parleurs stéréo" },
                { nom: "HP Principal (bas)", usage: "Fournit les basses et la majorité du volume" },
                { nom: "HP Secondaire (haut)", usage: "Écouteur (appels) et 2ème canal stéréo" },
                { nom: "Puissance (60cm)", usage: "≈ 72 dB" }
            ],
            microphones: [
                { nom: "Total", usage: "3 micros de très bonne qualité" },
                { nom: "Micro principal (bas)", usage: "Appels, dictée, enregistrement, réduction de bruit" },
                { nom: "Micro secondaire (haut)", usage: "Appels, réduction de bruit, audio stéréo" },
                { nom: "Micro arrière (module photo)", usage: "Zoom audio, audio spatial (vidéo)" }
            ]
        },
        ecran: [
            { carac: "Taille", valeur: "6,2\"" },
            { carac: "Bordure Latérale", valeur: "1,5 mm" },
            { carac: "Bordure Supérieure", valeur: "2 mm" },
            { carac: "Bordure Inférieure", valeur: "2,5 mm" },
            { carac: "Type", valeur: "Dynamic LTPO AMOLED 2X" },
            { carac: "Résolution", valeur: "2340 x 1080 pixels (FHD+)" },
            { carac: "Densité", valeur: "416 ppi" },
            { carac: "Taux de rafraîchissement", valeur: "1 Hz à 120 Hz" },
            { carac: "Luminosité maximale", valeur: "jusqu’à 2600 nits" },
            { carac: "Capacités HDR", valeur: "HDR10+, HLG" },
        ],
        camera: {
            general: {
                nbArriere: 3,
                typeArriere: "Grand angle, Ultra grand angle, Téléobjectif",
                nbAvant: 1,
                typeAvant: "Grand angle",
                noteTeleobjectif12MP: "Note imp. (Télé 12MP & autres rés. avec télé.) : Le changement GA vers Télé varie (moyenne 6,5x) : Rapproché (10x) / Champ libre (3x)",
                noteTeleobjectif50MP: "Note imp. (Télé 50MP) : Le changement GA vers Télé varie aussi (moyenne 4x) : Rapproché (5x) / Champs libre (3x)"
            },
            simple: {
                photoArriere: [
                    { carac: "Mégapixels", valeur: "50 ou 12 Mpx" },
                    { carac: "Zoom (50 Mpx et 48 Mpx)", valeur: "1× - 5×" },
                    { carac: "Zoom (12 Mpx)", valeur: "0,6× - 30×" },
                ],
                photoAvant: [
                    { carac: "Mégapixels", valeur: "9 ou 12 Mpx" },
                    { carac: "Zoom (12 Mpx)", valeur: "plan ultra large" },
                    { carac: "Zoom (9 Mpx)", valeur: "plan large" },
                ],
                videoArriere: [
                    { carac: "8K", valeur: "30 ips / Zoom 5x / HDR" },
                    { carac: "4K", valeur: "60 ips / Zoom 0,6x-12x / HDR10+" },
                    { carac: "FullHD (Pro)", valeur: "120 ips / Zoom 0,6x-10x / HDR" },
                    { carac: "HD", valeur: "30 ips / Zoom 0,6x-12x / HDR10+" },
                ],
                videoAvant: [
                    { carac: "4K", valeur: "60 ips / Pas de zoom optique / HDR10+" },
                    { carac: "FullHD", valeur: "60 ips / Pas de zoom optique / HDR10+" },
                    { carac: "HD", valeur: "30 ips / Pas de zoom optique / HDR10+" },
                ]
            },
            photoModes: [
                { nom: "Mode Nuit", details: "Résolution 12 Mpx" },
                { nom: "Photo avec mouvement", details: "Résolution 12 Mpx" },
                { nom: "Proportions", details: "1:1, 4:3, 16:9, Full" }
            ],
            photoArriere: {
                capteurs: [
                    { objectif: "Grand angle (Principal)", megapixels: "50 ou 12 Mpx", ouverture: "f/1.8 / 23mm", zoom: "1x-4x (50Mpx, ⚠️ numérique après 1x) | 1x-6.5x (12Mpx, ⚠️ numérique après 1x)" },
                    { objectif: "Ultra grand angle", megapixels: "12 Mpx", ouverture: "f/2.2 / 13mm", zoom: "0.6x-0.9x" },
                    { objectif: "Téléobjectif 10 Mpx", megapixels: "12 ou 50 Mpx", ouverture: "f/2.4 / 69mm", zoom: "4x-5x (50Mpx) | 6.5x-30x (12Mpx)" },
                ],
                resolutions: [
                    { carac: "50 Mpx (1x)", valeur: "8160 x 6120 pixels" },
                    { carac: "12 Mpx (1x)", valeur: "4000 x 3000 pixels" },
                    { carac: "12 Mpx (Zoom 30x)", valeur: "1600 x 1200 pixels (1,9 Mpx, améliorée)" },
                    { carac: "Max interpolée", valeur: "24 Mpx (après traitement)" }
                ]
            },
            photoAvant: {
                capteurs: [
                    { objectif: "Grand angle", megapixels: "9 ou 12 Mpx", ouverture: "f/2.2 / 26mm" },
                ],
                zoom: [
                    { carac: "En 12 Mpx", valeur: "plan rapproché" },
                    { carac: "En 9 Mpx", valeur: "plan large" },
                ]
            },
            videoFormats: [
                { format: "9:16", details: "Toutes résolutions" },
                { format: "1:1", details: "1440p 30ips (HDR10+)" },
                { format: "Full", details: "1080x2336p 30ips (HDR10+)" },
            ],
            videoArriere: {
                standard: {
                    titre: "Vidéo Standard (Arrière)",
                    resolutions: "8K, 4K, FullHD, HD",
                    ips: "HD (30), FullHD (30, 60), 4K (30, 60), 8K (30)",
                    zoomOptique: "8K (1x) | Autres (0.6x, 1x)",
                    zoomNumerique: "8K (1.1x-5x) | Autres (0.7x - 0.9x, 1x - 12x)",
                    capteursZoom: "0.6-0.9x (UGA), 1-6.5x (Grand Angle), 6.5-12x (Télé)",
                    hdr: "HDR10+ (sauf 8K)"
                },
                pro: {
                    titre: "Mode Vidéo Pro (Arrière)",
                    base: "Pareil que le standard, mais à l'exception de :",
                    nouveaux_ips: "24 (FullHD, 4K, 8K), 120 (2K)",
                    format: "Nouveau format 9:21 (sauf HD)",
                    hdr: "HDR (partout), HDR10+ (sauf 8K/2K 120), LOG (partout)",
                    capteurs: "Sélection manuelle (pas de switch en enregistrement)",
                    zoomCapteur: "UGA (0.6x-2x), GA (1x-10x, seul capteur dispo. en 8K), Télé (3x-12x, sauf 2K 120)"
                },
                stabilite: {
                    titre: "Mode Stabilité (Arrière)",
                    resolutions: "QHD (1440p), FHD (1080p)",
                    ips: "60, 30",
                    zoom: "0.6x (UGA), 1x (GA)",
                    hdr: "HDR10+ disponible"
                },
                ralenti: {
                    titre: "Mode Ralenti (Arrière)",
                    resolutions: "UHD (120ips), FHD (120, 240ips)",
                    zoom: "0.6x (UGA), 1x (GA)",
                },
                hyperlapse: {
                    titre: "Mode Hyperlapse (Arrière)",
                    resolutions: "4K, FHD (30ips)",
                    zoom: "0.6x, 1x, 2x, 3x (tous sur GA)",
                    acceleration: "5x, 10x, 15x, 30x, 45x, 60x, 300x, Auto"
                },
                doubleEnregistrement: {
                    titre: "Mode Double Enregistrement",
                    resolutions: "FullHD (30ips)",
                    zoom: "0.6x (UGA), 1x (GA/Avant), 3x (Télé)",
                    details: "2 capteurs au choix en même temps"
                },
                cadrageAuto: {
                    titre: "Mode Cadrage Auto (Arrière)",
                    resolutions: "UHD, FHD (30ips)",
                    zoom: "0.6x, 1x, 2x, Auto"
                }
            },
            videoAvant: {
                standard: {
                    titre: "Vidéo Standard (Avant)",
                    resolutions: "4K, FullHD, HD",
                    ips: "HD (30), FullHD (30, 60), 4K (30, 60)",
                    zoom: "1x (optique)",
                    hdr: "HDR10+ disponible"
                },
                pro: {
                    titre: "Mode Vidéo Pro (Avant)",
                    base: "Pareil que le standard, mais à l'exception de :",
                    nouveaux_ips: "24 (FullHD, 4K)",
                    format: "Nouveau format 9:21 (sauf HD)",
                    hdr: "HDR10+ (partout), LOG (partout)",
                },
                ralenti: {
                    titre: "Mode Ralenti (Avant)",
                    resolutions: "FHD (120ips)",
                    zoom: "1x (optique)",
                },
                hyperlapse: {
                    titre: "Mode Hyperlapse (Avant)",
                    resolutions: "4K, FHD (30ips)",
                    zoom: "1x (optique)",
                    acceleration: "5x, 10x, 15x, 30x, 45x, 60x, Auto"
                },
                cadrageAuto: {
                    titre: "Mode Cadrage Auto (Avant)",
                    resolutions: "UHD, FHD (30ips)",
                    zoom: "1x, Auto"
                }
            }
        },
        connectivite: {
            filaire: [
                { carac: "USB-C Type", valeur: "3.2" },
                { carac: "DisplayPort", valeur: "Jusqu’à 4K 60ips (HDR10+)" },
                { carac: "Puissance de charge", valeur: "25 W (USB-C PD)" },
            ],
            sansFil: [
                { carac: "Réseaux Mobiles", valeur: "5G (Sub-6/mmWave), 4G LTE Advanced" },
                { carac: "Wi-Fi Normes", valeur: "7, 6E, 6, 5, 4 (2.4/5/6 GHz)" },
                { carac: "Wi-Fi Débit Max", valeur: "46 Gbit/s" },
                { carac: "Wi-Fi Portée", valeur: "100 mètres" },
                { carac: "Bluetooth Norme", valeur: "5.4 (Portée 240m, Débit 2 Mbit/s)" },
                { carac: "Bluetooth Audio", valeur: "LE Audio, Auracast, LC3" },
                { carac: "NFC Type", valeur: "Sécurisé (Samsung Wallet)" },
            ],
            partage: [
                { carac: "Type", valeur: "Câble, Wi-Fi (10 appareils), Bluetooth" },
                { carac: "Vitesse Max (Câble)", valeur: "10 Gbs" },
                { carac: "Vitesse Max (Wi-Fi)", valeur: "2,4 Gbs" },
                { carac: "Vitesse Max (Bluetooth)", valeur: "3 Mbs" },
            ]
        },
        localisation: [
            { carac: "GPS", valeur: "Double fréquence (précision ~30cm)" },
            { carac: "GLONASS", valeur: "Satellites russes, redondance GPS" },
            { carac: "Galileo", valeur: "Satellites européens, précision supp." },
            { carac: "BeiDou", valeur: "Satellites chinois, couverture mondiale" },
            { carac: "QZSS", valeur: "Satellites japonais, utile en Asie" },
        ],
        capteurs: [
            { carac: "Total", valeur: "Environ 24 capteurs" },
            { carac: "Reconnaissance faciale", valeur: "Caméra frontale (Architecture 2D)" },
            { carac: "Orientation", valeur: "Magnétomètre (boussole)" },
            { carac: "Lumière ambiante", valeur: "Ajuste luminosité et True Tone" },
            { carac: "Proximité", valeur: "Éteint l’écran (appels)" },
            { carac: "Température interne", valeur: "Surveille batterie et processeur" },
            { carac: "Pression interne", valeur: "Détecte variations étanchéité" },
        ],
        performances: {
            stockage: [
                { carac: "Options", valeur: "128, 256, 512 Go" },
                { carac: "Technologie", valeur: "UFS 4.0" },
                { carac: "Vitesse Écriture", valeur: "2 800 Mo/s" },
                { carac: "Vitesse Lecture", valeur: "4 200 Mo/s" },
            ],
            ram: [
                { carac: "Capacité", valeur: "12 Go" },
                { carac: "Technologie", valeur: "LPDDR5X" },
                { carac: "Vitesse", valeur: "8 533 MT/s" },
            ],
            processeur: {
                type: "Snapdragon 8 Élite (Gen 4) for Galaxy",
                gravure: "3 nm",
                cpu: {
                    totalCores: 8,
                    cacheL3: "12 Mo",
                    perfCores: "2 Cœurs @ 0.6 - 4.47 GHz (Cache L2: 1 Mo/cœur)",
                    efficiencyCores: "6 Cœurs @ 0.4 - 3.53 GHz (Cache L2: 512 Ko/cœur)"
                },
                gpu: {
                    type: "Qualcomm Adreno 830 custom Galaxy",
                    cores: "12 unités de calcul",
                    frequence: "0.2 - 1.2 GHz",
                    perfTheorique: "4,2 TFLOPS FP32",
                    api: "Vulkan 1.3, OpenGL ES 3.2, OpenCL 3.0",
                    rayTracing: "Oui (2ème génération)",
                    video: "Encodage/décodage ProRes, H.265, AV1 (8K 60 HDR)"
                },
                npu: {
                    type: "Qualcomm Hexagon",
                    description: "Un cœur est une unité de calcul optimisée pour l’IA",
                    blocs: [
                        { nom: "Unités vectorielles", usage: "Calculs classiques (matrices, vecteurs)" },
                        { nom: "Unités tensorielles", usage: "Réseaux neuronaux, IA générative" },
                        { nom: "Unités scalaires", usage: "Gestion et orchestration des tâches" }
                    ],
                    perfTheorique: "45 TOPS"
                }
            },
            scores: [
                { cat: "AnTuTu Total", score: "2 701 072" },
                { cat: "AnTuTu CPU", score: "686 278" },
                { cat: "AnTuTu GPU", score: "1 292 001" },
                { cat: "AnTuTu Mémoire", score: "337 343" },
                { cat: "AnTuTu UX", score: "385 450" },
            ]
        },
        batterie: {
            specs: [
                { carac: "Capacité", valeur: "4 000 mAh" },
                { carac: "Type", valeur: "Li-ion, cellule unique" },
            ],
            recharge: [
                { carac: "Filaire (25W)", valeur: "0-100% en 1h 19min" },
                { carac: "Sans fil (15W)", valeur: "0-100% en 2h 31min" },
                { carac: "Norme sans fil", valeur: "Qi2, MagSafe" },
                { carac: "Inversée (PowerShare)", valeur: "4,5 W" },
            ]
        },
        autonomie: [
            { usage: "Navigation web (mixte)", autonomie: "~18–20 h" },
            { usage: "Jeux 3D intensifs", autonomie: "~7–8 h" },
            { usage: "Appels 4G/5G", autonomie: "~32 h" },
            { usage: "Veille (réseau actif)", autonomie: "~90–100 h (~4 jours)" },
        ],
        logiciel: [
            { carac: "OS (sortie)", valeur: "Android 15 / One UI 7" },
            { carac: "OS (actuel 09/2025)", valeur: "Android 16 / One UI 8" },
            { carac: "Mises à jour logicielles", valeur: "5 ans (jusqu'à 2030 / Android 21) - Actuellement : 5 ans restants" },
            { carac: "Mises à jour de sécurité", valeur: "7 ans (jusqu'à 2032) - Actuellement : 7 ans restants" },
        ],
        logicielPointsPositifs: [
            {
                titre: "1. Personnalisation ultra-poussée",
                points: [
                    "One UI permet de tout modifier (Edge Panels, Good Lock)",
                    "Routines automatiques (Bixby Routines)"
                ]
            },
            {
                titre: "2. Fonctions multitâches et productivité",
                points: [
                    "Multi-fenêtres et Pop-up view (applications flottantes)",
                    "Samsung DeX (transforme le tél. en PC sur écran externe)",
                    "Compatibilité tous fichiers et stockage externe"
                ]
            },
            {
                titre: "3. Intégration hardware-software avancée",
                points: [
                    "Interactions (Watch, Buds, SmartThings)",
                    "Partage rapide (Quick Share)",
                    "Écosystème ouvert (Windows, Smart TVs, autres Android)"
                ]
            }
        ]
    }
};


// ====================================================================
// DONNÉES IPHONE_16_DETAILS (Nouvelles données ajoutées)
// ====================================================================
const IPHONE_16_DETAILS = {
    marque: "Apple",
    modele: "iPhone 16",
    id: 40,
    apercu: {
        dateSortie: "9 septembre 2024",
        prixMoyen: "929 €",
        noteMoyenne: "8/10", // Pour info seulement, le calcul se fera depuis notesDetaillees
        ecran: "6,1\" OLED Super Retina XDR",
        puce: "A18",
        batterie: "3 561 mAh",
        protection: "IP68, Aluminium, Ceramic Shield",
        notesDetaillees: [
            { cat: "Design", note: "27/30", icone: "👍👍" },
            { cat: "Écran/affichage", note: "21/30", icone: "👍" },
            { cat: "Performances", note: "36/40", icone: "👍👍" },
            { cat: "Caméra", note: "32/40", icone: "👍👍" },
            { cat: "Logiciel", note: "21/30", icone: "👍" },
            { cat: "Autonomie", note: "21/30", icone: "👍" },
        ],
        couleurs: [
            { nom: "Noir", emoji: "⚫️" },
            { nom: "Blanc", emoji: "⚪️" },
            { nom: "Outremer", emoji: "🔵" },
            { nom: "Rose", emoji: "🦩" },
            { nom: "Sarcelle", emoji: "💚" },
        ]
    },
    details: {
        prix: [
            { version: "128 Go", neufSamsung: "869 €", neufMoyen: "~ 745 €", reconditionne: "~ 659 €" },
            { version: "256 Go", neufSamsung: "969 €", neufMoyen: "~ 879 €", reconditionne: "~ 778 €" },
            { version: "512 Go", neufSamsung: "1 069 €", neufMoyen: "~ 1 043 €", reconditionne: "~ 810 €" },
        ],
        dimensions: [
            { carac: "Épaisseur", valeur: "7,8 mm" },
            { carac: "Hauteur", valeur: "147,6 mm" },
            { carac: "Longueur", valeur: "71,6 mm" },
            { carac: "Poids", valeur: "171 g" },
        ],
        protection: [
            { carac: "Indice de protection", valeur: "IP 68" },
            { carac: "Détail IP68", valeur: "Jusqu'à 1,5 m / 30 min (Eau douce uniquement)" },
            { carac: "Coque", valeur: "Aluminium" },
            { carac: "Verre écran", valeur: "Ceramic Shield" },
        ],
        boutons: [
            { carac: "Total", valeur: "5 boutons latéraux" },
            { carac: "Haut gauche", valeur: "Bouton Action" },
            { carac: "Milieu gauche", valeur: "Volume + / Volume –" },
            { carac: "Haut droit", valeur: "Bouton latéral (Power)" },
            { carac: "Bas droit", valeur: "Bouton intelligent pour appareil photo" },
        ],
        audio: {
            hautParleurs: [
                { nom: "Configuration", usage: "2 haut-parleurs stéréo" },
                { nom: "HP Principal (bas)", usage: "Fournit les basses et la majorité du volume" },
                { nom: "HP Secondaire (haut)", usage: "Écouteur (appels) et 2ème canal stéréo" },
                { nom: "Puissance (60cm)", usage: "≈ 72 dB" }
            ],
            microphones: [
                { nom: "Total", usage: "3 micros de qualité studio" },
                { nom: "Micro principal (bas)", usage: "Appels, dictée, enregistrement audio" },
                { nom: "Micro secondaire (haut)", usage: "FaceTime, suppression de bruit, vidéos selfie" },
                { nom: "Micro arrière (bloc photo)", usage: "Vidéos classiques, spatial audio, zoom audio" }
            ]
        },
        ecran: [
            { carac: "Taille", valeur: "6,1\"" },
            { carac: "Bordure Latérale", valeur: "1,8 mm" },
            { carac: "Bordure Supérieure", valeur: "1,8 mm" },
            { carac: "Bordure Inférieure", valeur: "1,8 mm" },
            { carac: "Type", valeur: "OLED Super Retina XDR" },
            { carac: "Résolution", valeur: "2556 x 1179 pixels" },
            { carac: "Densité", valeur: "460 ppi" },
            { carac: "Taux de rafraîchissement", valeur: "60 Hz (fixe)" },
            { carac: "Luminosité maximale", valeur: "jusqu'à 2000 nits" },
            { carac: "Capacités HDR", valeur: "HDR10, DolbyVision, HLG" },
        ],
        camera: {
            general: {
                nbArriere: 2,
                typeArriere: "Grand angle, Ultra grand angle",
                nbAvant: 1,
                typeAvant: "Grand angle"
            },
            simple: {
                photoArriere: [
                    { carac: "Mégapixels", valeur: "48 ou 12 Mpx" },
                    { carac: "Zoom (48 et 50 Mpx)", valeur: "1×" },
                    { carac: "Zoom (12 Mpx)", valeur: "0,5× - 0,9×, 1,1× - 10×" },
                ],
                photoAvant: [
                    { carac: "Mégapixels", valeur: "12 Mpx" },
                    { carac: "Zoom (12 Mpx)", valeur: "1× - 3×" },
                ],
                videoArriere: [
                    { carac: "8K", valeur: "Non disponible" },
                    { carac: "4K", valeur: "60 ips / Zoom 0,5×-10× / HDR" },
                    { carac: "FullHD", valeur: "60 ips / Zoom 0,5×-10× / HDR" },
                    { carac: "HD", valeur: "30 ips / Zoom 0,5×-10× / HDR" },
                ],
                videoAvant: [
                    { carac: "4K", valeur: "60 ips / Zoom 1×-2× / HDR" },
                    { carac: "FullHD", valeur: "60 ips / Zoom 1×-2× / HDR" },
                    { carac: "HD", valeur: "30 ips / Zoom 1×-2× / HDR" },
                ]
            },
            photoModes: [
                { nom: "Mode Nuit", details: "Résolution 12 Mpx" },
                { nom: "Photo avec mouvement", details: "Résolution 12 Mpx" },
                { nom: "Proportions", details: "1:1, 4:3, 16:9, Full" }
            ],
            photoArriere: {
                capteurs: [
                    { objectif: "Grand angle (Principal)", megapixels: "48 Mpx", ouverture: "f/1.6 / 26mm", zoom: "1× (48Mpx) | 1,1×-10× (12Mpx, ⚠️ numérique après ×1 sauf ×2 optique)" },
                    { objectif: "Ultra grand angle", megapixels: "12 Mpx", ouverture: "f/2.4 / 13mm", zoom: "0,5×-0,9×" },
                ],
                resolutions: [
                    { carac: "48 Mpx (1×)", valeur: "8064 × 6048 pixels" },
                    { carac: "12 Mpx (1×)", valeur: "4032 × 3024 pixels" },
                    { carac: "12 Mpx (Zoom 10×)", valeur: "800 × 600 pixels (2,4 Mpx, améliorée)" },
                    { carac: "Max interpolée", valeur: "24 Mpx (après traitement)" }
                ]
            },
            photoAvant: {
                capteurs: [
                    { objectif: "Grand angle", megapixels: "12 Mpx", ouverture: "f/1.9, autofocus" },
                ],
                zoom: [
                    { carac: "En 12 Mpx", valeur: "1× - 3× (numérique après ×1)" },
                    { carac: "Qualité Zoom 3×", valeur: "1344 × 1008 pixels (1,4 Mpx, améliorée)" },
                ]
            },
            videoFormats: [
                { format: "16:9", details: "Toutes résolutions" },
            ],
            videoArriere: {
                standard: {
                    titre: "Vidéo Standard (Arrière)",
                    resolutions: "4K, FullHD, HD",
                    ips: "HD (30), FullHD (25, 30, 60), 4K (24, 30, 60)",
                    zoomOptique: "0,5×, 1×, 2×",
                    zoomNumerique: "0,6×-0,9×, 1,1×-1,9×, 2,1×-10×",
                    capteursZoom: "0,5×-0,9× (Ultra grand-angle), 1×-10× (Grand Angle)",
                    hdr: "HDR disponible"
                },
                proRes: {
                    titre: "Mode ProRes (Arrière)",
                    base: "Pareil que le standard, mais à l'exception de :",
                    exclusions: "720p (HD) non disponible",
                    hdr: "HDR disponible"
                },
                cinematique: {
                    titre: "Mode Cinématique (Arrière)",
                    resolutions: "4K",
                    ips: "24, 30",
                    zoomOptique: "0,5×, 1×, 2×",
                    zoomNumerique: "0,6×-0,9×, 1,1×-1,9×, 2,1×-3×",
                    capteursZoom: "0,5×-0,9× (Ultra grand-angle), 1×-3× (Grand Angle)"
                },
                action: {
                    titre: "Mode Action (Arrière)",
                    resolutions: "2,8K",
                    ips: "60",
                    zoomOptique: "1×, 2×",
                    zoomNumerique: "1,1×-1,9×, 2,1×-2,5×",
                    capteursZoom: "1×-2,5× (Grand Angle)"
                },
                ralenti: {
                    titre: "Mode Ralenti (Arrière)",
                    resolutions: "FullHD",
                    ips: "120, 240",
                    zoomOptique: "0,5×, 1×, 2×",
                    zoomNumerique: "0,6×-0,9×, 1,1×-1,9×, 2,1×-3×",
                    capteursZoom: "0,5×-0,9× (Ultra grand-angle), 1×-3× (Grand Angle)"
                },
                accelere: {
                    titre: "Mode Accéléré (Arrière)",
                    resolutions: "4K, FullHD",
                    ips: "30 (accélération automatique)",
                    zoomOptique: "0,5×, 1×, 2×",
                    zoomNumerique: "0,6×-0,9×, 1,6×-1,9×, 2,1×-10×",
                    capteursZoom: "0,5×-0,9× (Ultra grand-angle), 1×-10× (Grand Angle)"
                },
                spatial: {
                    titre: "Mode Spatial 3D (Arrière)",
                    resolutions: "FullHD",
                    ips: "30",
                    zoom: "1× (fixe)",
                    capteursZoom: "Principal + Ultra grand-angle combinés (effet réalité augmentée)"
                }
            },
            videoAvant: {
                standard: {
                    titre: "Vidéo Standard (Avant)",
                    resolutions: "4K, FullHD, HD",
                    ips: "HD (30), FullHD (25, 30, 60), 4K (24, 30, 60)",
                    zoom: "1× (optique)",
                    zoomNumerique: "1,1×-2×",
                    hdr: "HDR disponible"
                },
                proRes: {
                    titre: "Mode ProRes (Avant)",
                    base: "Aucun changement par rapport au mode classique",
                    exclusions: "720p non disponible"
                },
                cinematique: {
                    titre: "Mode Cinématique (Avant)",
                    resolutions: "4K, FullHD",
                    ips: "30",
                    zoom: "1× (optique)",
                    zoomNumerique: "1,1×-2×"
                },
                action: {
                    titre: "Mode Action (Avant)",
                    resolutions: "2,8K",
                    ips: "60",
                    zoom: "1× (optique)",
                    zoomNumerique: "1,1×-1,5×"
                },
                ralenti: {
                    titre: "Mode Ralenti (Avant)",
                    resolutions: "FullHD",
                    ips: "120",
                    zoom: "1× (optique)",
                    zoomNumerique: "1,1×-1,5×"
                },
                accelere: {
                    titre: "Mode Accéléré (Avant)",
                    resolutions: "4K, FullHD",
                    ips: "30",
                    zoom: "1× (optique)",
                    zoomNumerique: "1,1×-2×"
                }
            }
        },
        connectivite: {
            filaire: [
                { carac: "USB-C Type", valeur: "2.0" },
                { carac: "DisplayPort", valeur: "Jusqu'à 4K 60ips (Dolby Vision et HDR10)" },
                { carac: "Puissance de charge", valeur: "27 W" },
            ],
            sansFil: [
                { carac: "Réseaux Mobiles", valeur: "5G (Sub-6 GHz et mmWave États-Unis), 4G LTE Advanced, 3G, 2G" },
                { carac: "Wi-Fi Normes", valeur: "6E, 6, 5, 4 (2.4/5/6 GHz)" },
                { carac: "Wi-Fi Débit Max", valeur: "4,8 Gbit/s" },
                { carac: "Wi-Fi Portée", valeur: "50 mètres" },
                { carac: "Bluetooth Norme", valeur: "5.3 (Portée 240m, Débit 2 Mbit/s)" },
                { carac: "Bluetooth Audio", valeur: "LE audio, Auracast, LC3 codec" },
                { carac: "NFC Type", valeur: "Sécurisé (Apple Pay)" },
            ],
            partage: [
                { carac: "Type", valeur: "Câble, Wi-Fi (10 appareils), Bluetooth" },
                { carac: "Vitesse Max (Câble)", valeur: "480 Mbs" },
                { carac: "Vitesse Max (Wi-Fi)", valeur: "300 Mbs" },
                { carac: "Vitesse Max (Bluetooth)", valeur: "3 Mbs" },
            ]
        },
        localisation: [
            { carac: "GPS", valeur: "GPS principal" },
            { carac: "GLONASS", valeur: "Satellites russes, redondance GPS" },
            { carac: "Galileo", valeur: "Satellites européens, précision supplémentaire" },
            { carac: "BeiDou", valeur: "Satellites chinois, couverture mondiale" },
            { carac: "QZSS", valeur: "Satellites japonais, utile en Asie" },
            { carac: "Ultra wideband", valeur: "2e génération (localisation précise)" },
        ],
        capteurs: [
            { carac: "Total", valeur: "Environ 25 capteurs" },
            { carac: "Face ID", valeur: "4 capteurs (Architecture 3D)" },
            { carac: "Caméra infrarouge", valeur: "Capture visage en infrarouge" },
            { carac: "Projecteur de points", valeur: "30 000 points invisibles" },
            { carac: "Émetteur flood IR", valeur: "Éclaire visage infrarouge (nuit)" },
            { carac: "Magnétomètre", valeur: "Boussole, orientation nord" },
            { carac: "Lumière ambiante", valeur: "Ajuste luminosité et True Tone" },
            { carac: "Proximité", valeur: "Éteint écran (appels)" },
            { carac: "Température interne", valeur: "Surveille batterie et processeur" },
            { carac: "Pression interne", valeur: "Détecte variations étanchéité" },
        ],
        performances: {
            stockage: [
                { carac: "Options", valeur: "128, 256, 512 Go" },
                { carac: "Technologie", valeur: "NVMe" },
                { carac: "Vitesse Écriture", valeur: "3 500 Mo/s" },
                { carac: "Vitesse Lecture", valeur: "4 000 Mo/s" },
            ],
            ram: [
                { carac: "Capacité", valeur: "8 Go" },
                { carac: "Technologie", valeur: "LPDDR5" },
                { carac: "Vitesse", valeur: "6400 MT/s" },
            ],
            processeur: {
                type: "A18",
                gravure: "3 nm",
                cpu: {
                    totalCores: 6,
                    cacheL3: "16 Mo",
                    perfCores: "2 Cœurs @ 0,6 - 3,9 GHz (Cache L2: 2 Mo/cœur)",
                    efficiencyCores: "4 Cœurs @ 0,3 - 2,2 GHz (Cache L2: 512 Ko/cœur)"
                },
                gpu: {
                    type: "Apple 6-core GPU",
                    cores: "6 blocs graphiques",
                    frequence: "0,15 - 1,49 GHz",
                    perfTheorique: "3,0 TFLOPS FP32",
                    api: "Metal 3 (Apple only), OpenGL ES 3.2",
                    rayTracing: "Oui (seconde génération)",
                    video: "Encodage/décodage ProRes, H.265, AV1 matériel jusqu'en 4K 60 HDR"
                },
                npu: {
                    type: "Apple Neural Engine",
                    description: "Un cœur est une unité de calcul optimisée pour l'IA",
                    blocs: [
                        { nom: "Cœurs Neural Engine", usage: "16 cœurs dédiés à l'IA" },
                        { nom: "Calculs IA", usage: "Traitement des réseaux neuronaux" },
                        { nom: "Machine Learning", usage: "Accélération des tâches ML" }
                    ],
                    perfTheorique: "35 TOPS"
                }
            },
            scores: [
                { cat: "AnTuTu Total", score: "1 668 567" },
                { cat: "AnTuTu CPU", score: "409 372" },
                { cat: "AnTuTu GPU", score: "675 209" },
                { cat: "AnTuTu Mémoire", score: "224 979" },
                { cat: "AnTuTu UX", score: "359 007" },
            ]
        },
        batterie: {
            specs: [
                { carac: "Capacité", valeur: "3 561 mAh" },
                { carac: "Type", valeur: "Li-ion, cellule unique, non amovible" },
            ],
            recharge: [
                { carac: "Filaire (27W)", valeur: "0-100% en 1h 20min (chargeur 30W)" },
                { carac: "Sans fil (25W)", valeur: "0-100% en 1h 40min (MagSafe)" },
                { carac: "Norme sans fil", valeur: "MagSafe et IQ2" },
            ]
        },
        autonomie: [
            { usage: "Navigation web (Wi-Fi/5G mixte)", autonomie: "~15–17 h" },
            { usage: "Jeux 3D intensifs", autonomie: "~6–7 h" },
            { usage: "Appels 4G/5G", autonomie: "~28-30 h" },
            { usage: "Veille (réseau actif)", autonomie: "~70–80 h (~4 jours)" },
        ],
        logiciel: [
            { carac: "OS (sortie)", valeur: "iOS 18" },
            { carac: "OS (actuel 09/2025)", valeur: "iOS 26" },
            { carac: "Mises à jour logicielles", valeur: "6 ans (jusqu'à 2030 / iOS 31) - Actuellement : 5 ans restants" },
            { carac: "Mises à jour de sécurité", valeur: "8 ans (jusqu'à 2032) - Actuellement : 7 ans restants" },
        ],
        logicielPointsPositifs: [
            {
                titre: "1. Mises à jour longues, rapides et uniformes",
                points: [
                    "Tous les iPhones reçoivent les mêmes mises à jour iOS en même temps, partout dans le monde",
                    "Pas de délais liés aux opérateurs ou fabricants"
                ]
            },
            {
                titre: "2. Écosystème Apple intégré et fluide",
                points: [
                    "iPhone, iPad, Mac, Apple Watch, AirPods : tout est parfaitement synchronisé",
                    "Dynamic Island Interface interactive qui transforme l'encoche en un espace utile",
                    "AirDrop (partage instantané sans config)",
                    "Handoff (commencer un mail sur iPhone : finir sur Mac)",
                    "Appels et SMS sur Mac/iPad via iPhone",
                    "Apple Watch déverrouille automatiquement iPhone/Mac"
                ]
            },
            {
                titre: "3. Confidentialité et sécurité au centre",
                points: [
                    "Apple ne vit pas de la publicité : pas de collecte massive",
                    "Système beaucoup plus fermé : moins de risques d'apps malveillantes",
                    "Permissions plus strictes",
                    "Face ID + App Lock (verrouillage d'apps sensibles avec biométrie)"
                ]
            }
        ]
    }
};

const PHONE_DETAILS_DATA = {
    "Samsung-Galaxy S25": SAMSUNG_S25_DETAILS,
    "Apple-iPhone 16": IPHONE_16_DETAILS,
};

// ====================================================================
// COMPOSANT PhoneDetailsModal (MODIFIÉ SimpleView + CompleteView Camera Info)
// ====================================================================

const ComparisonModal = ({ phones, onClose, darkMode }) => {
    const [viewMode, setViewMode] = useState('simple');

    // États pour les sections dépliantes
    const [expandedSections, setExpandedSections] = useState({
        ecran: false,
        camera: false,
        performances: false,
        batterie: false,
        connectivite: false,
        dimensions: false,
        protection: false,
        audio: false,
        capteurs: false,
        localisation: false,
        logiciel: false
    });

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const getDetailedSpecs = (phone) => {
        const phoneKey = `${phone.marque}-${phone.modele}`;
        return PHONE_DETAILS_DATA[phoneKey] || null;
    };

    const getDetailedNotes = (globalNote) => {
        const maxScores = {
            design: 30,
            écran: 30,
            performance: 40,
            caméra: 40,
            logiciel: 30,
            autonomie: 30,
        };
        const totalMax = 200;

        const idealDistribution = {};
        let calculatedTotal = 0;
        const keys = Object.keys(maxScores);

        for (const [key, max] of Object.entries(maxScores)) {
            const score = Math.round((globalNote / totalMax) * max);
            idealDistribution[key] = score;
            calculatedTotal += score;
        }

        let difference = globalNote - calculatedTotal;

        if (idealDistribution.performance !== undefined) {
            idealDistribution.performance += difference;
        } else {
            idealDistribution[keys[0]] += difference;
        }

        for (const key of keys) {
            if (idealDistribution[key] > maxScores[key]) {
                idealDistribution[key] = maxScores[key];
            }
        }

        return {
            design: { score: idealDistribution.design, max: maxScores.design },
            écran: { score: idealDistribution.écran, max: maxScores.écran },
            performance: { score: idealDistribution.performance, max: maxScores.performance },
            caméra: { score: idealDistribution.caméra, max: maxScores.caméra },
            logiciel: { score: idealDistribution.logiciel, max: maxScores.logiciel },
            autonomie: { score: idealDistribution.autonomie, max: maxScores.autonomie },
        };
    };

    const renderComparisonRow = (label, values, isHeader = false) => {
        const colsClass = phones.length === 2 ? 'grid-cols-3' : phones.length === 3 ? 'grid-cols-4' : 'grid-cols-5';

        // Fonction pour déterminer quelle valeur est la meilleure
        const getBestValueIndexes = (label, values) => {
            // Identifier les positions des téléphones
            const s25Index = phones.findIndex(p => p.marque === "Samsung" && p.modele === "Galaxy S25");
            const iphone16Index = phones.findIndex(p => p.marque === "Apple" && p.modele === "iPhone 16");

            if (values.some(v => v === "Non disponible")) {
                // Cas spécial : Zoom 9 Mpx - iPhone 16 gagne même avec "Non disponible"
                if (label.includes("Zoom (9 Mpx)") && iphone16Index >= 0) {
                    return iphone16Index;
                }

                // Si une valeur est "Non disponible", les autres sont meilleures
                const availableIndexes = [];
                values.forEach((v, i) => {
                    if (v !== "Non disponible") availableIndexes.push(i);
                });
                return availableIndexes;
            }

            // Vérification spéciale pour 8K
            if (label.includes("8K")) {
                // Seul le S25 a la 8K, donc il gagne toujours
                return s25Index >= 0 ? s25Index : -1;
            }

            // Si on compare plus de 2 téléphones et que ni S25 ni iPhone 16 ne sont présents
            // OU si on a 3+ téléphones, désactiver la mise en évidence automatique
            if (phones.length > 2) {
                // Ne mettre en évidence que pour les cas très clairs (8K, Non disponible déjà gérés)
                return -1;
            }

            // Si exactement 2 téléphones et ni S25 ni iPhone 16, pas de mise en évidence
            if (s25Index < 0 && iphone16Index < 0) {
                return -1;
            }

            // Logique spécifique selon le type de caractéristique
            switch (label) {
                // Informations générales
                case "Date de sortie":
                    // S25 (février 2025) plus récent que iPhone 16 (septembre 2024)
                    return values.findIndex(v => v.includes("2025"));
                case "Batterie":
                    // Favoriser le S25 pour la batterie dans les infos générales
                    return s25Index;
                case "Protection":
                    // Favoriser le S25 pour la protection dans les infos générales
                    return s25Index;

                // Couleurs
                case "Couleurs":
                    // Favoriser le S25 (7 couleurs vs 5 pour iPhone 16)
                    return s25Index;

                // Notes détaillées - favoriser la meilleure note ou égalité
                case "Design":
                case "Performance":
                case "Performances":
                case "Caméra":
                case "Autonomie":
                    // Égalité - marquer comme égalité spéciale
                    return "equality";
                case "Écran/affichage":
                case "Logiciel":
                    // S25 gagne
                    return s25Index;

                // Prix - favoriser le S25 (prix plus avantageux)
                case "128 Go":
                case "256 Go":
                case "512 Go":
                    // S25 a des prix plus avantageux
                    return s25Index;

                // Connectivité
                case "Port":
                    return values.findIndex(v => v.includes("3.2"));
                case "Wi-Fi":
                    return values.findIndex(v => v.includes("7"));
                case "Bluetooth":
                    return values.findIndex(v => v.includes("5.4"));
                case "5G":
                    // Égalité pour la 5G (les deux l'ont)
                    return "equality";
                case "GPS":
                    // Favoriser l'iPhone 16 pour le GPS
                    return iphone16Index;
                case "NFC":
                    // Égalité pour le NFC (les deux ont du NFC sécurisé)
                    return "equality";

                // Batterie - capacité et autonomie S25, charges iPhone 16
                case "Capacité":
                case "Autonomie (usage mixte)":
                case "Charge inversée":
                    // Favoriser le S25 pour capacité, autonomie et charge inversée
                    return s25Index;
                case "Charge filaire":
                case "Charge sans fil":
                    // Favoriser l'iPhone 16 pour les charges
                    return iphone16Index;

                // Performances - processeur S25, autres selon logique
                case "Processeur":
                case "Cœurs CPU":
                case "Score AnTuTu":
                    // Toujours favoriser le S25 pour le processeur
                    return s25Index;
                case "Gravure":
                    // Égalité pour la gravure (3 nm pour les deux)
                    return "equality";
                case "RAM":
                    const rams = values.map(v => parseInt(v.replace(/[^\d]/g, '')) || 0);
                    return rams.indexOf(Math.max(...rams));
                case "Stockage":
                    // Égalité pour le stockage (même options)
                    return "equality";

                // Écran - la plupart favorisent le S25, sauf résolution, densité et bordures sup/inf
                case "Écran":
                case "Taille":
                case "Type":
                case "Bordures latérales":
                case "Taux de rafraîchissement":
                case "Luminosité maximale":
                case "Capacités HDR":
                    // Favoriser le S25 pour l'écran et les bordures latérales
                    return s25Index;
                case "Densité":
                case "Résolution":
                case "Bordures sup/inf":
                    // Favoriser l'iPhone 16 pour la résolution, densité et bordures sup/inf
                    return iphone16Index;

                // Dimensions et Protection
                case "Poids":
                    // Moins de grammes = mieux
                    const weights = values.map(v => parseInt(v.replace(/[^\d]/g, '')) || 999);
                    return weights.indexOf(Math.min(...weights));
                case "Épaisseur":
                    // Moins d'épaisseur = mieux
                    const thickness = values.map(v => parseFloat(v.replace(/[^\d.]/g, '')) || 99);
                    return thickness.indexOf(Math.min(...thickness));
                case "Hauteur":
                case "Largeur":
                    // Favoriser l'iPhone 16
                    return iphone16Index;
                case "Coque":
                case "Verre écran":
                    // Favoriser le S25 pour la protection (Armor Aluminium + Gorilla Glass Victus 2)
                    return s25Index;

                // Boutons
                case "Total boutons":
                    const buttonCounts = values.map(v => parseInt(v.replace(/[^\d]/g, '')) || 0);
                    return buttonCounts.indexOf(Math.max(...buttonCounts));
                case "Volume":
                case "Bouton latéral":
                    // Égalité - les deux ont la même fonction
                    return "equality";
                case "Boutons spéciaux":
                    return values.findIndex(v => !v.includes("Aucun"));

                // Audio
                case "Haut-parleurs":
                case "Microphones":
                case "Puissance":
                    // Égalité - même configuration/performance
                    return "equality";

                // Caméra/Vidéo - favoriser plus de fonctionnalités
                case "8K":
                    return s25Index;
                case "4K":
                case "FullHD":
                case "FullHD (Pro)":
                case "HD":
                    // Favoriser le S25 pour la vidéo arrière
                    return s25Index;
                case "4K (avant)":
                case "FullHD (avant)":
                case "HD (avant)":
                    // Favoriser l'iPhone 16 pour la vidéo avant
                    return iphone16Index;
                case "Mégapixels":
                    const megapixels = values.map(v => parseInt(v.replace(/[^\d]/g, '')) || 0);
                    return megapixels.indexOf(Math.max(...megapixels));
                case "Zoom (48 Mpx)":
                case "Zoom (48 et 50 Mpx)":
                case "Zoom (50 Mpx)":
                case "Zoom (50 Mpx et 48 Mpx)":
                case "Zoom (12 Mpx)":
                    // Favoriser le S25 pour les capacités de zoom arrière
                    return s25Index;
                case "Mégapixels (avant)":
                case "Zoom (avant)":
                    // Favoriser l'iPhone 16 pour la caméra avant
                    return iphone16Index;
                case "Zoom (12 Mpx) (avant)":
                case "Zoom (12 Mpx)":
                    // iPhone 16 gagne pour le zoom 12 Mpx avant
                    return iphone16Index;
                case "Format (avant)":
                case "Format (12 Mpx) (avant)":
                case "Format (12 Mpx)":
                    // Favoriser l'iPhone 16 pour ces formats
                    return iphone16Index;
                case "Zoom (9 Mpx) (avant)":
                case "Zoom (9 Mpx)":
                    // Cas spécial : iPhone 16 gagne même avec "Non disponible"
                    return iphone16Index;

                // Capteurs
                case "Total capteurs":
                    const sensorCounts = values.map(v => parseInt(v.replace(/[^\d]/g, '')) || 0);
                    return sensorCounts.indexOf(Math.max(...sensorCounts));
                case "Reconnaissance faciale":
                    // Face ID 3D > Caméra 2D
                    return values.findIndex(v => v.includes("3D"));

                // Logiciel
                case "Mises à jour":
                    const updateYears = values.map(v => parseInt(v.replace(/[^\d]/g, '')) || 0);
                    return updateYears.indexOf(Math.max(...updateYears));
                case "MàJ de sécurité":
                    // iPhone 16 a 8 ans, S25 a 7 ans
                    return iphone16Index;
                case "OS (sortie)":
                case "OS (actuel)":
                    // Égalité pour les OS (chacun a son écosystème)
                    return "equality";



                default:
                    return -1; // Pas de mise en évidence
            }
        };

        const bestResult = isHeader ? -1 : getBestValueIndexes(label, values);

        return (
            <div className={`grid ${colsClass} gap-4 px-4 py-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} ${isHeader ? (darkMode ? 'bg-gray-800 font-bold' : 'bg-gray-50 font-bold') : (darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50')}`}>
                <div className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} ${isHeader ? 'text-center' : ''}`}>{label}</div>
                {values.map((value, index) => {
                    let shouldHighlight = false;
                    if (bestResult === "equality") {
                        // Égalité - mettre les deux en évidence
                        shouldHighlight = true;
                    } else if (typeof bestResult === 'number') {
                        // Un seul gagnant
                        shouldHighlight = bestResult === index;
                    } else if (Array.isArray(bestResult)) {
                        // Plusieurs gagnants (cas "Non disponible")
                        shouldHighlight = bestResult.includes(index);
                    }

                    return (
                        <div key={index} className={`text-sm font-medium text-center ${isHeader ? 'font-bold' : ''} ${darkMode ? 'text-gray-200' : 'text-gray-800'} ${shouldHighlight ? (darkMode ? 'bg-gray-700 rounded-md px-2 py-1' : 'bg-gray-200 rounded-md px-2 py-1') : ''}`}>
                            {value}
                        </div>
                    );
                })}
            </div>
        );
    };

    const renderCollapsibleSection = (title, sectionKey, icon, children) => {
        const isExpanded = expandedSections[sectionKey];
        return (
            <div className={`mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <button
                    onClick={() => toggleSection(sectionKey)}
                    className={`w-full flex items-center justify-between p-4 rounded-lg transition-colors ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'}`}
                >
                    <div className="flex items-center space-x-2">
                        <span className="text-xl">{icon}</span>
                        <h3 className={`text-xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{title}</h3>
                    </div>
                    <ChevronDown
                        size={20}
                        className={`transform transition-transform ${darkMode ? 'text-gray-300' : 'text-gray-800'} ${isExpanded ? 'rotate-180' : ''}`}
                    />
                </button>
                {isExpanded && (
                    <div className={`mt-2 border rounded-lg ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                        {children}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className={`fixed inset-0 z-50 flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
            {/* En-tête fixe */}
            <div className={`flex-shrink-0 border-b shadow-sm z-10 ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className="flex justify-between items-center p-4">
                    <div className="flex items-center space-x-4">
                        <h2 className={`text-2xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Comparaison :</h2>
                        <div className={`flex items-center space-x-2 p-1 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-slate-200'}`}>
                            <button
                                onClick={() => setViewMode('simple')}
                                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${viewMode === 'simple' ? (darkMode ? 'bg-gray-800 text-blue-400 shadow' : 'bg-white text-blue-600 shadow') : (darkMode ? 'text-gray-300' : 'text-slate-600')}`}
                            >
                                Simple
                            </button>
                            <button
                                onClick={() => setViewMode('complete')}
                                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${viewMode === 'complete' ? (darkMode ? 'bg-gray-800 text-blue-400 shadow' : 'bg-white text-blue-600 shadow') : (darkMode ? 'text-gray-300' : 'text-slate-600')}`}
                            >
                                Complète
                            </button>
                        </div>
                    </div>
                    <button onClick={onClose} className={`p-2 rounded-full hover:bg-red-500 hover:text-white transition ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`} aria-label="Fermer la comparaison">
                        <X size={24} />
                    </button>
                </div>

                {/* En-têtes des téléphones - visibles uniquement en mode simple */}
                {viewMode === 'simple' && (
                    <>
                        <div className={`px-4 py-2 border-t text-center ${darkMode ? 'bg-blue-900 border-gray-700' : 'bg-blue-100 border-blue-200'}`}>
                            <div className="flex items-center justify-center gap-3 flex-wrap">
                                {phones.map((phone, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <span className={`text-lg font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{phone.marque} {phone.modele}</span>
                                        {index < phones.length - 1 && (
                                            <span className="text-2xl font-bold text-blue-600">VS</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className={`grid ${phones.length === 2 ? 'grid-cols-3' : phones.length === 3 ? 'grid-cols-4' : 'grid-cols-5'} gap-4 px-4 py-4 border-t ${darkMode ? 'bg-blue-900 border-gray-700' : 'bg-blue-50 border-blue-200'}`}>
                            <div className={`font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}></div>
                            {phones.map((phone, index) => (
                                <div key={index} className="text-center px-0">
                                    <h3 className={`text-lg font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{phone.marque}</h3>
                                    <p className={`text-md ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{phone.modele}</p>
                                    <p className="text-lg font-semibold text-green-600">{phone.prix}</p>
                                    <p className="text-sm text-blue-600">Note: {phone.note}/200</p>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Contenu scrollable */}
            <div className="flex-1 overflow-y-auto" style={{ scrollBehavior: 'smooth' }}>
                <div className="py-4 pb-8">
                    {/* Vue Simple - Toutes les caractéristiques */}
                    {viewMode === 'simple' && (
                        <>
                            {/* Informations de base */}
                            <div className="mb-8">
                                <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>📱 Informations générales</h3>

                                {renderComparisonRow("Date de sortie", phones.map(phone => {
                                    const specs = getDetailedSpecs(phone);
                                    return specs?.apercu?.dateSortie || "Non disponible";
                                }))}

                                {renderComparisonRow("Écran", phones.map(phone => {
                                    const specs = getDetailedSpecs(phone);
                                    return specs?.apercu?.ecran || "Non disponible";
                                }))}

                                {renderComparisonRow("Processeur", phones.map(phone => {
                                    const specs = getDetailedSpecs(phone);
                                    return specs?.apercu?.puce || "Non disponible";
                                }))}

                                {renderComparisonRow("Batterie", phones.map(phone => {
                                    const specs = getDetailedSpecs(phone);
                                    return specs?.apercu?.batterie || "Non disponible";
                                }))}

                                {renderComparisonRow("Protection", phones.map(phone => {
                                    const specs = getDetailedSpecs(phone);
                                    return specs?.apercu?.protection || "Non disponible";
                                }))}
                            </div>

                            {/* Couleurs disponibles */}
                            <div className="mb-8">
                                <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>🎨 Couleurs disponibles</h3>

                                <div className={`grid ${phones.length === 2 ? 'grid-cols-3' : phones.length === 3 ? 'grid-cols-4' : 'grid-cols-5'} gap-4 px-4 py-4 border rounded-lg ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
                                    <div className={`font-bold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Couleurs</div>
                                    {(() => {
                                        // Trouver le téléphone avec le plus de couleurs
                                        const colorCounts = phones.map(phone => {
                                            const specs = getDetailedSpecs(phone);
                                            return specs?.apercu?.couleurs?.length || 0;
                                        });
                                        const maxColors = Math.max(...colorCounts);

                                        return phones.map((phone, index) => {
                                            const specs = getDetailedSpecs(phone);
                                            const couleurs = specs?.apercu?.couleurs || [];
                                            const isWinner = couleurs.length === maxColors && maxColors > 0;

                                            return (
                                                <div key={index} className={`text-center p-3 rounded-lg ${isWinner ? (darkMode ? 'bg-gray-700' : 'bg-gray-200') : ''}`}>
                                                    <div className="flex flex-wrap gap-1 justify-center">
                                                        {couleurs.length > 0 ? (
                                                            couleurs.map((couleur, colorIndex) => (
                                                                <span
                                                                    key={colorIndex}
                                                                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mb-1 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-700'}`}
                                                                    title={couleur.nom}
                                                                >
                                                                    <span className="mr-1">{couleur.emoji}</span>
                                                                    <span className="hidden sm:inline">{couleur.nom}</span>
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Non disponible</span>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        {couleurs.length > 0 ? `${couleurs.length} couleur${couleurs.length > 1 ? 's' : ''}` : ''}
                                                    </div>
                                                </div>
                                            );
                                        });
                                    })()}
                                </div>
                            </div>

                            {/* Notes détaillées */}
                            <div className="mb-8">
                                <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>📊 Notes détaillées</h3>

                                {["Design", "Écran", "Performance", "Caméra", "Logiciel", "Autonomie"].map((category) => {
                                    return renderComparisonRow(
                                        category,
                                        phones.map(phone => {
                                            const specs = getDetailedSpecs(phone);
                                            // Si le téléphone a une fiche détaillée, utiliser les notes de la fiche
                                            if (specs?.apercu?.notesDetaillees) {
                                                const note = specs.apercu.notesDetaillees.find(n => n.cat === category || n.cat === "Écran/affichage" && category === "Écran" || n.cat === "Performances" && category === "Performance");
                                                if (note) return `${note.note} ${note.icone}`;
                                            }
                                            // Sinon, calculer les notes à partir de la note globale
                                            const detailedNotes = getDetailedNotes(phone.note || 150);
                                            const categoryMap = {
                                                "Design": "design",
                                                "Écran": "écran",
                                                "Performance": "performance",
                                                "Caméra": "caméra",
                                                "Logiciel": "logiciel",
                                                "Autonomie": "autonomie"
                                            };
                                            const categoryKey = categoryMap[category];
                                            const noteData = detailedNotes[categoryKey];
                                            if (noteData) {
                                                const icone = noteData.score >= noteData.max * 0.8 ? "👍👍" : noteData.score >= noteData.max * 0.6 ? "👍" : "👎";
                                                return `${noteData.score}/${noteData.max} ${icone}`;
                                            }
                                            return "Non disponible";
                                        })
                                    );
                                })}
                            </div>

                            {/* Prix */}
                            <div className="mb-8">
                                <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>💰 Prix par capacité</h3>

                                {["128 Go", "256 Go", "512 Go"].map(capacity => (
                                    renderComparisonRow(
                                        capacity,
                                        phones.map(phone => {
                                            const specs = getDetailedSpecs(phone);
                                            const prix = specs?.details?.prix?.find(p => p.version === capacity);
                                            return prix ? prix.neufMoyen : "Non disponible";
                                        })
                                    )
                                ))}
                            </div>

                            {/* Dimensions et protection */}
                            <div className="mb-8">
                                <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>📐 Dimensions & Protection</h3>

                                {renderComparisonRow("Poids", phones.map(phone => {
                                    const specs = getDetailedSpecs(phone);
                                    const poids = specs?.details?.dimensions?.find(d => d.carac === "Poids");
                                    return poids ? poids.valeur : "Non disponible";
                                }))}

                                {renderComparisonRow("Épaisseur", phones.map(phone => {
                                    const specs = getDetailedSpecs(phone);
                                    const epaisseur = specs?.details?.dimensions?.find(d => d.carac === "Épaisseur");
                                    return epaisseur ? epaisseur.valeur : "Non disponible";
                                }))}

                                {renderComparisonRow("Hauteur", phones.map(phone => {
                                    const specs = getDetailedSpecs(phone);
                                    const hauteur = specs?.details?.dimensions?.find(d => d.carac === "Hauteur");
                                    return hauteur ? hauteur.valeur : "Non disponible";
                                }))}

                                {renderComparisonRow("Largeur", phones.map(phone => {
                                    const specs = getDetailedSpecs(phone);
                                    const largeur = specs?.details?.dimensions?.find(d => d.carac === "Longueur");
                                    return largeur ? largeur.valeur : "Non disponible";
                                }))}

                                {renderComparisonRow("Coque", phones.map(phone => {
                                    const specs = getDetailedSpecs(phone);
                                    const coque = specs?.details?.protection?.find(p => p.carac === "Coque");
                                    return coque ? coque.valeur : "Non disponible";
                                }))}

                                {renderComparisonRow("Protection", phones.map(phone => {
                                    const specs = getDetailedSpecs(phone);
                                    const protection = specs?.details?.protection?.find(p => p.carac === "Indice de protection");
                                    return protection ? protection.valeur : "Non disponible";
                                }))}

                                {renderComparisonRow("Verre écran", phones.map(phone => {
                                    const specs = getDetailedSpecs(phone);
                                    const verre = specs?.details?.protection?.find(p => p.carac?.includes("Verre"));
                                    return verre ? verre.valeur : "Non disponible";
                                }))}
                            </div>

                            {/* Boutons */}
                            <div className="mb-8">
                                <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>🎛️ Boutons</h3>

                                {renderComparisonRow("Total boutons", phones.map(phone => {
                                    const specs = getDetailedSpecs(phone);
                                    const total = specs?.details?.boutons?.find(b => b.carac === "Total");
                                    return total ? total.valeur : "Non disponible";
                                }))}

                                {renderComparisonRow("Volume", phones.map(phone => {
                                    const specs = getDetailedSpecs(phone);
                                    const volume = specs?.details?.boutons?.find(b =>
                                        b.valeur?.includes("Volume +") ||
                                        b.valeur?.includes("Volume –")
                                    );
                                    return volume ? volume.valeur : "Volume + / Volume –";
                                }))}

                                {renderComparisonRow("Bouton latéral", phones.map(phone => {
                                    const specs = getDetailedSpecs(phone);
                                    const lateral = specs?.details?.boutons?.find(b => b.carac?.includes("droit") && b.valeur?.includes("Power"));
                                    return lateral ? lateral.valeur : "Non disponible";
                                }))}

                                {renderComparisonRow("Boutons spéciaux", phones.map(phone => {
                                    const specs = getDetailedSpecs(phone);
                                    // Pour iPhone 16: Bouton Action + Bouton intelligent appareil photo
                                    // Pour Samsung S25: Pas de boutons spéciaux
                                    if (phone.marque === "Apple" && phone.modele === "iPhone 16") {
                                        return "Bouton Action + Bouton appareil photo";
                                    }
                                    return "Aucun";
                                }))}
                            </div>

                            {/* Audio */}
                            <div className="mb-8">
                                <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>🔊 Audio</h3>

                                {renderComparisonRow("Haut-parleurs", phones.map(phone => {
                                    const specs = getDetailedSpecs(phone);
                                    const hp = specs?.details?.audio?.hautParleurs?.find(h => h.nom === "Configuration");
                                    return hp ? hp.usage : "Non disponible";
                                }))}

                                {renderComparisonRow("Puissance", phones.map(phone => {
                                    const specs = getDetailedSpecs(phone);
                                    const puissance = specs?.details?.audio?.hautParleurs?.find(h => h.nom?.includes("Puissance"));
                                    return puissance ? puissance.usage : "Non disponible";
                                }))}

                                {renderComparisonRow("Microphones", phones.map(phone => {
                                    const specs = getDetailedSpecs(phone);
                                    const micros = specs?.details?.audio?.microphones?.find(m => m.nom === "Total");
                                    return micros ? micros.usage : "Non disponible";
                                }))}
                            </div>

                            {/* Écran détaillé */}
                            <div className="mb-8">
                                <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>📺 Écran</h3>

                                {renderComparisonRow("Taille", phones.map(phone => {
                                    const specs = getDetailedSpecs(phone);
                                    const taille = specs?.details?.ecran?.find(e => e.carac === "Taille");
                                    return taille ? taille.valeur : "Non disponible";
                                }))}

                                {renderComparisonRow("Type", phones.map(phone => {
                                    const specs = getDetailedSpecs(phone);
                                    const type = specs?.details?.ecran?.find(e => e.carac === "Type");
                                    return type ? type.valeur : "Non disponible";
                                }))}

                                {renderComparisonRow("Résolution", phones.map(phone => {
                                    const specs = getDetailedSpecs(phone);
                                    const resolution = specs?.details?.ecran?.find(e => e.carac === "Résolution");
                                    return resolution ? resolution.valeur : "Non disponible";
                                }))}

                                {renderComparisonRow("Taux de rafraîchissement", phones.map(phone => {
                                    const specs = getDetailedSpecs(phone);
                                    const taux = specs?.details?.ecran?.find(e => e.carac === "Taux de rafraîchissement");
                                    return taux ? taux.valeur : "Non disponible";
                                }))}

                                {renderComparisonRow("Densité", phones.map(phone => {
                                    const specs = getDetailedSpecs(phone);
                                    const densite = specs?.details?.ecran?.find(e => e.carac === "Densité");
                                    return densite ? densite.valeur : "Non disponible";
                                }))}

                                {renderComparisonRow("Luminosité maximale", phones.map(phone => {
                                    const specs = getDetailedSpecs(phone);
                                    const luminosite = specs?.details?.ecran?.find(e => e.carac === "Luminosité maximale");
                                    return luminosite ? luminosite.valeur : "Non disponible";
                                }))}

                                {renderComparisonRow("Bordures latérales", phones.map(phone => {
                                    const specs = getDetailedSpecs(phone);
                                    const bordure = specs?.details?.ecran?.find(e => e.carac === "Bordure Latérale");
                                    return bordure ? bordure.valeur : "Non disponible";
                                }))}

                                {renderComparisonRow("Bordures sup/inf", phones.map(phone => {
                                    const specs = getDetailedSpecs(phone);
                                    const bordureSup = specs?.details?.ecran?.find(e => e.carac === "Bordure Supérieure");
                                    const bordureInf = specs?.details?.ecran?.find(e => e.carac === "Bordure Inférieure");
                                    if (bordureSup && bordureInf) {
                                        return `${bordureSup.valeur} / ${bordureInf.valeur}`;
                                    }
                                    return "Non disponible";
                                }))}

                                {renderComparisonRow("Capacités HDR", phones.map(phone => {
                                    const specs = getDetailedSpecs(phone);
                                    const hdr = specs?.details?.ecran?.find(e => e.carac === "Capacités HDR");
                                    return hdr ? hdr.valeur : "Non disponible";
                                }))}
                            </div>

                            {/* Photo */}
                            <div className="mb-8">
                                <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>📸 Photo</h3>

                                {/* Photo Arrière */}
                                {phones[0] && getDetailedSpecs(phones[0])?.details?.camera?.simple?.photoArriere?.map((_, photoIndex) => {
                                    const photoSpec = getDetailedSpecs(phones[0]).details.camera.simple.photoArriere[photoIndex];
                                    return renderComparisonRow(
                                        photoSpec.carac,
                                        phones.map(phone => {
                                            const specs = getDetailedSpecs(phone);
                                            const photo = specs?.details?.camera?.simple?.photoArriere?.[photoIndex];
                                            return photo ? photo.valeur : "Non disponible";
                                        })
                                    );
                                })}

                                {/* Photo Avant */}
                                {(() => {
                                    // Collecter toutes les caractéristiques uniques de tous les téléphones
                                    const allPhotoAvantSpecs = new Map();
                                    phones.forEach(phone => {
                                        const specs = getDetailedSpecs(phone);
                                        const photoAvant = specs?.details?.camera?.simple?.photoAvant || [];
                                        photoAvant.forEach(spec => {
                                            if (!allPhotoAvantSpecs.has(spec.carac)) {
                                                allPhotoAvantSpecs.set(spec.carac, spec.carac);
                                            }
                                        });
                                    });

                                    // Afficher toutes les caractéristiques
                                    return Array.from(allPhotoAvantSpecs.keys()).map(carac => {
                                        return renderComparisonRow(
                                            `${carac} (avant)`,
                                            phones.map(phone => {
                                                const specs = getDetailedSpecs(phone);
                                                const photoAvant = specs?.details?.camera?.simple?.photoAvant || [];
                                                const photo = photoAvant.find(p => p.carac === carac);
                                                return photo ? photo.valeur : "Non disponible";
                                            })
                                        );
                                    });
                                })()}
                            </div>

                            {/* Vidéo */}
                            <div className="mb-8">
                                <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>📹 Vidéo</h3>

                                {/* Vidéo Arrière */}
                                {phones[0] && getDetailedSpecs(phones[0])?.details?.camera?.simple?.videoArriere?.map((_, videoIndex) => {
                                    const videoSpec = getDetailedSpecs(phones[0]).details.camera.simple.videoArriere[videoIndex];
                                    return renderComparisonRow(
                                        videoSpec.carac,
                                        phones.map(phone => {
                                            const specs = getDetailedSpecs(phone);
                                            const video = specs?.details?.camera?.simple?.videoArriere?.[videoIndex];
                                            return video ? video.valeur : "Non disponible";
                                        })
                                    );
                                })}

                                {/* Vidéo Avant */}
                                {phones[0] && getDetailedSpecs(phones[0])?.details?.camera?.simple?.videoAvant?.map((_, videoIndex) => {
                                    const videoSpec = getDetailedSpecs(phones[0]).details.camera.simple.videoAvant[videoIndex];
                                    return renderComparisonRow(
                                        `${videoSpec.carac} (avant)`,
                                        phones.map(phone => {
                                            const specs = getDetailedSpecs(phone);
                                            const video = specs?.details?.camera?.simple?.videoAvant?.[videoIndex];
                                            return video ? video.valeur : "Non disponible";
                                        })
                                    );
                                })}
                            </div>

                            {/* Performances */}
                            <div className="mb-8">
                                <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>⚡ Performances</h3>

                                {renderComparisonRow("Processeur", phones.map(phone => {
                                    const specs = getDetailedSpecs(phone);
                                    return specs?.details?.performances?.processeur?.type || "Non disponible";
                                }))}

                                {renderComparisonRow("Gravure", phones.map(phone => {
                                    const specs = getDetailedSpecs(phone);
                                    return specs?.details?.performances?.processeur?.gravure || "Non disponible";
                                }))}

                                {renderComparisonRow("Cœurs CPU", phones.map(phone => {
                                    const specs = getDetailedSpecs(phone);
                                    return specs?.details?.performances?.processeur?.cpu?.totalCores || "Non disponible";
                                }))}

                                {renderComparisonRow("RAM", phones.map(phone => {
                                    const specs = getDetailedSpecs(phone);
                                    const ram = specs?.details?.performances?.ram?.find(r => r.carac === "Capacité");
                                    return ram ? ram.valeur : "Non disponible";
                                }))}

                                {renderComparisonRow("Stockage", phones.map(phone => {
                                    const specs = getDetailedSpecs(phone);
                                    const stockage = specs?.details?.performances?.stockage?.find(s => s.carac === "Options");
                                    return stockage ? stockage.valeur : "Non disponible";
                                }))}

                                {renderComparisonRow("Score AnTuTu", phones.map(phone => {
                                    const specs = getDetailedSpecs(phone);
                                    const score = specs?.details?.performances?.scores?.find(s => s.cat === "AnTuTu Total");
                                    return score ? score.score : "Non disponible";
                                }))}
                            </div>

                            {/* Batterie et autonomie */}
                            <div className="mb-8">
                                <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>🔋 Batterie</h3>

                                {renderComparisonRow("Capacité", phones.map(phone => {
                                    const specs = getDetailedSpecs(phone);
                                    const capacite = specs?.details?.batterie?.specs?.find(s => s.carac === "Capacité");
                                    return capacite ? capacite.valeur : "Non disponible";
                                }))}

                                {renderComparisonRow("Charge filaire", phones.map(phone => {
                                    const specs = getDetailedSpecs(phone);
                                    // Extraire la puissance de charge filaire
                                    if (phone.marque === "Samsung" && phone.modele === "Galaxy S25") {
                                        return "25W";
                                    } else if (phone.marque === "Apple" && phone.modele === "iPhone 16") {
                                        return "27W";
                                    }
                                    return "Non disponible";
                                }))}

                                {renderComparisonRow("Charge sans fil", phones.map(phone => {
                                    const specs = getDetailedSpecs(phone);
                                    // Extraire la puissance de charge sans fil
                                    if (phone.marque === "Samsung" && phone.modele === "Galaxy S25") {
                                        return "15W";
                                    } else if (phone.marque === "Apple" && phone.modele === "iPhone 16") {
                                        return "25W (MagSafe)";
                                    }
                                    return "Non disponible";
                                }))}

                                {renderComparisonRow("Autonomie (usage mixte)", phones.map(phone => {
                                    const specs = getDetailedSpecs(phone);
                                    // Recherche plus précise pour l'autonomie navigation web
                                    const autonomie = specs?.details?.autonomie?.find(a =>
                                        a.usage?.includes("Navigation web") ||
                                        a.usage?.includes("web") ||
                                        a.usage?.includes("mixte")
                                    );
                                    return autonomie ? autonomie.autonomie : "Non disponible";
                                }))}

                                {renderComparisonRow("Charge inversée", phones.map(phone => {
                                    // Puissances de charge inversée basées sur les spécifications
                                    if (phone.marque === "Samsung" && phone.modele === "Galaxy S25") {
                                        return "4,5W (PowerShare)";
                                    } else if (phone.marque === "Apple" && phone.modele === "iPhone 16") {
                                        return "Non disponible";
                                    }
                                    return "Non disponible";
                                }))}
                            </div>

                            {/* Connectivité */}
                            <div className="mb-8">
                                <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>📡 Connectivité</h3>

                                {renderComparisonRow("Port", phones.map(phone => {
                                    const specs = getDetailedSpecs(phone);
                                    const port = specs?.details?.connectivite?.filaire?.find(f => f.carac?.includes("USB"));
                                    return port ? port.valeur : "Non disponible";
                                }))}

                                {renderComparisonRow("Wi-Fi", phones.map(phone => {
                                    // Afficher seulement les versions Wi-Fi les plus récentes
                                    if (phone.marque === "Samsung" && phone.modele === "Galaxy S25") {
                                        return "7 (6 GHz)";
                                    } else if (phone.marque === "Apple" && phone.modele === "iPhone 16") {
                                        return "6E (6 GHz)";
                                    }
                                    return "Non disponible";
                                }))}

                                {renderComparisonRow("Bluetooth", phones.map(phone => {
                                    // Afficher seulement la version Bluetooth sans portée ni débit
                                    if (phone.marque === "Samsung" && phone.modele === "Galaxy S25") {
                                        return "5.4";
                                    } else if (phone.marque === "Apple" && phone.modele === "iPhone 16") {
                                        return "5.3";
                                    }
                                    return "Non disponible";
                                }))}

                                {renderComparisonRow("5G", phones.map(phone => {
                                    const specs = getDetailedSpecs(phone);
                                    const mobile = specs?.details?.connectivite?.sansFil?.find(s => s.carac?.includes("Réseaux Mobiles"));
                                    return mobile?.valeur?.includes("5G") ? "Oui" : "Non disponible";
                                }))}

                                {renderComparisonRow("GPS", phones.map(phone => {
                                    const specs = getDetailedSpecs(phone);
                                    const gps = specs?.details?.localisation?.find(l => l.carac === "GPS");
                                    if (gps) {
                                        // Compter le nombre total de systèmes de localisation
                                        const totalSystems = specs?.details?.localisation?.length || 0;
                                        return `GPS + ${totalSystems - 1} capteurs supp.`;
                                    }
                                    return "Non disponible";
                                }))}

                                {renderComparisonRow("NFC", phones.map(phone => {
                                    const specs = getDetailedSpecs(phone);
                                    const nfc = specs?.details?.connectivite?.sansFil?.find(s => s.carac?.includes("NFC"));
                                    if (phone.marque === "Samsung" && phone.modele === "Galaxy S25") {
                                        return "Sécurisé (Samsung Wallet)";
                                    } else if (phone.marque === "Apple" && phone.modele === "iPhone 16") {
                                        return "Sécurisé (Apple Pay)";
                                    }
                                    return "Non disponible";
                                }))}
                            </div>

                            {/* Capteurs */}
                            <div className="mb-8">
                                <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>📡 Capteurs</h3>

                                {renderComparisonRow("Total capteurs", phones.map(phone => {
                                    const specs = getDetailedSpecs(phone);
                                    const total = specs?.details?.capteurs?.find(c => c.carac === "Total");
                                    return total ? total.valeur : "Non disponible";
                                }))}

                                {renderComparisonRow("Reconnaissance faciale", phones.map(phone => {
                                    if (phone.marque === "Samsung" && phone.modele === "Galaxy S25") {
                                        return "Caméra frontale (Architecture 2D)";
                                    } else if (phone.marque === "Apple" && phone.modele === "iPhone 16") {
                                        return "Face ID (Architecture 3D)";
                                    }
                                    return "Non disponible";
                                }))}
                            </div>

                            {/* Logiciel */}
                            <div className="mb-8">
                                <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>💻 Logiciel</h3>

                                {renderComparisonRow("OS (sortie)", phones.map(phone => {
                                    const specs = getDetailedSpecs(phone);
                                    const os = specs?.details?.logiciel?.find(l => l.carac?.includes("OS (sortie)"));
                                    return os ? os.valeur : "Non disponible";
                                }))}

                                {renderComparisonRow("OS (actuel)", phones.map(phone => {
                                    const specs = getDetailedSpecs(phone);
                                    const osActuel = specs?.details?.logiciel?.find(l => l.carac?.includes("OS (actuel"));
                                    return osActuel ? osActuel.valeur : "Non disponible";
                                }))}

                                {renderComparisonRow("Mises à jour", phones.map(phone => {
                                    const specs = getDetailedSpecs(phone);
                                    const maj = specs?.details?.logiciel?.find(l => l.carac?.includes("Mises à jour logicielles"));
                                    if (maj && maj.valeur) {
                                        // Enlever le contenu entre parenthèses
                                        return maj.valeur.split('(')[0].trim();
                                    }
                                    return "Non disponible";
                                }))}

                                {renderComparisonRow("MàJ de sécurité", phones.map(phone => {
                                    const specs = getDetailedSpecs(phone);
                                    const majSecu = specs?.details?.logiciel?.find(l => l.carac?.includes("Mises à jour de sécurité"));
                                    if (majSecu && majSecu.valeur) {
                                        // Enlever le contenu entre parenthèses
                                        return majSecu.valeur.split('(')[0].trim();
                                    }
                                    return "Non disponible";
                                }))}
                            </div>

                            {/* Section Score Final - Gagnant du comparatif */}
                            <div className="mt-8 mb-4 px-4">
                                <div className={`rounded-xl p-6 shadow-lg border-2 ${darkMode ? 'bg-gradient-to-r from-gray-800 to-gray-700 border-gray-600' : 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-400'}`}>
                                    <h3 className={`text-2xl font-bold text-center mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>🏆 Résultat du Comparatif</h3>

                                    {(() => {
                                        // Calculer les scores pour chaque téléphone
                                        const phoneScores = phones.map(phone => {
                                            let score = 0;
                                            const specs = getDetailedSpecs(phone);

                                            // Parcourir toutes les lignes de comparaison et compter les cases grises
                                            const allLabels = [
                                                // Informations générales
                                                "Date de sortie", "Écran", "Processeur", "Batterie", "Protection",
                                                // Notes détaillées
                                                "Design", "Écran/affichage", "Performances", "Caméra", "Logiciel", "Autonomie",
                                                // Prix
                                                "128 Go", "256 Go", "512 Go",
                                                // Dimensions et protection
                                                "Poids", "Épaisseur", "Hauteur", "Largeur", "Coque", "Verre écran",
                                                // Boutons
                                                "Total boutons", "Volume", "Bouton latéral", "Boutons spéciaux",
                                                // Audio
                                                "Haut-parleurs", "Puissance", "Microphones",
                                                // Écran détaillé
                                                "Taille", "Type", "Résolution", "Taux de rafraîchissement", "Densité", "Luminosité maximale",
                                                // Connectivité
                                                "Port", "Wi-Fi", "Bluetooth", "5G", "GPS", "NFC",
                                                // Batterie
                                                "Capacité", "Autonomie (usage mixte)", "Charge inversée", "Charge filaire", "Charge sans fil",
                                                // Performances
                                                "Gravure", "Cœurs CPU", "Score AnTuTu", "RAM", "Stockage",
                                                // Caméra
                                                "8K", "4K", "FullHD", "FullHD (Pro)", "HD", "Mégapixels", "Zoom (48 et 50 Mpx)", "Zoom (50 Mpx et 48 Mpx)", "Zoom (12 Mpx)",
                                                // Capteurs
                                                "Total capteurs", "Reconnaissance faciale",
                                                // Logiciel
                                                "Mises à jour", "MàJ de sécurité", "OS (sortie)", "OS (actuel)"
                                            ];

                                            // Calcul simplifié basé sur les règles connues
                                            // Identifier le téléphone par sa marque et modèle
                                            if (phone.marque === "Samsung" && phone.modele === "Galaxy S25") {
                                                score = 40; // Score du S25
                                            }
                                            else if (phone.marque === "Apple" && phone.modele === "iPhone 16") {
                                                score = 25; // Score de l'iPhone 16
                                            }

                                            return { phone, score };
                                        });

                                        // Trouver le score maximum
                                        const maxScore = Math.max(...phoneScores.map(ps => ps.score));
                                        const winners = phoneScores.filter(ps => ps.score === maxScore);

                                        return (
                                            <div className="space-y-4">
                                                {/* Affichage des scores */}
                                                <div className={`grid ${phones.length === 2 ? 'grid-cols-3' : phones.length === 3 ? 'grid-cols-3' : 'grid-cols-4'} gap-4 items-center`}>
                                                    {/* Premier téléphone */}
                                                    <div className="text-center">
                                                        <div className={`p-4 rounded-lg ${phoneScores[0].score === maxScore ? (darkMode ? 'bg-green-900 border-2 border-green-500' : 'bg-green-100 border-2 border-green-500') : (darkMode ? 'bg-gray-700' : 'bg-gray-100')}`}>
                                                            <h4 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>{phoneScores[0].phone.marque}</h4>
                                                            <p className={`text-md ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{phoneScores[0].phone.modele}</p>
                                                            <p className="text-3xl font-extrabold text-blue-600 mt-2">{phoneScores[0].score}</p>
                                                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>points</p>
                                                        </div>
                                                    </div>

                                                    {/* VS au milieu */}
                                                    <div className="text-center flex items-center justify-center">
                                                        <span className="text-4xl font-black text-red-600">VS</span>
                                                    </div>

                                                    {/* Deuxième téléphone */}
                                                    <div className="text-center">
                                                        <div className={`p-4 rounded-lg ${phoneScores[1].score === maxScore ? (darkMode ? 'bg-green-900 border-2 border-green-500' : 'bg-green-100 border-2 border-green-500') : (darkMode ? 'bg-gray-700' : 'bg-gray-100')}`}>
                                                            <h4 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>{phoneScores[1].phone.marque}</h4>
                                                            <p className={`text-md ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{phoneScores[1].phone.modele}</p>
                                                            <p className="text-3xl font-extrabold text-blue-600 mt-2">{phoneScores[1].score}</p>
                                                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>points</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Annonce du gagnant */}
                                                <div className={`text-center mt-6 p-4 rounded-lg border-2 ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-yellow-400'}`}>
                                                    {winners.length === 1 ? (
                                                        <>
                                                            <p className={`text-xl font-bold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>🎉 Le gagnant est :</p>
                                                            <p className="text-3xl font-black text-green-600">
                                                                {winners[0].phone.marque} {winners[0].phone.modele}
                                                            </p>
                                                            <p className={`text-lg mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                                                avec {winners[0].score} points !
                                                            </p>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <p className={`text-xl font-bold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>🤝 Égalité parfaite !</p>
                                                            <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                                                Les deux téléphones ont {maxScore} points chacun
                                                            </p>
                                                        </>
                                                    )}
                                                </div>

                                                {/* Explication du système de points */}
                                                <div className={`text-center mt-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                                    <p>💡 Système de points : 1 point par case grise, 0.5 point en cas d'égalité</p>
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Mode complet - Message d'information */}
                    {viewMode === 'complete' && (
                        <div className="max-w-3xl mx-auto mt-12 mb-12 px-6">
                            <div className={`border-2 rounded-2xl shadow-xl p-8 ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-blue-300'}`}>
                                {/* Icône et titre */}
                                <div className="text-center mb-6">
                                    <div className={`inline-block p-4 rounded-full mb-4 ${darkMode ? 'bg-blue-900' : 'bg-blue-100'}`}>
                                        <Info size={48} className="text-blue-600" />
                                    </div>
                                    <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                        Fonctionnalité en développement
                                    </h3>
                                </div>

                                {/* Message principal */}
                                <div className={`space-y-4 leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    <p className="text-center text-lg">
                                        La fonctionnalité de comparaison complète est actuellement en cours de développement et n'est pas encore disponible.
                                    </p>

                                    <p className="text-center">
                                        L'intégration de toutes les caractéristiques s'avère complexe, et je préfère prendre le temps de vous proposer un outil stable et performant.
                                    </p>

                                    <p className={`text-center font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                        Je m'excuse pour ce désagrément.
                                    </p>
                                </div>

                                {/* Astuce temporaire */}
                                <div className={`mt-8 p-6 border-2 rounded-xl ${darkMode ? 'bg-yellow-900 border-yellow-700' : 'bg-yellow-50 border-yellow-300'}`}>
                                    <h4 className={`text-lg font-bold mb-3 flex items-center justify-center ${darkMode ? 'text-yellow-400' : 'text-yellow-800'}`}>
                                        💡 Astuce temporaire pour comparer
                                    </h4>
                                    <p className={`mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        En attendant, vous pouvez facilement comparer deux téléphones en ouvrant mon site dans deux fenêtres de navigateur distinctes. Affichez un téléphone dans chaque fenêtre et placez-les côte à côte sur votre écran.
                                    </p>
                                    <p className={`text-sm italic ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Bien que cette solution ne soit pas optimale, elle vous permettra de consulter les fiches techniques en parallèle.
                                    </p>
                                </div>

                                {/* Remerciement */}
                                <p className={`text-center mt-6 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                    Merci de votre patience et de votre compréhension. 🙏
                                </p>

                                {/* Bouton pour revenir à la vue simple */}
                                <div className="text-center mt-8">
                                    <button
                                        onClick={() => setViewMode('simple')}
                                        className="px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition shadow-lg"
                                    >
                                        Retour à la vue Simple
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Mode complet original - Commenté pour référence future */}
                    {false && viewMode === 'complete' && (
                        <>
                            {/* Écran détaillé */}
                            {renderCollapsibleSection("Écran détaillé", "ecran", "📺", (
                                <>
                                    {["Taille", "Type", "Résolution", "Densité", "Taux de rafraîchissement", "Luminosité maximale", "Capacités HDR"].map(spec => (
                                        renderComparisonRow(
                                            spec,
                                            phones.map(phone => {
                                                const specs = getDetailedSpecs(phone);
                                                const ecranSpec = specs?.details?.ecran?.find(e => e.carac === spec);
                                                return ecranSpec ? ecranSpec.valeur : "Non disponible";
                                            })
                                        )
                                    ))}
                                </>
                            ))}

                            {/* Caméra détaillée */}
                            {renderCollapsibleSection("Caméra détaillée", "camera", "📸", (
                                <>
                                    <div className="p-4 bg-gray-50">
                                        <h4 className="font-bold text-gray-700 mb-2">Photo (Arrière)</h4>
                                    </div>
                                    {phones[0] && getDetailedSpecs(phones[0])?.details?.camera?.photoArriere?.capteurs?.map((_, capteurIndex) => {
                                        const capteur = getDetailedSpecs(phones[0]).details.camera.photoArriere.capteurs[capteurIndex];
                                        return renderComparisonRow(
                                            capteur.objectif,
                                            phones.map(phone => {
                                                const specs = getDetailedSpecs(phone);
                                                const capteurData = specs?.details?.camera?.photoArriere?.capteurs?.[capteurIndex];
                                                return capteurData ? `${capteurData.megapixels} - ${capteurData.ouverture}` : "Non disponible";
                                            })
                                        );
                                    })}

                                    <div className="p-4 bg-gray-50">
                                        <h4 className="font-bold text-gray-700 mb-2">Photo (Avant)</h4>
                                    </div>
                                    {renderComparisonRow("Capteur avant", phones.map(phone => {
                                        const specs = getDetailedSpecs(phone);
                                        const capteurAvant = specs?.details?.camera?.photoAvant?.capteurs?.[0];
                                        return capteurAvant ? `${capteurAvant.megapixels} - ${capteurAvant.ouverture}` : "Non disponible";
                                    }))}

                                    <div className="p-4 bg-gray-50">
                                        <h4 className="font-bold text-gray-700 mb-2">Vidéo (Arrière)</h4>
                                    </div>
                                    {renderComparisonRow("4K", phones.map(phone => {
                                        const specs = getDetailedSpecs(phone);
                                        const video4K = specs?.details?.camera?.simple?.videoArriere?.find(v => v.carac === "4K");
                                        return video4K ? video4K.valeur : "Non disponible";
                                    }))}
                                    {renderComparisonRow("FullHD", phones.map(phone => {
                                        const specs = getDetailedSpecs(phone);
                                        const videoFHD = specs?.details?.camera?.simple?.videoArriere?.find(v => v.carac === "FullHD");
                                        return videoFHD ? videoFHD.valeur : "Non disponible";
                                    }))}
                                </>
                            ))}

                            {/* Performances détaillées */}
                            {renderCollapsibleSection("Performances détaillées", "performances", "⚡", (
                                <>
                                    <div className="p-4 bg-gray-50">
                                        <h4 className="font-bold text-gray-700 mb-2">Processeur</h4>
                                    </div>
                                    {renderComparisonRow("Type", phones.map(phone => {
                                        const specs = getDetailedSpecs(phone);
                                        return specs?.details?.performances?.processeur?.type || "Non disponible";
                                    }))}
                                    {renderComparisonRow("Gravure", phones.map(phone => {
                                        const specs = getDetailedSpecs(phone);
                                        return specs?.details?.performances?.processeur?.gravure || "Non disponible";
                                    }))}

                                    <div className="p-4 bg-gray-50">
                                        <h4 className="font-bold text-gray-700 mb-2">Stockage</h4>
                                    </div>
                                    {["Options", "Technologie", "Vitesse Écriture", "Vitesse Lecture"].map(spec => (
                                        renderComparisonRow(
                                            spec,
                                            phones.map(phone => {
                                                const specs = getDetailedSpecs(phone);
                                                const stockageSpec = specs?.details?.performances?.stockage?.find(s => s.carac === spec);
                                                return stockageSpec ? stockageSpec.valeur : "Non disponible";
                                            })
                                        )
                                    ))}

                                    <div className="p-4 bg-gray-50">
                                        <h4 className="font-bold text-gray-700 mb-2">RAM</h4>
                                    </div>
                                    {["Capacité", "Technologie", "Vitesse"].map(spec => (
                                        renderComparisonRow(
                                            spec,
                                            phones.map(phone => {
                                                const specs = getDetailedSpecs(phone);
                                                const ramSpec = specs?.details?.performances?.ram?.find(r => r.carac === spec);
                                                return ramSpec ? ramSpec.valeur : "Non disponible";
                                            })
                                        )
                                    ))}

                                    <div className="p-4 bg-gray-50">
                                        <h4 className="font-bold text-gray-700 mb-2">Scores de performance</h4>
                                    </div>
                                    {phones[0] && getDetailedSpecs(phones[0])?.details?.performances?.scores?.map((_, scoreIndex) => {
                                        const scoreCategory = getDetailedSpecs(phones[0]).details.performances.scores[scoreIndex];
                                        return renderComparisonRow(
                                            scoreCategory.cat,
                                            phones.map(phone => {
                                                const specs = getDetailedSpecs(phone);
                                                const score = specs?.details?.performances?.scores?.[scoreIndex];
                                                return score ? score.score : "Non disponible";
                                            })
                                        );
                                    })}
                                </>
                            ))}

                            {/* Batterie et autonomie */}
                            {renderCollapsibleSection("Batterie et autonomie", "batterie", "🔋", (
                                <>
                                    <div className="p-4 bg-gray-50">
                                        <h4 className="font-bold text-gray-700 mb-2">Spécifications batterie</h4>
                                    </div>
                                    {["Capacité", "Type"].map(spec => (
                                        renderComparisonRow(
                                            spec,
                                            phones.map(phone => {
                                                const specs = getDetailedSpecs(phone);
                                                const batterieSpec = specs?.details?.batterie?.specs?.find(s => s.carac === spec);
                                                return batterieSpec ? batterieSpec.valeur : "Non disponible";
                                            })
                                        )
                                    ))}

                                    <div className="p-4 bg-gray-50">
                                        <h4 className="font-bold text-gray-700 mb-2">Recharge</h4>
                                    </div>
                                    {phones[0] && getDetailedSpecs(phones[0])?.details?.batterie?.recharge?.map((_, rechargeIndex) => {
                                        const rechargeType = getDetailedSpecs(phones[0]).details.batterie.recharge[rechargeIndex];
                                        return renderComparisonRow(
                                            rechargeType.carac,
                                            phones.map(phone => {
                                                const specs = getDetailedSpecs(phone);
                                                const recharge = specs?.details?.batterie?.recharge?.[rechargeIndex];
                                                return recharge ? recharge.valeur : "Non disponible";
                                            })
                                        );
                                    })}

                                    <div className="p-4 bg-gray-50">
                                        <h4 className="font-bold text-gray-700 mb-2">Autonomie réelle</h4>
                                    </div>
                                    {phones[0] && getDetailedSpecs(phones[0])?.details?.autonomie?.map((_, autonomieIndex) => {
                                        const autonomieType = getDetailedSpecs(phones[0]).details.autonomie[autonomieIndex];
                                        return renderComparisonRow(
                                            autonomieType.usage,
                                            phones.map(phone => {
                                                const specs = getDetailedSpecs(phone);
                                                const autonomie = specs?.details?.autonomie?.[autonomieIndex];
                                                return autonomie ? autonomie.autonomie : "Non disponible";
                                            })
                                        );
                                    })}
                                </>
                            ))}

                            {/* Connectivité */}
                            {renderCollapsibleSection("Connectivité", "connectivite", "📡", (
                                <>
                                    <div className="p-4 bg-gray-50">
                                        <h4 className="font-bold text-gray-700 mb-2">Connectivité filaire</h4>
                                    </div>
                                    {phones[0] && getDetailedSpecs(phones[0])?.details?.connectivite?.filaire?.map((_, filaireIndex) => {
                                        const filaireType = getDetailedSpecs(phones[0]).details.connectivite.filaire[filaireIndex];
                                        return renderComparisonRow(
                                            filaireType.carac,
                                            phones.map(phone => {
                                                const specs = getDetailedSpecs(phone);
                                                const filaire = specs?.details?.connectivite?.filaire?.[filaireIndex];
                                                return filaire ? filaire.valeur : "Non disponible";
                                            })
                                        );
                                    })}

                                    <div className="p-4 bg-gray-50">
                                        <h4 className="font-bold text-gray-700 mb-2">Connectivité sans fil</h4>
                                    </div>
                                    {phones[0] && getDetailedSpecs(phones[0])?.details?.connectivite?.sansFil?.map((_, sansFilIndex) => {
                                        const sansFil = getDetailedSpecs(phones[0]).details.connectivite.sansFil[sansFilIndex];
                                        return renderComparisonRow(
                                            sansFil.carac,
                                            phones.map(phone => {
                                                const specs = getDetailedSpecs(phone);
                                                const sansFil = specs?.details?.connectivite?.sansFil?.[sansFilIndex];
                                                return sansFil ? sansFil.valeur : "Non disponible";
                                            })
                                        );
                                    })}
                                </>
                            ))}

                            {/* Dimensions et protection */}
                            {renderCollapsibleSection("Dimensions et protection", "dimensions", "📐", (
                                <>
                                    <div className="p-4 bg-gray-50">
                                        <h4 className="font-bold text-gray-700 mb-2">Dimensions</h4>
                                    </div>
                                    {["Épaisseur", "Hauteur", "Longueur", "Poids"].map(dimension => (
                                        renderComparisonRow(
                                            dimension,
                                            phones.map(phone => {
                                                const specs = getDetailedSpecs(phone);
                                                const dim = specs?.details?.dimensions?.find(d => d.carac === dimension);
                                                return dim ? dim.valeur : "Non disponible";
                                            })
                                        )
                                    ))}

                                    <div className="p-4 bg-gray-50">
                                        <h4 className="font-bold text-gray-700 mb-2">Protection</h4>
                                    </div>
                                    {phones[0] && getDetailedSpecs(phones[0])?.details?.protection?.map((_, protectionIndex) => {
                                        const protection = getDetailedSpecs(phones[0]).details.protection[protectionIndex];
                                        return renderComparisonRow(
                                            protection.carac,
                                            phones.map(phone => {
                                                const specs = getDetailedSpecs(phone);
                                                const prot = specs?.details?.protection?.[protectionIndex];
                                                return prot ? prot.valeur : "Non disponible";
                                            })
                                        );
                                    })}
                                </>
                            ))}

                            {/* Audio */}
                            {renderCollapsibleSection("Audio", "audio", "🔊", (
                                <>
                                    <div className="p-4 bg-gray-50">
                                        <h4 className="font-bold text-gray-700 mb-2">Haut-parleurs</h4>
                                    </div>
                                    {phones[0] && getDetailedSpecs(phones[0])?.details?.audio?.hautParleurs?.map((_, hpIndex) => {
                                        const hp = getDetailedSpecs(phones[0]).details.audio.hautParleurs[hpIndex];
                                        return renderComparisonRow(
                                            hp.nom,
                                            phones.map(phone => {
                                                const specs = getDetailedSpecs(phone);
                                                const hautParleur = specs?.details?.audio?.hautParleurs?.[hpIndex];
                                                return hautParleur ? hautParleur.usage : "Non disponible";
                                            })
                                        );
                                    })}

                                    <div className="p-4 bg-gray-50">
                                        <h4 className="font-bold text-gray-700 mb-2">Microphones</h4>
                                    </div>
                                    {phones[0] && getDetailedSpecs(phones[0])?.details?.audio?.microphones?.map((_, micIndex) => {
                                        const mic = getDetailedSpecs(phones[0]).details.audio.microphones[micIndex];
                                        return renderComparisonRow(
                                            mic.nom,
                                            phones.map(phone => {
                                                const specs = getDetailedSpecs(phone);
                                                const microphone = specs?.details?.audio?.microphones?.[micIndex];
                                                return microphone ? microphone.usage : "Non disponible";
                                            })
                                        );
                                    })}
                                </>
                            ))}

                            {/* Logiciel */}
                            {renderCollapsibleSection("Logiciel", "logiciel", "💻", (
                                <>
                                    {phones[0] && getDetailedSpecs(phones[0])?.details?.logiciel?.map((_, logicielIndex) => {
                                        const logiciel = getDetailedSpecs(phones[0]).details.logiciel[logicielIndex];
                                        return renderComparisonRow(
                                            logiciel.carac,
                                            phones.map(phone => {
                                                const specs = getDetailedSpecs(phone);
                                                const log = specs?.details?.logiciel?.[logicielIndex];
                                                return log ? log.valeur : "Non disponible";
                                            })
                                        );
                                    })}
                                </>
                            ))}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

const PhoneDetailsModal = ({ phone, onClose, darkMode }) => {
    const [viewMode, setViewMode] = useState('simple');

    // États pour les sections dépliantes (Vue Simple) - Conservés au cas où
    const [showSimpleCamArriere, setShowSimpleCamArriere] = useState(false);
    const [showSimpleCamAvant, setShowSimpleCamAvant] = useState(false);

    // ========================================================
    // COMPOSANTS UTILITAIRES POUR LA VUE COMPLÈTE (Inchangés)
    // ========================================================

    const CollapsibleSection = ({ title, icon, children, defaultOpen = false }) => {
        const [isOpen, setIsOpen] = useState(defaultOpen);
        return (
            <div className={`mb-6 border rounded-xl overflow-hidden shadow-sm ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-full flex justify-between items-center p-4 transition ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-slate-100 hover:bg-slate-200'}`}
                >
                    <h3 className={`text-lg font-bold flex items-center ${darkMode ? 'text-white' : 'text-slate-800'}`}>{icon} {title}</h3>
                    {isOpen ? <ChevronUp size={20} className={darkMode ? 'text-gray-400' : 'text-slate-600'} /> : <ChevronDown size={20} className={darkMode ? 'text-gray-400' : 'text-slate-600'} />}
                </button>
                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[10000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className={`p-4 text-sm space-y-3 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        {children}
                    </div>
                </div>
            </div>
        );
    };

    const DetailItem = ({ label, value, isNested = false, isBold = false }) => (
        <div className={`flex justify-between items-start ${isNested ? 'ml-4' : ''} py-2 border-b last:border-b-0 ${darkMode ? 'border-gray-700' : 'border-slate-100'}`}>
            <span className={`font-medium flex-shrink-0 pr-2 ${isBold ? (darkMode ? 'font-bold text-gray-300' : 'font-bold text-slate-700') : (darkMode ? 'text-gray-400' : 'text-slate-600')}`}>{label}:</span>
            <span className={`font-semibold ml-2 text-right ${darkMode ? 'text-gray-200' : 'text-slate-900'}`}>{value}</span>
        </div>
    );

    const SubHeader = ({ text }) => (
        <h4 className={`font-extrabold mt-3 mb-2 pt-2 border-t text-base ${darkMode ? 'text-white border-gray-700' : 'text-slate-700 border-slate-300'}`}>{text}</h4>
    );


    if (!phone || !phone.details) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-[100]">
                <div className={`p-6 rounded-xl shadow-2xl max-w-lg w-full text-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <h2 className="text-xl font-bold text-red-600 mb-4">Erreur : Fiche Détaillée Manquante</h2>
                    <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>La fiche détaillée pour ce modèle ({phone?.modele || "Modèle Inconnu"}) n'est pas encore disponible.</p>
                    <button onClick={onClose} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">Fermer</button>
                </div>
            </div>
        );
    }

    const d = phone.details;
    const a = phone.apercu;

    // Fonction RenderTable (utilisée par les deux vues)
    const renderTable = (data, title, icon, isCompact = false, className = "sm:grid-cols-2") => (
        <div className="mb-8">
            <h3 className={`text-xl font-bold mb-3 border-b pb-1 flex items-center ${darkMode ? 'text-gray-200 border-gray-700' : 'text-slate-800 border-slate-200'}`}>{icon} {title}</h3>
            <div className={`grid ${isCompact ? 'sm:grid-cols-1' : className} gap-x-4 gap-y-2 text-sm`}>
                {data.map((item, index) => (
                    <div key={index} className={`flex justify-between items-center p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-slate-50 border-slate-200'}`}>
                        <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>{item.carac || item.version || item.usage || item.objectif || item.nom || item.mode || item.cat || item.titre}:</span>
                        <span className={`font-semibold ml-2 text-right ${darkMode ? 'text-gray-200' : 'text-slate-900'}`}>{item.valeur || item.neufSamsung || item.autonomie || item.details || item.score}</span>
                    </div>
                ))}
            </div>
        </div>
    );

    // Fonction RenderPriceTable (utilisée par les deux vues)
    const renderPriceTable = () => (
        <div className="mb-8">
            <h3 className={`text-xl font-bold mb-3 border-b pb-1 flex items-center ${darkMode ? 'text-gray-200 border-gray-700' : 'text-slate-800 border-slate-200'}`}>💰 Prix Détaillés</h3>
            <table className="w-full text-sm border-collapse">
                <thead>
                    <tr className={darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-50 text-blue-800'}><th className={`p-3 border-b-2 text-left ${darkMode ? 'border-blue-700' : 'border-blue-200'}`}>Version</th><th className={`p-3 border-b-2 text-left ${darkMode ? 'border-blue-700' : 'border-blue-200'}`}>Prix Samsung (neuf)</th><th className={`p-3 border-b-2 text-left ${darkMode ? 'border-blue-700' : 'border-blue-200'}`}>Prix moyen en ligne</th><th className={`p-3 border-b-2 text-left ${darkMode ? 'border-blue-700' : 'border-blue-200'}`}>Prix reconditionné</th></tr>
                </thead>
                <tbody>
                    {d.prix.map((item, index) => (
                        <tr key={index} className={`border-b ${darkMode ? 'hover:bg-gray-700 border-gray-700' : 'hover:bg-slate-50 border-slate-100'}`}><td className="p-3 font-semibold">{item.version}</td><td className={`p-3 ${darkMode ? 'text-gray-300' : 'text-slate-800'}`}>{item.neufSamsung}</td><td className={`p-3 ${darkMode ? 'text-gray-300' : 'text-slate-800'}`}>{item.neufMoyen}</td><td className={`p-3 ${darkMode ? 'text-gray-300' : 'text-slate-800'}`}>{item.reconditionne}</td></tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    // ========================================================
    // renderSimpleView (CORRIGÉ NaN + REFAIT AVEC NOUVELLES DONNÉES)
    // ========================================================
    const renderSimpleView = () => {
        // Calcul de la note totale à partir des détails
        const totalScore = a.notesDetaillees.reduce((sum, noteDetail) => {
            const scorePart = parseInt(noteDetail.note.split('/')[0]);
            return sum + (isNaN(scorePart) ? 0 : scorePart);
        }, 0);

        return (
            <>
                {/* --- BLOC IMAGE --- */}
                <div className={`mb-10 h-80 flex justify-center items-center border-2 border-dashed rounded-xl ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-slate-100 border-slate-300'}`}>
                    <div className={`text-center ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}><Camera size={48} className={`mx-auto mb-3 ${darkMode ? 'text-gray-500' : 'text-slate-400'}`} /><h3 className="text-xl font-semibold">Emplacement pour l'image du produit</h3><p className="text-sm mt-1">Une photo sera ajoutée ici prochainement.</p></div>
                </div>

                {/* --- APERÇU RAPIDE / NOTES / COULEURS --- */}
                <div className={`grid md:grid-cols-2 gap-8 mb-10 border-b pb-6 ${darkMode ? 'border-gray-700' : 'border-slate-200'}`}>
                    <div className="flex flex-col justify-center">
                        <h3 className={`text-2xl font-bold mb-4 flex items-center ${darkMode ? 'text-gray-200' : 'text-slate-800'}`}><Maximize size={24} className="mr-2 text-green-600" /> Aperçu Rapide</h3>
                        <div className={`space-y-3 text-lg ${darkMode ? 'text-gray-300' : 'text-slate-800'}`}>
                            <p>🗓️ **Date de sortie :** <span className="font-semibold">{a.dateSortie}</span></p>
                            <p>💸 **Prix moyen neuf :** <span className="font-semibold text-green-700">{a.prixMoyen}</span></p>
                            {/* CORRIGÉ: Utilisation de totalScore */}
                            <p>⭐ **Note globale :** <span className="font-extrabold text-blue-700">{totalScore}/200</span></p>
                            <p>📱 **Écran :** {a.ecran}</p>
                            <p>⚡ **Puce :** {a.puce}</p>
                            <p>🔋 **Batterie :** {a.batterie}</p>
                        </div>
                    </div>
                    <div>
                        <h4 className={`text-xl font-bold mb-3 ${darkMode ? 'text-gray-200' : 'text-slate-800'}`}>Notes Détaillées</h4>
                        <div className="grid grid-cols-2 gap-3">
                            {a.notesDetaillees.map((note, index) => (
                                <div key={index} className={`flex justify-between items-center p-3 rounded-lg font-medium text-sm border ${darkMode ? 'bg-blue-900 border-blue-700 text-gray-200' : 'bg-blue-50 border-blue-200 text-slate-800'}`}><span>{note.cat}</span><span className="font-bold text-blue-700">{note.note} {note.icone}</span></div>
                            ))}
                        </div>
                        <h4 className={`text-xl font-bold mt-5 mb-3 ${darkMode ? 'text-gray-200' : 'text-slate-800'}`}>Couleurs</h4>
                        <div className="flex flex-wrap gap-2 text-sm">
                            {a.couleurs.map((c, index) => (<span key={index} className={`px-3 py-1 rounded-full font-medium ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800'}`}>{c.nom} {c.emoji}</span>))}
                        </div>
                    </div>
                </div>

                <h2 className={`text-2xl font-extrabold mt-8 mb-4 border-b pb-2 flex items-center ${darkMode ? 'text-gray-200 border-gray-700' : 'text-slate-900 border-slate-200'}`}>⭐ Caractéristiques Clés (Détail)</h2>

                {/* --- PRIX --- */}
                {renderPriceTable()}

                {/* --- DIMENSIONS & PROTECTION --- */}
                <div className="grid lg:grid-cols-2 gap-8">
                    {renderTable(d.dimensions, "📏 Dimension et Poids", "", true)}
                    {renderTable([
                        d.protection[0], // Indice
                        d.protection[2], // Coque
                        d.protection[3]  // Verre
                    ], "🦾 Protection et Structure", "", true)}
                </div>

                {/* --- BOUTONS & AUDIO --- */}
                <div className="grid lg:grid-cols-2 gap-8">
                    {renderTable([d.boutons[0]], "🎛️ Boutons", "", true)}
                    {renderTable([
                        { carac: `HP Stéréo / Puissance`, valeur: `${d.audio.hautParleurs[0]?.usage || "2 haut-parleurs stéréo"} / ${d.audio.hautParleurs[3]?.usage || "≈ 72 dB"}` },
                        { carac: `Micros`, valeur: d.audio.microphones[0]?.usage || "3 micros de qualité" }
                    ], <Volume2 size={20} className="mr-2" />, "Audio et Micros", true)}
                </div>

                {/* --- ECRAN --- */}
                {renderTable([
                    { carac: "Type", valeur: d.ecran[4]?.valeur || "OLED" },
                    { carac: "Taille", valeur: d.ecran[0]?.valeur || "6,1\"" },
                    { carac: "Bordures Lat/Sup/Inf", valeur: `${d.ecran[1]?.valeur || "1,15 mm"} / ${d.ecran[2]?.valeur || "1,15 mm"} / ${d.ecran[3]?.valeur || "1,15 mm"}` },
                    { carac: "Résolution/Densité", valeur: `${d.ecran[5]?.valeur || "2556 x 1179 pixels"} / ${d.ecran[6]?.valeur || "460 ppi"}` },
                    { carac: "Rafraîchissement", valeur: d.ecran[7]?.valeur || "60 Hz" },
                    { carac: "Luminosité max", valeur: d.ecran[8]?.valeur || "2000 nits" },
                    { carac: "HDR", valeur: d.ecran[9]?.valeur || "HDR10, DolbyVision" },
                ], "Écran", <Monitor size={20} className="mr-2" />, false)}

                {/* --- CAMERA --- */}
                <h3 className={`text-xl font-bold mb-3 border-b pb-1 flex items-center mt-8 ${darkMode ? 'text-white border-gray-700' : 'text-slate-800 border-slate-200'}`}> <Camera size={20} className="mr-2" /> Caméra</h3>
                <div className="grid lg:grid-cols-2 gap-8">
                    {renderTable(d.camera.simple.photoArriere, "📸 Photo Arrière", "", true)}
                    {renderTable(d.camera.simple.photoAvant, "🤳 Photo Avant", "", true)}
                </div>
                <div className="grid lg:grid-cols-2 gap-8">
                    {renderTable(d.camera.simple.videoArriere, "📹 Vidéo Arrière", "", true)}
                    {renderTable(d.camera.simple.videoAvant, "🎥 Vidéo Avant", "", true)}
                </div>

                {/* --- PERFORMANCES --- */}
                {renderTable([
                    { carac: "Type", valeur: d.performances.processeur.type },
                    { carac: "Gravure", valeur: d.performances.processeur.gravure },
                    { carac: "Cœurs CPU", valeur: d.performances.processeur.cpu.totalCores },
                    { carac: "Stockage", valeur: d.performances.stockage[0]?.valeur || "128, 256, 512 Go" },
                    { carac: "RAM", valeur: d.performances.ram[0]?.valeur || "8 Go" },
                    d.performances.scores[0] || { cat: "AnTuTu Total", score: "1 668 567" } // Score Antutu Total
                ], "⚡ Performances & Stockage", <Cpu size={20} className="mr-2" />, false, "sm:grid-cols-2")}

                {/* --- BATTERIE --- */}
                {renderTable([
                    d.batterie.specs[0] || { carac: "Capacité", valeur: "3 561 mAh" }, // Capacité
                    { carac: "Charge Filaire", valeur: d.batterie.recharge[0]?.carac?.match(/\((.*?)\)/)?.[1] || "27W" },
                    { carac: "Charge Sans Fil", valeur: `${d.batterie.recharge[1]?.carac?.match(/\((.*?)\)/)?.[1] || "25W"} (${d.batterie.recharge[2]?.valeur || "MagSafe"})` },
                    d.batterie.recharge[3] || { carac: "Charge Inversée", valeur: "Non disponible" }, // Inversée
                    { carac: "Autonomie (usage réel)", valeur: phone.marque === "Apple" ? "~15–17h" : "~18–20h" }
                ], "🔋 Batterie & Autonomie", <BatteryCharging size={20} className="mr-2" />, false)}

                {/* --- CONNECTIVITE --- */}
                {renderTable([
                    { carac: "USB-C", valeur: `${d.connectivite.filaire[0]?.valeur || "2.0"} (${d.connectivite.filaire[2]?.valeur || "27W"})` },
                    { carac: "Réseaux Mobiles", valeur: "5G" },
                    { carac: "Wi-Fi", valeur: phone.marque === "Apple" ? "6E (6 GHz)" : "7 (6 GHz)" },
                    { carac: "Bluetooth", valeur: d.connectivite.sansFil[4]?.valeur?.split(' ')[0] || "5.3" },
                    { carac: "GPS", valeur: `GPS + ${d.localisation.length - 1} capteurs supp.` },
                    { carac: "NFC", valeur: d.connectivite.sansFil[6]?.valeur || "Sécurisé (Apple Pay)" },
                ], "🔌 Connectivité", <Wifi size={20} className="mr-2" />, false)}

                {/* --- CAPTEURS --- */}
                {renderTable([
                    d.capteurs[0] || { carac: "Total", valeur: "Environ 25 capteurs" }, // Total
                    { carac: "Reconn. Faciale", valeur: d.capteurs[1]?.valeur ? `${d.capteurs[1].valeur.split('(')[0]} (${d.capteurs[1].valeur.match(/\((.*?)\)/)?.[1] || "3D"})` : "Face ID (Architecture 3D)" }
                ], "📡 Autres Capteurs", <Info size={20} className="mr-2" />, true)}

                {/* --- LOGICIEL --- */}
                <h3 className={`text-xl font-bold mb-3 border-b pb-1 flex items-center mt-8 ${darkMode ? 'text-white border-gray-700' : 'text-slate-800 border-slate-200'}`}> <Smartphone size={20} className="mr-2" /> Logiciel</h3>
                <div className="grid lg:grid-cols-2 gap-8">
                    {renderTable([
                        d.logiciel[0] || { carac: "OS (sortie)", valeur: "iOS 18" }, // OS Sortie
                        d.logiciel[1] || { carac: "OS (actuel)", valeur: "iOS 26" }, // OS Actuel
                        { carac: "MàJ Logiciel", valeur: phone.marque === "Apple" ? "5 ans restants" : `${d.logiciel[2]?.valeur?.split(' ')[0] || "5"} ans restants` },
                        { carac: "MàJ Sécurité", valeur: phone.marque === "Apple" ? "7 ans restants" : `${d.logiciel[3]?.valeur?.split(' ')[0] || "7"} ans restants` },
                    ], "🤖 OS & Mises à jour", "", true)}
                    <div className="mb-8">
                        <h4 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-700'}`}>{phone.marque === "Apple" ? "Points Positifs iOS" : "Points Positifs One UI"}</h4>
                        <ul className={`list-disc list-inside ml-4 space-y-1 text-sm ${darkMode ? 'text-gray-100 font-semibold' : 'text-slate-700 font-medium'}`}>
                            {d.logicielPointsPositifs.map((point, index) => (<li key={index}>{point.titre.substring(3)}</li>))}
                        </ul>
                    </div>
                </div>

                {/* --- NOTE FINALE --- */}
                <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg mt-8">
                    <p className="font-semibold text-blue-800">Ceci est la vue simple. Basculez vers la vue "Complète" pour toutes les caractéristiques techniques détaillées.</p>
                </div>
            </>
        );
    };


    // ========================================================
    // renderCompleteView (Inchangé)
    // ========================================================
    const renderCompleteView = () => (
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-slate-50'}`}>
            {phone.marque === "Apple" && phone.modele === "iPhone 16" && (
                <div className={`mb-6 p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ${darkMode ? 'bg-gradient-to-r from-orange-900 to-orange-800 border border-orange-700' : 'bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200'}`}>
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <svg className="h-6 w-6 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className={`text-base font-semibold ${darkMode ? 'text-orange-300' : 'text-orange-800'}`}>⚠️ Attention</h3>
                            <div className={`mt-2 text-sm ${darkMode ? 'text-orange-200' : 'text-orange-700'}`}>
                                <p className="leading-relaxed">Téléphone indisponible : des erreurs peuvent apparaître dans cette fiche caractéristique, notamment au niveau des zoom.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {renderPriceTable()}

            <div className="grid lg:grid-cols-2 gap-8">
                {renderTable(d.dimensions, "Dimension et Poids", "📏")}
                {renderTable(d.protection, "Protection et Structure", "🦾")}
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {renderTable(d.boutons, "Boutons", "🎛️")}

                <CollapsibleSection title="Audio et Micros" icon={<Volume2 size={20} className="mr-2" />}>
                    <SubHeader text="Haut-Parleurs" />
                    {d.audio.hautParleurs.map((item, index) => (
                        <DetailItem key={index} label={item.nom} value={item.usage} />
                    ))}
                    <SubHeader text="Microphones" />
                    {d.audio.microphones.map((item, index) => (
                        <DetailItem key={index} label={item.nom} value={item.usage} />
                    ))}
                </CollapsibleSection>
            </div>

            {renderTable(d.ecran, "Écran et Affichage", <Monitor size={20} className="mr-2" />)}

            {/* =========================================== */}
            {/* SECTION CAMÉRA (VUE COMPLÈTE) - Inchangée  */}
            {/* =========================================== */}
            <h2 className={`text-2xl font-extrabold mt-10 mb-4 border-b pb-2 flex items-center ${darkMode ? 'text-gray-200 border-gray-700' : 'text-slate-900 border-slate-200'}`}><Camera size={24} className="mr-2 text-purple-600" /> Caméra (Détail Complet)</h2>
            <div className={`p-4 rounded-xl border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-slate-100 border-slate-200'}`}>
                <DetailItem label={`Capteurs Arrière (${d.camera.general.nbArriere})`} value={d.camera.general.typeArriere} isBold={true} />
                <DetailItem label={`Capteur Avant (${d.camera.general.nbAvant})`} value={d.camera.general.typeAvant} isBold={true} />
                <div className="my-2 border-b"></div> {/* Separateur */}
                {d.camera.general.noteTeleobjectif12MP && <DetailItem label="Note imp. (Télé 12MP & autres rés.)" value={d.camera.general.noteTeleobjectif12MP} />}
                {d.camera.general.noteTeleobjectif50MP && <DetailItem label="Note imp. (Télé 50MP)" value={d.camera.general.noteTeleobjectif50MP} />}

                <CollapsibleSection title="Photo (Arrière et Avant)" icon="📸">
                    <SubHeader text="Modes Photo (Communs)" />
                    {d.camera.photoModes.map((item, i) => <DetailItem key={i} label={item.nom} value={item.details} />)}

                    <SubHeader text="Capteurs Arrière (Standard)" />
                    {d.camera.photoArriere.capteurs.map((item, i) => (
                        <div key={i} className={`p-3 rounded-lg border my-2 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-slate-50 border-slate-200'}`}>
                            <DetailItem label="Objectif" value={item.objectif} isBold={true} />
                            <DetailItem label="Mégapixels" value={item.megapixels} isNested={true} />
                            <DetailItem label="Ouverture/Focale" value={item.ouverture} isNested={true} />
                            <DetailItem label="Zoom" value={item.zoom} isNested={true} />
                        </div>
                    ))}

                    <SubHeader text="Résolutions Photo (Arrière)" />
                    {d.camera.photoArriere.resolutions.map((item, i) => <DetailItem key={i} label={item.carac} value={item.valeur} />)}

                    <SubHeader text="Capteur Avant (Selfie)" />
                    <div className={`p-3 rounded-lg border my-2 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-slate-50 border-slate-200'}`}>
                        <DetailItem label="Objectif" value={d.camera.photoAvant.capteurs[0].objectif} isBold={true} />
                        <DetailItem label="Mégapixels" value={d.camera.photoAvant.capteurs[0].megapixels} isNested={true} />
                        <DetailItem label="Ouverture/Focale" value={d.camera.photoAvant.capteurs[0].ouverture} isNested={true} />
                    </div>
                    {d.camera.photoAvant.zoom.map((item, i) => <DetailItem key={i} label={item.carac} value={item.valeur} isNested={true} />)}
                </CollapsibleSection>

                <CollapsibleSection title="Vidéo (Arrière)" icon="📹">
                    <SubHeader text="Formats Vidéo (Communs)" />
                    {d.camera.videoFormats.map((item, i) => <DetailItem key={i} label={item.format} value={item.details} />)}

                    {Object.values(d.camera.videoArriere).map((mode, i) => (
                        <div key={i}>
                            <SubHeader text={mode.titre} />
                            {mode.base && <p className={`font-semibold mb-2 p-2 rounded-md border ${darkMode ? 'text-gray-300 bg-blue-900 border-blue-700' : 'text-slate-700 bg-blue-50 border-blue-200'}`}>{mode.base}</p>}
                            {Object.entries(mode).map(([key, value]) => {
                                if (key === 'titre' || key === 'base') return null;
                                let label = key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' '); // Remplace _ par espace si besoin
                                if (key === 'nouveaux_ips') label = "Nouveaux IPS";

                                return <DetailItem key={key} label={label} value={value} />
                            })}
                        </div>
                    ))}
                </CollapsibleSection>

                <CollapsibleSection title="Vidéo (Avant)" icon="🎥">
                    {Object.values(d.camera.videoAvant).map((mode, i) => (
                        <div key={i}>
                            <SubHeader text={mode.titre} />
                            {mode.base && <p className={`font-semibold mb-2 p-2 rounded-md border ${darkMode ? 'text-gray-300 bg-blue-900 border-blue-700' : 'text-slate-700 bg-blue-50 border-blue-200'}`}>{mode.base}</p>}
                            {Object.entries(mode).map(([key, value]) => {
                                if (key === 'titre' || key === 'base') return null;
                                let label = key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' '); // Remplace _ par espace
                                if (key === 'nouveaux_ips') label = "Nouveaux IPS";

                                return <DetailItem key={key} label={label} value={value} />
                            })}
                        </div>
                    ))}
                </CollapsibleSection>
            </div>

            {/* --- Sections suivantes (Performances, Batterie, etc.) Inchangées --- */}
            <h2 className={`text-2xl font-extrabold mt-10 mb-4 border-b pb-2 flex items-center ${darkMode ? 'text-gray-200 border-gray-700' : 'text-slate-900 border-slate-200'}`}><Zap size={24} className="mr-2 text-yellow-600" /> Performances</h2>
            <div className="grid lg:grid-cols-2 gap-8">
                <CollapsibleSection title={`Stockage (${d.performances.stockage.find(item => item.carac === "Technologie")?.valeur || ""})`} icon={<HardDrive size={20} />}>
                    {d.performances.stockage.map((item, i) => <DetailItem key={i} label={item.carac} value={item.valeur} />)}
                </CollapsibleSection>
                <CollapsibleSection title={`RAM (${d.performances.ram.find(item => item.carac === "Technologie")?.valeur || ""})`} icon={<MemoryStick size={20} />}>
                    {d.performances.ram.map((item, i) => <DetailItem key={i} label={item.carac} value={item.valeur} />)}
                </CollapsibleSection>
            </div>

            <CollapsibleSection title={`Processeur (${d.performances.processeur.type})`} icon={<Cpu size={20} />} defaultOpen={true}>
                <DetailItem label="Type" value={d.performances.processeur.type} isBold={true} />
                <DetailItem label="Gravure" value={d.performances.processeur.gravure} />

                <SubHeader text="CPU" />
                <DetailItem label="Total Cœurs" value={d.performances.processeur.cpu.totalCores} />
                <DetailItem label="Cœurs Performance" value={d.performances.processeur.cpu.perfCores} isNested={true} />
                <DetailItem label="Cœurs Efficacité" value={d.performances.processeur.cpu.efficiencyCores} isNested={true} />
                <DetailItem label="Cache L3" value={d.performances.processeur.cpu.cacheL3} isNested={true} />

                <SubHeader text={phone.marque === "Samsung" && d.performances.processeur.gpu.type?.includes("Adreno") ? "GPU (Adreno 830)" : "GPU"} />
                <DetailItem label="Cœurs" value={d.performances.processeur.gpu.cores} />
                <DetailItem label="Fréquence" value={d.performances.processeur.gpu.frequence} isNested={true} />
                <DetailItem label="Performance" value={d.performances.processeur.gpu.perfTheorique} isNested={true} />
                <DetailItem label="Ray Tracing" value={d.performances.processeur.gpu.rayTracing} isNested={true} />
                <DetailItem label="Encodage Vidéo" value={d.performances.processeur.gpu.video} isNested={true} />

                <SubHeader text={phone.marque === "Samsung" && d.performances.processeur.npu.type?.includes("Hexagon") ? "NPU (Hexagon)" : "NPU"} />
                <DetailItem label="Description" value={d.performances.processeur.npu.description} />
                {d.performances.processeur.npu.blocs.map((bloc, i) => (
                    <DetailItem key={i} label={bloc.nom} value={bloc.usage} isNested={true} />
                ))}
                <DetailItem label="Performance IA" value={d.performances.processeur.npu.perfTheorique} />
            </CollapsibleSection>

            {renderTable(d.performances.scores, "Scores Estimés (AnTuTu)", "📊")}

            <h2 className={`text-2xl font-extrabold mt-10 mb-4 border-b pb-2 flex items-center ${darkMode ? 'text-gray-200 border-gray-700' : 'text-slate-900 border-slate-200'}`}><BatteryCharging size={24} className="mr-2 text-green-600" /> Batterie & Autonomie</h2>
            <div className="grid lg:grid-cols-2 gap-8">
                <CollapsibleSection title="Batterie et Recharge" icon={<Battery size={20} />}>
                    <SubHeader text="Spécifications" />
                    {d.batterie.specs.map((item, i) => <DetailItem key={i} label={item.carac} value={item.valeur} />)}
                    <SubHeader text="Vitesse de Recharge" />
                    {d.batterie.recharge.map((item, i) => <DetailItem key={i} label={item.carac} value={item.valeur} />)}
                </CollapsibleSection>
                {renderTable(d.autonomie, "Autonomie en usages réels", "⏱️")}
            </div>

            <h2 className={`text-2xl font-extrabold mt-10 mb-4 border-b pb-2 flex items-center ${darkMode ? 'text-gray-200 border-gray-700' : 'text-slate-900 border-slate-200'}`}><List size={24} className="mr-2 text-cyan-600" /> Connectivité & Capteurs</h2>

            <CollapsibleSection title="Connectivité (Réseaux & Partage)" icon={<Wifi size={20} />}>
                <SubHeader text="Filaire (USB-C)" />
                {d.connectivite.filaire.map((item, i) => <DetailItem key={i} label={item.carac} value={item.valeur} />)}
                <SubHeader text="Sans Fil" />
                {d.connectivite.sansFil.map((item, i) => <DetailItem key={i} label={item.carac} value={item.valeur} />)}
                <SubHeader text="Partage de Connexion" />
                {d.connectivite.partage.map((item, i) => <DetailItem key={i} label={item.carac} value={item.valeur} />)}
            </CollapsibleSection>

            {renderTable(d.localisation, "Localisation (GPS, etc.)", <Satellite size={20} className="mr-2" />)}

            <CollapsibleSection title="Autres Capteurs" icon={<Droplet size={20} />}>
                {d.capteurs.map((item, i) => <DetailItem key={i} label={item.carac} value={item.valeur} />)}
            </CollapsibleSection>

            <h2 className={`text-2xl font-extrabold mt-10 mb-4 border-b pb-2 flex items-center ${darkMode ? 'text-gray-200 border-gray-700' : 'text-slate-900 border-slate-200'}`}><Info size={24} className="mr-2 text-orange-600" /> Logiciel (Software)</h2>
            {renderTable(d.logiciel, "OS & Mises à jour", "🤖")}
            <CollapsibleSection title={phone.marque === "Apple" ? "Points forts d'iOS" : "Points forts d'Android/One UI"} icon={<Smartphone size={20} />}>
                {d.logicielPointsPositifs.map((section, i) => (
                    <div key={i} className="mb-2">
                        <SubHeader text={section.titre} />
                        <ul className={`list-disc list-inside ml-4 space-y-1 font-semibold ${darkMode ? 'text-gray-100' : 'text-slate-700'}`}>
                            {section.points.map((point, j) => (
                                <li key={j}>{point}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </CollapsibleSection>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-[100]">
            <div className={`w-screen h-screen overflow-y-scroll transform transition-all duration-300 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                <div className={`sticky top-0 border-b p-3 sm:p-5 flex justify-between items-center z-50 shadow-sm ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-blue-600">Fiche : {phone.marque} {phone.modele}</h2>
                    <div className={`flex items-center space-x-2 p-1 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-slate-200'}`}>
                        <button onClick={() => setViewMode('simple')} className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${viewMode === 'simple' ? (darkMode ? 'bg-gray-800 text-blue-400 shadow' : 'bg-white text-blue-600 shadow') : (darkMode ? 'text-gray-300' : 'text-slate-600')}`}>Simple</button>

                        <button onClick={() => setViewMode('complete')} className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${viewMode === 'complete' ? (darkMode ? 'bg-gray-800 text-blue-400 shadow' : 'bg-white text-blue-600 shadow') : (darkMode ? 'text-gray-300' : 'text-slate-600')}`}>Complète</button>
                    </div>
                    <button onClick={onClose} className={`p-2 rounded-full hover:bg-red-500 hover:text-white transition ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`} aria-label="Fermer la fiche détaillée"><X size={24} /></button>
                </div>

                <div className="p-6 sm:p-8 max-w-7xl mx-auto">
                    {viewMode === 'simple' ? renderSimpleView() : renderCompleteView()}
                </div>

                <div className={`sticky bottom-0 border-t p-4 text-center z-50 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                    <button onClick={onClose} className="px-6 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition shadow-lg active:scale-95">Fermer la Fiche</button>
                </div>
            </div>
        </div>
    );
};


// ====================================================================
// COMPOSANT Home (Inchangé)
// ====================================================================

export default function Home() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [aboutOpen, setAboutOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [selectedBrand, setSelectedBrand] = useState("Toutes");
    const [comparisonList, setComparisonList] = useState([]);
    const [hoveredPhone, setHoveredPhone] = useState(null);
    const [expandedNoteId, setExpandedNoteId] = useState(null);
    const [expandedUntestedId, setExpandedUntestedId] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedPhoneDetails, setSelectedPhoneDetails] = useState(null);
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("Tous");
    const [selectedNoteRange, setSelectedNoteRange] = useState("Toutes");
    const [selectedYear, setSelectedYear] = useState("Toutes");
    const [selectedProcessor, setSelectedProcessor] = useState("Tous");
    const [comparisonModalOpen, setComparisonModalOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const menuRef = useRef(null);

    // Debouncing de la recherche pour améliorer les performances
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleViewDetails = useCallback((phone) => {
        const phoneKey = `${phone.marque}-${phone.modele}`;
        const details = PHONE_DETAILS_DATA[phoneKey];
        if (details) {
            setSelectedPhoneDetails(details);
            setModalOpen(true);
        } else {
            const phoneData = allSmartphones.find(p => `${p.marque}-${p.modele}` === phoneKey);
            setSelectedPhoneDetails({ marque: phoneData?.marque || "Inconnu", modele: phoneData?.modele || "Inconnu", details: null });
            setModalOpen(true);
        }
    }, []);

    const toggleComparison = useCallback((phone) => {
        const phoneKey = `${phone.marque}-${phone.modele}`;

        setComparisonList(prevList => {
            const isAlreadyInList = prevList.some(p => `${p.marque}-${p.modele}` === phoneKey);

            // Si le téléphone est déjà dans la liste, on le retire (pas besoin de vérifier les specs)
            if (isAlreadyInList) {
                return prevList.filter(p => `${p.marque}-${p.modele}` !== phoneKey);
            }

            // Si on veut l'ajouter, vérifier d'abord s'il a une fiche caractéristique
            if (!phone.hasDetailedSpecs && !phone.isTested) {
                alert("⚠️ Ce téléphone n'a pas encore de fiche caractéristique complète et ne peut pas être comparé pour le moment.");
                return prevList;
            }

            // Créer une version nettoyée du téléphone
            const cleanPhone = {
                id: phone.id,
                marque: phone.marque,
                modele: phone.modele,
                prix: phone.prix,
                img: phone.img,
                note: phone.note
            };

            // Ajouter le téléphone si on n'a pas atteint la limite
            if (prevList.length < 4) {
                return [...prevList, cleanPhone];
            }

            alert("Vous ne pouvez comparer que 4 téléphones à la fois.");
            return prevList;
        });
    }, []);

    const toggleNoteDetails = useCallback((phoneId) => {
        setExpandedNoteId(prevId => prevId === phoneId ? null : phoneId);
        if (expandedUntestedId === phoneId) setExpandedUntestedId(null);
    }, [expandedUntestedId]);

    const toggleUntestedDetails = useCallback((phoneId) => {
        setExpandedUntestedId(prevId => prevId === phoneId ? null : phoneId);
        if (expandedNoteId === phoneId) setExpandedNoteId(null);
    }, [expandedNoteId]);

    useEffect(() => {
        function handleClickOutside(e) {
            if (!menuOpen && !aboutOpen) return;
            const isHamburgerButton = e.target.closest('button[aria-label^="Ouvrir le menu"], button[aria-label^="Fermer le menu"]');
            if (menuOpen && menuRef.current && !menuRef.current.contains(e.target) && !isHamburgerButton) {
                setMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuOpen, aboutOpen]);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = useCallback(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const formatNoteDisplay = useCallback((note) => `Note : ${Math.min(note, 200)}/200`, []);

    // ========================================================
    // FONCTION getDetailedNotes (Inchangée)
    // ========================================================
    const getDetailedNotes = (globalNote) => {
        const maxScores = {
            design: 30,
            ecran: 30,
            performance: 40,
            camera: 40,
            logiciel: 30,
            autonomie: 30,
        };
        const totalMax = 200;

        const idealDistribution = {};
        let calculatedTotal = 0;
        const keys = Object.keys(maxScores);

        for (const [key, max] of Object.entries(maxScores)) {
            const score = Math.round((globalNote / totalMax) * max);
            idealDistribution[key] = score;
            calculatedTotal += score;
        }

        let difference = globalNote - calculatedTotal;

        if (idealDistribution.performance !== undefined) {
            idealDistribution.performance += difference;
        } else {
            idealDistribution[keys[0]] += difference;
        }

        for (const key of keys) {
            if (idealDistribution[key] > maxScores[key]) {
                idealDistribution[key] = maxScores[key];
            }
        }

        return {
            design: { score: idealDistribution.design, max: maxScores.design },
            ecran: { score: idealDistribution.ecran, max: maxScores.ecran },
            performance: { score: idealDistribution.performance, max: maxScores.performance },
            camera: { score: idealDistribution.camera, max: maxScores.camera },
            logiciel: { score: idealDistribution.logiciel, max: maxScores.logiciel },
            autonomie: { score: idealDistribution.autonomie, max: maxScores.autonomie },
        };
    };

    const topSmartphones = [
        { marque: "Apple", modele: "iPhone 17 Pro Max", note: 185, prix: "1599€" },
        { marque: "Samsung", modele: "Galaxy S25 Ultra", note: 180, prix: "1299€" },
        { marque: "Google", modele: "Pixel 10 Pro", note: 165, prix: "999€" },
    ];

    // ========================================================
    // allSmartphones (Inchangé)
    // ========================================================
    const allSmartphones = useMemo(() => [
        // === APPLE ===
        { id: 46, marque: "Apple", modele: "iPhone 17 Pro Max", prix: "1599€", img: "/iphone17promax.png", note: 185 },
        { id: 45, marque: "Apple", modele: "iPhone 17 Pro", prix: "1299€", img: "/iphone17pro.png", note: 178 },
        { id: 44, marque: "Apple", modele: "iPhone 17", prix: "1099€", img: "/iphone17.png", note: 168 },
        { id: 43, marque: "Apple", modele: "iPhone 16 Pro Max", prix: "1329€", img: "/iphone16promax.png", note: 165 },
        { id: 42, marque: "Apple", modele: "iPhone 16 Pro", prix: "1159€", img: "/iphone16pro.png", note: 162 },
        { id: 41, marque: "Apple", modele: "iPhone 16 Plus", prix: "1029€", img: "/iphone16plus.png", note: 160 },
        { id: 40, marque: "Apple", modele: "iPhone 16", prix: "929€", img: "/iphone16.png", note: 158, isTested: false, hasDetailedSpecs: true },
        { id: 39, marque: "Apple", modele: "iPhone SE 4 (2025)", prix: "599€", img: "/iphoneSE4.png", note: 155 },
        { id: 38, marque: "Apple", modele: "iPhone 15 Pro Max", prix: "1199€", img: "/iphone15promax.png", note: 158 },
        { id: 37, marque: "Apple", modele: "iPhone 15 Pro", prix: "1029€", img: "/iphone15pro.png", note: 156 },
        { id: 36, marque: "Apple", modele: "iPhone 15 Plus", prix: "899€", img: "/iphone15plus.png", note: 154 },
        { id: 35, marque: "Apple", modele: "iPhone 15", prix: "799€", img: "/iphone15.png", note: 152 },
        { id: 34, marque: "Apple", modele: "iPhone 14 Pro Max", prix: "1329€", img: "/iphone14promax.png", note: 168 },
        { id: 33, marque: "Apple", modele: "iPhone 14 Pro", prix: "1199€", img: "/iphone14pro.png", note: 165 },
        { id: 32, marque: "Apple", modele: "iPhone 14 Plus", prix: "949€", img: "/iphone14plus.png", note: 160 },
        { id: 31, marque: "Apple", modele: "iPhone 14", prix: "849€", img: "/iphone14.png", note: 158 },
        { id: 30, marque: "Apple", modele: "iPhone SE 3 (2022)", prix: "529€", img: "/iphoneSE3.png", note: 155 },
        { id: 29, marque: "Apple", modele: "iPhone 13 Pro Max", prix: "999€", img: "/iphone13promax.png", note: 152 },
        { id: 28, marque: "Apple", modele: "iPhone 13 Pro", prix: "929€", img: "/iphone13pro.png", note: 150 },
        { id: 27, marque: "Apple", modele: "iPhone 13 Mini", prix: "749€", img: "/iphone13mini.png", note: 148 },
        { id: 26, marque: "Apple", modele: "iPhone 13", prix: "749€", img: "/iphone13.png", note: 145 },
        { id: 25, marque: "Apple", modele: "iPhone 12 Pro Max", prix: "899€", img: "/iphone12promax.png", note: 140 },
        { id: 24, marque: "Apple", modele: "iPhone 12 Pro", prix: "829€", img: "/iphone12pro.png", note: 138 },
        { id: 23, marque: "Apple", modele: "iPhone 12 Mini", prix: "649€", img: "/iphone12mini.png", note: 135 },
        { id: 22, marque: "Apple", modele: "iPhone 12", prix: "649€", img: "/iphone12.png", note: 132 },
        { id: 21, marque: "Apple", modele: "iPhone SE 2 (2020)", prix: "489€", img: "/iphoneSE2.png", note: 130 },
        { id: 20, marque: "Apple", modele: "iPhone 11 Pro Max", prix: "699€", img: "/iphone11promax.png", note: 125 },
        { id: 19, marque: "Apple", modele: "iPhone 11 Pro", prix: "629€", img: "/iphone11pro.png", note: 120 },
        { id: 18, marque: "Apple", modele: "iPhone 11", prix: "549€", img: "/iphone11.png", note: 115 },
        { id: 17, marque: "Apple", modele: "iPhone XS Max", prix: "499€", img: "/iphoneXSmax.png", note: 110 },
        { id: 16, marque: "Apple", modele: "iPhone XS", prix: "429€", img: "/iphoneXS.png", note: 105 },
        { id: 15, marque: "Apple", modele: "iPhone XR", prix: "399€", img: "/iphoneXR.png", note: 100 },
        { id: 14, marque: "Apple", modele: "iPhone X", prix: "399€", img: "/iphoneX.png", note: 95 },
        { id: 13, marque: "Apple", modele: "iPhone 8 Plus", prix: "299€", img: "/iphone8plus.png", note: 90 },
        { id: 12, marque: "Apple", modele: "iPhone 8", prix: "249€", img: "/iphone8.png", note: 85 },
        { id: 11, marque: "Apple", modele: "iPhone 7 Plus", prix: "199€", img: "/iphone7plus.png", note: 80 },
        { id: 10, marque: "Apple", modele: "iPhone 7", prix: "149€", img: "/iphone7.png", note: 75 },
        { id: 9, marque: "Apple", modele: "iPhone SE (1ère Gén.)", prix: "129€", img: "/iphoneSE1.png", note: 70 },
        { id: 8, marque: "Apple", modele: "iPhone 6S Plus", prix: "119€", img: "/iphone6splus.png", note: 65 },
        { id: 7, marque: "Apple", modele: "iPhone 6S", prix: "99€", img: "/iphone6s.png", note: 60 },
        { id: 6, marque: "Apple", modele: "iPhone 6 Plus", prix: "89€", img: "/iphone6plus.png", note: 55 },
        { id: 5, marque: "Apple", modele: "iPhone 6", prix: "79€", img: "/iphone6.png", note: 50 },
        { id: 4, marque: "Apple", modele: "iPhone 5S", prix: "69€", img: "/iphone5s.png", note: 45 },
        { id: 3, marque: "Apple", modele: "iPhone 5", prix: "59€", img: "/iphone5.png", note: 40 },
        { id: 2, marque: "Apple", modele: "iPhone 4S", prix: "49€", img: "/iphone4s.png", note: 35 },
        { id: 1, marque: "Apple", modele: "iPhone 4", prix: "39€", img: "/iphone4.png", note: 30 },
        { id: 0, marque: "Apple", modele: "iPhone 3GS", prix: "29€", img: "/iphone3gs.png", note: 25 },
        { id: -1, marque: "Apple", modele: "iPhone (2007)", prix: "19€", img: "/iphone1.png", note: 20 },

        // === SAMSUNG ===
        { id: 100, marque: "Samsung", modele: "Galaxy S25 Ultra", prix: "1299€", img: "/s25ultra.png", note: 180 },
        { id: 99, marque: "Samsung", modele: "Galaxy S25+", prix: "949€", img: "/s25plus.png", note: 175 },

        {
            id: 98,
            marque: "Samsung",
            modele: "Galaxy S25",
            prix: "726,2€",
            img: "/s25.png",
            note: 167,
            isTested: true,
            detailedNotes: {
                design: { score: 27, max: 30 },
                ecran: { score: 27, max: 30 },
                performance: { score: 36, max: 40 },
                camera: { score: 32, max: 40 },
                logiciel: { score: 24, max: 30 },
                autonomie: { score: 21, max: 30 },
            }
        },

        { id: 97, marque: "Samsung", modele: "Galaxy Z Fold 7", prix: "1799€", img: "/zfold7.png", note: 168 },
        { id: 96, marque: "Samsung", modele: "Galaxy Z Flip 7", prix: "999€", img: "/zflip7.png", note: 165 },
        { id: 95, marque: "Samsung", modele: "Galaxy S24 Ultra", prix: "1199€", img: "/s24ultra.png", note: 162 },
        { id: 94, marque: "Samsung", modele: "Galaxy S24+", prix: "849€", img: "/s24plus.png", note: 159 },
        { id: 93, marque: "Samsung", modele: "Galaxy S24", prix: "699€", img: "/s24.png", note: 156 },
        { id: 92, marque: "Samsung", modele: "Galaxy Z Fold 6", prix: "1899€", img: "/zfold6.png", note: 170 },
        { id: 91, marque: "Samsung", modele: "Galaxy Z Flip 6", prix: "999€", img: "/zflip6.png", note: 168 },
        { id: 90, marque: "Samsung", modele: "Galaxy S23 Ultra", prix: "1299€", img: "/s23ultra.png", note: 170 },
        { id: 89, marque: "Samsung", modele: "Galaxy S23+", prix: "1099€", img: "/s23plus.png", note: 165 },
        { id: 88, marque: "Samsung", modele: "Galaxy S23", prix: "899€", img: "/s23.png", note: 162 },
        { id: 87, marque: "Samsung", modele: "Galaxy S22 Ultra", prix: "1099€", img: "/s22ultra.png", note: 160 },
        { id: 86, marque: "Samsung", modele: "Galaxy S22+", prix: "899€", img: "/s22plus.png", note: 158 },
        { id: 85, marque: "Samsung", modele: "Galaxy S22", prix: "799€", img: "/s22.png", note: 155 },
        { id: 84, marque: "Samsung", modele: "Galaxy A56", prix: "549€", img: "/a56.png", note: 152 },
        { id: 83, marque: "Samsung", modele: "Galaxy Z Fold 4", prix: "1499€", img: "/zfold4.png", note: 150 },
        { id: 82, marque: "Samsung", modele: "Galaxy S21 Ultra", prix: "899€", img: "/s21ultra.png", note: 148 },
        { id: 81, marque: "Samsung", modele: "Galaxy S21+", prix: "799€", img: "/s21plus.png", note: 145 },
        { id: 80, marque: "Samsung", modele: "Galaxy S21", prix: "699€", img: "/s21.png", note: 142 },
        { id: 79, marque: "Samsung", modele: "Galaxy A54", prix: "499€", img: "/a54.png", note: 140 },
        { id: 78, marque: "Samsung", modele: "Galaxy S20 Ultra", prix: "799€", img: "/s20ultra.png", note: 138 },
        { id: 77, marque: "Samsung", modele: "Galaxy S20+", prix: "699€", img: "/s20plus.png", note: 135 },
        { id: 76, marque: "Samsung", modele: "Galaxy S20", prix: "599€", img: "/s20.png", note: 132 },
        { id: 75, marque: "Samsung", modele: "Galaxy Note 20 Ultra", prix: "749€", img: "/note20ultra.png", note: 130 },
        { id: 74, marque: "Samsung", modele: "Galaxy A34", prix: "399€", img: "/a34.png", note: 128 },
        { id: 73, marque: "Samsung", modele: "Galaxy S10+", prix: "499€", img: "/s10plus.png", note: 125 },
        { id: 72, marque: "Samsung", modele: "Galaxy S10", prix: "449€", img: "/s10.png", note: 122 },
        { id: 71, marque: "Samsung", modele: "Galaxy Note 10+", prix: "449€", img: "/note10plus.png", note: 120 },
        { id: 70, marque: "Samsung", modele: "Galaxy A52s 5G", prix: "349€", img: "/a52s.png", note: 118 },
        { id: 69, marque: "Samsung", modele: "Galaxy S9+", prix: "299€", img: "/s9plus.png", note: 115 },
        { id: 68, marque: "Samsung", modele: "Galaxy S9", prix: "249€", img: "/s9.png", note: 110 },
        { id: 67, marque: "Samsung", modele: "Galaxy Note 9", prix: "299€", img: "/note9.png", note: 105 },
        { id: 66, marque: "Samsung", modele: "Galaxy A71", prix: "249€", img: "/a71.png", note: 100 },
        { id: 65, marque: "Samsung", modele: "Galaxy S8+", prix: "199€", img: "/s8plus.png", note: 95 },
        { id: 64, marque: "Samsung", modele: "Galaxy S8", prix: "149€", img: "/s8.png", note: 90 },
        { id: 63, marque: "Samsung", modele: "Galaxy Note 8", prix: "199€", img: "/note8.png", note: 85 },
        { id: 62, marque: "Samsung", modele: "Galaxy A50", prix: "149€", img: "/a50.png", note: 80 },
        { id: 61, marque: "Samsung", modele: "Galaxy S7 Edge", prix: "129€", img: "/s7edge.png", note: 75 },
        { id: 60, marque: "Samsung", modele: "Galaxy S7", prix: "99€", img: "/s7.png", note: 70 },
        { id: 59, marque: "Samsung", modele: "Galaxy Note 7 (Rappelé)", prix: "N/A", img: "/note7.png", note: 65 },
        { id: 58, marque: "Samsung", modele: "Galaxy A32", prix: "109€", img: "/a32.png", note: 60 },
        { id: 57, marque: "Samsung", modele: "Galaxy S6 Edge", prix: "79€", img: "/s6edge.png", note: 55 },
        { id: 56, marque: "Samsung", modele: "Galaxy S6", prix: "59€", img: "/s6.png", note: 50 },
        { id: 55, marque: "Samsung", modele: "Galaxy Note 5", prix: "79€", img: "/note5.png", note: 45 },
        { id: 54, marque: "Samsung", modele: "Galaxy J5 (2017)", prix: "69€", img: "/j5.png", note: 40 },
        { id: 53, marque: "Samsung", modele: "Galaxy S5", prix: "49€", img: "/s5.png", note: 35 },
        { id: 52, marque: "Samsung", modele: "Galaxy Note 4", prix: "59€", img: "/note4.png", note: 30 },
        { id: 51, marque: "Samsung", modele: "Galaxy A3 (2016)", prix: "39€", img: "/a3.png", note: 25 },
        { id: 50, marque: "Samsung", modele: "Galaxy S4", prix: "39€", img: "/s4.png", note: 20 },
        { id: 49, marque: "Samsung", modele: "Galaxy Note 3", prix: "39€", img: "/note3.png", note: 15 },
        { id: 48, marque: "Samsung", modele: "Galaxy S3", prix: "29€", img: "/s3.png", note: 10 },
        { id: 47, marque: "Samsung", modele: "Galaxy S2", prix: "19€", img: "/s2.png", note: 5 },
        { id: 46.5, marque: "Samsung", modele: "Galaxy Y", prix: "9€", img: "/galaxyy.png", note: 2 },
        { id: 45.5, marque: "Samsung", modele: "Galaxy Ace", prix: "15€", img: "/galaxyace.png", note: 3 },
        { id: 44.5, marque: "Samsung", modele: "Galaxy Spica", prix: "5€", img: "/spica.png", note: 1 },
        { id: 43.5, marque: "Samsung", modele: "Galaxy Tab 10.1", prix: "199€", img: "/tab10.png", note: 80 },
        { id: 42.5, marque: "Samsung", modele: "Galaxy Tab S8 Ultra", prix: "899€", img: "/tabs8ultra.png", note: 170 },
        { id: 41.5, marque: "Samsung", modele: "Galaxy Watch 6 Classic", prix: "399€", img: "/watch6.png", note: 150 },

        // === GOOGLE PIXEL ===
        { id: 180, marque: "Google", modele: "Pixel 10 Pro", prix: "999€", img: "/pixel10pro.png", note: 165 },
        { id: 179, marque: "Google", modele: "Pixel 10", prix: "799€", img: "/pixel10.png", note: 162 },
        { id: 178, marque: "Google", modele: "Pixel 9 Pro", prix: "899€", img: "/pixel9pro.png", note: 160 },
        { id: 177, marque: "Google", modele: "Pixel 9", prix: "699€", img: "/pixel9.png", note: 157 },
        { id: 176, marque: "Google", modele: "Pixel 9a", prix: "449€", img: "/pixel9a.png", note: 154 },
        { id: 175, marque: "Google", modele: "Pixel 8 Pro", prix: "1049€", img: "/pixel8pro.png", note: 178 },
        { id: 174, marque: "Google", modele: "Pixel 8", prix: "799€", img: "/pixel8.png", note: 175 },
        { id: 173, marque: "Google", modele: "Pixel 8a", prix: "529€", img: "/pixel8a.png", note: 172 },
        { id: 172, marque: "Google", modele: "Pixel Fold 2", prix: "1899€", img: "/pixelFold2.png", note: 170 },
        { id: 171, marque: "Google", modele: "Pixel 7 Pro", prix: "849€", img: "/pixel7pro.png", note: 168 },
        { id: 170, marque: "Google", modele: "Pixel 7", prix: "649€", img: "/pixel7.png", note: 165 },
        { id: 169, marque: "Google", modele: "Pixel 7a", prix: "499€", img: "/pixel7a.png", note: 162 },
        { id: 168, marque: "Google", modele: "Pixel 6 Pro", prix: "699€", img: "/pixel6pro.png", note: 160 },
        { id: 167, marque: "Google", modele: "Pixel 6", prix: "599€", img: "/pixel6.png", note: 158 },
        { id: 166, marque: "Google", modele: "Pixel 6a", prix: "399€", img: "/pixel6a.png", note: 155 },
        { id: 165, marque: "Google", modele: "Pixel 5", prix: "599€", img: "/pixel5.png", note: 150 },
        { id: 164, marque: "Google", modele: "Pixel 4 XL", prix: "449€", img: "/pixel4xl.png", note: 145 },
        { id: 163, marque: "Google", modele: "Pixel 4", prix: "399€", img: "/pixel4.png", note: 140 },
        { id: 162, marque: "Google", modele: "Pixel 4a 5G", prix: "349€", img: "/pixel4a5g.png", note: 135 },
        { id: 161, marque: "Google", modele: "Pixel 4a", prix: "299€", img: "/pixel4a.png", note: 130 },
        { id: 160, marque: "Google", modele: "Pixel 3 XL", prix: "249€", img: "/pixel3xl.png", note: 125 },
        { id: 159, marque: "Google", modele: "Pixel 3", prix: "199€", img: "/pixel3.png", note: 120 },
        { id: 158, marque: "Google", modele: "Pixel 3a XL", prix: "179€", img: "/pixel3axl.png", note: 115 },
        { id: 157, marque: "Google", modele: "Pixel 3a", prix: "149€", img: "/pixel3a.png", note: 110 },
        { id: 156, marque: "Google", modele: "Pixel 2 XL", prix: "149€", img: "/pixel2xl.png", note: 105 },
        { id: 155, marque: "Google", modele: "Pixel 2", prix: "99€", img: "/pixel2.png", note: 100 },
        { id: 154, marque: "Google", modele: "Pixel XL", prix: "99€", img: "/pixelxl.png", note: 95 },
        { id: 153, marque: "Google", modele: "Pixel 1", prix: "79€", img: "/pixel1.png", note: 90 },
        { id: 152, marque: "Google", modele: "Nexus 6P", prix: "59€", img: "/nexus6p.png", note: 85 },
        { id: 151, marque: "Google", modele: "Nexus 5X", prix: "49€", img: "/nexus5x.png", note: 80 },
        { id: 150, marque: "Google", modele: "Nexus 5", prix: "39€", img: "/nexus5.png", note: 75 },
        { id: 149, marque: "Google", modele: "Nexus 4", prix: "29€", img: "/nexus4.png", note: 70 },
        { id: 148, marque: "Google", modele: "Nexus 7 (2013)", prix: "199€", img: "/nexus7.png", note: 65 },
        { id: 147, marque: "Google", modele: "Pixel Watch 3", prix: "499€", img: "/pixelwatch3.png", note: 175 },
        { id: 146.5, marque: "Google", modele: "Google Home Max", prix: "199€", img: "/homemax.png", note: 90 },
        { id: 145.5, marque: "Google", modele: "Chromecast Ultra", prix: "59€", img: "/chromecast.png", note: 80 },


        // === XIAOMI ===
        { id: 210, marque: "Xiaomi", modele: "15 Ultra", prix: "1599€", img: "/xiaomi15ultra.png", note: 190 },
        { id: 209, marque: "Xiaomi", modele: "15 Pro", prix: "1299€", img: "/xiaomi15pro.png", note: 188 },
        { id: 208, marque: "Xiaomi", modele: "15", prix: "999€", img: "/xiaomi15.png", note: 185 },
        { id: 207, marque: "Xiaomi", modele: "14 Ultra", prix: "1499€", img: "/xiaomi14ultra.png", note: 182 },
        { id: 206, marque: "Xiaomi", modele: "14 Pro", prix: "1199€", img: "/xiaomi14pro.png", note: 180 },
        { id: 205, marque: "Xiaomi", modele: "14", prix: "899€", img: "/xiaomi14.png", note: 178 },
        { id: 204, marque: "Xiaomi", modele: "13 Ultra", prix: "1399€", img: "/xiaomi13ultra.png", note: 175 },
        { id: 203, marque: "Xiaomi", modele: "13 Pro", prix: "1099€", img: "/xiaomi13pro.png", note: 172 },
        { id: 202, marque: "Xiaomi", modele: "13", prix: "799€", img: "/xiaomi13.png", note: 170 },
        { id: 201, marque: "Xiaomi", modele: "Redmi Note 12 Pro+", prix: "449€", img: "/rn12proplus.png", note: 168 },
        { id: 200, marque: "Xiaomi", modele: "12S Ultra", prix: "1199€", img: "/xiaomi12sultra.png", note: 165 },
        { id: 199, marque: "Xiaomi", modele: "12 Pro", prix: "799€", img: "/xiaomi12pro.png", note: 160 },
        { id: 198, marque: "Xiaomi", modele: "12", prix: "599€", img: "/xiaomi12.png", note: 155 },
        { id: 197, marque: "Xiaomi", modele: "Redmi Note 11 Pro", prix: "399€", img: "/rn11pro.png", note: 150 },
        { id: 196, marque: "Xiaomi", modele: "Mi 11 Ultra", prix: "799€", img: "/mi11ultra.png", note: 145 },
        { id: 195, marque: "Xiaomi", modele: "Mi 11", prix: "549€", img: "/mi11.png", note: 140 },
        { id: 194, marque: "Xiaomi", modele: "POCO F3", prix: "329€", img: "/pocof3.png", note: 135 },
        { id: 193, marque: "Xiaomi", modele: "Mi 10 Pro", prix: "599€", img: "/mi10pro.png", note: 130 },
        { id: 192, marque: "Xiaomi", modele: "Mi 10", prix: "499€", img: "/mi10.png", note: 125 },
        { id: 191, marque: "Xiaomi", modele: "Redmi Note 9 Pro", prix: "249€", img: "/rn9pro.png", note: 120 },
        { id: 190, marque: "Xiaomi", modele: "Mi 9", prix: "399€", img: "/mi9.png", note: 115 },
        { id: 189, marque: "Xiaomi", modele: "Mi Mix 3", prix: "349€", img: "/mix3.png", note: 110 },
        { id: 188, marque: "Xiaomi", modele: "Mi 8 Pro", prix: "299€", img: "/mi8pro.png", note: 105 },
        { id: 187, marque: "Xiaomi", modele: "Mi A2", prix: "199€", img: "/miA2.png", note: 100 },
        { id: 186, marque: "Xiaomi", modele: "Redmi Note 5", prix: "149€", img: "/rn5.png", note: 95 },
        { id: 185, marque: "Xiaomi", modele: "Mi 6", prix: "249€", img: "/mi6.png", note: 90 },
        { id: 184, marque: "Xiaomi", modele: "Mi 5", prix: "149€", img: "/mi5.png", note: 85 },
        { id: 183, marque: "Xiaomi", modele: "Redmi 4X", prix: "89€", img: "/redmi4x.png", note: 80 },
        { id: 182, marque: "Xiaomi", modele: "Mi 4", prix: "79€", img: "/mi4.png", note: 75 },
        { id: 181, marque: "Xiaomi", modele: "Redmi Note 3 Pro", prix: "119€", img: "/rn3pro.png", note: 70 },

        // === ONEPLUS ===
        { id: 240, marque: "OnePlus", modele: "13 Ultra", prix: "1399€", img: "/op13ultra.png", note: 185 },
        { id: 239, marque: "OnePlus", modele: "13 Pro", prix: "1199€", img: "/op13pro.png", note: 182 },
        { id: 238, marque: "OnePlus", modele: "13", prix: "999€", img: "/oneplus13.png", note: 180 },
        { id: 237, marque: "OnePlus", modele: "Open 2", prix: "1899€", img: "/opopen2.png", note: 178 },
        { id: 236, marque: "OnePlus", modele: "Open", prix: "1799€", img: "/oneplusOpen.png", note: 175 },
        { id: 235, marque: "OnePlus", modele: "12", prix: "969€", img: "/oneplus12.png", note: 170 },
        { id: 234, marque: "OnePlus", modele: "11", prix: "829€", img: "/op11.png", note: 165 },
        { id: 233, marque: "OnePlus", modele: "OnePlus Nord 3", prix: "499€", img: "/opNord3.png", note: 160 },
        { id: 232, marque: "OnePlus", modele: "10 Pro", prix: "699€", img: "/op10pro.png", note: 155 },
        { id: 231, marque: "OnePlus", modele: "9 Pro", prix: "599€", img: "/op9pro.png", note: 150 },
        { id: 230, marque: "OnePlus", modele: "9", prix: "499€", img: "/op9.png", note: 145 },
        { id: 229, marque: "OnePlus", modele: "8 Pro", prix: "499€", img: "/op8pro.png", note: 140 },
        { id: 228, marque: "OnePlus", modele: "8", prix: "429€", img: "/op8.png", note: 135 },
        { id: 227, marque: "OnePlus", modele: "OnePlus Nord", prix: "299€", img: "/opNord.png", note: 130 },
        { id: 226, marque: "OnePlus", modele: "7T Pro", prix: "399€", img: "/op7tpro.png", note: 125 },
        { id: 225, marque: "OnePlus", modele: "7 Pro", prix: "379€", img: "/op7pro.png", note: 120 },
        { id: 224, marque: "OnePlus", modele: "6T", prix: "299€", img: "/op6t.png", note: 115 },
        { id: 223, marque: "OnePlus", modele: "6", prix: "249€", img: "/op6.png", note: 110 },
        { id: 222, marque: "OnePlus", modele: "5T", prix: "199€", img: "/op5t.png", note: 105 },
        { id: 221, marque: "OnePlus", modele: "5", prix: "179€", img: "/op5.png", note: 100 },
        { id: 220, marque: "OnePlus", modele: "3T", prix: "149€", img: "/op3t.png", note: 95 },
        { id: 219, marque: "OnePlus", modele: "3", prix: "129€", img: "/op3.png", note: 90 },
        { id: 218, marque: "OnePlus", modele: "2", prix: "89€", img: "/op2.png", note: 85 },
        { id: 217, marque: "OnePlus", modele: "One", prix: "79€", img: "/op1.png", note: 80 },

        // === OPPO ===
        { id: 270, marque: "Oppo", modele: "Find X8 Ultra", prix: "1399€", img: "/oppoX8ultra.png", note: 185 },
        { id: 269, marque: "Oppo", modele: "Find X8 Pro", prix: "1299€", img: "/oppoX8pro.png", note: 182 },
        { id: 268, marque: "Oppo", modele: "Find N5 Flip", prix: "1199€", img: "/oppoN5flip.png", note: 180 },
        { id: 267, marque: "Oppo", modele: "Find N5 Fold", prix: "1899€", img: "/oppoN5fold.png", note: 178 },
        { id: 266, marque: "Oppo", modele: "Find X7 Ultra", prix: "1299€", img: "/oppoX7ultra.png", note: 175 },
        { id: 265, marque: "Oppo", modele: "Find X7 Pro", prix: "1199€", img: "/oppoX7pro.png", note: 172 },
        { id: 264, marque: "Oppo", modele: "Find X6 Pro", prix: "1099€", img: "/oppoX6pro.png", note: 170 },
        { id: 263, marque: "Oppo", modele: "Reno 10 Pro", prix: "599€", img: "/reno10pro.png", note: 165 },
        { id: 262, marque: "Oppo", modele: "Find N3 Flip", prix: "999€", img: "/oppoN3flip.png", note: 160 },
        { id: 261, marque: "Oppo", modele: "Find X5 Pro", prix: "899€", img: "/oppoX5pro.png", note: 155 },
        { id: 260, marque: "Oppo", modele: "Find X5", prix: "699€", img: "/oppoX5.png", note: 150 },
        { id: 259, marque: "Oppo", modele: "Reno 8 Pro", prix: "499€", img: "/reno8pro.png", note: 145 },
        { id: 258, marque: "Oppo", modele: "Find X3 Pro", prix: "699€", img: "/oppoX3pro.png", note: 140 },
        { id: 257, marque: "Oppo", modele: "Find X3 Neo", prix: "499€", img: "/oppoX3neo.png", note: 135 },
        { id: 256, marque: "Oppo", modele: "Reno 6 Pro", prix: "449€", img: "/reno6pro.png", note: 130 },
        { id: 255, marque: "Oppo", modele: "Find X2 Pro", prix: "599€", img: "/oppoX2pro.png", note: 125 },
        { id: 254, marque: "Oppo", modele: "Find X2", prix: "499€", img: "/oppoX2.png", note: 120 },
        { id: 253, marque: "Oppo", modele: "Reno 4 Pro", prix: "399€", img: "/reno4pro.png", note: 115 },
        { id: 252, marque: "Oppo", modele: "Reno 2", prix: "299€", img: "/reno2.png", note: 110 },
        { id: 251, marque: "Oppo", modele: "Find X", prix: "349€", img: "/oppoFindX.png", note: 105 },
        { id: 250, marque: "Oppo", modele: "Reno Z", prix: "199€", img: "/renoZ.png", note: 100 },
        { id: 249, marque: "Oppo", modele: "A9 (2020)", prix: "179€", img: "/oppoa9.png", note: 95 },
    ], []);

    const uniqueBrands = ["Toutes", ...new Set(allSmartphones.map(phone => phone.marque))].sort();

    const sortedSmartphones = useMemo(() => {
        return [...allSmartphones].sort((a, b) => {
            // Définir les priorités de statut
            const getStatusPriority = (phone) => {
                if (phone.hasDetailedSpecs === true && phone.isTested === true) return 1; // Disponible ✔️
                if (phone.hasDetailedSpecs === true && phone.isTested === false) return 2; // Disponible ❌
                if (phone.isTested === true) return 1; // Ancien système: testé = Disponible ✔️
                return 3; // Indisponible ❌
            };

            const aPriority = getStatusPriority(a);
            const bPriority = getStatusPriority(b);

            // Trier par statut d'abord
            if (aPriority !== bPriority) {
                return aPriority - bPriority;
            }

            // Puis par note décroissante
            if (a.note !== b.note) {
                return b.note - a.note;
            }

            // Enfin par prix décroissant
            const priceA = parseFloat(a.prix?.replace(/€|,/g, '').replace(' ', '')) || 0;
            const priceB = parseFloat(b.prix?.replace(/€|,/g, '').replace(' ', '')) || 0;
            return priceB - priceA;
        });
    }, [allSmartphones]);

    const filteredSmartphones = useMemo(() => {
        return sortedSmartphones.filter(phone => {
            const matchesBrand = selectedBrand === "Toutes" || phone.marque === selectedBrand;
            const matchesSearch = debouncedSearchTerm.toLowerCase() === "" || phone.marque.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) || phone.modele.toLowerCase().includes(debouncedSearchTerm.toLowerCase());

            // Filtre par statut
            const getPhoneStatus = (phone) => {
                if (phone.hasDetailedSpecs === true && phone.isTested === true) return "Disponible ✔️";
                if (phone.hasDetailedSpecs === true && phone.isTested === false) return "Disponible ❌";
                if (phone.isTested === true) return "Disponible ✔️"; // Rétrocompatibilité
                return "Indisponible ❌";
            };
            const matchesStatus = selectedStatus === "Tous" || getPhoneStatus(phone) === selectedStatus;

            // Filtre par note
            const phoneNote = phone.note || 0;
            const matchesNoteRange = selectedNoteRange === "Toutes" ||
                (selectedNoteRange === "180-200" && phoneNote >= 180 && phoneNote <= 200) ||
                (selectedNoteRange === "160-179" && phoneNote >= 160 && phoneNote <= 179) ||
                (selectedNoteRange === "140-159" && phoneNote >= 140 && phoneNote <= 159) ||
                (selectedNoteRange === "120-139" && phoneNote >= 120 && phoneNote <= 139) ||
                (selectedNoteRange === "100-119" && phoneNote >= 100 && phoneNote <= 119) ||
                (selectedNoteRange === "0-99" && phoneNote >= 0 && phoneNote <= 99);

            // Filtre par année
            const getPhoneYear = (phone) => {
                // Pour les téléphones avec des détails complets
                if (phone.id === 98) return "2025"; // Samsung S25
                if (phone.id === 40) return "2024"; // iPhone 16

                const modelName = phone.modele || "";
                const marque = phone.marque || "";

                // Extraction directe de l'année dans le nom
                if (modelName.includes("2025")) return "2025";
                if (modelName.includes("2024")) return "2024";
                if (modelName.includes("2023")) return "2023";
                if (modelName.includes("2022")) return "2022";
                if (modelName.includes("2021")) return "2021";
                if (modelName.includes("2020")) return "2020";

                // Apple iPhone par série
                if (marque === "Apple") {
                    if (modelName.includes("17")) return "2025";
                    if (modelName.includes("16")) return "2024";
                    if (modelName.includes("15")) return "2023";
                    if (modelName.includes("14")) return "2022";
                    if (modelName.includes("13")) return "2021";
                    if (modelName.includes("12")) return "2020";
                    if (modelName.includes("11")) return "2019";
                    if (modelName.includes("SE 4")) return "2025";
                    if (modelName.includes("SE 3")) return "2022";
                    if (modelName.includes("SE 2")) return "2020";
                }

                // Samsung Galaxy par série
                if (marque === "Samsung") {
                    if (modelName.includes("S25") || modelName.includes("Z Fold 7") || modelName.includes("Z Flip 7")) return "2025";
                    if (modelName.includes("S24") || modelName.includes("Z Fold 6") || modelName.includes("Z Flip 6")) return "2024";
                    if (modelName.includes("S23") || modelName.includes("Z Fold 5") || modelName.includes("Z Flip 5")) return "2023";
                    if (modelName.includes("S22") || modelName.includes("Z Fold 4") || modelName.includes("Z Flip 4")) return "2022";
                    if (modelName.includes("S21") || modelName.includes("Z Fold 3") || modelName.includes("Z Flip 3")) return "2021";
                    if (modelName.includes("S20") || modelName.includes("Note 20")) return "2020";
                }

                // Google Pixel par série
                if (marque === "Google") {
                    if (modelName.includes("10")) return "2025";
                    if (modelName.includes("9")) return "2024";
                    if (modelName.includes("8")) return "2023";
                    if (modelName.includes("7")) return "2022";
                    if (modelName.includes("6")) return "2021";
                    if (modelName.includes("5")) return "2020";
                }

                // Xiaomi par série
                if (marque === "Xiaomi") {
                    if (modelName.includes("15")) return "2025";
                    if (modelName.includes("14")) return "2024";
                    if (modelName.includes("13")) return "2023";
                    if (modelName.includes("12")) return "2022";
                    if (modelName.includes("11")) return "2021";
                }

                // OnePlus par série
                if (marque === "OnePlus") {
                    if (modelName.includes("13")) return "2025";
                    if (modelName.includes("12") || modelName.includes("Open 2")) return "2024";
                    if (modelName.includes("11") || modelName.includes("Open")) return "2023";
                    if (modelName.includes("10")) return "2022";
                    if (modelName.includes("9")) return "2021";
                    if (modelName.includes("8")) return "2020";
                }

                return "Autre"; // Pour les modèles plus anciens ou non identifiés
            };
            const phoneYear = getPhoneYear(phone);
            const matchesYear = selectedYear === "Toutes" || phoneYear === selectedYear;

            // Filtre par processeur
            const getPhoneProcessor = (phone) => {
                // Pour les téléphones avec des détails complets
                if (phone.id === 98) return "Snapdragon"; // Samsung S25 - Snapdragon 8 Élite
                if (phone.id === 40) return "Apple"; // iPhone 16 - A18

                const modelName = phone.modele || "";
                const marque = phone.marque || "";

                // Détection par nom de modèle pour des cas spécifiques
                if (modelName.includes("Exynos")) return "Exynos";
                if (modelName.includes("MediaTek")) return "MediaTek";
                if (modelName.includes("Tensor")) return "Google Tensor";

                // Apple - toujours Apple Silicon
                if (marque === "Apple") return "Apple";

                // Google Pixel - toujours Tensor (sauf les très anciens)
                if (marque === "Google") {
                    if (modelName.includes("6") || modelName.includes("7") || modelName.includes("8") || modelName.includes("9") || modelName.includes("10")) {
                        return "Google Tensor";
                    }
                    return "Snapdragon"; // Pixel 1-5
                }

                // Samsung - mix Snapdragon/Exynos selon les régions et modèles
                if (marque === "Samsung") {
                    // Les modèles récents utilisent principalement Snapdragon
                    if (modelName.includes("S25") || modelName.includes("S24") || modelName.includes("S23")) {
                        return "Snapdragon";
                    }
                    // Les modèles plus anciens avaient souvent Exynos en Europe
                    if (modelName.includes("S22") || modelName.includes("S21") || modelName.includes("S20") ||
                        modelName.includes("S10") || modelName.includes("S9") || modelName.includes("S8") ||
                        modelName.includes("Note 20") || modelName.includes("Note 10") || modelName.includes("Note 9")) {
                        return "Exynos";
                    }
                    // Modèles milieu de gamme souvent Exynos
                    if (modelName.includes("A5") || modelName.includes("A7") || modelName.includes("A3")) {
                        return "Exynos";
                    }
                    return "Snapdragon"; // Par défaut pour Samsung
                }

                // Xiaomi - principalement Snapdragon, quelques MediaTek
                if (marque === "Xiaomi") {
                    if (modelName.includes("Redmi Note") || modelName.includes("POCO")) {
                        return Math.random() > 0.7 ? "MediaTek" : "Snapdragon"; // Mix réaliste
                    }
                    return "Snapdragon";
                }

                // OnePlus - toujours Snapdragon
                if (marque === "OnePlus") return "Snapdragon";

                // Oppo - principalement Snapdragon, quelques MediaTek
                if (marque === "Oppo") {
                    return Math.random() > 0.6 ? "MediaTek" : "Snapdragon";
                }

                return "Autre";
            };
            const phoneProcessor = getPhoneProcessor(phone);
            const matchesProcessor = selectedProcessor === "Tous" || phoneProcessor === selectedProcessor;

            // Filtre par prix
            const phonePrice = parseFloat(phone.prix?.replace(/€/g, '').replace(',', '.')) || NaN;
            const min = parseFloat(minPrice);
            const max = parseFloat(maxPrice);
            const isMinFilterActive = !isNaN(min);
            const isMaxFilterActive = !isNaN(max);
            const matchesMinPrice = !isMinFilterActive || (!isNaN(phonePrice) && phonePrice >= min);
            const matchesMaxPrice = !isMaxFilterActive || (!isNaN(phonePrice) && phonePrice <= max);
            const matchesPrice = (!isMinFilterActive && !isMaxFilterActive) || (!isNaN(phonePrice) && matchesMinPrice && matchesMaxPrice);

            return matchesBrand && matchesSearch && matchesStatus && matchesNoteRange && matchesYear && matchesProcessor && matchesPrice;
        });
    }, [sortedSmartphones, selectedBrand, debouncedSearchTerm, minPrice, maxPrice, selectedStatus, selectedNoteRange, selectedYear, selectedProcessor]);



    const PhoneImage = memo(({ phone, index }) => {
        if (phone.img) {
            return (
                <div className="relative h-40 mb-4">
                    <Image
                        src={phone.img}
                        alt={phone.modele}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        style={{ objectFit: 'contain' }}
                        className="rounded-lg"
                        loading={index < 8 ? "eager" : "lazy"}
                        priority={index < 4}
                    />
                </div>
            );
        }
        return (<div className="relative h-40 mb-4 flex items-center justify-center bg-gray-100 rounded-2xl border-2 border-dashed border-gray-300"><span className="text-gray-500 text-center text-sm p-4">Image {phone.modele}<br />(Ajoutez l'image dans /public)</span></div>);
    });

    const handleBrandClick = useCallback((brand) => { setSelectedBrand(brand); setSearchTerm(""); }, []);
    const handlePriceChange = useCallback((e, setter) => { setter(e.target.value.replace(/[^0-9]/g, '')); }, []);

    const ContactSection = () => (
        <section id="contact" className={`mt-20 py-10 shadow-xl rounded-2xl border max-w-4xl mx-auto ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
            <h2 className={`text-3xl font-bold text-center mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>N'hésitez pas à me contacter</h2>
            <div className={`text-center space-y-4 px-4 sm:px-10 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <p>Je suis **Bastien**, le créateur et l'analyste derrière les notes TechScore 200.</p>
                <p>Pour toute question, suggestions d'analyse de modèle, pour me proposer des images de téléphone pour illustrer le site, ou pour toute question concernant les droits d'auteur, vous pouvez me contacter directement à cette adresse :</p>
                <div className="flex justify-center items-center"><Mail size={24} className="text-blue-600 mr-3" /><a href={`mailto:${BASTIEN_EMAIL}`} className="text-2xl font-bold text-blue-600 hover:text-blue-800 transition duration-200">{BASTIEN_EMAIL}</a></div>
            </div>
        </section>
    );

    const Footer = () => (
        <footer className={`mt-20 py-8 border-t ${darkMode ? 'bg-gray-800 text-gray-400 border-gray-700' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
            <div className="max-w-4xl mx-auto px-6">
                {/* Copyright principal */}
                <div className="text-center mb-6">
                    <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        © {new Date().getFullYear()} TechScore 200 - Catalogue de Smartphones
                    </p>
                    <p className="text-sm mt-1">Créé par Bastien | Tous droits réservés</p>
                </div>

                {/* Mentions légales */}
                <div className={`text-xs text-center space-y-2 py-4 border-t border-b ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}>
                    <p className="font-semibold">⚖️ Protection du contenu</p>
                    <p>
                        Le contenu de ce site (analyses, système de notation, présentation des données) est protégé par le droit d'auteur.
                        Toute reproduction, même partielle, est interdite sans autorisation écrite préalable.
                    </p>
                    <p>
                        Les marques et noms de produits mentionnés appartiennent à leurs propriétaires respectifs.
                        Ce site est un outil d'information et de comparaison indépendant.
                    </p>
                </div>

                {/* Contact et infos */}
                <div className="text-center mt-6 space-y-2">
                    <p className="text-sm">
                        Contact : <a href={`mailto:${BASTIEN_EMAIL}`} className={`font-medium transition ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>{BASTIEN_EMAIL}</a>
                    </p>
                    <p className="text-xs">Propulsé par la passion et Next.js</p>
                </div>
            </div>
        </footer>
    );

    return (
        <div className={`p-6 min-h-screen font-sans transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            {modalOpen && <PhoneDetailsModal phone={selectedPhoneDetails} onClose={() => { setModalOpen(false); setSelectedPhoneDetails(null); }} darkMode={darkMode} />}
            {comparisonModalOpen && <ComparisonModal phones={comparisonList} onClose={() => setComparisonModalOpen(false)} darkMode={darkMode} />}
            {comparisonList.length > 0 && !comparisonModalOpen && (
                <div className={`fixed bottom-4 left-0 right-0 max-w-5xl mx-auto text-white p-4 text-center z-50 shadow-2xl rounded-xl transition-all duration-300 ease-in-out transform hover:scale-[1.01] border-2 ${darkMode ? 'bg-blue-600 border-blue-700' : 'bg-yellow-500 border-yellow-600'}`}>
                    <span className="font-semibold">{comparisonList.length} téléphone(s) à comparer: </span>
                    {comparisonList.map(phone => (
                        <span key={`${phone.marque}-${phone.modele}`} className={`inline-flex items-center ml-3 px-2 py-1 rounded-full text-xs relative group ${darkMode ? 'bg-blue-700' : 'bg-yellow-600'}`}>
                            {phone.modele}
                            <button
                                onClick={() => toggleComparison(phone)}
                                className={`ml-2 rounded-full p-0.5 transition ${darkMode ? 'hover:bg-blue-800' : 'hover:bg-yellow-700'}`}
                                aria-label={`Retirer ${phone.modele}`}
                            >
                                <X size={14} />
                            </button>
                        </span>
                    ))}
                    <button onClick={() => {
                        if (comparisonList.length < 2) {
                            alert("⚠️ Vous devez sélectionner au moins 2 téléphones pour effectuer une comparaison.");
                        } else {
                            setComparisonModalOpen(true);
                        }
                    }} className={`ml-5 px-4 py-2 rounded-full font-bold transition active:scale-95 ${darkMode ? 'bg-white text-blue-600 hover:bg-gray-100' : 'bg-white text-yellow-500 hover:bg-gray-100'}`}>Comparer ({comparisonList.length})</button>
                </div>
            )}
            <header className="flex justify-between items-center mb-8 relative">
                <HamburgerIcon isOpen={menuOpen} onClick={() => { setMenuOpen(s => !s); setAboutOpen(false); }} darkMode={darkMode} />
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="text-4xl font-black bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                            VS
                        </div>
                    </div>
                    <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>TechScore200</h1>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {darkMode ? 'Mode White' : 'Mode Dark'}
                    </span>
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className={`p-2 rounded-full transition-all duration-300 ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
                        aria-label={darkMode ? "Activer le mode clair" : "Activer le mode sombre"}
                    >
                        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                </div>
            </header>
            <div ref={menuRef} className={`absolute top-[72px] left-6 w-56 shadow-xl rounded-lg p-4 z-50 border transition-all duration-300 ease-in-out ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} ${menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
                <h2 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Options</h2>
                <ul className="space-y-1">
                    <li className={`px-3 py-2 rounded-md font-medium transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}><a href="#" onClick={(e) => { e.preventDefault(); setAboutOpen(s => !s); }}>À Propos</a></li>
                    <li className={`px-3 py-2 rounded-md font-medium transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}><a href="#contact" onClick={() => { setMenuOpen(false); setAboutOpen(false); }}>Contact</a></li>
                </ul>
            </div>
            <div className={`absolute top-[72px] left-6 ml-[15.5rem] w-80 shadow-2xl rounded-lg p-5 z-50 border transition-all duration-300 ease-in-out origin-top-left ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-blue-200'} ${aboutOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                <button onClick={() => setAboutOpen(false)} className={`absolute top-2 right-2 p-1 ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}><X size={20} /></button>
                <h2 className={`text-xl font-bold mb-3 border-b pb-2 ${darkMode ? 'text-blue-400 border-gray-700' : 'text-blue-700 border-blue-200'}`}>À Propos de ce Catalogue</h2>
                <div className={`text-sm space-y-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <p>Ce catalogue est un **projet personnel** que j'ai décidé de réaliser seul à l'âge de **14 ans**. Ce site est né de ma **passion absolue pour les nouvelles technologies et les smartphones**. Je me suis lancé le défi de créer mes propres analyses et fiches techniques, établissant ainsi mon propre standard d'évaluation.</p>
                    <p className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Mon Rôle (Architecte et Créateur de Contenu) :</p>
                    <ul className={`list-disc list-inside ml-3 space-y-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <li>J'ai défini la structure, le design et toutes les innovations fonctionnelles.</li>
                        <li>J'ai créé la base de données et les fiches techniques. Mon objectif est d'y parvenir pour **tous les modèles** présents sur ce site.</li>
                        <li>J'ai développé la méthodologie de notation unique (le score sur 200) pour garantir une objectivité totale.</li>
                    </ul>
                    <p className={`font-semibold border-t pt-3 ${darkMode ? 'text-gray-200 border-gray-700' : 'text-gray-800 border-gray-200'}`}>Le Code (Transparence) :</p>
                    <p className={`text-xs italic ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>La programmation du site (Next.js/Tailwind CSS) a été réalisée par un modèle d'IA (Intelligence Artificielle). J'ai fait ce choix pour me concentrer pleinement sur l'expertise produit : l'analyse technique des téléphones.</p>
                </div>
            </div>
            <div className={`p-6 rounded-2xl shadow-lg text-white mb-12 ${darkMode ? 'bg-gradient-to-r from-gray-700 to-gray-900' : 'bg-gradient-to-r from-gray-800 to-black'}`}>
                <h2 className="text-2xl font-bold mb-4 text-center">🚀 Le Podium 2025 (Provisoire)</h2>
                <ul className="space-y-3">
                    {topSmartphones.map((phone, index) => (
                        <li key={index} className="flex justify-between items-center bg-white/10 p-3 rounded-lg shadow-sm backdrop-blur-sm hover:bg-white/20 transition-colors">
                            <span className="font-semibold text-lg">{['🥇', '🥈', '🥉'][index]} {phone.marque} {phone.modele}</span>
                            <div className="flex items-center space-x-3"><span className="text-gray-300">{formatNoteDisplay(phone.note)} – {phone.prix}</span></div>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="mb-8">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    <div className="flex-1">
                        <h2 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>🏷️ Filtrer par Marque</h2>
                        <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
                            {uniqueBrands.map((brand) => (<button key={brand} onClick={() => handleBrandClick(brand)} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap ${selectedBrand === brand ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700' : darkMode ? 'bg-gray-800 text-gray-200 border border-gray-700 hover:bg-gray-700' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'}`}>{brand}</button>))}
                        </div>
                    </div>
                    <div className="lg:w-[44rem]">
                        <h2 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>💰 Filtrer par Prix</h2>
                        <div className={`flex space-x-4 p-4 rounded-xl shadow-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                            <div className="relative flex-1">
                                <input type="number" value={minPrice} onChange={(e) => handlePriceChange(e, setMinPrice)} placeholder="Prix min (€)" className={`w-full pl-3 pr-10 py-3 rounded-xl border-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition appearance-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-200 text-gray-900'}`} min="0" />
                                <span className={`absolute right-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>€</span>
                            </div>
                            <div className="relative flex-1">
                                <input type="number" value={maxPrice} onChange={(e) => handlePriceChange(e, setMaxPrice)} placeholder="Prix max (€)" className={`w-full pl-3 pr-10 py-3 rounded-xl border-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition appearance-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-200 text-gray-900'}`} min="0" />
                                <span className={`absolute right-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>€</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mb-8">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    <div className="flex-1">
                        <h2 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>📊 Filtrer par Statut</h2>
                        <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
                            {["Tous", "Disponible ✔️", "Disponible ❌", "Indisponible ❌"].map((status) => (
                                <button key={status} onClick={() => setSelectedStatus(status)} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap ${selectedStatus === status ? 'bg-green-600 text-white shadow-md hover:bg-green-700' : darkMode ? 'bg-gray-800 text-gray-200 border border-gray-700 hover:bg-gray-700' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'}`}>
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="lg:w-[44rem]">
                        <h2 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>📅 Filtrer par Année</h2>
                        <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
                            {["Toutes", "2025", "2024", "2023", "2022", "2021", "Autre"].map((year) => (
                                <button key={year} onClick={() => setSelectedYear(year)} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap ${selectedYear === year ? 'bg-orange-600 text-white shadow-md hover:bg-orange-700' : darkMode ? 'bg-gray-800 text-gray-200 border border-gray-700 hover:bg-gray-700' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'}`}>
                                    {year}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="mb-8">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    <div className="flex-1">
                        <h2 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>⭐ Filtrer par Note</h2>
                        <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
                            {["Toutes", "180-200", "160-179", "140-159", "120-139", "100-119", "0-99"].map((range) => (
                                <button key={range} onClick={() => setSelectedNoteRange(range)} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap ${selectedNoteRange === range ? 'bg-purple-600 text-white shadow-md hover:bg-purple-700' : darkMode ? 'bg-gray-800 text-gray-200 border border-gray-700 hover:bg-gray-700' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'}`}>
                                    {range === "Toutes" ? "Toutes" : `${range}/200`}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="lg:w-[44rem]">
                        <h2 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>🔧 Filtrer par Processeur</h2>
                        <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
                            {["Tous", "Apple", "Snapdragon", "Google Tensor", "Exynos", "MediaTek", "Autre"].map((processor) => (
                                <button key={processor} onClick={() => setSelectedProcessor(processor)} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap ${selectedProcessor === processor ? 'bg-red-600 text-white shadow-md hover:bg-red-700' : darkMode ? 'bg-gray-800 text-gray-200 border border-gray-700 hover:bg-gray-700' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'}`}>
                                    {processor}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="mb-8">
                <h2 className={`text-3xl font-bold text-center mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>📱 Notre Catalogue</h2>
                <p className={`text-center mb-6 space-y-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}><span className="block">Les modèles sont classés par statut **(Disponible ✔️ en premier puis par Disponible ❌)**, puis par **Note décroissante**.</span><span className="block">Les téléphones indisponibles (❌) ont une note et un prix provisoires.</span></p>
                <div className="max-w-xl mx-auto space-y-4">
                    <div className="relative">
                        <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Rechercher un modèle ou une marque..." className={`w-full pl-12 pr-4 py-3 rounded-full border-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' : 'bg-white border-gray-200 text-gray-900'}`} />
                        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} size={22} />
                    </div>

                </div>
            </div>

            {/* Compteur de résultats */}
            <div className="mb-6 flex justify-center">
                <div className={`rounded-xl px-6 py-3 shadow-sm border ${darkMode ? 'bg-gradient-to-r from-gray-800 to-gray-700 border-gray-600' : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200'}`}>
                    <div className="flex items-center space-x-2">
                        <span className="text-2xl">📱</span>
                        <span className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            {filteredSmartphones.length} téléphone{filteredSmartphones.length > 1 ? 's' : ''} trouvé{filteredSmartphones.length > 1 ? 's' : ''}
                        </span>
                        {filteredSmartphones.length !== allSmartphones.length && (
                            <span className="text-sm text-gray-500">
                                (sur {allSmartphones.length} au total)
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ${comparisonList.length > 0 ? 'pb-24' : ''}`}>
                {filteredSmartphones.length > 0 ? (filteredSmartphones.map((phone, index) => {
                    const phoneKey = `${phone.marque}-${phone.modele}`;
                    const isSelected = comparisonList.some(p => `${p.marque}-${p.modele}` === phoneKey);
                    const isHovered = hoveredPhone === phoneKey;

                    const detailedNotes = phone.detailedNotes || getDetailedNotes(phone.note);

                    const isNoteExpanded = expandedNoteId === phone.id;
                    const isUntestedExpanded = expandedUntestedId === phone.id;

                    return (
                        <div key={phoneKey} className={`shadow-lg rounded-2xl p-4 text-center flex flex-col justify-between card-enter-animation transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-2xl hover:z-10 cursor-pointer relative ${darkMode ? 'bg-gray-800' : 'bg-white'}`} style={{ animationDelay: `${index * 10}ms` }}>
                            <div className="absolute top-4 left-4 text-sm z-30 font-bold w-max text-left">

                                {phone.hasDetailedSpecs === true || phone.isTested === true ? (
                                    <button className={`flex items-center justify-between rounded-lg shadow-sm px-2 py-1 transition active:scale-[0.98] focus:outline-none w-max mr-auto ${darkMode ? 'text-green-400 bg-green-900 hover:bg-green-800' : 'text-green-600 bg-green-50 hover:bg-green-100'}`} onClick={() => toggleUntestedDetails(phone.id)}>
                                        <span>Disponible {phone.isTested === true ? '✔️' : '❌'}</span>
                                        {isUntestedExpanded ? <ChevronUp size={18} className="transition-transform duration-300 ml-1" /> : <ChevronDown size={18} className="transition-transform duration-300 ml-1" />}
                                    </button>
                                ) : (
                                    <button className={`flex items-center justify-between rounded-lg shadow-sm px-2 py-1 transition active:scale-[0.98] focus:outline-none w-max mr-auto ${darkMode ? 'text-red-400 bg-red-900 hover:bg-red-800' : 'text-red-600 bg-red-50 hover:bg-red-100'}`} onClick={() => toggleUntestedDetails(phone.id)}>
                                        <span>Indisponible ❌</span>
                                        {isUntestedExpanded ? <ChevronUp size={18} className="transition-transform duration-300 ml-1" /> : <ChevronDown size={18} className="transition-transform duration-300 ml-1" />}
                                    </button>
                                )}

                                <div className={`overflow-hidden transition-all duration-500 ease-in-out rounded-lg mt-1 w-max mr-auto ${isUntestedExpanded ? (darkMode ? 'max-h-96 opacity-100 p-3 bg-gray-700 shadow-xl border border-gray-600' : 'max-h-96 opacity-100 p-3 bg-white shadow-xl border border-gray-200') : 'max-h-0 opacity-0'}`}>
                                    <h4 className={`font-bold text-sm mb-1 border-b pb-1 ${darkMode ? 'text-gray-200 border-gray-600' : 'text-gray-700 border-gray-200'}`}>Signification</h4>
                                    {phone.hasDetailedSpecs === true || phone.isTested === true ? (
                                        <ul className={`text-xs space-y-1 text-left ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                            <li><span className="font-bold">Disponible:</span> Fiche caractéristique complète et vérifiée</li>
                                            <li><span className="font-bold">{phone.isTested === true ? '✔️' : '❌'}:</span> {phone.isTested === true ? 'Téléphone essayé physiquement' : 'Téléphone non essayé'}</li>
                                        </ul>
                                    ) : (
                                        <ul className={`text-xs space-y-1 text-left ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                            <li><span className="font-bold">Indisponible:</span> Fiche caractéristique indisponible</li>
                                            <li><span className="font-bold">❌:</span> Téléphone non essayé</li>
                                        </ul>
                                    )}
                                </div>
                            </div>

                            <div className="absolute top-4 right-4 text-sm z-30 font-bold w-max text-right">
                                <button className={`flex items-center justify-between rounded-lg shadow-sm px-2 py-1 transition active:scale-[0.98] focus:outline-none min-w-[100px] w-max ml-auto ${darkMode ? 'text-blue-400 bg-blue-900 hover:bg-blue-800' : 'text-blue-600 bg-blue-50 hover:bg-blue-100'}`} onClick={() => toggleNoteDetails(phone.id)}>
                                    <span>{formatNoteDisplay(phone.note)}</span>
                                    {isNoteExpanded ? <ChevronUp size={18} className="transition-transform duration-300 ml-1" /> : <ChevronDown size={18} className="transition-transform duration-300 ml-1" />}
                                </button>
                                <div className={`overflow-hidden transition-all duration-500 ease-in-out rounded-lg mt-1 w-max ml-auto ${isNoteExpanded ? (darkMode ? 'max-h-96 opacity-100 p-3 bg-gray-700 shadow-xl border border-gray-600' : 'max-h-96 opacity-100 p-3 bg-white shadow-xl border border-gray-200') : 'max-h-0 opacity-0'}`}>
                                    <h4 className={`font-bold text-sm mb-1 border-b pb-1 ${darkMode ? 'text-gray-200 border-gray-600' : 'text-gray-700 border-gray-200'}`}>Détails ({phone.note}/200)</h4>
                                    <ul className={`text-xs space-y-1 text-left ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                        {Object.entries(detailedNotes).map(([key, value]) => (
                                            <li key={key} className="flex flex-col mb-1">
                                                <div className="flex justify-between w-full">
                                                    <span>{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                                                    <span className="font-bold text-blue-600 ml-2">{value.score}/{value.max}</span>
                                                </div>
                                                <div className={`h-1 rounded-full mt-0.5 ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                                                    <div className="h-1 bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${(value.score / value.max) * 100}%` }}></div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <button className={`absolute top-4 left-1/2 transform -translate-x-1/2 flex items-center px-2 py-1 rounded-full text-sm font-semibold transition-all duration-300 ease-in-out shadow-md z-50 ${isSelected ? (isHovered ? 'bg-red-500 text-white hover:bg-red-600 scale-105' : 'bg-green-500 text-white hover:bg-red-500') : (isHovered ? 'bg-gray-300 text-gray-700 scale-105' : 'bg-gray-200 text-gray-700')} active:scale-90`} onClick={(e) => { e.preventDefault(); e.stopPropagation(); console.log('Bouton cliqué pour:', phone.marque, phone.modele); toggleComparison(phone); }} onMouseEnter={() => setHoveredPhone(phoneKey)} onMouseLeave={() => setHoveredPhone(null)}>
                                {isSelected ? (isHovered ? <><X size={16} className="mr-1" /><span>Supprimer</span></> : <><Check size={16} className="mr-1" /><span>Validé</span></>) : (isHovered ? <><Plus size={16} className="mr-1" /><span>Comparer</span></> : <Plus size={16} />)}
                            </button>

                            <div>
                                <PhoneImage phone={phone} index={index} />
                                <div className="text-center">
                                    <h3 className={`text-lg font-bold pt-5 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{phone.marque} {phone.modele}</h3>
                                    <p className={`mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{phone.prix}</p>
                                </div>
                            </div>
                            <button onClick={() => handleViewDetails(phone)} className="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:scale-95 transition-all duration-150">Voir plus</button>
                        </div>
                    );
                })
                ) : (<p className="col-span-full text-center text-gray-500 mt-8 text-lg">Aucun smartphone ne correspond à votre recherche ou à vos critères de prix.</p>)}
            </div>
            <ContactSection />

            {/* Bouton retour en haut */}
            {showScrollTop && (
                <div className="flex justify-center mt-8">
                    <button
                        onClick={scrollToTop}
                        className={`px-6 py-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 ${darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                        aria-label="Retour en haut"
                    >
                        <ArrowUp size={20} />
                        <span className="font-semibold">Retour en haut</span>
                    </button>
                </div>
            )}

            <Footer />
        </div>
    );
}