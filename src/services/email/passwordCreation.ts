import { sendEmail } from './sendEmail'
import { passwordCreationTemplate } from './templates/passwordCreationTemplate'

export const sendPasswordCreationEmail = (to: string, name: string, temporaryPassword: string) => {
  const subject = 'Criação de Senha' // Title
  const html = passwordCreationTemplate(name, temporaryPassword) // Conteúdo

  sendEmail(to, subject, html)
}
