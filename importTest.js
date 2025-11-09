import { stringToASCIImatrix, addRoundKeytoMatrix, substituteBytesofMatrix, shiftRowsofMatrix, mixColumnsofMatrix, ASCIImatrixToString } from "./aes_building_blocks.js";
console.log("inside tests file");
console.log("Test 1");
let testMsg = "Two One Nine Two";
let testKey = "Thats my Kung Fu";

let testMsgMatrix = stringToASCIImatrix(testMsg);
let testKeyMatrix = stringToASCIImatrix(testKey);


let step1 = addRoundKeytoMatrix(testMsgMatrix, testKeyMatrix);
console.log(step1);

let step2 = substituteBytesofMatrix(step1);
console.log(step2);

let step3 = shiftRowsofMatrix(step2);
console.log(step3);

let step4 = mixColumnsofMatrix(step3);
console.log(step4);

let cipher = ASCIImatrixToString(step4);
console.log(cipher);

console.log("Test 2");
let testMsg2 = "Bruce is Batman!";
let testKey2 = "Three One Two On";

let testMsgMatrix2 = stringToASCIImatrix(testMsg2);
let testKeyMatrix2 = stringToASCIImatrix(testKey2);


let step1_2 = addRoundKeytoMatrix(testMsgMatrix2, testKeyMatrix2);
console.log(step1_2);

let step2_2 = substituteBytesofMatrix(step1_2);
console.log(step2_2);

let step3_2 = shiftRowsofMatrix(step2_2);
console.log(step3_2);

let step4_2 = mixColumnsofMatrix(step3_2);
console.log(step4_2);

let cipher2 = ASCIImatrixToString(step4_2);
console.log(cipher2);