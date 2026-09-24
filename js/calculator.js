/**
 * Cubic Yard Hub - Universal Material & Volume Calculation Engine
 * Accurate, zero-rounding-error calculations with real-time live updates
 */

const MATERIAL_DENSITIES = {
  gravel: { name: 'Gravel / Crushed Stone (#57)', tonsPerYard: 1.4, lbsPerYard: 2800 },
  pea_gravel: { name: 'Pea Gravel (3/8")', tonsPerYard: 1.45, lbsPerYard: 2900 },
  crusher_run: { name: 'Crusher Run / Dense Grade', tonsPerYard: 1.5, lbsPerYard: 3000 },
  river_rock: { name: 'River Rock / Egg Stone', tonsPerYard: 1.35, lbsPerYard: 2700 },
  topsoil: { name: 'Screened Topsoil (Moist)', tonsPerYard: 1.15, lbsPerYard: 2300 },
  dirt: { name: 'Fill Dirt (Compacted)', tonsPerYard: 1.25, lbsPerYard: 2500 },
  mulch: { name: 'Hardwood / Bark Mulch', tonsPerYard: 0.45, lbsPerYard: 900 },
  sand: { name: 'Masonry / Play Sand', tonsPerYard: 1.35, lbsPerYard: 2700 },
  concrete: { name: 'Standard Concrete Mix', tonsPerYard: 2.025, lbsPerYard: 4050 }
};

let lastCalculation = {
  yards: '0.00',
  feet: '0.0',
  tons: '0.00',
  lbs: '0',
  cost: '--',
  material: 'Gravel / Crushed Stone (#57)'
};

function calculateCubicYards() {
  const shape = document.getElementById('calc-shape')?.value || 'rectangle';
  const wastePercent = parseFloat(document.getElementById('calc-waste')?.value || 10) / 100;
  const materialKey = document.getElementById('calc-material')?.value || 'gravel';
  const unitPrice = parseFloat(document.getElementById('calc-price')?.value || 0);

  let areaSqFt = 0;

  if (shape === 'rectangle') {
    const length = parseFloat(document.getElementById('input-length')?.value || 0);
    const width = parseFloat(document.getElementById('input-width')?.value || 0);
    areaSqFt = length * width;
  } else if (shape === 'circle') {
    const diameter = parseFloat(document.getElementById('input-diameter')?.value || 0);
    const radius = diameter / 2;
    areaSqFt = Math.PI * radius * radius;
  } else if (shape === 'triangle') {
    const base = parseFloat(document.getElementById('input-base')?.value || 0);
    const height = parseFloat(document.getElementById('input-height')?.value || 0);
    areaSqFt = 0.5 * base * height;
  } else if (shape === 'border') {
    const outDiam = parseFloat(document.getElementById('input-outer-diameter')?.value || 0);
    const inDiam = parseFloat(document.getElementById('input-inner-diameter')?.value || 0);
    const rOut = outDiam / 2;
    const rIn = inDiam / 2;
    areaSqFt = Math.max(0, (Math.PI * rOut * rOut) - (Math.PI * rIn * rIn));
  }

  const depthInches = parseFloat(document.getElementById('input-depth')?.value || 0);
  const depthFeet = depthInches / 12;

  const rawCuFt = areaSqFt * depthFeet;
  const rawCuYd = rawCuFt / 27;

  // With waste / compaction allowance
  const totalCuFt = rawCuFt * (1 + wastePercent);
  const totalCuYd = totalCuFt / 27;
  const totalCuMeters = totalCuFt * 0.0283168;

  // Material Weight Calculations
  const mat = MATERIAL_DENSITIES[materialKey] || MATERIAL_DENSITIES.gravel;
  const totalTons = totalCuYd * mat.tonsPerYard;
  const totalLbs = totalCuYd * mat.lbsPerYard;

  // Bag Calculations
  const bags2CuFt = Math.ceil(totalCuFt / 2.0);
  const bags3CuFt = Math.ceil(totalCuFt / 3.0);
  const bags80Lb = Math.ceil(totalCuYd * 45); // 45 bags of 80lb per yard of concrete
  const bags60Lb = Math.ceil(totalCuYd * 60);

  // Total Estimated Cost
  let estimatedCost = 0;
  if (unitPrice > 0) {
    estimatedCost = totalCuYd * unitPrice;
  }

  // Update UI Elements
  setElText('out-cubic-yards', totalCuYd.toFixed(2));
  setElText('out-cubic-feet', totalCuFt.toFixed(1));
  setElText('out-cubic-meters', totalCuMeters.toFixed(2));
  setElText('out-square-feet', areaSqFt.toFixed(1));
  setElText('out-tons', totalTons.toFixed(2));
  setElText('out-lbs', Math.round(totalLbs).toLocaleString());
  setElText('out-bags-2cuft', bags2CuFt.toLocaleString());
  setElText('out-bags-3cuft', bags3CuFt.toLocaleString());
  setElText('out-bags-80lb', bags80Lb.toLocaleString());
  setElText('out-bags-60lb', bags60Lb.toLocaleString());

  const costText = estimatedCost > 0 ? '$' + Math.round(estimatedCost).toLocaleString() : '--';
  if (document.getElementById('out-cost')) {
    setElText('out-cost', costText);
  }

  // Save for clipboard
  lastCalculation = {
    yards: totalCuYd.toFixed(2),
    feet: totalCuFt.toFixed(1),
    tons: totalTons.toFixed(2),
    lbs: Math.round(totalLbs).toLocaleString(),
    cost: costText,
    material: mat.name
  };
}

