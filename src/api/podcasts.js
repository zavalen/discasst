import axios from '@/api/axios'

const getPodcasts = () => {
  return axios.get(`/podcasts`)
}

const getEpisodeById = id => {
  return axios.get(`/episodes/`, {params: {id}})
}

export default {
  getPodcasts,
  getEpisodeById
}
