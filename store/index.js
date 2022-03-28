import Vue from 'vue'
export const state = () => {
  return {
    suffix: process.env.suffix,
    apiHost: process.env.figHost,
    scroll_top: '',
    match_code: '',
    page: [],
    dyNav: []
  }
}

export const actions = {

}

export const mutations = {
  toTop (state, data) {
    Vue.set(state, 'scroll_top', data)
  },
  saveCode (state, code) {
    Vue.set(state, 'match_code', code)
  },
  savePage (state, data) {
    Vue.set(state, 'page', data)
  },
  saveNav (state, data) {
    Vue.set(state, 'dyNav', data)
  }
}
