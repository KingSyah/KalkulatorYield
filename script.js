// ============================================================
// EVE Online Mining Calculator v3.0
// End-Game Features: Fleet Boosts, Drones, Implants, Time-to-Pop
// ============================================================

// ========== EVE ONLINE GAME DATA ==========

const SHIPS = [
  { name: 'Venture',   cat: 'frigate',     miningYieldMult: 2.0,  stripYieldMult: 1.0, iceYieldMult: 1.0,  cycleTimeRed: 0.0, iceCycleTimeRed: 0.0,  note: 'Role: +100% mining yield' },
  { name: 'Prospect',  cat: 'frigate',     miningYieldMult: 1.5,  stripYieldMult: 1.0, iceYieldMult: 1.0,  cycleTimeRed: 0.0, iceCycleTimeRed: 0.0,  note: 'Role: +50% mining/gas yield' },
  { name: 'Endurance', cat: 'ice_frigate', miningYieldMult: 1.0,  stripYieldMult: 1.0, iceYieldMult: 1.5,  cycleTimeRed: 0.0, iceCycleTimeRed: 0.20, note: 'Role: +50% ice, -20% ice cycle' },
  { name: 'Procurer',  cat: 'barge',       miningYieldMult: 1.0,  stripYieldMult: 1.0, iceYieldMult: 1.0,  cycleTimeRed: 0.0, iceCycleTimeRed: 0.0,  note: 'Mining Barge: +5%/lvl yield, -5%/lvl cycle' },
  { name: 'Retriever', cat: 'barge',       miningYieldMult: 1.5,  stripYieldMult: 1.0, iceYieldMult: 1.0,  cycleTimeRed: 0.0, iceCycleTimeRed: 0.0,  note: 'Ship: +50% yield' },
  { name: 'Covetor',   cat: 'barge',       miningYieldMult: 1.25, stripYieldMult: 1.0, iceYieldMult: 1.0,  cycleTimeRed: 0.0, iceCycleTimeRed: 0.0,  note: 'Ship: +25% yield' },
  { name: 'Skiff',     cat: 'exhumer',     miningYieldMult: 1.0,  stripYieldMult: 1.0, iceYieldMult: 1.0,  cycleTimeRed: 0.0, iceCycleTimeRed: 0.0,  note: 'Exhumer: +5%/lvl yield, -5%/lvl cycle' },
  { name: 'Mackinaw',  cat: 'exhumer',     miningYieldMult: 1.0,  stripYieldMult: 1.0, iceYieldMult: 1.15, cycleTimeRed: 0.0, iceCycleTimeRed: 0.0,  note: 'Ship: +15% ice yield' },
  { name: 'Hulk',      cat: 'exhumer',     miningYieldMult: 1.0,  stripYieldMult: 1.25,iceYieldMult: 1.0,  cycleTimeRed: 0.0, iceCycleTimeRed: 0.0,  note: 'Ship: +25% strip yield' },
  { name: 'Porpoise',  cat: 'porpoise',    miningYieldMult: 1.0,  stripYieldMult: 1.0, iceYieldMult: 1.0,  droneYieldMult: 1.25, cycleTimeRed: 0.0, iceCycleTimeRed: 0.0, note: '+25% drone yield' },
  { name: 'Orca',      cat: 'capital_cmd', miningYieldMult: 1.0,  stripYieldMult: 1.0, iceYieldMult: 1.0,  droneYieldMult: 1.25, cycleTimeRed: 0.0, iceCycleTimeRed: 0.0, note: '+25% drone yield, strip/ice via Core' },
  { name: 'Rorqual',   cat: 'capital_cmd', miningYieldMult: 1.0,  stripYieldMult: 1.0, iceYieldMult: 1.0,  droneYieldMult: 1.50, cycleTimeRed: 0.0, iceCycleTimeRed: 0.0, note: '+50% drone yield, strip/ice via Core' },
  { name: 'Custom (no bonus)', cat: 'general', miningYieldMult: 1.0, stripYieldMult: 1.0, iceYieldMult: 1.0, cycleTimeRed: 0.0, iceCycleTimeRed: 0.0, note: 'Manual parameters' },
];

