import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const state = {
  auth: {
    authenticated: false
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
