//final generalized functions on entire message and key:

//FUNCTIONS ON ROWS
//add the round key
function addRoundKey(msg, key){
    //takes message row and key row
    //returns resulting row after XORing
    let res = [];
    var xor = 0;
    for(let i=0; i<msg.length; i++){
        xor = key[i] ^ msg[i];
        res.push(xor);
    }
    return res;
}

//Substitute bytes
//sbox and inverse sbox from https://asecuritysite.com/subjects/chapter88
const sBox = [
        0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76,
        0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0,
        0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15,
        0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75,
        0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84,
        0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf,
        0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8,
        0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2,
        0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73,
        0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb,
        0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79,
        0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08,
        0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a,
        0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e,
        0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf,
        0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16
]
const sBoxInv = [
        0x52, 0x09, 0x6a, 0xd5, 0x30, 0x36, 0xa5, 0x38, 0xbf, 0x40, 0xa3, 0x9e, 0x81, 0xf3, 0xd7, 0xfb,
        0x7c, 0xe3, 0x39, 0x82, 0x9b, 0x2f, 0xff, 0x87, 0x34, 0x8e, 0x43, 0x44, 0xc4, 0xde, 0xe9, 0xcb,
        0x54, 0x7b, 0x94, 0x32, 0xa6, 0xc2, 0x23, 0x3d, 0xee, 0x4c, 0x95, 0x0b, 0x42, 0xfa, 0xc3, 0x4e,
        0x08, 0x2e, 0xa1, 0x66, 0x28, 0xd9, 0x24, 0xb2, 0x76, 0x5b, 0xa2, 0x49, 0x6d, 0x8b, 0xd1, 0x25,
        0x72, 0xf8, 0xf6, 0x64, 0x86, 0x68, 0x98, 0x16, 0xd4, 0xa4, 0x5c, 0xcc, 0x5d, 0x65, 0xb6, 0x92,
        0x6c, 0x70, 0x48, 0x50, 0xfd, 0xed, 0xb9, 0xda, 0x5e, 0x15, 0x46, 0x57, 0xa7, 0x8d, 0x9d, 0x84,
        0x90, 0xd8, 0xab, 0x00, 0x8c, 0xbc, 0xd3, 0x0a, 0xf7, 0xe4, 0x58, 0x05, 0xb8, 0xb3, 0x45, 0x06,
        0xd0, 0x2c, 0x1e, 0x8f, 0xca, 0x3f, 0x0f, 0x02, 0xc1, 0xaf, 0xbd, 0x03, 0x01, 0x13, 0x8a, 0x6b,
        0x3a, 0x91, 0x11, 0x41, 0x4f, 0x67, 0xdc, 0xea, 0x97, 0xf2, 0xcf, 0xce, 0xf0, 0xb4, 0xe6, 0x73,
        0x96, 0xac, 0x74, 0x22, 0xe7, 0xad, 0x35, 0x85, 0xe2, 0xf9, 0x37, 0xe8, 0x1c, 0x75, 0xdf, 0x6e,
        0x47, 0xf1, 0x1a, 0x71, 0x1d, 0x29, 0xc5, 0x89, 0x6f, 0xb7, 0x62, 0x0e, 0xaa, 0x18, 0xbe, 0x1b,
        0xfc, 0x56, 0x3e, 0x4b, 0xc6, 0xd2, 0x79, 0x20, 0x9a, 0xdb, 0xc0, 0xfe, 0x78, 0xcd, 0x5a, 0xf4,
        0x1f, 0xdd, 0xa8, 0x33, 0x88, 0x07, 0xc7, 0x31, 0xb1, 0x12, 0x10, 0x59, 0x27, 0x80, 0xec, 0x5f,
        0x60, 0x51, 0x7f, 0xa9, 0x19, 0xb5, 0x4a, 0x0d, 0x2d, 0xe5, 0x7a, 0x9f, 0x93, 0xc9, 0x9c, 0xef,
        0xa0, 0xe0, 0x3b, 0x4d, 0xae, 0x2a, 0xf5, 0xb0, 0xc8, 0xeb, 0xbb, 0x3c, 0x83, 0x53, 0x99, 0x61,
        0x17, 0x2b, 0x04, 0x7e, 0xba, 0x77, 0xd6, 0x26, 0xe1, 0x69, 0x14, 0x63, 0x55, 0x21, 0x0c, 0x7d
]