const BARGE_EXHUMER = ['barge', 'exhumer'];

// ========== FLEET BOOST DATA ==========
// Mining Laser Optimization Burst (Foreman Burst)
// Source: EVE Online — Mining Foreman Burst effects
const FLEET_BOOSTS = [
  { name: 'None',                          cycleRed: 0.00, yieldBonus: 0.00 },
  { name: 'T1 Bursts (unbonused)',         cycleRed: 0.07, yieldBonus: 0.03 },
  { name: 'T2 Bursts (unbonused)',         cycleRed: 0.10, yieldBonus: 0.05 },
  { name: 'T1 Bursts (Porpoise)',          cycleRed: 0.11, yieldBonus: 0.05 },
  { name: 'T2 Bursts (Porpoise)',          cycleRed: 0.15, yieldBonus: 0.08 },
  { name: 'T1 Bursts (Orca)',              cycleRed: 0.14, yieldBonus: 0.07 },
  { name: 'T2 Bursts (Orca)',              cycleRed: 0.20, yieldBonus: 0.10 },
  { name: 'T1 Bursts (Rorqual)',           cycleRed: 0.17, yieldBonus: 0.09 },
  { name: 'T2 Bursts (Rorqual)',           cycleRed: 0.25, yieldBonus: 0.13 },
];

// ========== IMPLANT / BOOSTER PRESETS ==========
// Implants and boosters that affect mining yield
const IMPLANT_PRESETS = [
  { name: 'None',                   bonus: 0.00  },
  { name: 'Michi\'s Excavation (1%)', bonus: 0.01 },
  { name: 'Michi\'s Excavation (3%)', bonus: 0.03 },
  { name: 'Michi\'s Excavation (5%)', bonus: 0.05 },
  { name: 'High-grade Michi (7%)',   bonus: 0.07 },
  { name: 'Mining Laser Upgrade (5%)', bonus: 0.05 },
  { name: 'Booster: X-Instinct (+3%)', bonus: 0.03 },
  { name: 'Booster: Strong X-Instinct (+5%)', bonus: 0.05 },
  { name: 'Custom %',               bonus: 0.00, custom: true },
];

// ========== MINING MODULES ==========
const MODULES = {
  ore: [
    { name: 'Mining Laser I',                yield: 40,  cycle: 60,  residueProb: 0.00, slot: 'turret' },
    { name: 'Mining Laser II',               yield: 60,  cycle: 60,  residueProb: 0.00, slot: 'turret' },
    { name: 'Deep Core Mining Laser I',      yield: 40,  cycle: 60,  residueProb: 0.00, slot: 'turret' },
    { name: 'Deep Core Mining Laser II',     yield: 60,  cycle: 60,  residueProb: 0.34, slot: 'turret' },
    { name: 'Modulated Deep Core Miner II',  yield: 60,  cycle: 60,  residueProb: 0.34, slot: 'turret' },
    { name: 'Strip Miner I',                 yield: 540, cycle: 180, residueProb: 0.00, slot: 'strip' },
    { name: 'Modulated Strip Miner II',      yield: 800, cycle: 180, residueProb: 0.34, slot: 'strip' },
    { name: 'ORE Strip Miner',               yield: 900, cycle: 180, residueProb: 0.00, slot: 'strip' },
  ],
  ice: [
    { name: 'Ice Harvester I',   yield: 1000, cycle: 300, residueProb: 0.00, slot: 'ice' },
    { name: 'Ice Harvester II',  yield: 1000, cycle: 240, residueProb: 0.00, slot: 'ice' },
    { name: 'ORE Ice Harvester', yield: 1000, cycle: 200, residueProb: 0.00, slot: 'ice' },
  ],
  gas: [
    { name: 'Gas Harvester I',  yield: 10, cycle: 30, residueProb: 0.00, slot: 'turret' },
    { name: 'Gas Harvester II', yield: 20, cycle: 30, residueProb: 0.00, slot: 'turret' },
  ],
  drone: [
    { name: 'Mining Drone I',          yield: 25, cycle: 60, residueProb: 0.00, slot: 'drone' },
    { name: 'Mining Drone II',         yield: 33, cycle: 60, residueProb: 0.00, slot: 'drone' },
    { name: 'Augmented Mining Drone',  yield: 40, cycle: 60, residueProb: 0.00, slot: 'drone' },
    { name: 'Excavator Mining Drone',  yield: 80, cycle: 60, residueProb: 0.00, slot: 'drone' },
  ]
};

