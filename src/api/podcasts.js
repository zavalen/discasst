import axios from '@/api/axios'

const getPodcasts = () => {
  return axios.get(`/podcasts`)
}

const getEpisodeById = id => {
  return axios.get(`/episodes/`, {params: {id}})
}

const getPodcastBySlug = podcastSlug => {
  return axios.get(`/podcasts`, {params: {podcastSlug}})
}

const findOrAddPodcast = rss => {
  return axios.post(`/podcasts`, {rss: rss})
}

const getSubscribtions = () => {
  return axios.get('/podcasts/subscriptions')
}

const subscribe = podcastId => {
  return axios.post('/podcasts/subscriptions', null, {
    params: {podcastId}
  })
}

const unsubscribe = podcastId => {
  return axios.delete(`/podcasts/subscriptions`, {params: {podcastId}})
}

export default {
  getPodcasts,
  getEpisodeById,
  findOrAddPodcast,
  getPodcastBySlug,
  getSubscribtions,
  subscribe,
  unsubscribe
}
