import axios from '@/api/axios'

const getFeed = apiUrl => {
  axios.get(apiUrl)
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        data: {
          episodes: [
            {
              id: 1,
              title:
                'Мозг работает не так, как  что разные участки мозга что разные участки мозга  вы привыкли считать',
              slug: 'mozg',
              description:
                'Однажды ученые определили, что разные участки мозга  что разные участки мозга  что разные участки мозга отвечают за разные ментальные функции. Многие наверняка помнят эту схему в учебниках анатомии. Но все оказалось не так просто — недавние исследования показали, что границы этих участков намного запутаннее. А существующая схема не только сильно упрощена, но и вводит в заблуждение. Текстовая версия: https://newochem.io/rabote-mozga/ По материалам Quanta Magazine Озвучил: Генри Ким Переводил: Артем Белов Редактировала: Александра Листьева Хочешь слушать наши подкасты чаще? Поддержи проект на Патреоне https://www.patreon.com/join/newochem Хочешь предложить партнерство или заказать рекламу? Напиши нам: https://t.me/newochem go@newochem.io',
              pubDate: 'Thu, 21 Oct 2021 14:43:58 +0300',
              explicit: 'No',
              duration: '21:53',
              episode: '',
              enclosure: {
                url:
                  'https://newochem.podster.fm/377/download/audio.mp3?media=rss',
                length: '21005791',
                type: 'audio/mpeg'
              },
              link: '/sadas',
              watched: false,

              podcast: {
                id: '1',
                title: 'newochem',
                slug: 'newochem',
                author_id: 'newochem',
                description: 'newochem',
                image:
                  'hfttps://i.podster.fm/img/55004/crop/yes/size/mlarge/crop/yes/55004-2.jpg'
              }
            },
            {
              id: 2,
              title: 'Мозг работает не так, как вы привыкли считать',
              slug: 'mozg',
              description:
                'Однажды ученые определили, что разные участки мозга отвечают за разные ментальные функции. Многие наверняка помнят эту схему в учебниках анатомии. Но все оказалось не так просто — недавние исследования показали, что границы этих участков намного запутаннее. А существующая схема не только сильно упрощена, но и вводит в заблуждение. Текстовая версия: https://newochem.io/rabote-mozga/ По материалам Quanta Magazine Озвучил: Генри Ким Переводил: Артем Белов Редактировала: Александра Листьева Хочешь слушать наши подкасты чаще? Поддержи проект на Патреоне https://www.patreon.com/join/newochem Хочешь предложить партнерство или заказать рекламу? Напиши нам: https://t.me/newochem go@newochem.io',
              pubDate: 'Thu, 21 Oct 2021 14:43:58 +0300',
              explicit: 'No',
              duration: '21:53',
              episode: '',
              enclosure: {
                url:
                  'https://newochem.podster.fm/377/download/audio.mp3?media=rss',
                length: '21005791',
                type: 'audio/mpeg'
              },
              link: '/sadas',
              watched: false,

              podcast: {
                id: '1',
                title: 'newochem',
                slug: 'newochem',
                author_id: 'newochem',
                description: 'newochem',
                image:
                  'https://i.podster.fm/img/55004/crop/yes/size/mlarge/crop/yes/55004-2.jpg'
              }
            }
          ]
        }
      })
    }, 1000)
  })
}

export default {
  getFeed
}
