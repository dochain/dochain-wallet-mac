import Api from '../../lib/http'

// User的api
const authApi = {
  signIn () {
    return Api.get('/jquery/3.2.1/core.js')
  },
  getUser () {
    return Api.get('/jquery/3.2.1/core.js')
  }
}
export default authApi
