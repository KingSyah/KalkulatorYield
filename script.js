// ============================================================
// EVE Online Mining Calculator — Accurate Data & Calculations
// ============================================================

// ========== EVE ONLINE GAME DATA ==========

// Unified ship list — semua kapal yang bisa fit mining modules
// User bebas testing kapal apapun. Bonus 0 = tidak ada bonus yield khusus,
// tapi kapal tetap bisa dipasangi mining modules di in-game.
const SHIPS = [
  // Frigates
  { name: 'Venture', bonus: 0.00, note: 'Mining frigate, +2 turret slots' },
  { name: 'Prospect', bonus: 0.00, note: 'Covert ops, gas/ore mining' },
  { name: 'Endurance', bonus: 0.00, note: 'Expedition frigate, ice bonus' },
  // Mining Barges
  { name: 'Procurer', bonus: 0.00, note: 'T1 barge, tanky' },
  { name: 'Retriever', bonus: 0.00, note: 'T1 barge, large ore hold' },
  { name: 'Covetor', bonus: 0.00, note: 'T1 barge, max yield' },
  // Exhumers
  { name: 'Skiff', bonus: 0.00, note: 'Exhumer, max tank' },
  { name: 'Mackinaw', bonus: 0.15, note: 'Exhumer, +15% ice yield' },
  { name: 'Hulk', bonus: 0.00, note: 'Exhumer, max yield (2 strips)' },
  // Industrial Command
  { name: 'Porpoise', bonus: 0.25, note: 'Industrial command, +25%' },
  { name: 'Orca', bonus: 0.25, note: 'Industrial command, +25%' },
  // Capital
  { name: 'Rorqual', bonus: 0.40, note: 'Capital, +40%' },
  // General Purpose (bisa fit mining modules walau tanpa bonus)
  { name: 'Capsule', bonus: 0.00, note: 'Basic, 1 turret slot' },
  { name: 'Nereus', bonus: 0.00, note: 'Hauler, can fit mining laser' },
  { name: 'Iteron Mark V', bonus: 0.00, note: 'Hauler, can fit mining laser' },
  { name: 'Badger', bonus: 0.00, note: 'Hauler, can fit mining laser' },
  { name: 'Tayra', bonus: 0.00, note: 'Hauler, can fit mining laser' },
  { name: 'Miasmos', bonus: 0.00, note: 'Ore hauler, can fit mining laser' },
  { name: 'Epithal', bonus: 0.00, note: 'Planetary hauler, can fit mining laser' },
  { name: 'Catalyst', bonus: 0.00, note: 'Destroyer, can fit mining laser' },
  { name: 'Coercer', bonus: 0.00, note: 'Destroyer, can fit mining laser' },
  { name: 'Thrasher', bonus: 0.00, note: 'Destroyer, can fit mining laser' },
  { name: 'Cormorant', bonus: 0.00, note: 'Destroyer, can fit mining laser' },
  { name: 'Vexor', bonus: 0.00, note: 'Cruiser, can fit mining laser' },
  { name: 'Osprey', bonus: 0.00, note: 'Cruiser, can fit mining laser' },
  { name: 'Caracal', bonus: 0.00, note: 'Cruiser, can fit mining laser' },
  { name: 'Thorax', bonus: 0.00, note: 'Cruiser, can fit mining laser' },
  { name: 'Drake', bonus: 0.00, note: 'Battlecruiser, can fit mining laser' },
  { name: 'Myrmidon', bonus: 0.00, note: 'Battlecruiser, can fit mining laser' },
  { name: 'Prophecy', bonus: 0.00, note: 'Battlecruiser, can fit mining laser' },
  { name: 'Hurricane', bonus: 0.00, note: 'Battlecruiser, can fit mining laser' },
  { name: 'Dominix', bonus: 0.00, note: 'Battleship, can fit mining laser' },
  { name: 'Scorpion', bonus: 0.00, note: 'Battleship, can fit mining laser' },
  { name: 'Raven', bonus: 0.00, note: 'Battleship, can fit mining laser' },
  { name: 'Megathron', bonus: 0.00, note: 'Battleship, can fit mining laser' },
  { name: 'Custom (no bonus)', bonus: 0.00, note: 'Manual — set your own yield' },
];

