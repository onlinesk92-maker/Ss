import { CountryPreset, SheetPreset } from '../types';

export const COUNTRY_PRESETS: CountryPreset[] = [
  {
    id: 'in-passport',
    name: 'India Passport / Visa / OCI (35x45 mm)',
    nameHi: 'भारत पासपोर्ट / वीज़ा (35x45 मिमी)',
    widthMm: 35,
    heightMm: 45,
    flag: '🇮🇳',
    description: 'Standard 3.5cm x 4.5cm for Indian Passport, OCI & Police Verification',
  },
  {
    id: 'us-passport',
    name: 'US Visa & Passport (2x2 inches / 51x51 mm)',
    nameHi: 'यूएस वीज़ा व पासपोर्ट (2x2 इंच)',
    widthMm: 51,
    heightMm: 51,
    flag: '🇺🇸',
    description: 'Square 2"x2" format for US DS-160, Visa & American Passport',
  },
  {
    id: 'schengen',
    name: 'Schengen / Europe / UK (35x45 mm)',
    nameHi: 'यूरोप / शेंगेन / यूके (35x45 मिमी)',
    widthMm: 35,
    heightMm: 45,
    flag: '🇪🇺',
    description: 'ICAO 9303 European Biometric standard',
  },
  {
    id: 'uae-visa',
    name: 'UAE / Dubai / GCC Visa (40x60 mm)',
    nameHi: 'दुबई / यूएई वीज़ा (40x60 मिमी)',
    widthMm: 40,
    heightMm: 60,
    flag: '🇦🇪',
    description: 'Official 4x6cm format for Emirates ID and Gulf Visas',
  },
  {
    id: 'in-stamp',
    name: 'India Stamp Size (25x30 mm)',
    nameHi: 'भारत स्टाम्प साइज़ (25x30 मिमी)',
    widthMm: 25,
    heightMm: 30,
    flag: '🇮🇳',
    description: 'Compact stamp format for Indian colleges, certificates & forms',
  },
  {
    id: 'in-pan',
    name: 'India PAN Card (25x35 mm)',
    nameHi: 'भारत पैन कार्ड (25x35 मिमी)',
    widthMm: 25,
    heightMm: 35,
    flag: '🇮🇳',
    description: 'NSDL / UTI PAN card application dimensions',
  },
  {
    id: 'ca-passport',
    name: 'Canada Passport (50x70 mm)',
    nameHi: 'कनाडा पासपोर्ट (50x70 मिमी)',
    widthMm: 50,
    heightMm: 70,
    flag: '🇨🇦',
    description: '50mm wide x 70mm high Canadian spec',
  },
  {
    id: 'au-passport',
    name: 'Australia Passport (35x45 mm)',
    nameHi: 'ऑस्ट्रेलिया पासपोर्ट (35x45 मिमी)',
    widthMm: 35,
    heightMm: 45,
    flag: '🇦🇺',
    description: '35mm x 45mm standard Australian format',
  },
];

export const SHEET_PRESETS: SheetPreset[] = [
  {
    id: '4x6-landscape',
    name: '4x6" Landscape (8 Photos - Most Popular)',
    widthInches: 6,
    heightInches: 4,
    dpi: 300,
    defaultCols: 4,
    defaultRows: 2,
    orientation: 'landscape',
  },
  {
    id: '4x6-portrait',
    name: '4x6" Portrait (6 Photos)',
    widthInches: 4,
    heightInches: 6,
    dpi: 300,
    defaultCols: 2,
    defaultRows: 3,
    orientation: 'portrait',
  },
  {
    id: 'a4-sheet',
    name: 'A4 Photo Paper (32 Photos)',
    widthInches: 8.27,
    heightInches: 11.69,
    dpi: 300,
    defaultCols: 4,
    defaultRows: 8,
    orientation: 'portrait',
  },
  {
    id: '5x7-landscape',
    name: '5x7" Landscape (12 Photos)',
    widthInches: 7,
    heightInches: 5,
    dpi: 300,
    defaultCols: 4,
    defaultRows: 3,
    orientation: 'landscape',
  },
  {
    id: 'single-photo',
    name: 'Single Photo (High-Res 300 DPI File)',
    widthInches: 1.38,
    heightInches: 1.77,
    dpi: 300,
    defaultCols: 1,
    defaultRows: 1,
    orientation: 'portrait',
  },
];

