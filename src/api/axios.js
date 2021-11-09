import axios from 'axios'
import {setItem, getItem} from '@/helpers/persistenceStorage.js'

// axios.defaults.baseURL = 'https://conduit.productionready.io/api'
// axios.defaults.baseURL = 'https://conduit-api-realworld.herokuapp.com/api/'
axios.defaults.baseURL = 'http://localhost:8081/api'

axios.interceptors.request.use(config => {
  const token = getItem('accessToken')
  const authtorisationToken = token ? `Token ${token}` : ''
  config.headers.Authorization = authtorisationToken
  config.headers.visitorId = getVisitorId()
  return config
})

export default axios

export function getVisitorId() {
  const idFromLocalStorage = getItem('visitorId')
  if (idFromLocalStorage) {
    return idFromLocalStorage
  }

  const id =
    Date.now().toString(36) +
    Math.random()
      .toString(36)
      .substr(2)

  setItem('visitorId', id)
  return id
}