const MODULES = {
  ore: [
    { name: 'Mining Laser I', yield: 40, cycle: 60, residue: 0 },
    { name: 'Mining Laser II', yield: 60, cycle: 60, residue: 0 },
    { name: 'Modulated Deep Core Miner II', yield: 60, cycle: 60, residue: 33.4 },
    { name: 'Strip Miner I', yield: 540, cycle: 180, residue: 0 },
    { name: 'Strip Miner II', yield: 800, cycle: 180, residue: 0 },
    { name: 'Modulated Strip Miner II', yield: 800, cycle: 180, residue: 33.4 },
    { name: 'ORE Strip Miner', yield: 900, cycle: 180, residue: 0 },
    { name: 'Deep Core Mining Laser I', yield: 40, cycle: 60, residue: 0 },
    { name: 'Deep Core Mining Laser II', yield: 60, cycle: 60, residue: 33.4 },
  ],
  ice: [
    { name: 'Ice Harvester I', yield: 1000, cycle: 300, residue: 0 },
    { name: 'Ice Harvester II', yield: 1000, cycle: 240, residue: 0 },
    { name: 'ORE Ice Harvester', yield: 1000, cycle: 200, residue: 0 },
  ],
  gas: [
    { name: 'Gas Harvester I', yield: 10, cycle: 30, residue: 0 },
    { name: 'Gas Harvester II', yield: 20, cycle: 30, residue: 0 },
  ]
};

// Ore presets: name, volume per unit (m³), m³ of ore per cycle reference
const ORE_PRESETS = [
  { name: 'Veldspar', vol: 0.1 },
  { name: 'Scordite', vol: 0.15 },
  { name: 'Pyroxeres', vol: 0.3 },
  { name: 'Plagioclase', vol: 0.35 },
  { name: 'Omber', vol: 0.6 },
  { name: 'Kernite', vol: 1.2 },
  { name: 'Jaspet', vol: 2.0 },
  { name: 'Hemorphite', vol: 3.0 },
  { name: 'Hedbergite', vol: 3.0 },
  { name: 'Gneiss', vol: 5.0 },
  { name: 'Dark Ochre', vol: 8.0 },
  { name: 'Crokite', vol: 16.0 },
  { name: 'Bistot', vol: 16.0 },
  { name: 'Arkonor', vol: 16.0 },
  { name: 'Mercoxit', vol: 40.0 },
];

const ICE_PRESETS = [
  { name: 'White Glaze', vol: 1000 },
  { name: 'Blue Ice', vol: 1000 },
  { name: 'Clear Icicle', vol: 1000 },
  { name: 'Glacial Mass', vol: 1000 },
  { name: 'Smooth Glacial', vol: 1000 },
  { name: 'Enriched Clear Icicle', vol: 1000 },
  { name: 'Thick Blue Ice', vol: 1000 },
  { name: 'Pristine White Glaze', vol: 1000 },
  { name: 'Gelidus', vol: 1000 },
  { name: 'Krystallos', vol: 1000 },
];

const GAS_PRESETS = [
  { name: 'Cytoserocin', unitSize: 5 },
  { name: 'Golden Cytoserocin', unitSize: 10 },
  { name: 'Amber Cytoserocin', unitSize: 5 },
  { name: 'Azure Cytoserocin', unitSize: 5 },
  { name: 'Celadon Cytoserocin', unitSize: 5 },
  { name: 'Emerald Cytoserocin', unitSize: 5 },
  { name: 'Lime Cytoserocin', unitSize: 5 },
  { name: 'Malachite Cytoserocin', unitSize: 5 },
  { name: 'Vermillion Cytoserocin', unitSize: 5 },
  { name: 'Viridian Cytoserocin', unitSize: 5 },
  { name: 'Fullerite-C28', unitSize: 1 },
  { name: 'Fullerite-C32', unitSize: 1 },
  { name: 'Fullerite-C320', unitSize: 1 },
  { name: 'Fullerite-C50', unitSize: 1 },
  { name: 'Fullerite-C540', unitSize: 1 },
  { name: 'Fullerite-C60', unitSize: 1 },
  { name: 'Fullerite-C70', unitSize: 1 },
  { name: 'Fullerite-C72', unitSize: 1 },
  { name: 'Fullerite-C84', unitSize: 1 },
];

