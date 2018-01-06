import axios from 'axios'

import * as types from './types'

export default {
  [types.SECURITY_AUTH] (state, keycloakAuth) {
    state.auth = keycloakAuth
    axios.defaults.headers.common = { 'Authorization': 'Bearer ' + keycloakAuth.token }
  }
}