// ========== DRONE DATA (for the separate drone section) ==========
const DRONE_TYPES = [
  { name: 'No drones',               yield: 0,  cycle: 60 },
  { name: 'Mining Drone I',          yield: 25, cycle: 60 },
  { name: 'Mining Drone II',         yield: 33, cycle: 60 },
  { name: 'Augmented Mining Drone',  yield: 40, cycle: 60 },
  { name: 'Excavator Mining Drone',  yield: 80, cycle: 60 },
];

// ========== PRESETS ==========
const ORE_PRESETS = [
  { name: 'Veldspar', vol: 0.1 }, { name: 'Scordite', vol: 0.15 }, { name: 'Pyroxeres', vol: 0.3 },
  { name: 'Plagioclase', vol: 0.35 }, { name: 'Omber', vol: 0.6 }, { name: 'Kernite', vol: 1.2 },
  { name: 'Jaspet', vol: 2.0 }, { name: 'Hemorphite', vol: 3.0 }, { name: 'Hedbergite', vol: 3.0 },
  { name: 'Gneiss', vol: 5.0 }, { name: 'Dark Ochre', vol: 8.0 }, { name: 'Crokite', vol: 16.0 },
  { name: 'Bistot', vol: 16.0 }, { name: 'Arkonor', vol: 16.0 }, { name: 'Mercoxit', vol: 40.0 },
];
const ICE_PRESETS = [
  { name: 'White Glaze', vol: 1000 }, { name: 'Blue Ice', vol: 1000 }, { name: 'Clear Icicle', vol: 1000 },
  { name: 'Glacial Mass', vol: 1000 }, { name: 'Smooth Glacial Mass', vol: 1000 },
  { name: 'Enriched Clear Icicle', vol: 1000 }, { name: 'Thick Blue Ice', vol: 1000 },
  { name: 'Pristine White Glaze', vol: 1000 }, { name: 'Gelidus', vol: 1000 }, { name: 'Krystallos', vol: 1000 },
];
const GAS_PRESETS = [
  { name: 'Cytoserocin', unitSize: 5 }, { name: 'Golden Cytoserocin', unitSize: 10 },
  { name: 'Amber Cytoserocin', unitSize: 5 }, { name: 'Azure Cytoserocin', unitSize: 5 },
  { name: 'Celadon Cytoserocin', unitSize: 5 }, { name: 'Emerald Cytoserocin', unitSize: 5 },
  { name: 'Lime Cytoserocin', unitSize: 5 }, { name: 'Malachite Cytoserocin', unitSize: 5 },
  { name: 'Vermillion Cytoserocin', unitSize: 5 }, { name: 'Viridian Cytoserocin', unitSize: 5 },
  { name: 'Fullerite-C28', unitSize: 1 }, { name: 'Fullerite-C32', unitSize: 1 },
  { name: 'Fullerite-C320', unitSize: 1 }, { name: 'Fullerite-C50', unitSize: 1 },
  { name: 'Fullerite-C540', unitSize: 1 }, { name: 'Fullerite-C60', unitSize: 1 },
  { name: 'Fullerite-C70', unitSize: 1 }, { name: 'Fullerite-C72', unitSize: 1 },
  { name: 'Fullerite-C84', unitSize: 1 },
];


// ========== STATE ==========
const state = {
  mode: 'single',
  resourceType: 'ore',
};


// ========== HELPERS ==========
function $(id) { return document.getElementById(id); }
function qsa(sel, ctx) { return [...(ctx || document).querySelectorAll(sel)]; }

function formatTime(seconds) {
  if (!isFinite(seconds) || seconds < 0) return '∞';
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 24) { const d = Math.floor(h / 24); return `${d}d ${h % 24}h ${m}m`; }
  if (h > 0) return `${h}h ${m}m ${s}s`;
  return `${m}m ${s}s`;
}

