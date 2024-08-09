import CryptoJS from "crypto-js";

interface PassProps {
    pass: string
}


function hashPassword({ pass }: PassProps) {
    return CryptoJS.AES?.encrypt(JSON.stringify(pass), `${process.env.PASSCRYP}`).toString()
}

function verifyPassword(data: string) {
    let bytes = CryptoJS.AES.decrypt(data, `${process.env.PASSCRYP}`);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
}


export const PassCrypt = {
    hashPassword,
    verifyPassword
};