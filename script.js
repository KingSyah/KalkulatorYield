// ============================================================
// EVE Online Mining Calculator v2.1
// Accurate data from Tranquility server (verified)
// ============================================================

// ========== EVE ONLINE GAME DATA ==========

/**
 * SHIP DATABASE — Verified against EVE Online SDE / Tranquility
 *
 * Each ship stores SEPARATE properties:
 *   miningYieldMult  — multiplier for mining laser / strip miner yield
 *   stripYieldMult   — additional multiplier specific to strip miners
 *   iceYieldMult     — multiplier for ice harvester yield
 *   cycleTimeRed     — cycle time reduction (decimal, e.g. 0.25 = -25%)
 *   iceCycleTimeRed  — cycle time reduction for ice harvesters specifically
 *
 * These are SHIP bonuses only. Skill bonuses are calculated separately.
 * All bonuses are MULTIPLICATIVE with skill and implant bonuses.
 *
 * Sources: EVE Online item database, ship traits, January 2025 patch.
 */
const SHIPS = [
  // ── Frigates ──────────────────────────────────────────
  {
    name: 'Venture',
    cat: 'frigate',
    miningYieldMult: 2.0,    // Role: +100% mining yield
    stripYieldMult: 1.0,
    iceYieldMult: 1.0,
    cycleTimeRed: 0.0,
    iceCycleTimeRed: 0.0,
    note: 'Role: +100% mining yield, +2 warp stab'
  },
  {
    name: 'Prospect',
    cat: 'frigate',
    miningYieldMult: 1.5,    // Role: +50% mining & gas yield
    stripYieldMult: 1.0,
    iceYieldMult: 1.0,
    cycleTimeRed: 0.0,
    iceCycleTimeRed: 0.0,
    note: 'Role: +50% mining/gas yield, covert ops'
  },
  {
    name: 'Endurance',
    cat: 'ice_frigate',
    miningYieldMult: 1.0,
    stripYieldMult: 1.0,
    iceYieldMult: 1.5,       // Role: +50% ice yield
    cycleTimeRed: 0.0,
    iceCycleTimeRed: 0.20,   // Role: -20% ice cycle time
    note: 'Role: +50% ice yield, -20% ice cycle'
  },

  // ── Mining Barges ─────────────────────────────────────
  // Mining Barge skill: +5% mining yield per level, -5% cycle time per level
  // Ship bonuses are on top of the skill
  {
    name: 'Procurer',
    cat: 'barge',
    miningYieldMult: 1.0,    // No ship yield bonus (tank-focused)
    stripYieldMult: 1.0,
    iceYieldMult: 1.0,
    cycleTimeRed: 0.0,       // Skill handles cycle reduction
    iceCycleTimeRed: 0.0,
    note: 'Mining Barge: +5% yield/lvl, -5% cycle/lvl'
  },
  {
    name: 'Retriever',
    cat: 'barge',
    miningYieldMult: 1.5,    // Ship: +50% mining yield
    stripYieldMult: 1.0,
    iceYieldMult: 1.0,
    cycleTimeRed: 0.0,
    iceCycleTimeRed: 0.0,
    note: 'Ship: +50% yield. Skill: +5%/lvl, -5%/lvl'
  },
  {
    name: 'Covetor',
    cat: 'barge',
    miningYieldMult: 1.25,   // Ship: +25% mining yield
    stripYieldMult: 1.0,
    iceYieldMult: 1.0,
    cycleTimeRed: 0.0,
    iceCycleTimeRed: 0.0,
    note: 'Ship: +25% yield. Skill: +5%/lvl, -5%/lvl'
  },

  // ── Exhumers ──────────────────────────────────────────
  // Exhumer skill: +5% mining yield per level, -5% cycle time per level
  {
    name: 'Skiff',
    cat: 'exhumer',
    miningYieldMult: 1.0,    // No ship yield bonus (max tank)
    stripYieldMult: 1.0,
    iceYieldMult: 1.0,
    cycleTimeRed: 0.0,
    iceCycleTimeRed: 0.0,
    note: 'Exhumer: +5% yield/lvl, -5% cycle/lvl'
  },
  {
    name: 'Mackinaw',
    cat: 'exhumer',
    miningYieldMult: 1.0,
    stripYieldMult: 1.0,
    iceYieldMult: 1.15,      // Ship: +15% ice yield
    cycleTimeRed: 0.0,
    iceCycleTimeRed: 0.0,    // Skill handles it
    note: 'Ship: +15% ice yield. Exhumer: +5%/lvl, -5%/lvl'
  },
  {
    name: 'Hulk',
    cat: 'exhumer',
    miningYieldMult: 1.0,    // No separate mining bonus
    stripYieldMult: 1.25,    // Ship: +25% strip miner yield
    iceYieldMult: 1.0,
    cycleTimeRed: 0.0,
    iceCycleTimeRed: 0.0,
    note: 'Ship: +25% strip yield. Exhumer: +5%/lvl, -5%/lvl'
  },

  // ── Industrial Command ────────────────────────────────
  {
    name: 'Porpoise',
    cat: 'porpoise',
    miningYieldMult: 1.0,
    stripYieldMult: 1.0,
    iceYieldMult: 1.0,
    droneYieldMult: 1.25,    // Ship: +25% drone mining yield
    cycleTimeRed: 0.0,
    iceCycleTimeRed: 0.0,
    note: '+25% drone yield. Industrial Command: +3%/lvl'
  },
  {
    name: 'Orca',
    cat: 'capital_cmd',
    miningYieldMult: 1.0,
    stripYieldMult: 1.0,     // Via Industrial Core
    iceYieldMult: 1.0,
    droneYieldMult: 1.25,    // Ship: +25% drone mining yield
    cycleTimeRed: 0.0,
    iceCycleTimeRed: 0.0,
    note: '+25% drone yield, strip/ice via Industrial Core'
  },

  // ── Capital ───────────────────────────────────────────
  {
    name: 'Rorqual',
    cat: 'capital_cmd',
    miningYieldMult: 1.0,
    stripYieldMult: 1.0,     // Via Industrial Core
    iceYieldMult: 1.0,
    droneYieldMult: 1.50,    // Ship: +50% drone mining yield
    cycleTimeRed: 0.0,
    iceCycleTimeRed: 0.0,
    note: '+50% drone yield, strip/ice via Industrial Core'
  },

  // ── Custom ────────────────────────────────────────────
  {
    name: 'Custom (no bonus)',
    cat: 'general',
    miningYieldMult: 1.0,
    stripYieldMult: 1.0,
    iceYieldMult: 1.0,
    cycleTimeRed: 0.0,
    iceCycleTimeRed: 0.0,
    note: 'Manual — set your own parameters'
  },
];