function setElText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function handleShapeSwitch(newShape) {
  const shapeInput = document.getElementById('calc-shape');
  if (shapeInput) shapeInput.value = newShape;

  document.querySelectorAll('.shape-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.shape === newShape);
  });

  const rectFields = document.getElementById('fields-rectangle');
  const circleFields = document.getElementById('fields-circle');
  const triangleFields = document.getElementById('fields-triangle');
  const borderFields = document.getElementById('fields-border');

  if (rectFields) rectFields.style.display = newShape === 'rectangle' ? 'block' : 'none';
  if (circleFields) circleFields.style.display = newShape === 'circle' ? 'block' : 'none';
  if (triangleFields) triangleFields.style.display = newShape === 'triangle' ? 'block' : 'none';
  if (borderFields) borderFields.style.display = newShape === 'border' ? 'block' : 'none';

  calculateCubicYards();
}

function copyResultsSummary() {
  const text = `CubicYardHub.com Estimate Summary:
• Volume: ${lastCalculation.yards} Cubic Yards (${lastCalculation.feet} cu ft)
• Material: ${lastCalculation.material}
• Estimated Weight: ${lastCalculation.tons} US Tons (${lastCalculation.lbs} lbs)
• Estimated Cost: ${lastCalculation.cost}
Calculate online at: https://www.cubicyardhub.com`;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showCopyToast('Estimate summary copied to clipboard!');
    }).catch(() => {
      fallbackCopy(text);
    });
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  try {
    document.execCommand('copy');
    showCopyToast('Estimate summary copied to clipboard!');
  } catch (err) {
    alert('Please copy manually: ' + text);
  }
  document.body.removeChild(textArea);
}

function showCopyToast(msg) {
  let toast = document.getElementById('calc-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'calc-toast';
    toast.style.cssText = 'position: fixed; bottom: 24px; right: 24px; background: #1e3a8a; color: #ffffff; padding: 12px 20px; border-radius: 8px; font-weight: 600; font-size: 0.875rem; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); z-index: 9999; transition: opacity 0.3s ease;';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  setTimeout(() => {
    toast.style.opacity = '0';
  }, 2500);
}

document.addEventListener('DOMContentLoaded', () => {
  // Bind input listeners
  const inputs = document.querySelectorAll('.form-input, .form-select');
  inputs.forEach(input => {
    input.addEventListener('input', calculateCubicYards);
    input.addEventListener('change', calculateCubicYards);
  });

  // Bind shape button listeners using currentTarget
  document.querySelectorAll('.shape-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const shape = e.currentTarget.dataset.shape;
      if (shape) handleShapeSwitch(shape);
    });
  });

  // Bind FAQ Accordion buttons
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const faqItem = e.currentTarget.closest('.faq-item');
      if (!faqItem) return;
      const answer = faqItem.querySelector('.faq-answer');
      const iconSpan = e.currentTarget.querySelector('span:last-child');
      
      if (answer) {
        const isHidden = answer.style.display === 'none';
        answer.style.display = isHidden ? 'block' : 'none';
        if (iconSpan) {
          iconSpan.innerHTML = isHidden ? '&minus;' : '&plus;';
        }
      }
    });
  });

  // Insert Copy Summary Button into Results Pane if present
  const resultsCard = document.querySelector('.results-card');
  if (resultsCard && !document.getElementById('btn-copy-summary')) {
    const copyBtn = document.createElement('button');
    copyBtn.id = 'btn-copy-summary';
    copyBtn.type = 'button';
    copyBtn.className = 'btn-primary';
    copyBtn.style.cssText = 'width: 100%; margin-top: 1rem; padding: 0.65rem 1rem; font-size: 0.85rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem; border-radius: 8px; cursor: pointer;';
    copyBtn.innerHTML = '📋 <span>Copy Calculation Summary</span>';
    copyBtn.addEventListener('click', copyResultsSummary);
    resultsCard.appendChild(copyBtn);
  }

  // Initial Calculation
  calculateCubicYards();
});
