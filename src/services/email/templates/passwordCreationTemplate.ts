export const passwordCreationTemplate = (name: string, temporaryPassword: string) => `
  <p>Olá ${name},</p>
  
  <p>Você foi cadastrado no nosso sistema e uma senha provisória foi gerada para que você possa ter acesso. Por favor, siga as instruções abaixo para realizar seu primeiro acesso e trocar sua senha.</p>
  
  <h3>Dados de Acesso:</h3>
  <ul>
      <li><strong>Usuário: (será enviado pelo administrador)</strong></li>
      <li><strong>Senha Provisória:</strong> ${temporaryPassword}</li>
  </ul>
  
  <h3>Instruções de Acesso:</h3>
  <ol>
      <li><strong>Acesso ao Sistema:</strong>
      <ul>
          <li>O link para acesso ao sistema será fornecido pelo administrador que realizou seu cadastro.</li>
      </ul>
      </li>
      <li><strong>Troca da Senha:</strong>
          <ul>
              <li>Para garantir a segurança da sua conta, é necessário trocar a senha provisória. Siga os passos abaixo:</li>
              <li>1. Faça login no sistema usando a senha provisória.</li>
              <li>2. Clique no ícone de engrenagem (configurações) no canto superior direito.</li>
              <li>3. Selecione "Informações da Conta".</li>
              <li>4. Clique em "Atualizar Senha" e siga as instruções para definir sua nova senha.</li>
          </ul>
      </li>
  </ol>
  
  <p>Se você não solicitou este cadastro, por favor, ignore este e-mail.</p>
  
  <p>Atenciosamente,<br>
      Equipe H2L</p>
`
