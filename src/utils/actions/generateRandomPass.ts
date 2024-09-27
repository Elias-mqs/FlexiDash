/// ////// GERAR SENHAS ALEATÓRIA CONFORME REQUISITOS /////////
export function generateRandomPass() {
  const length = 10
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()'
  let password = ''

  // Garantir que pelo menos um de cada tipo de caractere está presente
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'
  const special = '!@#$%^&*()'

  // Adicionar um de cada tipo de caractere
  password += uppercase[Math.floor(Math.random() * uppercase.length)]
  password += lowercase[Math.floor(Math.random() * lowercase.length)]
  password += numbers[Math.floor(Math.random() * numbers.length)]
  password += special[Math.floor(Math.random() * special.length)]

  // Completar a senha com caracteres aleatórios até atingir o comprimento desejado
  for (let i = password.length; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)]
  }

  // Embaralhar os caracteres para evitar padrões previsíveis
  return password
    .split('')
    .sort(() => 0.5 - Math.random())
    .join('')
}

export const utils = {
  generateRandomPass,
}
