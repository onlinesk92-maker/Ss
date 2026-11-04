import { CountryPreset, PhotoAdjustments, SheetPreset, SheetSettings } from '../types';
import { SUIT_PRESETS } from '../constants/presets';

// Helper to convert hex to RGB
function hexToRgb(hex: string) {
  const cleanHex = hex.replace('#', '');
  const bigint = parseInt(cleanHex, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

// Render a single processed passport photo onto an offscreen canvas
export function renderProcessedPhoto(
  sourceImg: HTMLImageElement,
  frameWidth: number,
  frameHeight: number,
  adjustments: PhotoAdjustments
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(frameWidth);
  canvas.height = Math.round(frameHeight);
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return canvas;

  // Background fill if replacing background
  if (adjustments.bgMode === 'color') {
    ctx.fillStyle = adjustments.bgColor;
    ctx.fillRect(0, 0, frameWidth, frameHeight);
  } else {
    // Clean neutral default
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, frameWidth, frameHeight);
  }

  // Draw subject image with transformations
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, frameWidth, frameHeight);
  ctx.clip();

  // Move origin to center of frame
  const centerX = frameWidth / 2 + adjustments.panX;
  const centerY = frameHeight / 2 + adjustments.panY;

  ctx.translate(centerX, centerY);

  // Apply rotation
  if (adjustments.rotation !== 0) {
    ctx.rotate((adjustments.rotation * Math.PI) / 180);
  }

  // Apply flip
  if (adjustments.flipHorizontal) {
    ctx.scale(-1, 1);
  }

  // Calculate base scale so image covers frame, then multiply by zoom
  const baseScale = Math.max(frameWidth / sourceImg.width, frameHeight / sourceImg.height);
  const scale = baseScale * adjustments.zoom;

  const drawWidth = sourceImg.width * scale;
  const drawHeight = sourceImg.height * scale;

  // Slight optical head offset (people's heads are in upper 2/3)
  const drawX = -drawWidth / 2;
  const drawY = -drawHeight / 2;

  // Filters
  const brightness = 1 + adjustments.brightness / 100;
  const contrast = 1 + adjustments.contrast / 100;
  const saturation = adjustments.grayscale ? 0 : 1 + adjustments.saturation / 100;

  ctx.filter = `brightness(${brightness}) contrast(${contrast}) saturate(${saturation}) ${
    adjustments.grayscale ? 'grayscale(100%)' : ''
  }`;

  // If replacing background with color, create a temporary masked version
  if (adjustments.bgMode === 'color') {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = sourceImg.width;
    tempCanvas.height = sourceImg.height;
    const tempCtx = tempCanvas.getContext('2d');
    if (tempCtx) {
      tempCtx.drawImage(sourceImg, 0, 0);
      const imgData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
      const data = imgData.data;

      // Sample corner pixel as background reference
      const refR = data[0];
      const refG = data[1];
      const refB = data[2];

      const tolerance = adjustments.bgTolerance * 2.8;
      const feather = Math.max(1, adjustments.bgFeather * 2);

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Euclidean color distance from corner background color
        const dist = Math.sqrt(
          (r - refR) * (r - refR) + (g - refG) * (g - refG) + (b - refB) * (b - refB)
        );

        if (dist < tolerance) {
          data[i + 3] = 0; // Transparent
        } else if (dist < tolerance + feather) {
          // Feather edge
          const alphaFactor = (dist - tolerance) / feather;
          data[i + 3] = Math.round(data[i + 3] * alphaFactor);
        }
      }

      tempCtx.putImageData(imgData, 0, 0);
      ctx.drawImage(tempCanvas, drawX, drawY, drawWidth, drawHeight);
    } else {
      ctx.drawImage(sourceImg, drawX, drawY, drawWidth, drawHeight);
    }
  } else {
    ctx.drawImage(sourceImg, drawX, drawY, drawWidth, drawHeight);
  }

  ctx.restore();

  // Apply suit overlay if selected
  if (adjustments.suitOverlayId) {
    const suit = SUIT_PRESETS.find((s) => s.id === adjustments.suitOverlayId);
    if (suit) {
      renderSuitVector(ctx, frameWidth, frameHeight, suit.svgData, adjustments.suitScale, adjustments.suitOffsetY);
    }
  }

  // Apply Candidate Name & Date strip if enabled
  if (adjustments.enableNameDate && (adjustments.candidateName || adjustments.photoDate)) {
    const stripHeight = Math.round(frameHeight * 0.14);
    const stripY = frameHeight - stripHeight;

    // Crisp white background strip
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, stripY, frameWidth, stripHeight);

    // Top hairline border
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = Math.max(1, Math.round(frameHeight * 0.003));
    ctx.strokeRect(0, stripY, frameWidth, stripHeight);

    // Name and Date text
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const fontSize = Math.max(12, Math.round(stripHeight * 0.36));
    ctx.font = `bold ${fontSize}px sans-serif`;

    if (adjustments.candidateName && adjustments.photoDate) {
      ctx.fillText(
        adjustments.candidateName.toUpperCase(),
        frameWidth / 2,
        stripY + stripHeight * 0.32
      );
      ctx.font = `600 ${Math.max(10, Math.round(fontSize * 0.85))}px sans-serif`;
      ctx.fillText(`DOB / DOP: ${adjustments.photoDate}`, frameWidth / 2, stripY + stripHeight * 0.72);
    } else if (adjustments.candidateName) {
      ctx.fillText(adjustments.candidateName.toUpperCase(), frameWidth / 2, stripY + stripHeight / 2);
    } else if (adjustments.photoDate) {
      ctx.fillText(`DATE: ${adjustments.photoDate}`, frameWidth / 2, stripY + stripHeight / 2);
    }
  }

  return canvas;
}

