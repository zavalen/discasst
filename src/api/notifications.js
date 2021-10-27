// import axios from '@/api/axios'

const getNotifications = () => {
  // return axios.get(apiUrl)
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        data: {
          notifications: [
            {
              id: 354,
              message: 'Зареsadsad sdasdasdasdasd asdгайся',
              link: '/sadas',
              watched: false
            },
            {
              id: 3544,
              message: 'Зареsadsad dfsasdasd asdasdasdгайся',
              link: '/sadas',
              watched: false
            },
            {
              id: 3552,
              message: 'Зареsagf  fgdsadasdasdasdas fddasdгайся',
              link: '/sadas',
              watched: false
            },
            {
              id: 352,
              message: 'Зареs adsadas asd dasdasdasdasdгайся',
              link: '/sadas',
              watched: false
            },
            {
              id: 3454,
              message: 'Зареsadsadasdasdasdasdasdгайся',
              link: '/sadas',
              watched: false
            }
          ]
        }
      })
    }, 1000)
  })
}

export default {
  getNotifications
}
