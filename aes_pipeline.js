import {
    stringToASCIImatrix,
    addRoundKeytoMatrix,
    substituteBytesofMatrix,
    shiftRowsofMatrix,
    mixColumnsofMatrix,
    ASCIImatrixToString
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

