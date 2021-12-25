import {setItem, getItem} from '@/helpers/persistenceStorage.js'
import api from '@/api/episodes'

const state = {
  isPlaying: false,
  currentEpisode: getItem('currentEpisode') || null,
  lastPoint: 0,
  reallyListened: new Set(),

  queue: getItem('queue') || [],
  history: getItem('history') || [],
  isModalOpen: false,
  isLoading: false,
  errors: null
}

export const zPlayerMutations = {
  play: '[zPlayer] play',
  pause: '[zPlayer] pause',
  setCurrentEpisode: '[zPlayer] setCurrentEpisode',
  setLastPoint: '[zPlayer] setLastPoint',
  addToQueue: '[zPlayer] addToQueue',
  removeFromQueue: '[zPlayer] removeFromQueue',
  addToHistory: '[zPlayer] addToHistory',
  setHistory: '[zPlayer] setHistory',
  removeFromHistory: '[zPlayer] removeFromHistory',
  toggle: '[zPlayer] toggle',
  setReallyListened: '[zPlayer] setReallyListened',
  toggleModal: '[zPlayer] toggleModal',
  closeModal: '[zPlayer] closeModal',
  updateQueue: '[zPlayer] updateQueue'
}

export const zPlayerActions = {
  playEpisode: '[zPlayer] playEpisode',
  setLastPoint: '[zPlayer] setLastPoint',
  addToQueue: '[zPlayer] addToQueue',
  removeFromQueue: '[zPlayer] removeFromQueue',
  addToHistory: '[zPlayer] addToHistory',
  getHistory: '[zPlayer] getHistory',
  removeFromHistory: '[zPlayer] removeFromHistory',
  toggle: '[zPlayer] toggle'
}

const mutations = {
  [zPlayerMutations.play](state) {
    state.isPlaying = true
  },
  [zPlayerMutations.pause](state) {
    state.isPlaying = false
  },
  [zPlayerMutations.toggle](state) {
    state.isPlaying = !state.isPlaying
  },

  [zPlayerMutations.setCurrentEpisode](state, payload) {
    state.currentEpisode = payload
    state.queue = state.queue.filter(ep => ep.id != state.currentEpisode.id)

    if (payload.progress && payload.progress.lastPoint) {
      state.reallyListened = new Set(payload.progress.reallyListenedArray)
      state.lastPoint = payload.progress.lastPoint
    } else {
      state.reallyListened = new Set()
      state.lastPoint = 0
    }
  },
  [zPlayerMutations.setLastPoint](state, payload) {
    state.lastPoint = payload

    if (payload > 1) {
      if (!state.currentEpisode.progress) {
        state.currentEpisode.progress = {}
      }
      state.currentEpisode.progress.lastPoint = payload
      state.currentEpisode.progress.percentage =
        (payload * 100) / state.currentEpisode.duration
    }
  },
  [zPlayerMutations.addToQueue](state, payload) {
    // if (state.currentEpisode) {
    state.queue.push(payload)
    // } else {
    //   state.currentEpisode = payload
    // }

    // delete duplicates
    // state.queue = state.queue.filter(
    //   (v, i, a) => a.findIndex(t => t.id === v.id) === i
    // )
  },
  [zPlayerMutations.removeFromQueue](state, payload) {
    state.queue = state.queue.filter(ep => ep.id != payload.id)
  },

  [zPlayerMutations.addToHistory](state, payload) {
    state.history.unshift(payload)
  },
  [zPlayerMutations.setHistory](state, payload) {
    state.history = payload
  },
  [zPlayerMutations.removeFromHistory](state, payload) {
    state.history = state.history.filter(ep => ep.id != payload.id)
  },
  [zPlayerMutations.setReallyListened](state, payload) {
    state.reallyListened.add(payload)
  },
  [zPlayerMutations.toggleModal](state) {
    state.isModalOpen = !state.isModalOpen
  },
  [zPlayerMutations.closeModal](state) {
    state.isModalOpen = false
  },
  [zPlayerMutations.updateQueue](state, payload) {
    state.queue = payload
  }
}

const actions = {
  [zPlayerActions.playEpisode](context, episode) {
    const previousEpisode = context.state.currentEpisode
    if (previousEpisode && previousEpisode.id != episode.id) {
      api.sendToHistory(previousEpisode)
      context.commit(zPlayerMutations.addToHistory, previousEpisode)
    }
    // set new episode
    context.commit(zPlayerMutations.setCurrentEpisode, episode)
    setItem('currentEpisode', episode)
  },
  [zPlayerActions.setLastPoint](context, time) {
    context.commit(zPlayerMutations.setLastPoint, time)
    context.commit(zPlayerMutations.setReallyListened, Math.round(time))

    window.playerTime ? window.playerTime++ : (window.playerTime = 1)
    if (window.playerTime === 1 || window.playerTime % 20 == 0) {
      const progress = getProgressObj(context)
      api.sendProgress(progress)
    }
  },
  [zPlayerActions.addToQueue](context, episode) {
    context.commit(zPlayerMutations.addToQueue, episode)
    setItem('queue', state.queue)
  },
  [zPlayerActions.removeFromQueue](context, episode) {
    if (episode) {
      context.commit(zPlayerMutations.removeFromQueue, episode)
    }
  },
  [zPlayerActions.addToHistory](context, previousEpisode) {
    context.commit(zPlayerMutations.addToHistory, previousEpisode)
  },
  [zPlayerActions.removeFromHistory](context, episode) {
    context.commit(zPlayerMutations.removeFromHistory, episode)
  },
  [zPlayerActions.toggle](context) {
    context.commit(zPlayerMutations.toggle)
  },
  [zPlayerActions.getHistory](context, payload) {
    api
      .getHistory(payload)
      .then(response => {
        context.commit(zPlayerMutations.setHistory, response.data.episodes)
      })
      .catch(err => {
        console.log(err)
      })
  }
}

export default {
  state,
  mutations,
  actions
}

function getProgressObj(context) {
  return {
    EpisodeId: context.state.currentEpisode
      ? context.state.currentEpisode.id
      : null,
    lastPoint: Math.round(context.state.lastPoint),
    percentage: Math.round(
      (Math.round(context.state.lastPoint) * 100) /
        context.state.currentEpisode.duration
    ),
    reallyListened: context.state.reallyListened.size,
    reallyListenedPercentage: Math.round(
      (context.state.reallyListened.size * 100) /
        context.state.currentEpisode.duration
    ),
    reallyListenedArray: Array.from(context.state.reallyListened)
  }
}
