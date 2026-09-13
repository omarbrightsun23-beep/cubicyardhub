/**
 * Universal Cubic Yardage & Material Calculator Engine
 * High-performance, reactive, vanilla ES6 calculation engine.
 */

// Material Density Presets (lbs per cubic yard & tons per cubic yard)
const MATERIAL_PRESETS = {
  gravel: { name: "Crushed Stone / Gravel", densityLbs: 2800, tonsPerYard: 1.40, unitType: "weight" },
  concrete: { name: "Ready-Mix Concrete", densityLbs: 4050, tonsPerYard: 2.03, unitType: "weight" },
  dirt: { name: "Screened Topsoil / Dirt", densityLbs: 2200, tonsPerYard: 1.10, unitType: "weight" },
  sand: { name: "Construction Sand", densityLbs: 2700, tonsPerYard: 1.35, unitType: "weight" },
  mulch: { name: "Bark / Wood Mulch", densityLbs: 800, tonsPerYard: 0.40, unitType: "volume" },
  asphalt: { name: "Hot-Mix Asphalt", densityLbs: 3900, tonsPerYard: 1.95, unitType: "weight" }
};

// State Object
const state = {
  unitSystem: 'imperial', // 'imperial' or 'metric'
  shape: 'rectangle',     // 'rectangle', 'cylinder', 'triangle', 'multiarea'
  depthUnit: 'inches',    // 'inches' or 'feet'
  areas: [
    { id: 1, name: 'Area 1', length: 20, width: 10, depth: 4, shape: 'rectangle' }
  ],
  material: 'gravel',
  wastePercent: 10,       // 0, 5, 10, 15
  pricePerUnit: 65.00
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  parseUrlParams();
  bindEvents();
  renderAreas();
  calculateAll();
});

// Parse URL Parameters for 1-Click State Sharing
function parseUrlParams() {
  const params = new URLSearchParams(window.location.search);
  if (params.has('shape')) state.shape = params.get('shape');
  if (params.has('mat')) state.material = params.get('mat');
  if (params.has('waste')) state.wastePercent = parseFloat(params.get('waste')) || 10;
  if (params.has('price')) state.pricePerUnit = parseFloat(params.get('price')) || 0;
  if (params.has('l') && params.has('w') && params.has('d')) {
    state.areas[0].length = parseFloat(params.get('l')) || 20;
    state.areas[0].width = parseFloat(params.get('w')) || 10;
    state.areas[0].depth = parseFloat(params.get('d')) || 4;
  }
}

// Bind UI Events
function bindEvents() {
  // Shape tabs
  document.querySelectorAll('[data-shape-tab]').forEach(tab => {
    tab.addEventListener('click', (e) => {
      state.shape = tab.getAttribute('data-shape-tab');
      updateShapeTabsUI();
      renderAreas();
      calculateAll();
    });
  });

  // Unit Toggle (Imperial / Metric)
  const unitToggle = document.getElementById('unit-toggle');
  if (unitToggle) {
    unitToggle.addEventListener('click', () => {
      state.unitSystem = state.unitSystem === 'imperial' ? 'metric' : 'imperial';
      unitToggle.textContent = state.unitSystem === 'imperial' ? 'Imperial' : 'Metric';
      updateUnitLabels();
      calculateAll();
    });
  }

  // Depth Toggle (Inches / Feet)
  document.querySelectorAll('[data-depth-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.depthUnit = btn.getAttribute('data-depth-toggle');
      updateDepthToggleUI();
      calculateAll();
    });
  });

  // Waste percentage buttons
  document.querySelectorAll('[data-waste-btn]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.wastePercent = parseFloat(btn.getAttribute('data-waste-btn'));
      updateWasteButtonsUI();
      calculateAll();
    });
  });

  // Material select
  const matSelect = document.getElementById('material-select');
  if (matSelect) {
    matSelect.value = state.material;
    matSelect.addEventListener('change', (e) => {
      state.material = e.target.value;
      calculateAll();
    });
  }

  // Price input
  const priceInput = document.getElementById('price-input');
  if (priceInput) {
    priceInput.value = state.pricePerUnit;
    priceInput.addEventListener('input', (e) => {
      state.pricePerUnit = parseFloat(e.target.value) || 0;
      calculateAll();
    });
  }

  // Add Area Button
  const addAreaBtn = document.getElementById('add-area-btn');
  if (addAreaBtn) {
    addAreaBtn.addEventListener('click', () => {
      const newId = state.areas.length + 1;
      state.areas.push({
        id: newId,
        name: `Area ${newId}`,
        length: 10,
        width: 10,
        depth: 4,
        shape: state.shape
      });
      renderAreas();
      calculateAll();
    });
  }

  // Share Link Button
  const shareBtn = document.getElementById('share-btn');
  if (shareBtn) {
    shareBtn.addEventListener('click', copyShareLink);
  }

  // Print Button
  const printBtn = document.getElementById('print-btn');
  if (printBtn) {
    printBtn.addEventListener('click', () => window.print());
  }

  // Embed Modal
  const embedBtn = document.getElementById('embed-btn');
  if (embedBtn) {
    embedBtn.addEventListener('click', showEmbedModal);
  }
}

