import axios from 'axios'
import Cookies from 'js-cookie'

const api = axios.create({
  baseURL: '/api/',
})

export { api }

/// //////////////////////////////////////////////////////////////////
/// /////////////////// REQUEST INTERCEPTORS /////////////////////////
/// //////////////////////////////////////////////////////////////////

// Interceptores de requisição
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('ssnAuth')
    const authRequestToken = token ? `Bearer ${token}` : ''
    config.headers.Authorization = authRequestToken
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

/// //////////////////////////////////////////////////////////////////
/// ////////////////// RESPONSE INTERCEPTORS /////////////////////////
/// //////////////////////////////////////////////////////////////////

interface ResponseErrorProps {
  status: number
  title: string
  message: string
}

api.interceptors.response.use(
  (response) => {
    // Modifique a resposta antes de entregá-la
    return response
  },
  (error) => {
    // FALTA INSERIR OS OUTROS POSSIVEIS ERROS E SUAS DESCRIÇÕES

    // NÃO AUTORIZADO
    // if (error.response?.status === 401) {
    //     //remover o token aqui e redirecionar para a tela de login

    //     return Promise.reject(error);
    // }
    return Promise.reject({ data: error.response.data, status: error.response.status })
  },
)

export default api
