import {setItem, getItem} from '@/helpers/persistenceStorage.js'

const state = {
  isPlaying: false,
  currentEpisode: getItem('currentEpisode') || null,
  currentEpisodeTime: 0,
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
  toggle: '[zPlayer] toggle'
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
  }
}

const actions = {
  [zPlayerActions.playEpisode](context, episode) {
    context.commit(zPlayerMutations.setCurrentEpisode, episode)
    setItem('currentEpisode', episode)
    console.log('playEpisode')
  },
  [zPlayerActions.setCurrentEpisodeTime](context, time) {
    context.commit(zPlayerMutations.setCurrentEpisodeTime, time)
    // io.emit('q', {
    //   message: time
    // })
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
