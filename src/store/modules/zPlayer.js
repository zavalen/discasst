import {setItem, getItem} from '@/helpers/persistenceStorage.js'
import api from '@/api/feed'

const state = {
  isPlaying: false,
  currentEpisode: getItem('currentEpisode') || null,
  currentEpisodeTime: 0,
  currentEpisodeReallyListened: new Set(),

  queue: getItem('queue') || [],
  history: getItem('history') || [],
  isLoading: false,
  errors: null
}

export const zPlayerMutations = {
  play: '[zPlayer] play',
  pause: '[zPlayer] pause',
  setCurrentEpisode: '[zPlayer] setCurrentEpisode',
  setCurrentEpisodeTime: '[zPlayer] setCurrentEpisodeTime',
  addToQueue: '[zPlayer] addToQueue',
  removeFromQueue: '[zPlayer] removeFromQueue',
  addToHistory: '[zPlayer] addToHistory',
  removeFromHistory: '[zPlayer] removeFromHistory',
  toggle: '[zPlayer] toggle',
  setReallyListened: '[zPlayer] setReallyListened'
}

export const zPlayerActions = {
  playEpisode: '[zPlayer] playEpisode',
  setCurrentEpisodeTime: '[zPlayer] setCurrentEpisodeTime',
  addToQueue: '[zPlayer] addToQueue',
  removeFromQueue: '[zPlayer] removeFromQueue',
  addToHistory: '[zPlayer] addToHistory',
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
    if (state.currentEpisode && payload.id != state.currentEpisode.id) {
      state.history.unshift(state.currentEpisode)
    }
    state.currentEpisode = payload
    state.queue = state.queue.filter(ep => ep.id != state.currentEpisode.id)

    if (payload.progress) {
      state.currentEpisodeReallyListened = new Set(
        payload.progress.setReallyListenedArray
      )
      state.currentEpisodeTime = payload.progress.lastPoint
    } else {
      state.currentEpisodeReallyListened = new Set()
    }
  },
  [zPlayerMutations.setCurrentEpisodeTime](state, payload) {
    state.currentEpisodeTime = payload
  },
  [zPlayerMutations.addToQueue](state, payload) {
    state.queue.push(payload)

    // delete duplicates
    state.queue = state.queue.filter(
      (v, i, a) => a.findIndex(t => t.id === v.id) === i
    )
  },
  [zPlayerMutations.removeFromQueue](state, payload) {
    state.queue = state.queue.filter(ep => ep.id != payload.id)
  },

  [zPlayerMutations.addToHistory](state, payload) {
    state.history.unshift(payload)
  },
  [zPlayerMutations.removeFromHistory](state, payload) {
    state.history = state.history.filter(ep => ep.id != payload.id)
  },
  [zPlayerMutations.setReallyListened](state, payload) {
    state.currentEpisodeReallyListened.add(payload)
  }
}

const actions = {
  [zPlayerActions.playEpisode](context, episode) {
    // set new episode
    context.commit(zPlayerMutations.setCurrentEpisode, episode)
    setItem('currentEpisode', episode)
    console.log('playEpisode')
  },
  [zPlayerActions.setCurrentEpisodeTime](context, time) {
    context.commit(zPlayerMutations.setCurrentEpisodeTime, time)
    context.commit(zPlayerMutations.setReallyListened, Math.ceil(time))

    window.playerTime ? window.playerTime++ : (window.playerTime = 1)
    if (window.playerTime === 1 || window.playerTime % 20 == 0) {
      const progress = {
        EpisodeId: context.state.currentEpisode
          ? context.state.currentEpisode.id
          : null,
        lastPoint: Math.floor(time),
        reallyListened: context.state.currentEpisodeReallyListened.size,
        reallyListenedArray: Array.from(
          context.state.currentEpisodeReallyListened
        )
      }

      // console.log(progress)
      // console.log(context)
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
  }
}

export default {
  state,
  mutations,
  actions
}
