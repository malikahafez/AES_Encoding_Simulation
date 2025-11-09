
// Check if I need to modify code to take longer messages
let strMsg = "Bruce is Batman!";//16 characters - 16 bytes - 128 bits
let strKey = "Three One Two On";//16 characters - 16 bytes - 128 bits
console.log("Original Message: " + strMsg);
console.log("Key: " + strKey);


//convert to hex byte arrays for each row:
let msg1 = [];
let msg2 = [];
let msg3 = [];
let msg4 = [];

let key1 = [];
let key2 = [];
let key3 = [];
let key4 = [];

//message ascii arrays
for (let i = 0; i<strMsg.length; i++){
    if(i<4)
        msg1.push(strMsg.charCodeAt(i));
    else if(i<8)
        msg2.push(strMsg.charCodeAt(i));
    else if(i<12)
        msg3.push(strMsg.charCodeAt(i));
    else
        msg4.push(strMsg.charCodeAt(i));
}
console.log("Message arrays:");
console.log(msg1);console.log(msg2);console.log(msg3);console.log(msg4);

//key ascii arrays
for (let i=0; i<strKey.length; i++){
    if(i<4)
        key1.push(strKey.charCodeAt(i));
    else if(i<8)
        key2.push(strKey.charCodeAt(i));
    else if(i<12)
        key3.push(strKey.charCodeAt(i));
    else
        key4.push(strKey.charCodeAt(i));
}
console.log("Key arrays:");
console.log(key1);console.log(key2);console.log(key3);console.log(key4);

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
msg1x = addRoundKey(msg1, key1); msg2x = addRoundKey(msg2, key2);msg3x = addRoundKey(msg3, key3);msg4x = addRoundKey(msg4, key4);
console.log("After Adding Round Key:");
console.log(msg1x);console.log(msg2x);console.log(msg3x);console.log(msg4x);

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
msg1sb = subBytes(msg1x);msg2sb = subBytes(msg2x);msg3sb = subBytes(msg3x);msg4sb = subBytes(msg4x);
console.log("After Substituting Bytes:");
console.log(msg1sb);console.log(msg2sb);console.log(msg3sb);console.log(msg4sb);
console.log("check inverse is correct:");
msg1isb = invSubBytes(msg1sb);msg2isb = invSubBytes(msg2sb);msg3isb = invSubBytes(msg3sb);msg4isb = invSubBytes(msg4sb);
console.log(msg1isb);console.log(msg2isb);console.log(msg3isb);console.log(msg4isb);

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
msg1sr = shiftRows(msg1sb, 0); msg2sr = shiftRows(msg2sb, 1);msg3sr = shiftRows(msg3sb, 2);msg4sr = shiftRows(msg4sb, 3);
console.log("After Shifting Rows:");
console.log(msg1sr);console.log(msg2sr);console.log(msg3sr);console.log(msg4sr);

//Mix columns:
let mixingMatrix1 = [2,3,1,1];
let mixingMatrix2 = [1,2,3,1];
let mixingMatrix3 = [1,1,2,3];
let mixingMatrix4 = [3,1,1,2];
let mixingMatrix = [mixingMatrix1, mixingMatrix2, mixingMatrix3, mixingMatrix4];

//columns of the shifted matrix
let col1 = [msg1sr[0], msg2sr[0], msg3sr[0], msg4sr[0]];
let col2 = [msg1sr[1], msg2sr[1], msg3sr[1], msg4sr[1]];
let col3 = [msg1sr[2], msg2sr[2], msg3sr[2], msg4sr[2]];
let col4 = [msg1sr[3], msg2sr[3], msg3sr[3], msg4sr[3]];

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
        sum = 0;
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
mixedCol1 = mixColumns(col1, mixingMatrix);mixedCol2 = mixColumns(col2, mixingMatrix);mixedCol3 = mixColumns(col3, mixingMatrix);mixedCol4 = mixColumns(col4, mixingMatrix);
console.log("After Mixing Columns (columns):")
console.log(mixedCol1);console.log(mixedCol2);console.log(mixedCol3);console.log(mixedCol4);
console.log("After Mixing Columns (rows):");
let msg1mc = [mixedCol1[0], mixedCol2[0], mixedCol3[0], mixedCol4[0]];
let msg2mc = [mixedCol1[1], mixedCol2[1], mixedCol3[1], mixedCol4[1]];
let msg3mc = [mixedCol1[2], mixedCol2[2], mixedCol3[2], mixedCol4[2]];
let msg4mc = [mixedCol1[3], mixedCol2[3], mixedCol3[3], mixedCol4[3]];
console.log(msg1mc);console.log(msg2mc);console.log(msg3mc);console.log(msg4mc);


// put encrypted message into string
let encMsg = "";
function codeToString(msgmc){
    for(let i = 0; i<msgmc.length; i++){
        encMsg += String.fromCharCode(msgmc[i]);
        // console.log("Curr encrypted message: " + encMsg);
    }
}
codeToString(msg1mc);codeToString(msg2mc);codeToString(msg3mc);codeToString(msg4mc);
console.log("Encrypted Message: ");
console.log(encMsg);//9Q,¤­§±:#_/