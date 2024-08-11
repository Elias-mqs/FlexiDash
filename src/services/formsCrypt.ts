import CryptoJS from "crypto-js";



///////// CRIPTOGRAFAR FORMULARIOS /////////
function dataCrypt(data: any) {
    return { data: CryptoJS.AES?.encrypt(JSON.stringify(data), `${process.env.ROUTECRYPT}`).toString() }
}

///////// DESCRIPTOGRAFAR FORMULARIOS /////////
function verifyData({ data }: { data: string }) {
    let bytes = CryptoJS.AES.decrypt(data, `${process.env.ROUTECRYPT}`);
    console.log(JSON.stringify(bytes.toString(CryptoJS.enc.Utf8)))
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
}


export const FormsCrypt = {
    dataCrypt,
    verifyData
};