// Render Input Fields for Areas
function renderAreas() {
  const container = document.getElementById('areas-container');
  if (!container) return;

  container.innerHTML = '';

  state.areas.forEach((area, index) => {
    const areaEl = document.createElement('div');
    areaEl.className = 'bg-[#FAF8F2] border border-[#E2DCB9] rounded-xl p-4 mb-4 relative transition shadow-sm';
    
    let shapeInputsHtml = '';
    if (state.shape === 'cylinder') {
      shapeInputsHtml = `
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Diameter (${state.unitSystem === 'imperial' ? 'feet' : 'meters'})</label>
            <input type="number" step="any" value="${area.length}" data-input="length" data-index="${index}" class="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-bold focus:border-[#003865] focus:outline-none" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-[#1BB954] mb-1">Depth (${state.depthUnit === 'inches' ? 'inches' : (state.unitSystem === 'imperial' ? 'feet' : 'cm')})</label>
            <input type="number" step="any" value="${area.depth}" data-input="depth" data-index="${index}" class="w-full bg-white border-2 border-[#1BB954] rounded-lg px-3 py-2 text-slate-900 font-bold focus:outline-none" />
          </div>
        </div>
      `;
    } else if (state.shape === 'triangle') {
      shapeInputsHtml = `
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Base Length (${state.unitSystem === 'imperial' ? 'feet' : 'meters'})</label>
            <input type="number" step="any" value="${area.length}" data-input="length" data-index="${index}" class="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-bold focus:border-[#003865] focus:outline-none" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Perpendicular Height (${state.unitSystem === 'imperial' ? 'feet' : 'meters'})</label>
            <input type="number" step="any" value="${area.width}" data-input="width" data-index="${index}" class="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-bold focus:border-[#003865] focus:outline-none" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-[#1BB954] mb-1">Depth (${state.depthUnit === 'inches' ? 'inches' : (state.unitSystem === 'imperial' ? 'feet' : 'cm')})</label>
            <input type="number" step="any" value="${area.depth}" data-input="depth" data-index="${index}" class="w-full bg-white border-2 border-[#1BB954] rounded-lg px-3 py-2 text-slate-900 font-bold focus:outline-none" />
          </div>
        </div>
      `;
    } else {
      // Rectangle / Slab / Multi-area default
      shapeInputsHtml = `
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Length (${state.unitSystem === 'imperial' ? 'feet' : 'meters'})</label>
            <input type="number" step="any" value="${area.length}" data-input="length" data-index="${index}" class="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-bold focus:border-[#003865] focus:outline-none" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Width (${state.unitSystem === 'imperial' ? 'feet' : 'meters'})</label>
            <input type="number" step="any" value="${area.width}" data-input="width" data-index="${index}" class="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-bold focus:border-[#003865] focus:outline-none" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-[#1BB954] mb-1">Depth (${state.depthUnit === 'inches' ? 'inches' : (state.unitSystem === 'imperial' ? 'feet' : 'cm')})</label>
            <input type="number" step="any" value="${area.depth}" data-input="depth" data-index="${index}" class="w-full bg-white border-2 border-[#1BB954] rounded-lg px-3 py-2 text-slate-900 font-bold focus:outline-none" />
          </div>
        </div>
      `;
    }

    areaEl.innerHTML = `
      <div class="flex items-center justify-between pb-1">
        <div class="text-xs font-bold uppercase tracking-wider text-[#003865]">${area.name}</div>
        ${state.areas.length > 1 ? `<button data-remove-index="${index}" class="text-red-500 hover:text-red-700 text-xs font-bold">Remove ✕</button>` : ''}
      </div>
      ${shapeInputsHtml}
      <div class="mt-2 text-right text-xs font-bold text-[#003865]" id="subtotal-area-${index}">
        Calculating...
      </div>
    `;

    container.appendChild(areaEl);
  });

  // Attach input listeners
  container.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', (e) => {
      const idx = parseInt(e.target.getAttribute('data-index'));
      const field = e.target.getAttribute('data-input');
      state.areas[idx][field] = parseFloat(e.target.value) || 0;
      calculateAll();
    });
  });

  // Attach remove listeners
  container.querySelectorAll('[data-remove-index]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.target.getAttribute('data-remove-index'));
      state.areas.splice(idx, 1);
      renderAreas();
      calculateAll();
    });
  });
}

