import { paddingIfNeeded,stringToASCIImatrix, addRoundKeytoMatrix, substituteBytesofMatrix, shiftRowsofMatrix, mixColumnsofMatrix, ASCIImatrixToString } from "./aes_building_blocks.js";
import {runPipeline} from "./aes_pipeline.js";
console.log("inside tests file");
console.log("Test 1");
let testMsg = "Two One Nine Two";
let testKey = "Thats my Kung Fu";
console.log("Original Message: " + testMsg);
console.log("Key: " + testKey);


let testMsgMatrices = stringToASCIImatrix(testMsg);
let testKeyMatrices = stringToASCIImatrix(testKey);

let testMsgMatrix = testMsgMatrices[0];
let testKeyMatrix = testKeyMatrices[0];


let step1 = addRoundKeytoMatrix(testMsgMatrix, testKeyMatrix);
console.log("After Adding Round Key:");
console.log(step1);

let step2 = substituteBytesofMatrix(step1);
console.log("After Substituting Bytes:");
console.log(step2);

let step3 = shiftRowsofMatrix(step2);
console.log("After Shifting Rows:");
console.log(step3);

let step4 = mixColumnsofMatrix(step3);
console.log("After Mixing Columns (rows):");
console.log(step4);

let cipher = ASCIImatrixToString(step4);
console.log("Encrypted Message: ");
console.log(cipher);

console.log("Test 2");
let testMsg2 = "Bruce is Batman!";
let testKey2 = "Three One Two On";

console.log("Original Message: " + testMsg2);
console.log("Key: " + testKey2);

let testMsgMatrices2 = stringToASCIImatrix(testMsg2);
let testKeyMatrices2 = stringToASCIImatrix(testKey2);

let testMsgMatrix2 = testMsgMatrices2[0];
let testKeyMatrix2 = testKeyMatrices2[0];

let step1_2 = addRoundKeytoMatrix(testMsgMatrix2, testKeyMatrix2);
console.log("After Adding Round Key:");
console.log(step1_2);

let step2_2 = substituteBytesofMatrix(step1_2);
console.log("After Substituting Bytes:");
console.log(step2_2);

let step3_2 = shiftRowsofMatrix(step2_2);
console.log("After Shifting Rows:");
console.log(step3_2);

let step4_2 = mixColumnsofMatrix(step3_2);
console.log("After Mixing Columns (rows):");
console.log(step4_2);

let cipher2 = ASCIImatrixToString(step4_2);
console.log("Encrypted Message: ");
console.log(cipher2);

// ---- Pipline Test ----
console.log("\nPipeline test for Test 1 (AddRoundKey -> SubBytes -> ShiftRows -> MixColumns):");
const states = runPipeline(testMsgMatrix, testKeyMatrix);
states.forEach((state, index) => {
    console.log(`\nState ${index}:`);
    for (let r = 0; r < 4; r++) {
        const row = [];
        for (let c = 0; c < 4; c++) {
            row.push((state[c][r] ?? 0).toString(16).padStart(2, '0').toUpperCase());
        }
        console.log(row.join(' '));
    }
});


//for key = "Thats my Kung Fu" and msg = "Two One Nine Two"
//encrypted msg is: "ºuôz¤2è@}]" = ba75f47a84a48d32e88d060e1b407d5d (hex)
//or "ºuôz„¤2è@}]" or "�u�z���2�@}]"

//for key = "Three One Two On" and msg = "Bruce is Batman!"
//encrypted msg is: "9¤/±_,#§Q­:" or "9¤„/±_™,#ƒ‹§ŸQ­:" or "9��/�_�,#����Q�:"