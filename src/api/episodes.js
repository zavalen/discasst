import axios from '@/api/axios'

const getEpisodes = payload => {
  return axios.get(payload.apiUrl, {
    params: payload.params
  })
}

const setRating = payload => {
  console.log(payload)
  return axios.post('/episodes/rating', {
    rating: payload
  })
}

const sendProgress = payload => {
  console.log(payload)
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
  getEpisodes,
  sendProgress,
  sendToHistory,
  getHistory,
  setRating
}
