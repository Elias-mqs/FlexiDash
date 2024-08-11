import bcrypt from 'bcryptjs';

async function hashPassword(pass: string): Promise<string> {
    const saltRounds = 10;
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPass = await bcrypt.hash(pass, salt);
        return hashedPass;
    } catch (error) {
        console.error('Erro ao hashear a senha:', error);
        throw error;
    }
}

async function verifyPassword(pass: string, hashedPass: string): Promise<boolean> {

    console.log('pass no verify:',pass)
    console.log('hashedPass no verify:',hashedPass)

    if (!pass || !hashedPass) {
        throw new Error('Senha e hash são obrigatórios');
    }
    
    try {
        const match = await bcrypt.compare(pass, hashedPass);
        return match;
    } catch (error) {
        console.error('Erro ao comparar senhas:', error);
        throw error;
    }
}

export const PassCrypt = {
    hashPassword,
    verifyPassword
};
