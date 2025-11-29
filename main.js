import {
    stringToASCIImatrix,
    addRoundKeytoMatrix,
    substituteBytesofMatrix,
    shiftRowsofMatrix,
    mixColumnsofMatrix,
    keyExpansion
} from './aes_building_blocks.js';

import { runPipeline, runFullAES } from './aes_pipeline.js';

// Application State
let appState = {
    mode: 'individual', // 'individual' or 'pipeline'
    dataMode: 'default', // 'default' or 'custom'
    message: "Two One Nine Two",
    key: "Thats my Kung Fu",
    currentMatrix: null,
    messageMatrices: null,
    currentBlockIndex: 0,
    totalBlocks: 1,
    keyMatrix: null,
    pipelineStates: null,
    currentPipelineStep: 0,
    individualState: null,
    fullAESResult: null,
    roundKeys: null
};

// DOM Elements
const dataModeRadios = document.querySelectorAll('input[name="dataMode"]');
const customInputsDiv = document.getElementById('customInputs');
const messageInput = document.getElementById('messageInput');
const keyInput = document.getElementById('keyInput');
const individualBtn = document.getElementById('individualBtn');
const pipelineBtn = document.getElementById('pipelineBtn');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const individualMode = document.getElementById('individualMode');
const pipelineMode = document.getElementById('pipelineMode');
const stepButtons = document.querySelectorAll('.step-btn');
const nextStepBtn = document.getElementById('nextStepBtn');
const prevStepBtn = document.getElementById('prevStepBtn');
const autoRunBtn = document.getElementById('autoRunBtn');
const statusMessage = document.getElementById('statusMessage');

// Status message timeout reference
let statusTimeout = null;

// Initialize
function init() {
    setupEventListeners();
    showStatus('Welcome! Configure your input and select a mode to begin.', 'info');
}

// Event Listeners
function setupEventListeners() {
    dataModeRadios.forEach(radio => {
        radio.addEventListener('change', handleDataModeChange);
    });

    // Block navigation buttons (pipeline)
    const prevBlockBtn = document.getElementById('prevBlockBtn');
    const nextBlockBtn = document.getElementById('nextBlockBtn');
    if (prevBlockBtn) prevBlockBtn.addEventListener('click', handlePrevBlock);
    if (nextBlockBtn) nextBlockBtn.addEventListener('click', handleNextBlock);

    individualBtn.addEventListener('click', () => switchMode('individual'));
    pipelineBtn.addEventListener('click', () => switchMode('pipeline'));
    
    startBtn.addEventListener('click', startSimulation);
    resetBtn.addEventListener('click', resetSimulation);
    
    stepButtons.forEach(btn => {
        btn.addEventListener('click', handleIndividualStep);
    });
    
    if (nextStepBtn) nextStepBtn.addEventListener('click', handlePipelineNextStep);
    if (prevStepBtn) prevStepBtn.addEventListener('click', handlePipelinePrevStep);
    if (autoRunBtn) autoRunBtn.addEventListener('click', handleAutoRun);
}

function handleDataModeChange(e) {
    appState.dataMode = e.target.value;
    customInputsDiv.style.display = appState.dataMode === 'custom' ? 'block' : 'none';
}

function switchMode(mode) {
    appState.mode = mode;
    
    individualBtn.classList.toggle('active', mode === 'individual');
    pipelineBtn.classList.toggle('active', mode === 'pipeline');
    
    individualMode.style.display = mode === 'individual' ? 'block' : 'none';
    pipelineMode.style.display = mode === 'pipeline' ? 'block' : 'none';
    
    resetSimulation();
}