function formatNum(n, dec = 2) {
  if (!isFinite(n)) return '∞';
  return n.toLocaleString(undefined, { minimumFractionDigits: dec, maximumFractionDigits: dec });
}


// ========== POPULATE UI ==========
function populateSelect(selId, items) {
  const sel = $(selId);
  sel.innerHTML = items.map((item, i) =>
    `<option value="${i}">${item.name}${item.note ? ' — ' + item.note : ''}</option>`
  ).join('');
}

function populatePresets(containerId, presets) {
  $(containerId).innerHTML = presets.map((p, i) =>
    `<button class="chip" data-idx="${i}">${p.name}</button>`
  ).join('');
}

function populateDroneSelect(selId) {
  const sel = $(selId);
  sel.innerHTML = DRONE_TYPES.map((d, i) =>
    `<option value="${i}">${d.name}${d.yield > 0 ? ` (${d.yield} m³/cycle)` : ''}</option>`
  ).join('');
}

function populateFleetBoost(selId) {
  const sel = $(selId);
  sel.innerHTML = FLEET_BOOSTS.map((b, i) =>
    `<option value="${i}">${b.name}${b.cycleRed > 0 ? ` (-${(b.cycleRed * 100).toFixed(0)}% cycle, +${(b.yieldBonus * 100).toFixed(0)}% yield)` : ''}</option>`
  ).join('');
}

function populateImplantPreset(selId) {
  const sel = $(selId);
  sel.innerHTML = IMPLANT_PRESETS.map((p, i) =>
    `<option value="${i}">${p.name}${p.bonus > 0 ? ` (+${(p.bonus * 100).toFixed(0)}%)` : ''}</option>`
  ).join('');
}


// ========== FILTER MODULES BY SHIP ==========
function getFilteredModules(resourceType, shipIdx) {
  const allMods = MODULES[resourceType];
  if (!allMods) return [];
  const ship = SHIPS[shipIdx];
  if (!ship) return allMods;
  const cat = ship.cat;
  if (BARGE_EXHUMER.includes(cat)) return allMods;
  if (cat === 'capital_cmd') return resourceType === 'drone' ? allMods : allMods.filter(m => m.slot === 'strip' || m.slot === 'ice');
  if (cat === 'ice_frigate') return allMods.filter(m => m.slot === 'turret' || m.slot === 'ice');
  if (cat === 'porpoise') return resourceType === 'drone' ? allMods : [];
  return allMods.filter(m => m.slot === 'turret');
}

function updateModulesForShip(n) {
  const t = state.resourceType;
  const shipIdx = parseInt($(`ship${n}`).value) || 0;
  const filtered = getFilteredModules(t, shipIdx);
  const sel = $(`module${n}`);
  const prevName = sel.options[sel.selectedIndex]?.text?.split(' — ')[0] || '';
  if (!filtered.length) { sel.innerHTML = '<option>No modules</option>'; $(`depletionResult${n}`).style.display = 'none'; return; }
  sel.innerHTML = filtered.map((m, i) => `<option value="${i}">${m.name}${m.slot === 'strip' || m.slot === 'ice' ? ' ⚓' : ''}</option>`).join('');
  const keepIdx = filtered.findIndex(m => m.name === prevName);
  if (keepIdx >= 0) sel.value = keepIdx;
  const mod = filtered[parseInt(sel.value) || 0];
  $(`depletionResult${n}`).style.display = (mod && mod.residueProb > 0) ? '' : 'none';
}


// ========== UPDATE UI FOR RESOURCE TYPE ==========
function updateResourceUI() {
  const t = state.resourceType;
  ['ship1', 'ship2'].forEach(id => populateSelect(id, SHIPS));
  for (let n = 1; n <= 2; n++) {
    updateModulesForShip(n);
    populateDroneSelect(`droneType${n}`);
    populateFleetBoost(`fleetBoost${n}`);
    populateImplantPreset(`implantPreset${n}`);
  }
  const presets = t === 'ore' ? ORE_PRESETS : t === 'ice' ? ICE_PRESETS : t === 'gas' ? GAS_PRESETS : [];
  populatePresets('presets1', presets);
  populatePresets('presets2', presets);
  for (let n = 1; n <= 2; n++) {
    $(`targetLabel${n}`).textContent = t === 'gas' ? 'Target Amount' : 'Target Vol';
    $(`targetUnit${n}`).textContent = t === 'gas' ? 'units' : 'm³';
  }
  calculateAll();
}


