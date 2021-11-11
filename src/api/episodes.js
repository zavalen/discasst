import axios from '@/api/axios'

const getFeed = payload => {
  return axios.get(payload.apiUrl, {
    params: payload.params
  })
}

const sendProgress = payload => {
  return axios.post('/episodes/progress', {progress: payload})
}

const sendToHistory = payload => {
  console.log('send to history', payload)
  return axios.post('/episodes/history', {episode: payload})
}

const getHistory = payload => {
  return axios.get('/episodes/history', {
    params: payload.params
  })
}

export default {
  getFeed,
  sendProgress,
  sendToHistory,
  getHistory
}
