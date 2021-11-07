import axios from '@/api/axios'

const sendVisitor = visitor => {
  return axios.post('/visitor', {visitor})
}

export default {
  sendVisitor
}
