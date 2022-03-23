import Vue from 'vue'
export const state = () => {
  return {
    suffix: process.env.suffix,
    mHost: process.env.figHost,
    scroll_top: '',
    match_code: '',
    page: []
  }
}

export const actions = {

}

export const mutations = {
  toTop (state, data) {
    Vue.set(state, 'scroll_top', data)
  },
  saveCode (state, code) {
    window.localStorage.setItem('match_code', code)
    Vue.set(state, 'match_code', window.localStorage.getItem('code'))
  },
  savePage (state, data) {
    window.localStorage.setItem('page', JSON.stringify(data))
    Vue.set(state, 'page', JSON.parse(window.localStorage.getItem('page')))
  }
}