// Perform All Calculations Reactively
function calculateAll() {
  let totalVolumeCuFt = 0;
  const isMetric = state.unitSystem === 'metric';

  state.areas.forEach((area, index) => {
    let cuFt = 0;
    let depthInFeet = 0;

    if (state.depthUnit === 'inches') {
      depthInFeet = isMetric ? (area.depth / 100) * 3.28084 : area.depth / 12;
    } else {
      depthInFeet = isMetric ? area.depth * 3.28084 : area.depth;
    }

    const lengthInFeet = isMetric ? area.length * 3.28084 : area.length;
    const widthInFeet = isMetric ? area.width * 3.28084 : area.width;

    if (state.shape === 'cylinder') {
      const radius = lengthInFeet / 2;
      cuFt = Math.PI * Math.pow(radius, 2) * depthInFeet;
    } else if (state.shape === 'triangle') {
      cuFt = 0.5 * lengthInFeet * widthInFeet * depthInFeet;
    } else {
      // Rectangle
      cuFt = lengthInFeet * widthInFeet * depthInFeet;
    }

    totalVolumeCuFt += cuFt;

    // Update subtotal display
    const subtotalEl = document.getElementById(`subtotal-area-${index}`);
    if (subtotalEl) {
      const subCuYds = cuFt / 27;
      subtotalEl.textContent = `This area: ${subCuYds.toFixed(2)} yd³ • ${cuFt.toFixed(1)} ft³`;
    }
  });

  // Apply Waste Buffer
  const wasteMultiplier = 1 + (state.wastePercent / 100);
  const totalCuFtWithWaste = totalVolumeCuFt * wasteMultiplier;
  const totalCuYards = totalCuFtWithWaste / 27;
  const totalCuMeters = totalCuFtWithWaste * 0.0283168;

  // Material Weight Calculations
  const matInfo = MATERIAL_PRESETS[state.material] || MATERIAL_PRESETS.gravel;
  const totalLbs = totalCuYards * matInfo.densityLbs;
  const totalTons = totalLbs / 2000;
  const totalKg = totalLbs * 0.453592;

  // Estimated Cost
  const totalCost = totalCuYards * state.pricePerUnit;

  // Update Hero Outputs
  setText('res-cubic-yards', totalCuYards.toFixed(2));
  setText('res-cubic-feet', totalCuFtWithWaste.toFixed(2));
  setText('res-cubic-meters', totalCuMeters.toFixed(2));
  setText('res-tons', totalTons.toFixed(2));
  setText('res-lbs', Math.round(totalLbs).toLocaleString());
  setText('res-kg', Math.round(totalKg).toLocaleString());
  setText('res-total-cost', `$${totalCost.toFixed(2)}`);
  setText('res-areas-count', state.areas.length.toString());
  setText('res-waste-yards', totalCuYards.toFixed(2));

  // Retail Bag Breakdown
  updateBagCounts(totalLbs, totalCuFtWithWaste, matInfo);

  // Dynamic Vehicle Hauling Safety Alert Engine
  updateHaulingAlert(totalTons, totalLbs, totalCuYards, matInfo.name);

  // Update URL Query String for seamless sharing
  updateBrowserUrl();
}

// Update Retail Bag Counts
function updateBagCounts(totalLbs, totalCuFt, matInfo) {
  if (matInfo.unitType === 'volume') {
    // Mulch bags (2 cu ft standard bag)
    const bags2CuFt = Math.ceil(totalCuFt / 2.0);
    setText('bag-50-count', `${bags2CuFt} (2 cu ft)`);
    setText('bag-60-count', `${Math.ceil(totalCuFt / 1.5)} (1.5 cu ft)`);
    setText('bag-80-count', `${Math.ceil(totalCuFt / 3.0)} (3 cu ft)`);
  } else {
    // Weight-based bags (Concrete, Gravel, Sand)
    setText('bag-50-count', Math.ceil(totalLbs / 50).toLocaleString());
    setText('bag-60-count', Math.ceil(totalLbs / 60).toLocaleString());
    setText('bag-80-count', Math.ceil(totalLbs / 80).toLocaleString());
  }
}

