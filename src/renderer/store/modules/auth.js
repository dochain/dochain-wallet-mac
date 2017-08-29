import * as types from '../mutation-types'
import authApi from '@/http/api/auth.js'

const state = {
  currentUser: null,
  authToken: null
}

const getters = {
  currentUser: state => state.currentUser,
  authToken: state => state.authToken
}

const actions = {
  // 登录
  signIn ({ commit, dispatch }, user) {
    return new Promise((resolve, reject) => {
      authApi.signIn()
        .then(result => {
          // 设置用户
          commit(types.SET_CURRENT_USER, {'name': 'chicheng'})

          // 设置授权token
          dispatch('setAuthToken', 'u48riuet4jqdd3fj')
          resolve()
        })
        .catch(errorResult => {
          console.log('错误信息')
          reject(errorResult)
        })
    })
  },
  // 退出
  signOut ({ commit, dispatch }) {
    commit(types.CLEAR_CURRENT_USER)
    dispatch('clearAuthToken')
  },
  // 获取当前用户
  getCurrentUser ({ commit, dispatch }) {
    if (state.authToken) {
      return new Promise((resolve, reject) => {
        authApi.getUser()
          .then(result => {
            // 设置用户
            commit(types.SET_CURRENT_USER, {'name': 'chicheng'})
            resolve()
          })
          .catch(errorResult => {
            commit(types.CLEAR_CURRENT_USER)

            // 清除授权 TODO 可以判断是否有授权
            dispatch('clearAuthToken')
            reject(errorResult)
          })
      })
    }
  },
  // 设置授权token
  setAuthToken ({ commit }, authToken) {
    if (authToken !== 'null' && authToken !== 'undefined') {
      window.localStorage.setItem('AUTH_TOKEN', authToken)
      commit(types.SET_AUTH_TOKEN, authToken)
    }
  },
  // 清除授权token
  clearAuthToken ({ commit }) {
    window.localStorage.removeItem('AUTH_TOKEN')
    commit(types.CLEAR_AUTH_TOKEN)
  }
}

const mutations = {
  [types.SET_CURRENT_USER] (state, user) {
    state.currentUser = { ...user }
  },
  [types.CLEAR_CURRENT_USER] (state) {
    state.currentUser = null
  },
  [types.SET_AUTH_TOKEN] (state, authToken) {
    state.authToken = authToken
  },
  [types.CLEAR_AUTH_TOKEN] (state) {
    state.authToken = null
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
