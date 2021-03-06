import axios from '@/api/axios'

const register = credentials => {
  return axios.post('/users', {user: credentials})
}

const login = credentials => {
  return axios.post('/users/login', {user: credentials})
}

const getCurrentUser = () => {
  return axios.get('/user')
}

const updateUserDetails = user => {
  return axios.patch('/user', {user})
}

export default {
  register,
  login,
  getCurrentUser,
  updateUserDetails
}