function subBytes(msg){
    //takes message row after adding round key
    //returns resulting row after substituting bytes from sBox
    let res = [];
    for(let i=0; i<msg.length;i++){
        res.push(sBox[msg[i]]);
    }
    return res;
}
function invSubBytes(msg){
    //takes message row after substituting bytes
    //returns resulting row after substituting bytes from inverse sBox
    let res = [];
    for(let i=0; i<msg.length;i++){
        res.push(sBoxInv[msg[i]]);
    }
    return res;
}

//Shift rows:
//cyclic shift left by row index
function shiftRows(msg, row){
    //takes message row after substituting bytes and its row index
    //returns the row after shifting to the left by row index
    let res = [];
    let start = row;
    for(let i = start; i<msg.length; i++ ){
        res.push(msg[i]);
    }
    for(let j=0; j<start; j++){
        res.push(msg[j]);
    }
    return res;
}

//Mix columns:
let mixingMatrix1 = [2,3,1,1];
let mixingMatrix2 = [1,2,3,1];
let mixingMatrix3 = [1,1,2,3];
let mixingMatrix4 = [3,1,1,2];
let mixingMatrix = [mixingMatrix1, mixingMatrix2, mixingMatrix3, mixingMatrix4];

function galoisMult(mix,val){
    //multiply value by mixing matrix value and keeps it in the Galois field
    if(val == 0 || mix == 0){
        return 0;
    }
    if(mix == 1){
        return val;
    }
    else if (mix == 2){
        //multiply by 2 by shifting left
        let res = 0;
        let binValBefore = val.toString(2).padStart(8,'0');
        res = val << 1;
        res = res & 0xFF; //clip to the 8 LSB

        let binValAfter = res.toString(2).padStart(8,'0');

        //if overflow, xor with 0x1b to keep in Galois field
        //detect overflow by checking if MSB == 1 before shift
        if(binValBefore[0] == '1'){
            res = res ^ 0x1b;
        }
        return res;
    }
    //mix = 3
    else{
        //multiply by 2 by shifting left
        let res = 0;
        let binValBefore = val.toString(2).padStart(8,'0');
        // console.log("Value before shift: " + binValBefore);
        // console.log("MSB: " + binValBefore[0]);
        res = val << 1;
        res = res & 0xFF; //clip to the 8 LSB

        // let binValAfter = res.toString(2).padStart(8,'0');
        // console.log(binValAfter);

        //if overflow, xor with 0x1b to keep in Galois field
        if(binValBefore[0] == '1'){
            res = res ^ 0x1b;
        }
        // add value again to multiply by 3
        res = res ^ val;
        return res;
    }

}

function mixColumns(col, mixMatrix){
    //takes column of shifted matrix and takes entire mixing matrix
    //returns result column after mixing
    let res = [];
    //iterate over rows
    for(let i=0; i<mixMatrix.length; i++){
        let mixRow = mixMatrix[i];
        let sum = 0;
        //iterate over columns
        for(let j = 0; j<col.length;j++){
            // console.log("Mixing " + mixRow[j] + " with " + col[j]);
            sum = sum ^ galoisMult(mixRow[j],col[j]);
            // console.log("Galois Multiplication:  "+galoisMult(mixRow[j],col[j]));
        }
        res.push(sum);
    }
    return res;
}

//EXPORTED FUNCTIONS TO BE USED
export function paddingIfNeeded(str) {
    //handle emojis too - utf-8
    //takes input string
    //checks if it is 16 bytes long
    //if yes, returns array of string and a full padding according to PKCS#7
    //if shorter, pads the string using PKCS#7 padding defined in rfc 2315 and returns it
    //if longer, splits the string into multiple strings of 16 byte length (the last one is padded)
    // and returns them in an array
  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);