function startSimulation() {
    // Get message and key
    if (appState.dataMode === 'custom') {
        appState.message = messageInput.value;
        appState.key = keyInput.value;
        // Allow messages of any length > 0, but key must be exactly 16 characters for AES-128
        if (!appState.message || appState.message.length === 0) {
            showStatus('Error: Message cannot be empty!', 'error');
            return;
        }
        if (!appState.key || appState.key.length !== 16) {
            showStatus('Error: Key must be exactly 16 characters for AES-128!', 'error');
            return;
        }
    } else {
        appState.message = "Two One Nine Two";
        appState.key = "Thats my Kung Fu";
    }
    
    try {
    // Convert to matrices
    const messageMatrices = stringToASCIImatrix(appState.message);
    const keyMatrices = stringToASCIImatrix(appState.key);

    // Store matrices (message may contain multiple 16-byte blocks)
    appState.messageMatrices = messageMatrices;
    appState.totalBlocks = messageMatrices.length;
    appState.currentBlockIndex = 0;

    // Use first block as starting point
    appState.currentMatrix = JSON.parse(JSON.stringify(messageMatrices[0]));
    appState.keyMatrix = JSON.parse(JSON.stringify(keyMatrices[0]));
    appState.individualState = JSON.parse(JSON.stringify(messageMatrices[0]));
        
        console.log('Initial Message Matrix:', appState.currentMatrix);
        console.log('Initial Key Matrix:', appState.keyMatrix);
        
        if (appState.mode === 'individual') {
            startIndividualMode();
        } else {
            startPipelineMode();
        }
        
        showStatus('Simulation started! Processing one 16-byte block with 10 rounds.', 'success');
    } catch (error) {
        showStatus('Error: ' + error.message, 'error');
        console.error(error);
    }
}

function startIndividualMode() {
    // Enable step buttons
    stepButtons.forEach(btn => btn.disabled = false);
    
    // Display initial state
    displayIndividualState('Initial State', appState.individualState);
}

function startPipelineMode() {
    // Run full AES encryption
    appState.fullAESResult = runFullAES(appState.currentMatrix, appState.keyMatrix);
    appState.roundKeys = appState.fullAESResult.roundKeys;
    appState.currentPipelineStep = 0;
    
    // Display all round keys
    displayRoundKeys(appState.roundKeys);
    
    // Show first step
    displayPipelineStep(0);
}

function displayRoundKeys(roundKeys) {
    const container = document.getElementById('roundKeysDisplay');
    container.innerHTML = '';
    
    console.log('=== Generated Round Keys ===');
    roundKeys.forEach((keyMatrix, round) => {
        const keyHex = matrixToHexString(keyMatrix);
        console.log(`Round ${round}: ${keyHex}`);
        
        const keyItem = document.createElement('div');
        keyItem.className = 'round-key-item';
        keyItem.id = `roundKey${round}`;
        keyItem.innerHTML = `
            <h4>Round ${round} Key</h4>
            <div class="key-hex">${keyHex}</div>
        `;
        container.appendChild(keyItem);
    });
}

function matrixToHexString(matrix) {
    // Convert matrix to hex string in column-major order (AES standard)
    // Read column by column: col0, col1, col2, col3
    let hex = '';
    for (let col = 0; col < 4; col++) {
        for (let row = 0; row < 4; row++) {
            hex += matrix[col][row].toString(16).toUpperCase().padStart(2, '0') + ' ';
        }
    }
    return hex.trim();
}

function handlePipelineNextStep() {
    if (!appState.fullAESResult) return;
    
    if (appState.currentPipelineStep < appState.fullAESResult.states.length - 1) {
        appState.currentPipelineStep++;
        displayPipelineStep(appState.currentPipelineStep);
    } else {
        showStatus('Encryption complete! All 10 rounds finished.', 'success');
    }
}

function handlePipelinePrevStep() {
    if (!appState.fullAESResult) return;
    
    if (appState.currentPipelineStep > 0) {
        appState.currentPipelineStep--;
        displayPipelineStep(appState.currentPipelineStep);
    }
}

function handleAutoRun() {
    if (!appState.fullAESResult) return;
    
    let step = 0;
    const interval = setInterval(() => {
        if (step < appState.fullAESResult.states.length) {
            appState.currentPipelineStep = step;
            displayPipelineStep(step);
            step++;
        } else {
            clearInterval(interval);
            showStatus('Auto-run complete! Full AES-128 encryption finished.', 'success');
        }
    }, 800);
}

