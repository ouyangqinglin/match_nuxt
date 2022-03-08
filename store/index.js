import Vue from 'vue'
export const state = () => {
  return {
    scroll_top: '',
    match_code: ''
  }
}
export const actions = {

}

export const mutations = {
  toTop (state, data) {
    Vue.set(state, 'scroll_top', data )
  },
  saveCode (state, code) {
    Vue.set(state, 'match_code', code)
  }
}