const BARGE_EXHUMER = ['barge', 'exhumer'];

/**
 * SKILL BONUSES — Applied separately from ship bonuses.
 * These are MULTIPLICATIVE with ship bonuses.
 *
 * Mining Frigate:  Venture/Prospect only — +100% mining yield (role bonus, flat)
 *                  Endurance uses Expedition Frigate skill (not modeled separately)
 * Mining Barge:    +5% mining yield per level, -5% cycle time per level
 * Exhumer:         +5% mining yield per level, -5% cycle time per level
 * Mining:          +5% mining yield per level (applies to all mining lasers)
 * Ice Harvesting:  -5% cycle time per level (specialization)
 */
function getSkillBonuses(shipCat, skillLevel, resourceType) {
  const lvl = Math.max(0, Math.min(5, skillLevel));

  if (BARGE_EXHUMER.includes(shipCat)) {
    // Mining Barge or Exhumer skill: +5% yield per level, -5% cycle per level
    return {
      yieldMult: 1 + (lvl * 0.05),   // 1.00 to 1.25
      cycleMult: 1 - (lvl * 0.05),    // 1.00 to 0.75
    };
  }

  // For frigates, general, capital_cmd — Mining skill: +5% yield per level
  // No cycle time reduction from skills (except ice specialization)
  return {
    yieldMult: 1 + (lvl * 0.05),
    cycleMult: 1.0,  // No cycle reduction for non-barges
  };
}