//   console.log("bytes: ");
//   console.log(bytes);
  const blockSize = 16;
  const blocks = [];

  //split into chunks of 16 bytes each
  for (let i = 0; i < bytes.length; i += blockSize) {
    let chunk = bytes.slice(i, i + blockSize);

    if (chunk.length < blockSize) {
        // PKCS#7 padding: pad with bytes equal to pad length
      const padLength = blockSize - (chunk.length % blockSize);
      const padding = new Uint8Array(padLength).fill(padLength);
      const paddedChunk = new Uint8Array([...chunk, ...padding]);
      blocks.push(paddedChunk);
    } else {
      blocks.push(chunk);
    }
  }

  // If input is exactly multiple of 16 bytes, add extra padded block
  //a whole block of bytes = 16 - 16 bytes of value 16
  if (bytes.length !== 0 && bytes.length % blockSize === 0) {
    const padding = new Uint8Array(blockSize).fill(blockSize);
    blocks.push(padding);
  }

  return blocks; //Array of Uint8Array(16)
}


export function stringToASCIImatrix(str){
    //takes string message, pads it if needed
    //returns the resulting 4x4 matrix/matrices - matrix of matrices
    const paddedBlocks = paddingIfNeeded(str); // Array of Uint8Array(16) - padded string in byte form
    console.log("padded blocks: ");
    console.log(paddedBlocks);
    let resMatrices = [];

    //message ascii/utf code arrays - handles emojis and special characters
    //must be column major order
    for (let i = 0; i<paddedBlocks.length; i++){
        let block = paddedBlocks[i];
        let msgr1 = [];
        let msgr2 = [];
        let msgr3 = [];
        let msgr4 = [];
        for (let j = 0; j<block.length; j++){
            //row major
            if(j<4)
                msgr1.push(block[j]);
            else if(j<8)
                msgr2.push(block[j]);
            else if(j<12)
                msgr3.push(block[j]);
            else
                msgr4.push(block[j]);

        }
        console.log("Byte arrays (row major): (index " + i + ")");
        console.log(msgr1);console.log(msgr2);console.log(msgr3);console.log(msgr4);
        //convert to column major
        let msg1 = [msgr1[0], msgr2[0], msgr3[0], msgr4[0]];
        let msg2 = [msgr1[1], msgr2[1], msgr3[1], msgr4[1]];
        let msg3 = [msgr1[2], msgr2[2], msgr3[2], msgr4[2]];
        let msg4 = [msgr1[3], msgr2[3], msgr3[3], msgr4[3]];
        console.log("Byte arrays (column major): (index " + i + ")");
        console.log(msg1);console.log(msg2);console.log(msg3);console.log(msg4);

        resMatrices.push([msg1,msg2,msg3,msg4]);
    }
    
    
    return resMatrices;
}


export function addRoundKeytoMatrix(msg,key){
    let res = []
    for(let i = 0; i<msg.length;i++){
        let row = msg[i];
        let keyRow = key[i];
        let newRow = [];
        newRow = addRoundKey(row, keyRow);
        res.push(newRow);
    }
    return res;
}

export function substituteBytesofMatrix(msg){
    let res = [];
    for(let i = 0; i<msg.length; i++){
        let row = msg[i];
        let newRow = [];
        newRow = subBytes(row);
        res.push(newRow);
    }
    return res;
}

export function shiftRowsofMatrix(msg){
    let res = [];
    for(let i = 0; i<msg.length; i++){
        let row = msg[i];
        let newRow = [];
        newRow = shiftRows(row,i);
        res.push(newRow);
    }
    return res;
}

export function mixColumnsofMatrix(msg){
    let mixingMatrix = [mixingMatrix1, mixingMatrix2, mixingMatrix3, mixingMatrix4];
    let col1 = [msg[0][0], msg[1][0], msg[2][0], msg[3][0]];
    let col2 = [msg[0][1], msg[1][1], msg[2][1], msg[3][1]];
    let col3 = [msg[0][2], msg[1][2], msg[2][2], msg[3][2]];
    let col4 = [msg[0][3], msg[1][3], msg[2][3], msg[3][3]];
    let mixedCols = [mixColumns(col1,mixingMatrix), 
        mixColumns(col2,mixingMatrix),
        mixColumns(col3, mixingMatrix),
        mixColumns(col4,mixingMatrix)];
    let msg1mc = [mixedCols[0][0], mixedCols[1][0], mixedCols[2][0], mixedCols[3][0]];
    let msg2mc = [mixedCols[0][1], mixedCols[1][1], mixedCols[2][1], mixedCols[3][1]];
    let msg3mc = [mixedCols[0][2], mixedCols[1][2], mixedCols[2][2], mixedCols[3][2]];
    let msg4mc = [mixedCols[0][3], mixedCols[1][3], mixedCols[2][3], mixedCols[3][3]];

    let res = [msg1mc, msg2mc, msg3mc, msg4mc];
    return res;
}