// Dynamic Hauling Safety Alert Engine
function updateHaulingAlert(totalTons, totalLbs, totalCuYards, materialName) {
  const alertBox = document.getElementById('hauling-alert-box');
  const alertTitle = document.getElementById('hauling-alert-title');
  const alertDesc = document.getElementById('hauling-alert-desc');
  const alertRec = document.getElementById('hauling-alert-rec');

  if (!alertBox || !alertTitle || !alertDesc || !alertRec) return;

  const halfTonMaxLbs = 1800; // Average safe payload capacity for standard F-150 / 1500 pickup

  if (totalLbs <= 0) {
    alertBox.classList.add('hidden');
    return;
  }

  alertBox.classList.remove('hidden');

  if (totalLbs <= halfTonMaxLbs) {
    // Safe for 1 pickup trip
    alertBox.className = 'bg-emerald-50 border-2 border-emerald-400 rounded-xl p-4 text-xs mt-4 shadow-sm';
    alertTitle.className = 'text-emerald-800 font-bold flex items-center gap-1.5 text-sm';
    alertTitle.innerHTML = '<span>✅</span> SAFE TO HAUL IN 1 PICKUP TRIP';
    alertDesc.textContent = `Total Weight: ${totalTons.toFixed(2)} Tons (${Math.round(totalLbs).toLocaleString()} lbs). Fits within standard 1/2-Ton (F-150) payload capacity (~1,800 lbs).`;
    alertRec.textContent = '➔ Recommendation: Single trip with a standard pickup truck or utility trailer.';
    alertRec.className = 'text-emerald-700 font-semibold pt-1';
  } else {
    // Exceeds half ton payload
    const neededTrips = Math.ceil(totalLbs / halfTonMaxLbs);
    alertBox.className = 'bg-amber-50 border-2 border-amber-400 rounded-xl p-4 text-xs mt-4 shadow-sm';
    alertTitle.className = 'text-amber-900 font-bold flex items-center gap-1.5 text-sm';
    alertTitle.innerHTML = '<span>🚨</span> VEHICLE PAYLOAD & HAULING ADVISORY';
    alertDesc.textContent = `Total Weight: ${totalTons.toFixed(2)} Tons (${Math.round(totalLbs).toLocaleString()} lbs). Exceeds standard 1/2-Ton pickup (F-150) safe payload capacity (~1,800 lbs).`;
    alertRec.textContent = `➔ Recommendation: Requires ${neededTrips} pickup truck trips OR 1 single-axle dump truck bulk delivery.`;
    alertRec.className = 'text-amber-800 font-semibold pt-1';
  }
}

// UI Helpers
function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function updateShapeTabsUI() {
  document.querySelectorAll('[data-shape-tab]').forEach(tab => {
    const shape = tab.getAttribute('data-shape-tab');
    if (shape === state.shape) {
      tab.className = 'bg-[#003865] text-white py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 shadow-sm font-bold transition';
    } else {
      tab.className = 'text-slate-600 hover:text-slate-900 py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition font-semibold';
    }
  });
}

function updateDepthToggleUI() {
  document.querySelectorAll('[data-depth-toggle]').forEach(btn => {
    const unit = btn.getAttribute('data-depth-toggle');
    if (unit === state.depthUnit) {
      btn.className = 'bg-[#003865] text-white px-3 py-1.5 rounded-md font-bold text-xs shadow';
    } else {
      btn.className = 'text-slate-600 px-3 py-1.5 rounded-md font-semibold text-xs hover:text-slate-900';
    }
  });
}

function updateWasteButtonsUI() {
  document.querySelectorAll('[data-waste-btn]').forEach(btn => {
    const val = parseFloat(btn.getAttribute('data-waste-btn'));
    if (val === state.wastePercent) {
      btn.className = 'bg-[#EFE6C8] border-2 border-[#003865] py-2 rounded-lg text-[#003865] font-bold text-xs';
    } else {
      btn.className = 'bg-white border border-slate-300 py-2 rounded-lg text-slate-600 font-semibold text-xs hover:border-slate-400';
    }
  });
}

function updateUnitLabels() {
  renderAreas();
}

function updateBrowserUrl() {
  const params = new URLSearchParams();
  params.set('shape', state.shape);
  params.set('mat', state.material);
  params.set('waste', state.wastePercent.toString());
  params.set('price', state.pricePerUnit.toString());
  if (state.areas.length > 0) {
    params.set('l', state.areas[0].length.toString());
    params.set('w', state.areas[0].width.toString());
    params.set('d', state.areas[0].depth.toString());
  }
  const newUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState({}, '', newUrl);
}

function copyShareLink() {
  const url = window.location.href;
  navigator.clipboard.writeText(url).then(() => {
    const shareBtn = document.getElementById('share-btn');
    if (shareBtn) {
      const orig = shareBtn.textContent;
      shareBtn.textContent = '✓ Copied Link!';
      setTimeout(() => shareBtn.textContent = orig, 2000);
    }
  });
}

function showEmbedModal() {
  const embedCode = `<iframe src="${window.location.origin}/" width="100%" height="700" frameborder="0" style="border-radius:12px;border:1px solid #E5E7EB;"></iframe><div style="font-size:12px;margin-top:4px;"><a href="${window.location.origin}/" target="_blank" rel="noopener">Powered by CubicYardCalc.com</a></div>`;
  alert(`Copy this Embed Code for your website:\n\n${embedCode}`);
}

