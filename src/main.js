// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueFire from 'vuefire';
import firebase from 'firebase/app';
import Vuetify from 'vuetify';
import 'firebase/firestore';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';


import router from './router';
import { store } from './store';

const App = () => import('./App');


library.add(faSpinner);

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false;

Vue.use(VueFire);
Vue.use(Vuetify);

const config = {
  apiKey: '',
  authDomain: '',
  databaseURL: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
};
firebase.initializeApp(config);

/* eslint-disable no-new */
let app;
firebase.auth().onAuthStateChanged((user) => {
  if (!app) {
    app = new Vue({
      el: '#app',
      router,
      store,
      components: { App },
      beforeCreate() {
        if (user) {
          store.dispatch('autoSignIn', user);
        }
      },
      template: '<App/>',
    });
  }
});

if (app && store.getters.user) {
  store.dispatch('autoSignIn', store.getters.user);
}

