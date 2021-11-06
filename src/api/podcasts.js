import axios from '@/api/axios'

const getPodcasts = () => {
  return axios.get(`/podcasts`)
}

const getEpisodeById = id => {
  return axios.get(`/episodes/`, {params: {id}})
}

const addPodcast = rss => {
  return axios.post(`/podcasts`, {rss: rss})
}

export default {
  getPodcasts,
  getEpisodeById,
  addPodcast
}
