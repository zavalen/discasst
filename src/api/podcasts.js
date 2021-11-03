import axios from '@/api/axios'

const getPodcasts = credentials => {
  return axios.get('/podcasts', credentials)
}

export default {
  getPodcasts
}
