import axios from '@/api/axios'

const getFeed = payload => {
  return axios.get(payload.apiUrl, {
    params: payload.params
  })
}

export default {
  getFeed
}