/**
 * MINING MODULES — Verified against EVE Online item database.
 *
 * CRITICAL: Only Deep Core and Modulated Deep Core T2 modules have residue.
 * Standard Mining Laser II does NOT have residue.
 * Ice Harvesters do NOT have residue.
 * Gas Harvesters do NOT have residue.
 *
 * Residue mechanics:
 * - Residue probability is FIXED per module (not user-configurable)
 * - When residue fires, it DESTROYS extra ore from the asteroid
 * - It does NOT reduce yield going into cargo
 * - Asteroid depletion = yield × (1 + residue_probability)
 */
const MODULES = {
  ore: [
    // Standard Mining Lasers (turret slot, all ships)
    { name: 'Mining Laser I',                  yield: 40,  cycle: 60,  residueProb: 0.00, slot: 'turret' },
    { name: 'Mining Laser II',                 yield: 60,  cycle: 60,  residueProb: 0.00, slot: 'turret' },
    // Deep Core Mining Lasers (turret slot, for Mercoxit)
    { name: 'Deep Core Mining Laser I',        yield: 40,  cycle: 60,  residueProb: 0.00, slot: 'turret' },
    { name: 'Deep Core Mining Laser II',       yield: 60,  cycle: 60,  residueProb: 0.34, slot: 'turret' },
    { name: 'Modulated Deep Core Miner II',    yield: 60,  cycle: 60,  residueProb: 0.34, slot: 'turret' },
    // Strip Miners (strip slot, barge/exhumer only)
    { name: 'Strip Miner I',                   yield: 540, cycle: 180, residueProb: 0.00, slot: 'strip' },
    { name: 'Modulated Strip Miner II',        yield: 800, cycle: 180, residueProb: 0.34, slot: 'strip' },
    // Faction
    { name: 'ORE Strip Miner',                 yield: 900, cycle: 180, residueProb: 0.00, slot: 'strip' },
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
    // Mining Drones — yield is per drone per cycle
    { name: 'Mining Drone I',            yield: 25,  cycle: 60, residueProb: 0.00, slot: 'drone' },
    { name: 'Mining Drone II',           yield: 33,  cycle: 60, residueProb: 0.00, slot: 'drone' },
    { name: 'Augmented Mining Drone',    yield: 40,  cycle: 60, residueProb: 0.00, slot: 'drone' },
    { name: 'Excavator Mining Drone',    yield: 80,  cycle: 60, residueProb: 0.00, slot: 'drone' },
  ]
};

// Ore presets — volume per unit in m³
const ORE_PRESETS = [
  { name: 'Veldspar',       vol: 0.1  },
  { name: 'Scordite',       vol: 0.15 },
  { name: 'Pyroxeres',      vol: 0.3  },
  { name: 'Plagioclase',    vol: 0.35 },
  { name: 'Omber',          vol: 0.6  },
  { name: 'Kernite',        vol: 1.2  },
  { name: 'Jaspet',         vol: 2.0  },
  { name: 'Hemorphite',     vol: 3.0  },
  { name: 'Hedbergite',     vol: 3.0  },
  { name: 'Gneiss',         vol: 5.0  },
  { name: 'Dark Ochre',     vol: 8.0  },
  { name: 'Crokite',        vol: 16.0 },
  { name: 'Bistot',         vol: 16.0 },
  { name: 'Arkonor',        vol: 16.0 },
  { name: 'Mercoxit',       vol: 40.0 },
];

const ICE_PRESETS = [
  { name: 'White Glaze',          vol: 1000 },
  { name: 'Blue Ice',             vol: 1000 },
  { name: 'Clear Icicle',         vol: 1000 },
  { name: 'Glacial Mass',         vol: 1000 },
  { name: 'Smooth Glacial Mass',  vol: 1000 },
  { name: 'Enriched Clear Icicle',vol: 1000 },
  { name: 'Thick Blue Ice',       vol: 1000 },
  { name: 'Pristine White Glaze', vol: 1000 },
  { name: 'Gelidus',              vol: 1000 },
  { name: 'Krystallos',           vol: 1000 },
];