// ========== SKILL BONUSES ==========
function getSkillBonuses(shipCat, skillLevel) {
  const lvl = Math.max(0, Math.min(5, skillLevel));
  if (BARGE_EXHUMER.includes(shipCat)) {
    return { yieldMult: 1 + (lvl * 0.05), cycleMult: 1 - (lvl * 0.05) };
  }
  return { yieldMult: 1 + (lvl * 0.05), cycleMult: 1.0 };
}


// ========== CORE CALCULATION ==========
function calcSetup(n) {
  const t = state.resourceType;
  const shipIdx = parseInt($(`ship${n}`).value) || 0;
  const modules = getFilteredModules(t, shipIdx);
  if (!modules.length) return null;

  const modIdx = parseInt($(`module${n}`).value) || 0;
  const numMod = Math.max(1, parseInt($(`numModules${n}`).value) || 1);
  const skill = Math.min(5, Math.max(0, parseInt($(`skillLevel${n}`).value) || 0));
  const target = Math.max(1, parseFloat($(`target${n}`).value) || 1);
  const asteroidSize = parseFloat($(`asteroidSize${n}`).value) || 0;

  const ship = SHIPS[shipIdx];
  const mod = modules[modIdx];
  if (!mod) return null;

  // ── Implant / Booster ─────────────────────────────────
  const implantIdx = parseInt($(`implantPreset${n}`).value) || 0;
  const implantPreset = IMPLANT_PRESETS[implantIdx];
  let implantMult = 1.0;
  if (implantPreset && !implantPreset.custom) {
    implantMult = 1 + (implantPreset.bonus || 0);
  }

  // ── Fleet Boost ───────────────────────────────────────
  const boostIdx = parseInt($(`fleetBoost${n}`).value) || 0;
  const boost = FLEET_BOOSTS[boostIdx];
  const fleetCycleRed = boost ? boost.cycleRed : 0;
  const fleetYieldBonus = boost ? boost.yieldBonus : 0;

  // ── Ship bonuses ──────────────────────────────────────
  let shipYieldMult = 1.0;
  let shipCycleRed = 0.0;
  if (t === 'ore') {
    shipYieldMult = (ship.miningYieldMult || 1.0);
    if (mod.slot === 'strip') shipYieldMult *= (ship.stripYieldMult || 1.0);
    shipCycleRed = ship.cycleTimeRed || 0.0;
  } else if (t === 'ice') {
    shipYieldMult = (ship.iceYieldMult || 1.0);
    shipCycleRed = ship.iceCycleTimeRed || 0.0;
  } else if (t === 'gas') {
    shipYieldMult = (ship.miningYieldMult || 1.0);
  } else if (t === 'drone') {
    shipYieldMult = (ship.droneYieldMult || 1.0);
  }

  // ── Skill bonuses ─────────────────────────────────────
  const skillBonuses = getSkillBonuses(ship ? ship.cat : 'general', skill);

  // ── Module yield per cycle ────────────────────────────
  const effectiveYieldPerModule = mod.yield * shipYieldMult * skillBonuses.yieldMult * implantMult * (1 + fleetYieldBonus);
  const totalModuleYieldPerCycle = effectiveYieldPerModule * numMod;

  // ── Cycle time (ship + skill + fleet boost) ───────────
  // Fleet boost reduction is applied AFTER ship+skill
  const baseCycle = mod.cycle;
  const cycleAfterShipSkill = baseCycle * (1 - shipCycleRed) * skillBonuses.cycleMult;
  const effectiveCycleTime = cycleAfterShipSkill * (1 - fleetCycleRed);

  // ── Module hourly metrics ─────────────────────────────
  const cyclesPerHour = 3600 / effectiveCycleTime;
  const moduleYieldPerHour = totalModuleYieldPerCycle * cyclesPerHour;

  // ── Drone yield (separate calculation) ────────────────
  const droneIdx = parseInt($(`droneType${n}`).value) || 0;
  const numDrones = Math.max(0, Math.min(5, parseInt($(`numDrones${n}`).value) || 0));
  const droneType = DRONE_TYPES[droneIdx];
  let droneYieldPerHour = 0;
  if (droneType && droneType.yield > 0 && numDrones > 0) {
    const droneShipMult = (ship.droneYieldMult || 1.0);
    const droneCyclePerHour = 3600 / droneType.cycle;
    droneYieldPerHour = droneType.yield * numDrones * droneShipMult * skillBonuses.yieldMult * droneCyclePerHour;
  }

  // ── Total yield (modules + drones) ────────────────────
  const totalYieldPerHour = moduleYieldPerHour + droneYieldPerHour;

  // ── Residue / Asteroid Depletion ──────────────────────
  const residueProb = mod.residueProb || 0;
  const depletionPerCycle = totalModuleYieldPerCycle * (1 + residueProb);
  const depletionPerHour = depletionPerCycle * cyclesPerHour;

  // ── Target calculation ────────────────────────────────
  let targetM3 = target;
  if (t === 'gas') {
    const chipActive = qsa(`#presets${n} .chip.active`);
    if (chipActive.length > 0) {
      targetM3 = target * (GAS_PRESETS[parseInt(chipActive[0].dataset.idx)]?.unitSize || 5);
    } else {
      targetM3 = target * 5;
    }
  }

  // Cycles to fill target (module yield only, drones are bonus)
  const totalCycles = totalModuleYieldPerCycle > 0 ? Math.ceil(targetM3 / totalModuleYieldPerCycle) : Infinity;
  const totalTime = totalCycles === Infinity ? Infinity : totalCycles * effectiveCycleTime;

  // ── Time-to-Pop (asteroid depletion predictor) ────────
  let timeToPop = null;
  if (asteroidSize > 0 && depletionPerHour > 0) {
    // How long until the asteroid is completely depleted
    // If no residue, depletion = yield. If residue, depletion = yield × (1 + residueProb)
    timeToPop = (asteroidSize / depletionPerHour) * 3600; // in seconds
  }

  return {
    yieldPerCycle: totalModuleYieldPerCycle,
    moduleYieldPerHour,
    droneYieldPerHour,
    totalYieldPerHour,
    cycleTime: effectiveCycleTime,
    totalCycles,
    totalTime,
    depletionPerCycle,
    depletionPerHour,
    residueProb,
    hasResidue: residueProb > 0,
    timeToPop,
    hasTimeToPop: asteroidSize > 0,
  };
}


