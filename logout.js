import store from '../'

export default () => {
  var keycloakAuth = store.getters.SECURITY_AUTH
  keycloakAuth.logout()
  store.dispatch('authLogout')
}
