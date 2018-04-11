rockt-vuejs-keycloak
=============================================================
Vue.js with Keycloak authentication

This plugin integrates VueJS with Keycloak to perform authentication and configuration of the authorization to send requests to the backend.

Requirements
-------------------------------------------------------------
* Vue ^2.0.0
* Vuex ^2.0.0
* axios ^0.17.0

Installation
-------------------------------------------------------------
```$ npm install --save rockt-vuejs-keycloak```

Setup
-------------------------------------------------------------
Put the frontend settings in ```/src/statics/keycloak.json``` file that will be used to authenticate to Keycloak.
```json
{
  "realm": "SERVER-DEV",
  "auth-server-url": "https://keycloak.mydomain.com/auth",
  "ssl-required": "external",
  "resource": "app-name",
  "public-client": true,
  "use-resource-role-mappings": true,
  "confidential-port": 0
}
```

Put the plugin at VueJS startup

```javascript
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import store from 'rockt-vuejs-keycloak'
import App from './App'
import router from './router'

/* eslint-disable no-new */
new Vue({
  el: '#app',  
  router,
  store,
  template: '<App/>',
  components: { App }
})

```

Configure the ```vue-router``` for to use ```rockt-vuejs-keycloak``` on verification of the routes.
```javascript
import Vue from 'vue'
import VueRouter from 'vue-router'

import store from 'rockt-vuejs-keycloak'

import security from 'rockt-vuejs-keycloak/security'

Vue.use(VueRouter)

function load (component) {
  // '@' is aliased to src/components
  return () => import(`@/${component}.vue`)
}

const routes = [
  {
    path: '/',
    component: load('Layout'),
    meta: { requiresAuth: true, roles: ['user'] },
    children: [
      { path: '', name: 'home', component: load('Home'), meta: { requiresAuth: true, roles: ['user'] } }      
    ]
  },  
  { path: '*', component: load('Error404') }, // Not found
  { path: '/unauthorized', name: 'Unauthorized', component: load('Unauthorized') } // Unauthorized
]

const router = new VueRouter({
  /*
   * NOTE! VueRouter "history" mode DOESN'T works for Cordova builds,
   * it is only to be used only for websites.
   *
   * If you decide to go with "history" mode, please also open /config/index.js
   * and set "build.publicPath" to something other than an empty string.
   * Example: '/' instead of current ''
   *
   * If switching back to default "hash" mode, don't forget to set the
   * build publicPath back to '' so Cordova builds work again.
   */
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const auth = store.state.security.auth
    if (!auth.authenticated) {
      security.init(next, to.meta.roles)
    }
    else {
      if (to.meta.roles) {
        if (security.roles(to.meta.roles[0])) {
          next()
        }
        else {
          next({ name: 'unauthorized' })
        }
      }
      else {
        next()
      }
    }
  }
  else {
    next()
  }
})

export default router
```

Contributions
-----------------------------------------------------------
Any comments or suggestions are very welcome.

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2018-present, Rockt