// ========== UPDATE RESULTS DISPLAY ==========
function updateResults(n, data) {
  if (!data) {
    ['yieldCycle', 'droneYield', 'totalYieldHour', 'cycleTime', 'cycles', 'totalTime', 'depletion', 'timetopop'].forEach(k => {
      const el = $(`r_${k}${n}`);
      if (el) el.textContent = '—';
    });
    return;
  }

  $(`r_yieldCycle${n}`).textContent = `${formatNum(data.yieldPerCycle)} m³`;
  $(`r_droneYield${n}`).textContent = data.droneYieldPerHour > 0 ? `${formatNum(data.droneYieldPerHour)} m³/hr` : '—';
  $(`r_totalYieldHour${n}`).textContent = `${formatNum(data.totalYieldPerHour)} m³`;
  $(`r_cycleTime${n}`).textContent = formatTime(data.cycleTime);
  $(`r_cycles${n}`).textContent = data.totalCycles === Infinity ? '∞' : formatNum(data.totalCycles, 0);
  $(`r_totalTime${n}`).textContent = formatTime(data.totalTime);

  // Asteroid Depletion
  if (data.hasResidue) {
    const pct = (data.residueProb * 100).toFixed(0);
    $(`r_depletion${n}`).textContent = `${formatNum(data.depletionPerHour)} m³/hr (+${pct}% extra)`;
  }

  // Time-to-Pop
  const ttpResult = $(`timetopopResult${n}`);
  if (data.hasTimeToPop && data.timeToPop !== null) {
    ttpResult.style.display = '';
    $(`r_timetopop${n}`).textContent = formatTime(data.timeToPop);
  } else {
    ttpResult.style.display = 'none';
  }
}


