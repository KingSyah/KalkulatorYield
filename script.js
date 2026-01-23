// ========== STATE MANAGEMENT ==========
const state = {
    mode: 'single',
    darkMode: false,
    setups: {
        1: {
            resourceType: 'ore',
            resourceName: '',
            numModules: 1,
            yieldPerCycle: 100,
            cycleTime: 60,
            residuePercentage: 0,
            targetVolume: 10000
        },
        2: {
            resourceType: 'ore',
            resourceName: '',
            numModules: 1,
            yieldPerCycle: 100,
            cycleTime: 60,
            residuePercentage: 0,
            targetVolume: 10000
        }
    }
};

// ========== DOM ELEMENTS ==========
const elements = {
    darkModeToggle: document.getElementById('darkModeToggle'),
    singleModeBtn: document.getElementById('singleMode'),
    compareModeBtn: document.getElementById('compareMode'),
    calculatorContainer: document.getElementById('calculatorContainer'),
    cards: document.querySelectorAll('.calculator-card')
};

// ========== INITIALIZATION ==========
function init() {
    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
        toggleDarkMode();
    }

    // Attach event listeners
    elements.darkModeToggle.addEventListener('click', toggleDarkMode);
    elements.singleModeBtn.addEventListener('click', () => setMode('single'));
    elements.compareModeBtn.addEventListener('click', () => setMode('compare'));

    // Attach input listeners for both setups
    attachInputListeners(1);
    attachInputListeners(2);

    // Initial calculation
    calculateResults(1);
    calculateResults(2);
}

// ========== DARK MODE TOGGLE ==========
function toggleDarkMode() {
    state.darkMode = !state.darkMode;
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', state.darkMode);
}

// ========== MODE SWITCHING ==========
function setMode(mode) {
    state.mode = mode;

    if (mode === 'single') {
        elements.singleModeBtn.classList.add('active');
        elements.compareModeBtn.classList.remove('active');
        elements.calculatorContainer.classList.remove('compare-mode');
        elements.cards[1].style.display = 'none';
        clearEfficiencyBadges();
    } else {
        elements.compareModeBtn.classList.add('active');
        elements.singleModeBtn.classList.remove('active');
        elements.calculatorContainer.classList.add('compare-mode');
        elements.cards[1].style.display = 'block';
        compareSetups();
    }
}

// ========== INPUT LISTENERS ==========
function attachInputListeners(setupNum) {
    const card = elements.cards[setupNum - 1];

    const inputs = {
        resourceType: card.querySelector('.resource-type'),
        resourceName: card.querySelector('.resource-name'),
        numModules: card.querySelector('.num-modules'),
        yieldPerCycle: card.querySelector('.yield-per-cycle'),
        cycleTime: card.querySelector('.cycle-time'),
        residuePercentage: card.querySelector('.residue-percentage'),
        targetVolume: card.querySelector('.target-volume')
    };

    Object.keys(inputs).forEach(key => {
        inputs[key].addEventListener('input', (e) => {
            const value = e.target.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
            state.setups[setupNum][key] = value;
            calculateResults(setupNum);
            
            if (state.mode === 'compare') {
                compareSetups();
            }
        });
    });
}

// ========== CALCULATIONS ==========
function calculateResults(setupNum) {
    const setup = state.setups[setupNum];
    const card = elements.cards[setupNum - 1];

    // Calculate total yield per cycle (all modules combined)
    const totalYieldPerCycle = setup.yieldPerCycle * setup.numModules;

    // Calculate effective yield after residue (all modules)
    const effectiveYield = totalYieldPerCycle * (1 - setup.residuePercentage / 100);

    // Calculate yield per minute
    const cyclesPerMinute = 60 / setup.cycleTime;
    const yieldPerMinute = effectiveYield * cyclesPerMinute;

    // Calculate total cycles required
    const totalCycles = Math.ceil(setup.targetVolume / effectiveYield);

    // Calculate total time required in seconds
    const totalSeconds = totalCycles * setup.cycleTime;

    // Calculate total residue wasted
    const totalResidue = (totalYieldPerCycle * setup.residuePercentage / 100) * totalCycles;

    // Update UI
    updateResultDisplay(card, 'totalYieldPerCycle', totalYieldPerCycle.toFixed(2) + ' m³');
    updateResultDisplay(card, 'effectiveYield', effectiveYield.toFixed(2) + ' m³');
    updateResultDisplay(card, 'yieldPerMinute', yieldPerMinute.toFixed(2) + ' m³/min');
    updateResultDisplay(card, 'totalCycles', totalCycles.toString());
    updateResultDisplay(card, 'totalTime', formatTime(totalSeconds));
    updateResultDisplay(card, 'totalResidue', totalResidue.toFixed(2) + ' m³');

    // Store calculated values for comparison
    state.setups[setupNum].calculatedYieldPerMinute = yieldPerMinute;

    return {
        totalYieldPerCycle,
        effectiveYield,
        yieldPerMinute,
        totalCycles,
        totalSeconds,
        totalResidue
    };
}

// ========== COMPARISON LOGIC ==========
function compareSetups() {
    const ypm1 = state.setups[1].calculatedYieldPerMinute || 0;
    const ypm2 = state.setups[2].calculatedYieldPerMinute || 0;

    clearEfficiencyBadges();

    if (ypm1 > ypm2 && ypm1 > 0) {
        showEfficiencyBadge(1);
    } else if (ypm2 > ypm1 && ypm2 > 0) {
        showEfficiencyBadge(2);
    }
}

// ========== UI UPDATE HELPERS ==========
function updateResultDisplay(card, resultKey, value) {
    const resultElement = card.querySelector(`[data-result="${resultKey}"]`);
    if (resultElement) {
        resultElement.textContent = value;
    }
}

function formatTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
}

function padZero(num) {
    return num.toString().padStart(2, '0');
}

function showEfficiencyBadge(setupNum) {
    const card = elements.cards[setupNum - 1];
    const badge = card.querySelector('.efficiency-badge');
    badge.classList.add('winner');
}

function clearEfficiencyBadges() {
    elements.cards.forEach(card => {
        const badge = card.querySelector('.efficiency-badge');
        badge.classList.remove('winner');
    });
}

// ========== START APPLICATION ==========
init();