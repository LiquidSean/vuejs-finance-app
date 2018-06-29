// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueFire from 'vuefire';
import firebase from 'firebase/app';
import Vuetify from 'vuetify';
import 'firebase/firestore';

import router from './router';
import { store } from './store';

const App = () => import('./App');


Vue.config.productionTip = false;

Vue.use(VueFire);
Vue.use(Vuetify);

const config = {
  apiKey: 'AIzaSyCzSukjC23k1fTiLiQEDfVG5a_-WDyMMr0',
  authDomain: 'finance-app-9099c.firebaseapp.com',
  databaseURL: 'https://finance-app-9099c.firebaseio.com',
  projectId: 'finance-app-9099c',
  storageBucket: 'finance-app-9099c.appspot.com',
  messagingSenderId: '793643547458',
};

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
  mounted() {
    firebase.initializeApp(config);
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$store.dispatch('autoSignIn', user);
      }
    });
    if (this.$store.getters.user) {
      this.$store.dispatch('autoSignIn', this.user);
    }
  },
});