export function ASCIImatrixToString(msg){
    //takes input matrix of bytes after encryption
    //returns ciphertext

    //try utf-8 coding to include emojis and special characters
    //also try latin-1 to include strange characters
    
   let col1 = [msg[0][0], msg[1][0], msg[2][0], msg[3][0]];
   let col2 = [msg[0][1], msg[1][1], msg[2][1], msg[3][1]];
   let col3 = [msg[0][2], msg[1][2], msg[2][2], msg[3][2]];
   let col4 = [msg[0][3], msg[1][3], msg[2][3], msg[3][3]];

   // Combine all columns to get 16 bytes total (row-major order)
   const bytes = new Uint8Array([...col1, ...col2, ...col3, ...col4]);
   const utf8Decoder = new TextDecoder("utf-8", { fatal: false });
   let ciphertext = "";
   try {
    ciphertext = utf8Decoder.decode(bytes);
    console.log(ciphertext);
    } 
    catch {
        // Fallback to Latin-1 if not valid UTF-8
        const latin1Decoder = new TextDecoder("latin1");
        ciphertext = latin1Decoder.decode(bytes);
        console.log(ciphertext);
        }
    finally{
        const latin1Decoder = new TextDecoder("latin1");
        ciphertext = latin1Decoder.decode(bytes);
        console.log(ciphertext);
        // for(let i =0; i<bytes.length; i++){
        //     ciphertext += String.fromCharCode(bytes[i]);
        // }
    }

    return ciphertext;
}

//TESTS

let strMsg = "Bruce is Batman!";//16 characters - 16 bytes - 128 bits
let strKey = "Three One Two On";//16 characters - 16 bytes - 128 bits
// console.log("Original Message: " + strMsg);
// console.log("Key: " + strKey);


//convert to hex byte arrays for each row:
let msgr1 = [];
let msgr2 = [];
let msgr3 = [];
let msgr4 = [];

let keyr1 = [];
let keyr2 = [];
let keyr3 = [];
let keyr4 = [];

//message ascii arrays
//must be column major order
for (let i = 0; i<strMsg.length; i++){
    if(i<4)
        msgr1.push(strMsg.charCodeAt(i));
    else if(i<8)
        msgr2.push(strMsg.charCodeAt(i));
    else if(i<12)
        msgr3.push(strMsg.charCodeAt(i));
    else
        msgr4.push(strMsg.charCodeAt(i));
}
// console.log("Message arrays (row major):");
// console.log(msgr1);console.log(msgr2);console.log(msgr3);console.log(msgr4);

// console.log("Message arrays (column major):");
let msg1 = [msgr1[0], msgr2[0], msgr3[0], msgr4[0]];
let msg2 = [msgr1[1], msgr2[1], msgr3[1], msgr4[1]];
let msg3 = [msgr1[2], msgr2[2], msgr3[2], msgr4[2]];
let msg4 = [msgr1[3], msgr2[3], msgr3[3], msgr4[3]];
// console.log(msg1);console.log(msg2);console.log(msg3);console.log(msg4);
let message = [msg1,msg2,msg3,msg4];
//key ascii arrays
//must be column major order
for (let i=0; i<strKey.length; i++){
    if(i<4)
        keyr1.push(strKey.charCodeAt(i));
    else if(i<8)
        keyr2.push(strKey.charCodeAt(i));
    else if(i<12)
        keyr3.push(strKey.charCodeAt(i));
    else
        keyr4.push(strKey.charCodeAt(i));
}
// console.log("Key arrays (row major):");
// console.log(keyr1);console.log(keyr2);console.log(keyr3);console.log(keyr4);
// console.log("Key arrays (column major):");
let key1 = [keyr1[0], keyr2[0], keyr3[0], keyr4[0]];
let key2 = [keyr1[1], keyr2[1], keyr3[1], keyr4[1]];
let key3 = [keyr1[2], keyr2[2], keyr3[2], keyr4[2]];
let key4 = [keyr1[3], keyr2[3], keyr3[3], keyr4[3]];
// console.log(key1);console.log(key2);console.log(key3); console.log(key4);
let roundKey = [key1,key2,key3,key4];