function displayPipelineStep(stepIndex) {
    if (!appState.fullAESResult) return;
    
    const stateInfo = appState.fullAESResult.states[stepIndex];
    
    // Update title (include block info when multiple blocks present)
    const blockInfo = appState.totalBlocks && appState.totalBlocks > 1 ? `Block ${appState.currentBlockIndex + 1}/${appState.totalBlocks} - ` : '';
    document.getElementById('roundTitle').textContent = blockInfo + stateInfo.description;
    
    // Highlight current round key
    document.querySelectorAll('.round-key-item').forEach(item => {
        item.classList.remove('active');
    });
    const currentKeyEl = document.getElementById(`roundKey${stateInfo.round}`);
    if (currentKeyEl) currentKeyEl.classList.add('active');
    
    // Display current round key matrix
    document.getElementById('currentRoundKey').innerHTML = 
        createMatrixHTML(stateInfo.roundKey, '', true);
    
    // Display current state matrix
    document.getElementById('currentStateDisplay').innerHTML = 
        createMatrixHTML(stateInfo.state, '', true);
    
    // Update progress
    updateProgress(stepIndex);
    
    // Show status
    const totalSteps = appState.fullAESResult.states.length;
    showStatus(`Step ${stepIndex + 1}/${totalSteps}: ${stateInfo.description}`, 'info');
}

// -- Block navigation (for messages split into multiple 16-byte blocks) --
function handlePrevBlock() {
    if (!appState.messageMatrices || appState.totalBlocks <= 1) return;
    if (appState.currentBlockIndex > 0) {
        appState.currentBlockIndex--;
        // set current matrix to new block and re-run AES
        appState.currentMatrix = JSON.parse(JSON.stringify(appState.messageMatrices[appState.currentBlockIndex]));
        appState.individualState = JSON.parse(JSON.stringify(appState.currentMatrix));
        appState.fullAESResult = runFullAES(appState.currentMatrix, appState.keyMatrix);
        appState.roundKeys = appState.fullAESResult.roundKeys;
        appState.currentPipelineStep = 0;
        displayRoundKeys(appState.roundKeys);
        updateBlockIndicator();
        displayPipelineStep(0);
        showStatus(`Switched to block ${appState.currentBlockIndex + 1}/${appState.totalBlocks}`, 'info');
    }
}

function handleNextBlock() {
    if (!appState.messageMatrices || appState.totalBlocks <= 1) return;
    if (appState.currentBlockIndex < appState.totalBlocks - 1) {
        appState.currentBlockIndex++;
        // set current matrix to new block and re-run AES
        appState.currentMatrix = JSON.parse(JSON.stringify(appState.messageMatrices[appState.currentBlockIndex]));
        appState.individualState = JSON.parse(JSON.stringify(appState.currentMatrix));
        appState.fullAESResult = runFullAES(appState.currentMatrix, appState.keyMatrix);
        appState.roundKeys = appState.fullAESResult.roundKeys;
        appState.currentPipelineStep = 0;
        displayRoundKeys(appState.roundKeys);
        updateBlockIndicator();
        displayPipelineStep(0);
        showStatus(`Switched to block ${appState.currentBlockIndex + 1}/${appState.totalBlocks}`, 'info');
    }
}

function updateBlockIndicator() {
    const el = document.getElementById('blockIndicator');
    if (!el) return;
    el.textContent = `Block ${appState.currentBlockIndex + 1}/${appState.totalBlocks}`;
}

function updateProgress(currentStep) {
    const progressDiv = document.getElementById('stepProgress');
    const total = appState.fullAESResult.states.length;
    const percentage = ((currentStep + 1) / total) * 100;
    
    progressDiv.innerHTML = `
        <h4>Progress: Step ${currentStep + 1} of ${total}</h4>
        <div style="background: #ddd; height: 20px; border-radius: 10px; overflow: hidden; margin-top: 10px;">
            <div style="background: linear-gradient(135deg, #ff85a2 0%, #d63384 100%); 
                        height: 100%; width: ${percentage}%; transition: width 0.3s;"></div>
        </div>
        <div class="progress-indicator">
            ${Array(Math.min(total, 20)).fill(0).map((_, i) => {
                const dotStep = Math.floor(i * total / 20);
                let className = 'progress-dot';
                if (dotStep < currentStep) className += ' completed';
                else if (dotStep === currentStep) className += ' active';
                return `<div class="${className}"></div>`;
            }).join('')}
        </div>
    `;
}