// Render SVG suit synchronously onto canvas
function renderSuitVector(
  ctx: CanvasRenderingContext2D,
  frameWidth: number,
  frameHeight: number,
  svgString: string,
  scaleMod = 1.0,
  offsetYMod = 0
) {
  const suitImg = new Image();
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  // Note: in synchronous rendering, we can draw directly with path or create cached image
  // To ensure instant sync without flickering, we precompute with image
  suitImg.src = url;
  
  const targetW = frameWidth * 1.05 * scaleMod;
  const targetH = (targetW * 300) / 400;
  const x = (frameWidth - targetW) / 2;
  const y = frameHeight - targetH + offsetYMod;

  ctx.drawImage(suitImg, x, y, targetW, targetH);
  URL.revokeObjectURL(url);
}

// Render the complete 300 DPI Print Sheet (e.g. 1800x1200 for 4x6 landscape 8 photos)
export function renderCompleteSheet(
  sourceImg: HTMLImageElement,
  country: CountryPreset,
  sheet: SheetPreset,
  adjustments: PhotoAdjustments,
  settings: SheetSettings
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');

  // Exact 300 DPI sheet canvas dimensions
  const sheetWidth = Math.round(sheet.widthInches * sheet.dpi);
  const sheetHeight = Math.round(sheet.heightInches * sheet.dpi);

  canvas.width = sheetWidth;
  canvas.height = sheetHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // Crisp White Sheet Base
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, sheetWidth, sheetHeight);

  // Optional Studio Watermark Header strip
  const topHeaderReserved = settings.includeStudioWatermark ? 54 : 0;

  const cols = settings.cols;
  const rows = settings.rows;

  // Compute individual photo cell size maintaining country aspect ratio
  const countryAspect = country.widthMm / country.heightMm;

  // Max space available for photo grid
  const availableW = sheetWidth - 40;
  const availableH = sheetHeight - topHeaderReserved - 40;

  // Fit cell within available space
  let cellW = Math.floor(availableW / cols) - 16;
  let cellH = Math.round(cellW / countryAspect);

  if (cellH * rows > availableH) {
    cellH = Math.floor(availableH / rows) - 16;
    cellW = Math.round(cellH * countryAspect);
  }

  // Center the grid onto sheet with equal margins
  const totalGridW = cellW * cols;
  const totalGridH = cellH * rows;

  const marginX = (sheetWidth - totalGridW) / (cols + 1);
  const marginY = topHeaderReserved + (sheetHeight - topHeaderReserved - totalGridH) / (rows + 1);

  // Pre-render one single high-quality photo tile
  const processedPhoto = renderProcessedPhoto(sourceImg, cellW, cellH, adjustments);

  // Draw grid of passport photos
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = Math.round(marginX + c * (cellW + marginX));
      const y = Math.round(marginY + r * (cellH + marginY));

      // Draw the passport photo
      ctx.drawImage(processedPhoto, x, y, cellW, cellH);

      // Cutting guidelines
      if (settings.cutBorder === 'hairline') {
        ctx.strokeStyle = settings.borderColor || '#cbd5e1';
        ctx.lineWidth = settings.borderWidth || 2;
        ctx.strokeRect(x, y, cellW, cellH);
      } else if (settings.cutBorder === 'dashed') {
        ctx.strokeStyle = settings.borderColor || '#94a3b8';
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 8]);
        ctx.strokeRect(x, y, cellW, cellH);
        ctx.setLineDash([]);
      } else if (settings.cutBorder === 'corners') {
        // Subtle corner crop tick marks
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2;
        const tick = 12;
        // Top-left
        ctx.beginPath();
        ctx.moveTo(x - tick, y);
        ctx.lineTo(x, y);
        ctx.lineTo(x, y - tick);
        // Top-right
        ctx.moveTo(x + cellW + tick, y);
        ctx.lineTo(x + cellW, y);
        ctx.lineTo(x + cellW, y - tick);
        // Bottom-left
        ctx.moveTo(x - tick, y + cellH);
        ctx.lineTo(x, y + cellH);
        ctx.lineTo(x, y + cellH + tick);
        // Bottom-right
        ctx.moveTo(x + cellW + tick, y + cellH);
        ctx.lineTo(x + cellW, y + cellH);
        ctx.lineTo(x + cellW, y + cellH + tick);
        ctx.stroke();
      }
    }
  }

  // Draw Studio Header Watermark if enabled
  if (settings.includeStudioWatermark) {
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, sheetWidth, topHeaderReserved);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, sheetWidth, topHeaderReserved);

    ctx.fillStyle = '#334155';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('SAIYAD PHOTO STUDIO', 28, topHeaderReserved / 2);

    ctx.fillStyle = '#64748b';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(
      `${sheet.name} · ${country.name} · 300 DPI ULTRA HD`,
      sheetWidth - 28,
      topHeaderReserved / 2
    );
  }

  return canvas;
}