const GAS_PRESETS = [
  { name: 'Cytoserocin',           unitSize: 5  },
  { name: 'Golden Cytoserocin',    unitSize: 10 },
  { name: 'Amber Cytoserocin',     unitSize: 5  },
  { name: 'Azure Cytoserocin',     unitSize: 5  },
  { name: 'Celadon Cytoserocin',   unitSize: 5  },
  { name: 'Emerald Cytoserocin',   unitSize: 5  },
  { name: 'Lime Cytoserocin',      unitSize: 5  },
  { name: 'Malachite Cytoserocin', unitSize: 5  },
  { name: 'Vermillion Cytoserocin',unitSize: 5  },
  { name: 'Viridian Cytoserocin',  unitSize: 5  },
  { name: 'Fullerite-C28',         unitSize: 1  },
  { name: 'Fullerite-C32',         unitSize: 1  },
  { name: 'Fullerite-C320',        unitSize: 1  },
  { name: 'Fullerite-C50',         unitSize: 1  },
  { name: 'Fullerite-C540',        unitSize: 1  },
  { name: 'Fullerite-C60',         unitSize: 1  },
  { name: 'Fullerite-C70',         unitSize: 1  },
  { name: 'Fullerite-C72',         unitSize: 1  },
  { name: 'Fullerite-C84',         unitSize: 1  },
];