function handleIndividualStep(e) {
    const step = e.target.dataset.step;
    
    try {
        let result;
        let stepName;
        
        switch(step) {
            case 'addRoundKey':
                result = addRoundKeytoMatrix(
                    JSON.parse(JSON.stringify(appState.individualState)), 
                    JSON.parse(JSON.stringify(appState.keyMatrix))
                );
                stepName = 'After Add Round Key';
                break;
            case 'subBytes':
                result = substituteBytesofMatrix(
                    JSON.parse(JSON.stringify(appState.individualState))
                );
                stepName = 'After Substitute Bytes';
                break;
            case 'shiftRows':
                result = shiftRowsofMatrix(
                    JSON.parse(JSON.stringify(appState.individualState))
                );
                stepName = 'After Shift Rows';
                break;
            case 'mixColumns':
                result = mixColumnsofMatrix(
                    JSON.parse(JSON.stringify(appState.individualState))
                );
                stepName = 'After Mix Columns';
                break;
        }
        
        appState.individualState = result;
        displayIndividualState(stepName, result);
        showStatus(`Applied: ${stepName}`, 'success');
    } catch (error) {
        showStatus('Error: ' + error.message, 'error');
        console.error(error);
    }
}

function displayIndividualState(title, matrix) {
    const currentState = document.getElementById('currentState');
    currentState.innerHTML = `
        <div class="step-info">
            <h4>${title}</h4>
            <p>Current state of the 4x4 matrix (column-major order)</p>
        </div>
        ${createMatrixHTML(matrix, title)}
    `;
}

function createMatrixHTML(matrix, label = '', compact = false) {
    const size = compact ? 'small' : 'normal';
    let html = '';
    
    if (label) {
        html += `<div class="matrix-label">${label}</div>`;
    }
    
    html += '<table class="matrix-table">';
    
    // Display matrix correctly: matrix is stored as matrix[col][row]
    // To display it properly, we show each column as a row in the table
    for (let row = 0; row < 4; row++) {
        html += '<tr>';
        for (let col = 0; col < 4; col++) {
            const value = matrix[row][col];
            const hex = value.toString(16).toUpperCase().padStart(2, '0');
            html += `<td>${hex}</td>`;
        }
        html += '</tr>';
    }
    
    html += '</table>';
    return html;
}

function resetSimulation() {
    appState.currentMatrix = null;
    appState.messageMatrices = null;
    appState.currentBlockIndex = 0;
    appState.totalBlocks = 1;
    appState.keyMatrix = null;
    appState.pipelineStates = null;
    appState.currentPipelineStep = 0;
    appState.individualState = null;
    appState.fullAESResult = null;
    appState.roundKeys = null;
    
    // Clear outputs
    const currentStateEl = document.getElementById('currentState');
    if (currentStateEl) {
        currentStateEl.innerHTML = '<p style="text-align: center; color: #999;">Click "Start Simulation" to begin</p>';
    }
    
    // Clear pipeline displays
    const roundKeysDisplay = document.getElementById('roundKeysDisplay');
    if (roundKeysDisplay) roundKeysDisplay.innerHTML = '';
    
    const roundTitle = document.getElementById('roundTitle');
    if (roundTitle) roundTitle.textContent = 'Waiting to start...';
    
    const currentRoundKey = document.getElementById('currentRoundKey');
    if (currentRoundKey) currentRoundKey.innerHTML = '<p style="color: #999;">-</p>';
    
    const currentStateDisplay = document.getElementById('currentStateDisplay');
    if (currentStateDisplay) currentStateDisplay.innerHTML = '<p style="color: #999;">-</p>';
    
    const stepProgress = document.getElementById('stepProgress');
    if (stepProgress) stepProgress.innerHTML = '';
    // reset block indicator
    const blockIndicator = document.getElementById('blockIndicator');
    if (blockIndicator) blockIndicator.textContent = 'Block 1/1';
    
    // Disable individual step buttons
    stepButtons.forEach(btn => btn.disabled = true);
    
    showStatus('Simulation reset. Configure input and click Start.', 'info');
}

function showStatus(message, type) {
    // Clear any existing timeout to prevent premature hiding
    if (statusTimeout) {
        clearTimeout(statusTimeout);
    }
    
    statusMessage.textContent = message;
    statusMessage.className = `status-message show ${type}`;
    
    // Set new timeout to hide after 5 seconds
    statusTimeout = setTimeout(() => {
        statusMessage.classList.remove('show');
    }, 5000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);
