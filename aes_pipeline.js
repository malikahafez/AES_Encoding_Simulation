import {
    stringToASCIImatrix,
    addRoundKeytoMatrix,
    substituteBytesofMatrix,
    shiftRowsofMatrix,
    mixColumnsofMatrix,
    ASCIImatrixToString,
    keyExpansion
} from './aes_building_blocks.js';

// Run a single round pipeline and return array of states:
// states[0] = initial matrix, states[1] = after AddRoundKey, states[2] = after SubBytes,
// states[3] = after ShiftRows, states[4] = after MixColumns
export function runPipeline(blockMatrix, roundKeyMatrix) {
    const clone = m => JSON.parse(JSON.stringify(m));
    const states = [];
    states.push(clone(blockMatrix));

    const afterAdd = addRoundKeytoMatrix(clone(blockMatrix), clone(roundKeyMatrix));
    states.push(clone(afterAdd));

    const afterSub = substituteBytesofMatrix(clone(afterAdd));
    states.push(clone(afterSub));

    const afterShift = shiftRowsofMatrix(clone(afterSub));
    states.push(clone(afterShift));

    const afterMix = mixColumnsofMatrix(clone(afterShift));
    states.push(clone(afterMix));

    return states;
}

// Run full AES-128 encryption (10 rounds)
export function runFullAES(blockMatrix, initialKeyMatrix) {
    const clone = m => JSON.parse(JSON.stringify(m));
    
    // Generate all round keys
    const roundKeys = keyExpansion(initialKeyMatrix);
    
    // Store all states with their round and step information
    const allStates = [];
    
    let state = clone(blockMatrix);
    
    // Initial round (Round 0) - just AddRoundKey
    allStates.push({
        round: 0,
        step: 'initial',
        description: 'Initial State',
        state: clone(state),
        roundKey: clone(roundKeys[0])
    });
    
    state = addRoundKeytoMatrix(state, roundKeys[0]);
    allStates.push({
        round: 0,
        step: 'addRoundKey',
        description: 'After Initial AddRoundKey',
        state: clone(state),
        roundKey: clone(roundKeys[0])
    });
    
    // Rounds 1-9 (full rounds with MixColumns)
    for (let round = 1; round <= 9; round++) {
        state = substituteBytesofMatrix(state);
        allStates.push({
            round: round,
            step: 'subBytes',
            description: `Round ${round}: After SubBytes`,
            state: clone(state),
            roundKey: clone(roundKeys[round])
        });
        
        state = shiftRowsofMatrix(state);
        allStates.push({
            round: round,
            step: 'shiftRows',
            description: `Round ${round}: After ShiftRows`,
            state: clone(state),
            roundKey: clone(roundKeys[round])
        });
        
        state = mixColumnsofMatrix(state);
        allStates.push({
            round: round,
            step: 'mixColumns',
            description: `Round ${round}: After MixColumns`,
            state: clone(state),
            roundKey: clone(roundKeys[round])
        });
        
        state = addRoundKeytoMatrix(state, roundKeys[round]);
        allStates.push({
            round: round,
            step: 'addRoundKey',
            description: `Round ${round}: After AddRoundKey`,
            state: clone(state),
            roundKey: clone(roundKeys[round])
        });
    }
    
    // Round 10 (final round - no MixColumns)
    state = substituteBytesofMatrix(state);
    allStates.push({
        round: 10,
        step: 'subBytes',
        description: 'Round 10: After SubBytes',
        state: clone(state),
        roundKey: clone(roundKeys[10])
    });
    
    state = shiftRowsofMatrix(state);
    allStates.push({
        round: 10,
        step: 'shiftRows',
        description: 'Round 10: After ShiftRows',
        state: clone(state),
        roundKey: clone(roundKeys[10])
    });
    
    state = addRoundKeytoMatrix(state, roundKeys[10]);
    allStates.push({
        round: 10,
        step: 'addRoundKey',
        description: 'Round 10: Final Ciphertext',
        state: clone(state),
        roundKey: clone(roundKeys[10])
    });
    
    return {
        states: allStates,
        roundKeys: roundKeys,
        finalState: state
    };
}