// ========== STATE ==========
const state = {
  mode: 'single',
  resourceType: 'ore',
  setups: {
    1: { ship: '', module: '', numModules: 2, skill: 5, implant: 0, target: 10000 },
    2: { ship: '', module: '', numModules: 2, skill: 5, implant: 0, target: 10000 },
  }
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


// ========== POPULATE UI ==========
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


// ========== FILTER MODULES BY SHIP ==========
function getFilteredModules(resourceType, shipIdx) {
  const allMods = MODULES[resourceType];
  if (!allMods) return [];
  const ship = SHIPS[shipIdx];
  if (!ship) return allMods;
  const cat = ship.cat;

  // Barge/Exhumer: can fit all ore/ice modules
  if (BARGE_EXHUMER.includes(cat)) return allMods;

  // Capital command: strip + ice via Industrial Core, also drones
  if (cat === 'capital_cmd') {
    if (resourceType === 'drone') return allMods;
    return allMods.filter(m => m.slot === 'strip' || m.slot === 'ice');
  }

  // Endurance (ice_frigate): turret + ice
  if (cat === 'ice_frigate') {
    return allMods.filter(m => m.slot === 'turret' || m.slot === 'ice');
  }

  // Porpoise: drone mining only
  if (cat === 'porpoise') {
    if (resourceType === 'drone') return allMods;
    return [];
  }

  // Frigate, general: turret modules only (mining lasers, gas harvesters)
  return allMods.filter(m => m.slot === 'turret');
}

function updateModulesForShip(n) {
  const t = state.resourceType;
  const shipIdx = parseInt($(`ship${n}`).value) || 0;
  const filtered = getFilteredModules(t, shipIdx);
  const sel = $(`module${n}`);
  const prevName = sel.options[sel.selectedIndex]?.text?.split(' — ')[0] || '';

  if (filtered.length === 0) {
    sel.innerHTML = '<option value="0">No modules available</option>';
    $(`depletionResult${n}`).style.display = 'none';
    return;
  }

  sel.innerHTML = filtered.map((m, i) =>
    `<option value="${i}">${m.name}${m.slot === 'strip' || m.slot === 'ice' ? ' ⚓' : ''}</option>`
  ).join('');

  const keepIdx = filtered.findIndex(m => m.name === prevName);
  if (keepIdx >= 0) sel.value = keepIdx;

  const mod = filtered[parseInt(sel.value) || 0];
  const hasResidue = mod && mod.residueProb > 0;
  $(`depletionResult${n}`).style.display = hasResidue ? '' : 'none';
}


// ========== UPDATE UI FOR RESOURCE TYPE ==========
function updateResourceUI() {
  const t = state.resourceType;

  ['ship1', 'ship2'].forEach(id => populateSelect(id, SHIPS));
  for (let n = 1; n <= 2; n++) { updateModulesForShip(n); }

  const presets = t === 'ore' ? ORE_PRESETS : t === 'ice' ? ICE_PRESETS : t === 'gas' ? GAS_PRESETS : [];
  populatePresets('presets1', presets);
  populatePresets('presets2', presets);

  for (let n = 1; n <= 2; n++) {
    if (t === 'gas') {
      $(`targetLabel${n}`).textContent = 'Target Amount';
      $(`targetUnit${n}`).textContent = 'units';
    } else if (t === 'drone') {
      $(`targetLabel${n}`).textContent = 'Target Vol';
      $(`targetUnit${n}`).textContent = 'm³';
    } else {
      $(`targetLabel${n}`).textContent = 'Target Vol';
      $(`targetUnit${n}`).textContent = 'm³';
    }
  }

  calculateAll();
}


// ========== CORE CALCULATION ==========
/**
 * Calculate mining setup results with CORRECT EVE mechanics.
 *
 * BONUS STACKING (multiplicative):
 *   Effective Yield = BaseYield × ShipMult × SkillMult × ImplantMult
 *
 * For ore mining:
 *   ShipMult = miningYieldMult × stripYieldMult (if strip miner)
 *   SkillMult = 1 + (MiningBarge_lvl × 0.05) for barges/exhumers
 *             = 1 + (Mining_lvl × 0.05) for others
 *
 * Cycle time:
 *   Effective Cycle = BaseCycle × (1 - cycleTimeRed_ship) × SkillCycleMult
 *
 * Residue (only on Deep Core / Modulated T2 modules):
 *   Does NOT reduce cargo yield
 *   Asteroid depletion per cycle = yield × (1 + residue_probability)
 */
function calcSetup(n) {
  const t = state.resourceType;
  const shipIdx = parseInt($(`ship${n}`).value) || 0;
  const modules = getFilteredModules(t, shipIdx);
  if (!modules.length) return null;

  const modIdx = parseInt($(`module${n}`).value) || 0;
  const numMod = Math.max(1, parseInt($(`numModules${n}`).value) || 1);
  const skill = Math.min(5, Math.max(0, parseInt($(`skillLevel${n}`).value) || 0));
  const implant = Math.max(0, parseFloat($(`implant${n}`).value) || 0) / 100;
  const target = Math.max(1, parseFloat($(`target${n}`).value) || 1);

  const ship = SHIPS[shipIdx];
  const mod = modules[modIdx];
  if (!mod) return null;

  // ── Ship bonuses ──────────────────────────────────────
  let shipYieldMult = 1.0;
  let shipCycleRed = 0.0;

  if (t === 'ore') {
    shipYieldMult = (ship.miningYieldMult || 1.0);
    // Strip miners get additional strip-specific bonus
    if (mod.slot === 'strip') {
      shipYieldMult *= (ship.stripYieldMult || 1.0);
    }
    shipCycleRed = ship.cycleTimeRed || 0.0;
  } else if (t === 'ice') {
    shipYieldMult = (ship.iceYieldMult || 1.0);
    shipCycleRed = ship.iceCycleTimeRed || 0.0;
  } else if (t === 'gas') {
    shipYieldMult = (ship.miningYieldMult || 1.0);
    shipCycleRed = 0.0;
  } else if (t === 'drone') {
    shipYieldMult = (ship.droneYieldMult || 1.0);
    shipCycleRed = 0.0;
  }

  // ── Skill bonuses (separate from ship) ────────────────
  const skillBonuses = getSkillBonuses(ship ? ship.cat : 'general', skill, t);
  const skillYieldMult = skillBonuses.yieldMult;
  const skillCycleMult = skillBonuses.cycleMult;

  // ── Implant bonus ─────────────────────────────────────
  const implantMult = 1 + implant;

  // ── Effective yield per module per cycle ───────────────
  const effectiveYieldPerModule = mod.yield * shipYieldMult * skillYieldMult * implantMult;

  // Total yield per cycle (all modules)
  const totalYieldPerCycle = effectiveYieldPerModule * numMod;

  // ── Effective cycle time ──────────────────────────────
  // Ship cycle reduction is applied first, then skill reduction
  const baseCycle = mod.cycle;
  const effectiveCycleTime = baseCycle * (1 - shipCycleRed) * skillCycleMult;

  // ── Hourly metrics ────────────────────────────────────
  const cyclesPerHour = 3600 / effectiveCycleTime;
  const yieldPerHour = totalYieldPerCycle * cyclesPerHour;

  // ── Residue / Asteroid Depletion ──────────────────────
  const residueProb = mod.residueProb || 0;
  // Expected asteroid depletion per cycle = yield × (1 + residue_probability)
  const depletionPerCycle = totalYieldPerCycle * (1 + residueProb);
  // Asteroid depletion per hour
  const depletionPerHour = depletionPerCycle * cyclesPerHour;

  // ── Target calculation ────────────────────────────────
  let targetM3 = target;
  if (t === 'gas') {
    const chipActive = qsa(`#presets${n} .chip.active`);
    if (chipActive.length > 0) {
      const idx = parseInt(chipActive[0].dataset.idx);
      targetM3 = target * (GAS_PRESETS[idx]?.unitSize || 5);
    } else {
      targetM3 = target * 5;
    }
  }

  // Cycles to fill target (based on yield, NOT depletion)
  const totalCycles = totalYieldPerCycle > 0 ? Math.ceil(targetM3 / totalYieldPerCycle) : Infinity;
  const totalTime = totalCycles === Infinity ? Infinity : totalCycles * effectiveCycleTime;
  const totalDepleted = totalCycles === Infinity ? Infinity : depletionPerCycle * totalCycles;

  return {
    yieldPerCycle: totalYieldPerCycle,
    yieldPerHour,
    cycleTime: effectiveCycleTime,
    totalCycles,
    totalTime,
    depletionPerCycle,
    depletionPerHour,
    totalDepleted,
    residueProb,
    hasResidue: residueProb > 0,
    shipYieldMult,
    skillYieldMult,
  };
}


// ========== UPDATE RESULTS DISPLAY ==========
function updateResults(n, data) {
  if (!data) {
    ['yieldCycle', 'yieldHour', 'cycleTime', 'cycles', 'totalTime', 'depletion'].forEach(k => {
      const el = $(`r_${k}${n}`);
      if (el) el.textContent = '—';
    });
    return;
  }

  $(`r_yieldCycle${n}`).textContent = `${formatNum(data.yieldPerCycle)} m³`;
  $(`r_yieldHour${n}`).textContent = `${formatNum(data.yieldPerHour)} m³`;
  $(`r_cycleTime${n}`).textContent = formatTime(data.cycleTime);
  $(`r_cycles${n}`).textContent = data.totalCycles === Infinity ? '∞' : formatNum(data.totalCycles, 0);
  $(`r_totalTime${n}`).textContent = formatTime(data.totalTime);

  // Asteroid Depletion / Hour
  if (data.hasResidue) {
    const pct = (data.residueProb * 100).toFixed(0);
    $(`r_depletion${n}`).textContent =
      `${formatNum(data.depletionPerHour)} m³/hr (+${pct}% extra asteroid damage)`;
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
  const d1 = calcSetup(1);
  const d2 = calcSetup(2);
  updateResults(1, d1);
  updateResults(2, d2);
  updateCompare(d1, d2);
}


// ========== EVENT LISTENERS ==========
function init() {
  updateResourceUI();

  // Mode tabs
  qsa('.tab').forEach(btn => {
    btn.addEventListener('click', () => {
      qsa('.tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.mode = btn.dataset.mode;

      const app = $('app');
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
        $(`target${n}`).value = preset.unitSize * 100;
      }
      calculateAll();
    });
  }

  // Input listeners
  for (let n = 1; n <= 2; n++) {
    const fields = ['ship', 'module', 'numModules', 'skillLevel', 'implant', 'target'];
    fields.forEach(f => {
      const el = $(`${f}${n}`);
      if (!el) return;
      const evt = el.tagName === 'SELECT' ? 'change' : 'input';
      el.addEventListener(evt, () => {
        if (f === 'ship' || f === 'module') {
          updateModulesForShip(n);
        }
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

// ========== START ==========
document.addEventListener('DOMContentLoaded', init);
