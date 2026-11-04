export type Language = 'en' | 'hi';

export interface CountryPreset {
  id: string;
  name: string;
  nameHi: string;
  widthMm: number;
  heightMm: number;
  flag: string;
  description: string;
}

export interface SheetPreset {
  id: string;
  name: string;
  widthInches: number;
  heightInches: number;
  dpi: number;
  defaultCols: number;
  defaultRows: number;
  orientation: 'landscape' | 'portrait';
}

export interface PhotoAdjustments {
  zoom: number; // 0.5 to 3.0
  rotation: number; // -45 to 45 deg
  panX: number; // px offset
  panY: number; // px offset
  brightness: number; // -50 to 50
  contrast: number; // -50 to 50
  saturation: number; // -50 to 50
  sharpness: number; // 0 to 10
  grayscale: boolean;
  flipHorizontal: boolean;
  
  // Background replacement
  bgMode: 'original' | 'color';
  bgColor: string; // '#ffffff', '#2b6cb0', etc.
  bgTolerance: number; // 5 to 60 (for chroma/matte keying)
  bgFeather: number; // 0 to 10
  
  // Attire overlay
  suitOverlayId: string | null;
  suitScale: number;
  suitOffsetY: number;
  
  // Biometric overlay guides
  showGuides: boolean;
  
  // Name & Date stamp (for NEET/Govt exams)
  enableNameDate: boolean;
  candidateName: string;
  photoDate: string;
}

export interface SheetSettings {
  sheetPresetId: string;
  countryPresetId: string;
  cols: number;
  rows: number;
  marginX: number;
  marginY: number;
  gapX: number;
  gapY: number;
  cutBorder: 'none' | 'hairline' | 'dashed' | 'corners';
  borderColor: string;
  borderWidth: number;
  includeStudioWatermark: boolean;
}