// ========== STATE ==========
const state = {
  mode: 'single',
  resourceType: 'ore',
  setups: {
    1: { ship: '', module: '', numModules: 2, skill: 5, implant: 0, residue: 0, target: 10000, presetName: '' },
    2: { ship: '', module: '', numModules: 2, skill: 5, implant: 0, residue: 0, target: 10000, presetName: '' },
  }
};

// ========== HELPERS ==========
function $(id) { return document.getElementById(id); }
function qs(sel, ctx) { return (ctx || document).querySelector(sel); }
function qsa(sel, ctx) { return [...(ctx || document).querySelectorAll(sel)]; }

function formatTime(seconds) {
  if (!isFinite(seconds) || seconds < 0) return '∞';
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 24) {
    const d = Math.floor(h / 24);
    const rh = h % 24;
    return `${d}d ${rh}h ${m}m`;
  }
  if (h > 0) return `${h}h ${m}m ${s}s`;
  return `${m}m ${s}s`;
}

function formatNum(n, dec = 2) {
  if (!isFinite(n)) return '∞';
  return n.toLocaleString(undefined, { minimumFractionDigits: dec, maximumFractionDigits: dec });
}

// ========== POPULATE SELECTS ==========
function populateSelect(selId, items) {
  const sel = $(selId);
  sel.innerHTML = items.map((item, i) =>
    `<option value="${i}">${item.name}${item.note ? ' — ' + item.note : ''}</option>`
  ).join('');
}

function populatePresets(containerId, presets) {
  const container = $(containerId);
  container.innerHTML = presets.map((p, i) =>
    `<button class="chip" data-idx="${i}">${p.name}</button>`
  ).join('');
}

// ========== UPDATE UI FOR RESOURCE TYPE ==========
function updateResourceUI() {
  const t = state.resourceType;
  const ships = SHIPS;
  const modules = MODULES[t];

  ['ship1', 'ship2'].forEach(id => populateSelect(id, ships));
  ['module1', 'module2'].forEach(id => populateSelect(id, modules));
  populatePresets('presets1', t === 'ore' ? ORE_PRESETS : t === 'ice' ? ICE_PRESETS : GAS_PRESETS);
  populatePresets('presets2', t === 'ore' ? ORE_PRESETS : t === 'ice' ? ICE_PRESETS : GAS_PRESETS);

  // Reset resize height when switching resource type
  ['presets1', 'presets2'].forEach(id => { $(id).style.height = ''; });

  // Update labels & residue visibility
  for (let n = 1; n <= 2; n++) {
    if (t === 'gas') {
      $(`targetLabel${n}`).textContent = 'Target Amount';
      $(`targetUnit${n}`).textContent = 'units';
    } else {
      $(`targetLabel${n}`).textContent = 'Target Volume';
      $(`targetUnit${n}`).textContent = 'm³';
    }
    // Residue only for ore with deep core / modulated modules
    const modIdx = parseInt($(`module${n}`).value) || 0;
    const mod = modules[modIdx];
    const hasResidue = t === 'ore' && mod && mod.residue > 0;
    $(`residueField${n}`).style.display = hasResidue ? '' : 'none';
    if (hasResidue && parseFloat($(`residue${n}`).value) === 0) {
      $(`residue${n}`).value = mod.residue;
    }
    $(`residueResult${n}`).style.display = hasResidue ? '' : 'none';
  }

  // Set first module as default and trigger residue
  for (let n = 1; n <= 2; n++) {
    const modIdx = parseInt($(`module${n}`).value) || 0;
    const mod = modules[modIdx];
    if (mod && mod.residue > 0) {
      $(`residue${n}`).value = mod.residue;
    }
  }

  calculateAll();
}

