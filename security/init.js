import Keycloak from 'keycloak-js'
import store from '../'

let keycloakAuth = new Keycloak('/statics/keycloak.json')

export default (next, roles) => {
  keycloakAuth.init({ onLoad: 'login-required' })
    .success((authenticated) => {
      if (!authenticated) {
        window.location.reload()
      }
      store.dispatch('authLogin', keycloakAuth)
      if (roles) {
        if (keycloakAuth.hasResourceRole(roles[0])) {
          next()
        }
        else {
          next({ name: 'Unauthorized' })
        }
      }
      else {
        next()
      }
      setInterval(function () {
        keycloakAuth.updateToken(70)
          .success((refreshed) => {
            if (refreshed) {
              store.dispatch('authLogin', keycloakAuth)
            }
            else {
              console.log('Token not refreshed, valid for ' + Math.round(keycloakAuth.tokenParsed.exp + keycloakAuth.timeSkew - new Date().getTime() / 1000) + ' seconds')
            }
          }).error(function () {
            console.error('Failed to refresh token')
          })
      }, 60000)
    })
    .error(() => {
      console.log('failed to login')
    })
}
