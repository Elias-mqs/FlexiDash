import CryptoJS from "crypto-js";



///////// CRIPTOGRAFAR FORMULARIOS /////////
function dataCrypt(data: any) {
    const SECRETKEY = process.env.NEXT_PUBLIC_ROUTECRYPT
    return { data: CryptoJS.AES?.encrypt(JSON.stringify(data), SECRETKEY!).toString() }
}

///////// DESCRIPTOGRAFAR FORMULARIOS /////////
function verifyData({ data }: { data: string }) {

    const SECRETKEY = process.env.NEXT_PUBLIC_ROUTECRYPT

    let bytes = CryptoJS.AES.decrypt(data, SECRETKEY!);

    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);

    try {
        return JSON.parse(decryptedString);
    } catch (error) {
        console.error('Erro ao parsear JSON:', error);
        return null;
    }
}


export const FormsCrypt = {
    dataCrypt,
    verifyData
};