// ========== CALCULATE SETUP ==========
function calcSetup(n) {
  const t = state.resourceType;
  const ships = SHIPS;
  const modules = MODULES[t];

  const shipIdx = parseInt($(`ship${n}`).value) || 0;
  const modIdx = parseInt($(`module${n}`).value) || 0;
  const numMod = Math.max(1, parseInt($(`numModules${n}`).value) || 1);
  const skill = Math.min(5, Math.max(0, parseInt($(`skillLevel${n}`).value) || 0));
  const implant = Math.max(0, parseFloat($(`implant${n}`).value) || 0) / 100;
  const residue = Math.max(0, Math.min(100, parseFloat($(`residue${n}`).value) || 0)) / 100;
  const target = Math.max(1, parseFloat($(`target${n}`).value) || 1);

  const ship = ships[shipIdx];
  const mod = modules[modIdx];

  if (!mod) return null;

  // Skill bonus: 5% per level for mining, 10% per level for ice/gas specific
  const skillMultiplier = 1 + (skill * 0.05);

  // Ship bonus
  const shipMultiplier = 1 + (ship ? ship.bonus : 0);

  // Implant bonus
  const implantMultiplier = 1 + implant;

  // Effective yield per module per cycle
  const baseYield = mod.yield;
  const effectiveYieldPerModule = baseYield * skillMultiplier * shipMultiplier * implantMultiplier;

  // Total yield per cycle (all modules)
  const totalYieldPerCycle = effectiveYieldPerModule * numMod;

  // Effective yield after residue loss
  const effectiveYieldAfterResidue = totalYieldPerCycle * (1 - residue);

  // Cycle time (seconds)
  const cycleTime = mod.cycle;

  // Cycles per hour
  const cyclesPerHour = 3600 / cycleTime;

  // Yield per hour
  const yieldPerHour = effectiveYieldAfterResidue * cyclesPerHour;

  // For gas: target is in units, convert to m³ for calculation
  let targetM3 = target;
  if (t === 'gas') {
    const gasPresets = GAS_PRESETS;
    const chipActive = qsa(`#presets${n} .chip.active`);
    if (chipActive.length > 0) {
      const idx = parseInt(chipActive[0].dataset.idx);
      targetM3 = target * (gasPresets[idx]?.unitSize || 5);
    } else {
      targetM3 = target * 5; // default
    }
  }

  // Total cycles needed
  const totalCycles = effectiveYieldAfterResidue > 0 ? Math.ceil(targetM3 / effectiveYieldAfterResidue) : Infinity;

  // Total time
  const totalTime = totalCycles === Infinity ? Infinity : totalCycles * cycleTime;

  // Residue lost
  const residuePerCycle = totalYieldPerCycle * residue;
  const totalResidue = totalCycles === Infinity ? Infinity : residuePerCycle * totalCycles;

  return {
    yieldPerCycle: effectiveYieldAfterResidue,
    yieldPerHour,
    cycleTime,
    totalCycles,
    totalTime,
    totalResidue,
    residuePerCycle,
    hasResidue: t === 'ore' && mod.residue > 0,
  };
}

// ========== UPDATE RESULTS DISPLAY ==========
function updateResults(n, data) {
  if (!data) {
    ['yieldCycle', 'yieldHour', 'cycleTime', 'cycles', 'totalTime', 'residue'].forEach(k => {
      $(`r_${k}${n}`).textContent = '—';
    });
    return;
  }

  $(`r_yieldCycle${n}`).textContent = `${formatNum(data.yieldPerCycle)} m³`;
  $(`r_yieldHour${n}`).textContent = `${formatNum(data.yieldPerHour)} m³`;
  $(`r_cycleTime${n}`).textContent = formatTime(data.cycleTime);
  $(`r_cycles${n}`).textContent = data.totalCycles === Infinity ? '∞' : formatNum(data.totalCycles, 0);
  $(`r_totalTime${n}`).textContent = formatTime(data.totalTime);
  $(`r_residue${n}`).textContent = data.hasResidue ? `${formatNum(data.totalResidue)} m³` : '—';
}

