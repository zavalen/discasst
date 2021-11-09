import axios from '@/api/axios'

const getFeed = payload => {
  return axios.get(payload.apiUrl, {
    params: payload.params
  })
}

const sendProgress = payload => {
  console.log(payload)
  return axios.post('/episodes', {progress: payload})
}

export default {
  getFeed,
  sendProgress
}
