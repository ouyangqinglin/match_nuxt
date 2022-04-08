import Vue from 'vue'
export const state = () => {
  return {
    suffix: process.env.suffix,
    apiHost: process.env.figHost,
    scroll_top: '',
    match_code: '',
    page: [],
    dyNav: [],
    commitment_letter: null,
    disclaimer: null,
    theme: '',
    menu: [],
    mobile_config: {},
    mobile_page: [],
    urlObj: {}
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
  },
  saveLetter (state, data) {
    Vue.set(state, 'commitment_letter', data)
  },
  saveDisclaimer (state, data) {
    Vue.set(state, 'disclaimer', data)
  },
  saveTheme (state, data) {
    Vue.set(state,'theme', data)
  },
  saveMenu (state, data) {
    Vue.set(state, 'menu', data)
  },
  saveConfig (state, data) {
    Vue.set(state, 'mobile_config', data)
  },
  saveMobilePage (state, data) {
    Vue.set(state, 'mobile_page', data)
  },
  saveUrlObj (state, data) {
    Vue.set(state, 'urlObj', data)
  },
}
