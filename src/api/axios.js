import axios from 'axios'
import {getItem} from '@/helpers/persistenceStorage'

axios.defaults.baseURL = 'https://conduit.productionready.io/api'
axios.interceptors.request.use(config => {
  const token = getItem('accessToken')
  const authtorisationToken = token ? `Token ${token}` : ''
  console.log(authtorisationToken)
  config.headers.authorization = authtorisationToken
  return config
})

export default axios