// Draw Biometric Passport Guides on preview canvas
export function drawBiometricGuides(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  ctx.save();

  // Dim overlay outer zone slightly
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.9)'; // Amber gold guideline
  ctx.lineWidth = 2;

  // Center vertical line
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(width / 2, 0);
  ctx.lineTo(width / 2, height);
  ctx.stroke();

  // Top of head allowance line (~10% from top)
  const headTopY = height * 0.12;
  ctx.beginPath();
  ctx.moveTo(width * 0.2, headTopY);
  ctx.lineTo(width * 0.8, headTopY);
  ctx.stroke();

  // Eye level line (~42% from top)
  const eyeY = height * 0.42;
  ctx.strokeStyle = 'rgba(59, 130, 246, 0.9)'; // Blue
  ctx.beginPath();
  ctx.moveTo(width * 0.15, eyeY);
  ctx.lineTo(width * 0.85, eyeY);
  ctx.stroke();

  // Chin line (~78% from top)
  const chinY = height * 0.78;
  ctx.strokeStyle = 'rgba(239, 68, 68, 0.9)'; // Red
  ctx.beginPath();
  ctx.moveTo(width * 0.25, chinY);
  ctx.lineTo(width * 0.75, chinY);
  ctx.stroke();

  // Face oval contour
  ctx.setLineDash([]);
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.75)';
  ctx.beginPath();
  ctx.ellipse(width / 2, height * 0.45, width * 0.28, height * 0.32, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Labels
  ctx.font = 'bold 10px sans-serif';
  ctx.fillStyle = '#3b82f6';
  ctx.textAlign = 'left';
  ctx.fillText('EYE LEVEL', 6, eyeY - 4);

  ctx.fillStyle = '#ef4444';
  ctx.fillText('CHIN LINE', 6, chinY - 4);

  ctx.fillStyle = '#f59e0b';
  ctx.fillText('HEAD TOP', 6, headTopY - 4);

  ctx.restore();
}

// Download helper
export function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
