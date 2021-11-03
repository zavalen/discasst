const state = {
  isPlaying: false,
  episodeToPlay: null,
  currentEpisode: null,
  queue: [],
  history: [],
  isLoading: false,
  errors: null
}

export const zPlayerMutations = {
  play: '[zPlayer] play',
  pause: '[zPlayer] pause',
  setEpisodeToPlay: '[zPlayer] setEpisodeToPlay',
  setCurrentEpisode: '[zPlayer] setCurrentEpisode',
  addToPlaylist: '[zPlayer] addToPlaylist',
  moveToHistory: '[zPlayer] moveToHistory'
}

export const zPlayerActions = {
  playEpisode: '[zPlayer] playEpisode',
  addToPlaylist: '[zPlayer] addToPlaylist',
  moveToHistory: '[zPlayer] moveToHistory'
}

const mutations = {
  [zPlayerMutations.play](state) {
    state.isPlaying = true
  },
  [zPlayerMutations.pause](state) {
    state.isPlaying = false
  },
  [zPlayerMutations.setEpisodeToPlay](state, payload) {
    state.episodeToPlay = payload
  },
  [zPlayerMutations.setCurrentEpisode](state, payload) {
    state.currentEpisode = payload
  },
  [zPlayerMutations.addToPlaylist](state, payload, position = 'start') {
    if (position === 'top') {
      state.queue.unshift(payload)
    } else {
      state.queue.push(payload)
    }
  },
  [zPlayerMutations.addToHistory](state, payload) {
    state.queue.push(payload)
  }
}

const actions = {
  [zPlayerActions.playEpisode](context, episode) {
    context.commit(zPlayerMutations.addToPlaylist, episode)
    context.commit(zPlayerMutations.setEpisodeToPlay, episode)
  },
  [zPlayerActions.addToPlaylist](context, episode) {
    context.commit(zPlayerMutations.addToPlaylist, episode)
  },
  [zPlayerActions.moveToHistory](context, previousEpisode) {
    context.commit(zPlayerMutations.addToPlaylist, previousEpisode)
  }
}

const getters = {}
export default {
  state,
  mutations,
  getters,
  actions
}