export const BACKGROUND_COLORS = [
  { id: 'white', label: 'Pure White', hex: '#FFFFFF', desc: 'Standard Passport / Visa requirement' },
  { id: 'blue', label: 'Studio Light Blue', hex: '#C5D8EA', desc: 'Official Corporate, ID & Govt jobs' },
  { id: 'deep-blue', label: 'Deep Blue', hex: '#4A7CA8', desc: 'Diplomatic & Classical ID' },
  { id: 'off-white', label: 'Soft Off-White', hex: '#F4F4F6', desc: 'Gentle studio backdrop' },
  { id: 'light-grey', label: 'Light Studio Grey', hex: '#E5E7EB', desc: 'Schengen & Embassy acceptable' },
  { id: 'red', label: 'Official Red', hex: '#DC2626', desc: 'Used in specific Asian passports' },
];

export interface SuitPreset {
  id: string;
  name: string;
  gender: 'male' | 'female';
  color: string;
  svgData: string;
}

// Crisp vector SVG suits rendered directly on canvas
export const SUIT_PRESETS: SuitPreset[] = [
  {
    id: 'navy-suit',
    name: 'Navy Blazer & Red Tie',
    gender: 'male',
    color: '#1e293b',
    svgData: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
      <!-- White shirt collar -->
      <path d="M150,10 L200,60 L250,10 L220,100 L180,100 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
      <polygon points="180,20 200,65 220,20 200,10" fill="#f8fafc"/>
      <!-- Red striped tie -->
      <path d="M190,60 L210,60 L218,180 L200,210 L182,180 Z" fill="#b91c1c" stroke="#991b1b" stroke-width="1.5"/>
      <path d="M188,85 L212,95" stroke="#ffffff" stroke-width="2.5" opacity="0.6"/>
      <path d="M185,115 L215,125" stroke="#ffffff" stroke-width="2.5" opacity="0.6"/>
      <path d="M184,145 L216,155" stroke="#ffffff" stroke-width="2.5" opacity="0.6"/>
      <path d="M183,175 L217,185" stroke="#ffffff" stroke-width="2.5" opacity="0.6"/>
      <!-- Tie Knot -->
      <polygon points="190,55 210,55 206,75 194,75" fill="#991b1b"/>
      <!-- Navy suit lapels -->
      <path d="M40,290 L130,90 L170,120 L160,290 Z" fill="#0f172a"/>
      <path d="M360,290 L270,90 L230,120 L240,290 Z" fill="#0f172a"/>
      <path d="M40,290 L130,90 L180,160 L140,290 Z" fill="#1e293b" stroke="#334155" stroke-width="2"/>
      <path d="M360,290 L270,90 L220,160 L260,290 Z" fill="#1e293b" stroke="#334155" stroke-width="2"/>
      <!-- Suit body -->
      <path d="M10,300 C30,220 90,160 140,150 L140,300 Z" fill="#0f172a"/>
      <path d="M390,300 C370,220 310,160 260,150 L260,300 Z" fill="#0f172a"/>
      <!-- Lapel crease highlight -->
      <path d="M130,90 L175,155" stroke="#475569" stroke-width="2"/>
      <path d="M270,90 L225,155" stroke="#475569" stroke-width="2"/>
    </svg>`,
  },
  {
    id: 'black-tux',
    name: 'Black Suit & Bow Tie',
    gender: 'male',
    color: '#09090b',
    svgData: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
      <!-- Crisp wing shirt collar -->
      <polygon points="140,15 200,60 260,15 220,95 180,95" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
      <!-- Black Bowtie -->
      <polygon points="160,45 195,58 160,70" fill="#18181b"/>
      <polygon points="240,45 205,58 240,70" fill="#18181b"/>
      <ellipse cx="200" cy="58" rx="8" ry="7" fill="#27272a"/>
      <!-- Lapels (satin look) -->
      <path d="M30,300 L125,80 L180,160 L145,300 Z" fill="#18181b" stroke="#3f3f46" stroke-width="1.5"/>
      <path d="M370,300 L275,80 L220,160 L255,300 Z" fill="#18181b" stroke="#3f3f46" stroke-width="1.5"/>
      <path d="M0,300 C20,210 80,150 135,140 L135,300 Z" fill="#09090b"/>
      <path d="M400,300 C380,210 320,150 265,140 L265,300 Z" fill="#09090b"/>
      <!-- Button -->
      <circle cx="200" cy="220" r="6" fill="#27272a" stroke="#52525b" stroke-width="1"/>
    </svg>`,
  },
  {
    id: 'women-suit',
    name: 'Women Formal Dark Blazer',
    gender: 'female',
    color: '#1e1b4b',
    svgData: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
      <!-- White inner blouse -->
      <path d="M150,20 C170,70 230,70 250,20 L225,120 L175,120 Z" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.5"/>
      <!-- Pendant / necklace subtle line -->
      <path d="M175,45 Q200,65 225,45" fill="none" stroke="#d97706" stroke-width="1.5"/>
      <circle cx="200" cy="60" r="3" fill="#d97706"/>
      <!-- Deep V blazer lapels -->
      <path d="M40,300 L140,80 L195,180 L155,300 Z" fill="#1e1b4b" stroke="#3730a3" stroke-width="1.5"/>
      <path d="M360,300 L260,80 L205,180 L245,300 Z" fill="#1e1b4b" stroke="#3730a3" stroke-width="1.5"/>
      <path d="M10,300 C35,210 95,150 145,140 L145,300 Z" fill="#0f172a"/>
      <path d="M390,300 C365,210 305,150 255,140 L255,300 Z" fill="#0f172a"/>
    </svg>`,
  },
];

// Helper to create an instant high-quality sample portrait canvas data URL
// so users can test immediately on mobile or desktop without hunting for a photo
export function generateSamplePortraitDataUrl(type: 'male' | 'female' = 'male'): string {
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 750;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Studio background gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 0, 750);
  bgGrad.addColorStop(0, '#dbeafe');
  bgGrad.addColorStop(1, '#bfdbfe');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 600, 750);

  // Soft rim light vignette
  const radialVignette = ctx.createRadialGradient(300, 320, 100, 300, 320, 380);
  radialVignette.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
  radialVignette.addColorStop(1, 'rgba(191, 219, 254, 0)');
  ctx.fillStyle = radialVignette;
  ctx.fillRect(0, 0, 600, 750);

  // Body / Torso
  ctx.fillStyle = type === 'male' ? '#1e293b' : '#312e81';
  ctx.beginPath();
  ctx.ellipse(300, 720, 240, 260, 0, 0, Math.PI * 2);
  ctx.fill();

  // Shirt collar / Inner neckline
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(250, 480);
  ctx.lineTo(300, 560);
  ctx.lineTo(350, 480);
  ctx.lineTo(330, 440);
  ctx.lineTo(270, 440);
  ctx.closePath();
  ctx.fill();

  // Neck
  ctx.fillStyle = type === 'male' ? '#e2a178' : '#ebb89b';
  ctx.beginPath();
  ctx.rect(260, 380, 80, 100);
  ctx.fill();
  // Neck shadow
  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  ctx.beginPath();
  ctx.arc(300, 400, 48, 0, Math.PI);
  ctx.fill();

  // Head / Face
  ctx.fillStyle = type === 'male' ? '#f0b58d' : '#f7cbb0';
  ctx.beginPath();
  ctx.ellipse(300, 310, 105, 135, 0, 0, Math.PI * 2);
  ctx.fill();

  // Ears
  ctx.beginPath();
  ctx.ellipse(190, 315, 14, 28, 0, 0, Math.PI * 2);
  ctx.ellipse(410, 315, 14, 28, 0, 0, Math.PI * 2);
  ctx.fill();

  // Hair
  ctx.fillStyle = '#1c1917';
  ctx.beginPath();
  if (type === 'male') {
    ctx.arc(300, 265, 115, Math.PI * 0.85, Math.PI * 2.15);
    ctx.lineTo(300, 215);
    ctx.fill();
    // Sideburns
    ctx.fillRect(190, 270, 12, 35);
    ctx.fillRect(398, 270, 12, 35);
  } else {
    // Elegant professional hair
    ctx.arc(300, 260, 120, Math.PI * 0.8, Math.PI * 2.2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(190, 350, 25, 75, 0, 0, Math.PI * 2);
    ctx.ellipse(410, 350, 25, 75, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Eyebrows
  ctx.strokeStyle = '#292524';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(230, 280);
  ctx.quadraticCurveTo(255, 272, 280, 280);
  ctx.moveTo(320, 280);
  ctx.quadraticCurveTo(345, 272, 370, 280);
  ctx.stroke();

  // Eyes (Neutral biometric expression)
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(255, 298, 16, 9, 0, 0, Math.PI * 2);
  ctx.ellipse(345, 298, 16, 9, 0, 0, Math.PI * 2);
  ctx.fill();

  // Pupils
  ctx.fillStyle = '#262626';
  ctx.beginPath();
  ctx.arc(255, 298, 6.5, 0, Math.PI * 2);
  ctx.arc(345, 298, 6.5, 0, Math.PI * 2);
  ctx.fill();
  // Iris catchlight
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(257, 296, 2, 0, Math.PI * 2);
  ctx.arc(347, 296, 2, 0, Math.PI * 2);
  ctx.fill();

  // Nose
  ctx.strokeStyle = '#cb845b';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(300, 290);
  ctx.lineTo(297, 335);
  ctx.lineTo(306, 337);
  ctx.stroke();

  // Lips (Neutral closed passport expression)
  ctx.fillStyle = '#c76e60';
  ctx.beginPath();
  ctx.ellipse(300, 375, 22, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  return canvas.toDataURL('image/png');
}
