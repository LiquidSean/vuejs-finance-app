// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueFire from 'vuefire';
import firebase from 'firebase/app';
import Vuetify from 'vuetify';
import 'firebase/firestore';

// Styles

import App from './App';
import router from './router';
import { store } from './store';


Vue.config.productionTip = false;

Vue.use(VueFire);
Vue.use(Vuetify);

let app;
firebase.auth().onAuthStateChanged((user) => {
  store.currentUser = user;
  store.subscribeToCollections();
  store.seedCollections().then(() => {
    if (!app) {
      /* eslint-disable no-new */
      app = new Vue({
        el: '#app',
        template: '<App :user="user" />',
        data() { return { user }; },
        components: { App },
        router,
      });
    } else {
      app.user = store.currentUser;
    }
  });
});