// ========== COMPARE ==========
function updateCompare(data1, data2) {
  const summary = $('compareSummary');
  if (state.mode !== 'compare') { summary.style.display = 'none'; return; }
  summary.style.display = '';

  if (!data1 || !data2) {
    $('compareWinner').textContent = 'Enter data for both setups';
    $('compareDiff').textContent = '';
    $('barA').style.width = '0%';
    $('barB').style.width = '0%';
    return;
  }

  const yph1 = data1.yieldPerHour;
  const yph2 = data2.yieldPerHour;
  const max = Math.max(yph1, yph2, 1);

  $('barA').style.width = `${(yph1 / max) * 100}%`;
  $('barB').style.width = `${(yph2 / max) * 100}%`;

  if (Math.abs(yph1 - yph2) < 0.01) {
    $('compareWinner').textContent = '⚖️ Both setups are equal';
    $('compareDiff').textContent = '';
  } else if (yph1 > yph2) {
    const pct = ((yph1 - yph2) / yph2 * 100).toFixed(1);
    $('compareWinner').textContent = '🏆 Setup 1 is more efficient';
    $('compareDiff').textContent = `+${formatNum(yph1 - yph2)} m³/h faster (${pct}% more yield)`;
  } else {
    const pct = ((yph2 - yph1) / yph1 * 100).toFixed(1);
    $('compareWinner').textContent = '🏆 Setup 2 is more efficient';
    $('compareDiff').textContent = `+${formatNum(yph2 - yph1)} m³/h faster (${pct}% more yield)`;
  }
}

// ========== CALCULATE ALL ==========
function calculateAll() {
  const d1 = calcSetup(1);
  const d2 = calcSetup(2);
  updateResults(1, d1);
  updateResults(2, d2);
  updateCompare(d1, d2);
}

// ========== EVENT LISTENERS ==========
function init() {
  // Copyright footer
  const el = $('copyright-text');
  if (el) el.textContent = `© ${new Date().getFullYear()} KingSyah`;

  // Initial populate
  updateResourceUI();

  // Mode tabs
  qsa('.tab').forEach(btn => {
    btn.addEventListener('click', () => {
      qsa('.tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.mode = btn.dataset.mode;
      const app = document.querySelector('.app');
      const s2 = $('setup2');
      const vs = $('vsDivider');
      const summary = $('compareSummary');
      if (state.mode === 'compare') {
        app.classList.add('compare-active');
        s2.style.display = '';
        vs.style.display = '';
        summary.style.display = '';
      } else {
        app.classList.remove('compare-active');
        s2.style.display = 'none';
        vs.style.display = 'none';
        summary.style.display = 'none';
      }
      calculateAll();
    });
  });

  // Resource type segment
  qsa('.seg-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      qsa('.seg-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.resourceType = btn.dataset.type;
      updateResourceUI();
    });
  });

  // Preset chips
  for (let n = 1; n <= 2; n++) {
    $(`presets${n}`).addEventListener('click', (e) => {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      qsa(`#presets${n} .chip`).forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const idx = parseInt(chip.dataset.idx);
      const t = state.resourceType;
      if (t === 'gas') {
        const preset = GAS_PRESETS[idx];
        $(`target${n}`).value = preset.unitSize * 100; // default 100 units
      }
      calculateAll();
    });
  }

  // Input listeners for both setups
  for (let n = 1; n <= 2; n++) {
    const fields = ['ship', 'module', 'numModules', 'skillLevel', 'implant', 'residue', 'target'];
    fields.forEach(f => {
      const el = $(`${f}${n}`);
      if (!el) return;
      const evt = el.tagName === 'SELECT' ? 'change' : 'input';
      el.addEventListener(evt, () => {
        // Update residue when module changes
        if (f === 'module') {
          const t = state.resourceType;
          const modules = MODULES[t];
          const modIdx = parseInt(el.value) || 0;
          const mod = modules[modIdx];
          const hasResidue = t === 'ore' && mod && mod.residue > 0;
          $(`residueField${n}`).style.display = hasResidue ? '' : 'none';
          $(`residueResult${n}`).style.display = hasResidue ? '' : 'none';
          if (hasResidue) $(`residue${n}`).value = mod.residue;
        }
        calculateAll();
      });
    });
  }

  // Set default values
  for (let n = 1; n <= 2; n++) {
    $(`ship${n}`).value = '0';
    $(`module${n}`).value = '0';
  }

  calculateAll();
}

// ========== START ==========
document.addEventListener('DOMContentLoaded', init);
