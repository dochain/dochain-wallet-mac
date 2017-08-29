import * as types from './mutation-types'

const actions = {
  // 改变左侧菜单
  changeLeftMenu ({ commit }, leftMenu) {
    commit(types.SET_LEFT_MENU, leftMenu)
  },
  // 显示loading
  showLoading ({ commit }) {
    commit(types.SHOW_LOADING)
  },
  // 隐藏loging
  hideLoading ({ commit }) {
    commit(types.HIDE_LOADING)
  },
  showHeader ({ commit }) {
    commit(types.SHOW_HEADER)
  },
  hideHeader ({ commit }) {
    commit(types.HIDE_HEADER)
  }
}

export default actions
