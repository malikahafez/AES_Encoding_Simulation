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

//message arrays
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

//key arrays
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