let msg1x = addRoundKey(msg1, key1); let msg2x = addRoundKey(msg2, key2); let msg3x = addRoundKey(msg3, key3);let msg4x = addRoundKey(msg4, key4);
// console.log("After Adding Round Key:");
// console.log(msg1x);console.log(msg2x);console.log(msg3x);console.log(msg4x);


let msg1sb = subBytes(msg1x);let msg2sb = subBytes(msg2x);let msg3sb = subBytes(msg3x);let msg4sb = subBytes(msg4x);
// console.log("After Substituting Bytes:");
// console.log(msg1sb);console.log(msg2sb);console.log(msg3sb);console.log(msg4sb);
// console.log("check inverse is correct:");
let msg1isb = invSubBytes(msg1sb);let msg2isb = invSubBytes(msg2sb);let msg3isb = invSubBytes(msg3sb);let msg4isb = invSubBytes(msg4sb);
// console.log(msg1isb);console.log(msg2isb);console.log(msg3isb);console.log(msg4isb);


let msg1sr = shiftRows(msg1sb, 0); let msg2sr = shiftRows(msg2sb, 1);let msg3sr = shiftRows(msg3sb, 2);let msg4sr = shiftRows(msg4sb, 3);
// console.log("After Shifting Rows:");
// console.log(msg1sr);console.log(msg2sr);console.log(msg3sr);console.log(msg4sr);



//columns of the shifted matrix
let col1 = [msg1sr[0], msg2sr[0], msg3sr[0], msg4sr[0]];
let col2 = [msg1sr[1], msg2sr[1], msg3sr[1], msg4sr[1]];
let col3 = [msg1sr[2], msg2sr[2], msg3sr[2], msg4sr[2]];
let col4 = [msg1sr[3], msg2sr[3], msg3sr[3], msg4sr[3]];


let mixedCol1 = mixColumns(col1, mixingMatrix);let mixedCol2 = mixColumns(col2, mixingMatrix);let mixedCol3 = mixColumns(col3, mixingMatrix);let mixedCol4 = mixColumns(col4, mixingMatrix);
// console.log("After Mixing Columns (columns):")
// console.log(mixedCol1);console.log(mixedCol2);console.log(mixedCol3);console.log(mixedCol4);
// console.log("After Mixing Columns (rows):");
let msg1mc = [mixedCol1[0], mixedCol2[0], mixedCol3[0], mixedCol4[0]];
let msg2mc = [mixedCol1[1], mixedCol2[1], mixedCol3[1], mixedCol4[1]];
let msg3mc = [mixedCol1[2], mixedCol2[2], mixedCol3[2], mixedCol4[2]];
let msg4mc = [mixedCol1[3], mixedCol2[3], mixedCol3[3], mixedCol4[3]];
// console.log(msg1mc);console.log(msg2mc);console.log(msg3mc);console.log(msg4mc);

// put encrypted message into string
let encMsg = "";
function codeToString(msgmc){
    for(let i = 0; i<msgmc.length; i++){
        encMsg += String.fromCharCode(msgmc[i]);
        // console.log("Curr encrypted message: " + encMsg);
    }
}
codeToString(mixedCol1);codeToString(mixedCol2);codeToString(mixedCol3);codeToString(mixedCol4);
// console.log("Encrypted Message: ");
// console.log(encMsg);//9Q,¤­§±:#_/
//for key = "Thats my Kung Fu" and msg = "Two One Nine Two"
//encrypted msg is: "ºuôz¤2è@}]" = ba75f47a84a48d32e88d060e1b407d5d (hex)
//or "ºuôz„¤2è@}]" or "�u�z���2�@}]"

//for key = "Three One Two On" and msg = "Bruce is Batman!"
//encrypted msg is: "9¤/±_,#§Q­:" or "9¤„/±_™,#ƒ‹§ŸQ­:" or "9��/�_�,#����Q�:"
