import CryptoJS from "crypto-js";

export const encryptWithAES = (text : string) => {
    try {
      return CryptoJS.AES.encrypt(text, process.env.ENCRYPT_KEY).toString();
    } catch (error) {
      console.error("error ::::: ", error);
      return "";
    }
};

export const decryptWithAES = (ciphertext : string) => {
  try {
      const bytes = CryptoJS.AES.decrypt(ciphertext, process.env.ENCRYPT_KEY);
      return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
      console.error("error ::::: ", error);
      return "";
  }
}; 

export const decodeString = (keyEncrypt : string) => {
  let text = window.atob(keyEncrypt);
  if(text.length>7){
    let result1 = text.substring(0, 2);
    let result2 = text.substring(3, text.length-5);
    let result3 = text.substring(text.length-4, text.length);
    return window.atob(result1+result2+result3);
  }else{
    let result1 = text.substring(0, 2);
    let result2 = text.substring(3, text.length-1);
    return window.atob(result1+result2);
  }
};

export const encodeString = (key : string ) => {
  let encodedKey = window.btoa(key);
  if(encodedKey.length>6){
    let result1 = encodedKey.substring(0, 2);
    let result2 = encodedKey.substring(2, encodedKey.length-4);
    let result3 = encodedKey.substring(encodedKey.length-4, encodedKey.length);
    let result = result1+"/"+result2+"/"+result3;
    return window.btoa(result);
  } else{
    let result1 = encodedKey.substring(0, 2);
    let result2 = encodedKey.substring(2, encodedKey.length);
    let result = result1+"/"+result2+"/";
    return window.btoa(result);
  }
};
