import * as types from './types'

import store from '../../'

export default {
  authLogin ({ commit }, keycloakAuth) {
    store.commit(types.SECURITY_AUTH, keycloakAuth)
  },
  authLogout ({ commit }) {
    commit(types.SECURITY_AUTH)
  }
}
