import CryptoJS from "crypto-js";

///////// CRIPTOGRAFAR FORMULARIOS /////////
// a de cima é a original
// function dataCrypt(data: any) {
//     return { data: CryptoJS.AES?.encrypt(JSON.stringify(data), `${process.env.ROUTECRYPT}`).toString() }
// }
function dataCrypt(data: any) {
    const dados = CryptoJS.AES?.encrypt(JSON.stringify(data), `${process.env.ROUTECRYPT}`).toString() 
    return dados
}
///////// DESCRIPTOGRAFAR FORMULARIOS /////////
function verifyData(data: string) {
    let bytes = CryptoJS.AES.decrypt(data, `${process.env.ROUTECRYPT}`);
    console.log(JSON.stringify(bytes.toString(CryptoJS.enc.Utf8)))
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
}


export const FormsCrypt = {
    dataCrypt,
    verifyData
};