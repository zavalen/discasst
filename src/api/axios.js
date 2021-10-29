import axios from 'axios'
import {getItem} from '@/helpers/persistenceStorage'

// axios.defaults.baseURL = 'https://conduit.productionready.io/api'
// axios.defaults.baseURL = 'https://conduit-api-realworld.herokuapp.com/api/'
axios.defaults.baseURL = 'http://localhost:8081/api'

axios.interceptors.request.use(config => {
  const token = getItem('accessToken')
  const authtorisationToken = token ? `Token ${token}` : ''
  config.headers.authorization = authtorisationToken
  return config
})

export default axios