// ========== COMPARE ==========
function updateCompare(data1, data2) {
  const summary = $('compareSummary');
  if (state.mode !== 'compare') { summary.style.display = 'none'; return; }
  summary.style.display = '';
  if (!data1 || !data2) {
    $('compareWinner').textContent = 'Enter data for both setups';
    $('compareDiff').textContent = '';
    $('barA').style.width = '0%'; $('barB').style.width = '0%';
    return;
  }
  const yph1 = data1.totalYieldPerHour, yph2 = data2.totalYieldPerHour;
  const max = Math.max(yph1, yph2, 1);
  $('barA').style.width = `${(yph1 / max) * 100}%`;
  $('barB').style.width = `${(yph2 / max) * 100}%`;
  if (Math.abs(yph1 - yph2) < 0.01) {
    $('compareWinner').textContent = '⚖️ Both setups are equal';
    $('compareDiff').textContent = '';
  } else if (yph1 > yph2) {
    const pct = ((yph1 - yph2) / yph2 * 100).toFixed(1);
    $('compareWinner').textContent = '🏆 Setup 1 wins';
    $('compareDiff').textContent = `+${formatNum(yph1 - yph2)} m³/h (${pct}% more)`;
  } else {
    const pct = ((yph2 - yph1) / yph1 * 100).toFixed(1);
    $('compareWinner').textContent = '🏆 Setup 2 wins';
    $('compareDiff').textContent = `+${formatNum(yph2 - yph1)} m³/h (${pct}% more)`;
  }
}


// ========== CALCULATE ALL ==========
function calculateAll() {
  updateResults(1, calcSetup(1));
  updateResults(2, calcSetup(2));
  updateCompare(calcSetup(1), calcSetup(2));
}


// ========== INIT ==========
function init() {
  const el = $('copyright-text');
  if (el) el.textContent = `© ${new Date().getFullYear()} KingSyah · EVE Mining Calculator`;

  updateResourceUI();

  // Mode tabs
  qsa('.tab').forEach(btn => {
    btn.addEventListener('click', () => {
      qsa('.tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.mode = btn.dataset.mode;
      const app = $('app'), s2 = $('setup2'), vs = $('vsDivider'), sum = $('compareSummary');
      if (state.mode === 'compare') { app.classList.add('compare-active'); s2.style.display = ''; vs.style.display = ''; sum.style.display = ''; }
      else { app.classList.remove('compare-active'); s2.style.display = 'none'; vs.style.display = 'none'; sum.style.display = 'none'; }
      calculateAll();
    });
  });

  // Resource type
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
      if (state.resourceType === 'gas') {
        $(`target${n}`).value = GAS_PRESETS[parseInt(chip.dataset.idx)]?.unitSize * 100 || 500;
      }
      calculateAll();
    });
  }

  // All input listeners
  const allFields = ['ship', 'module', 'numModules', 'skillLevel', 'target', 'asteroidSize',
                     'droneType', 'numDrones', 'fleetBoost', 'implantPreset'];
  for (let n = 1; n <= 2; n++) {
    allFields.forEach(f => {
      const el = $(`${f}${n}`);
      if (!el) return;
      const evt = el.tagName === 'SELECT' ? 'change' : 'input';
      el.addEventListener(evt, () => {
        if (f === 'ship' || f === 'module') updateModulesForShip(n);
        calculateAll();
      });
    });
  }

  // Defaults
  for (let n = 1; n <= 2; n++) {
    $(`ship${n}`).value = '0';
    $(`module${n}`).value = '0';
  }
  calculateAll();
}

// ========== THEME TOGGLE ==========
function initTheme() {
  const toggle = $('themeToggle'), icon = $('themeIcon'), html = document.documentElement;
  const saved = localStorage.getItem('eve-calc-theme') || 'dark';
  html.setAttribute('data-theme', saved);
  updateThemeIcon(saved);
  toggle.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('eve-calc-theme', next);
    updateThemeIcon(next);
  });
  function updateThemeIcon(theme) {
    icon.textContent = theme === 'dark' ? '🌙' : '☀️';
    toggle.title = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
  }
}

// ========== START ==========
document.addEventListener('DOMContentLoaded', () => { initTheme(); init(); });
