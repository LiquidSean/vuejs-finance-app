import firebase from 'firebase/app';
import 'firebase/firestore';

export default {
  state: {
    user: localStorage.user ? JSON.parse(localStorage.user) : null,
    db: null,
  },
  mutations: {
    setUser(state) {
      state.user = localStorage.user ? JSON.parse(localStorage.user) : null;
    },
    setDB(state, payload) {
      const settings = {
        timestampsInSnapshots: true,
      };
      if (payload) {
        if (state.db === null) {
          const db = firebase.firestore();
          db.settings(settings);
          state.db = db;
        }
      } else {
        state.db = null;
      }
    },
  },
  actions: {
    signUserUp({ commit }, payload) {
      commit('setLoading', true);
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
        .then(
          (user) => {
            commit('setLoading', false);
            const newUser = {
              id: user.uid,
              name: user.displayName,
              email: user.email,
              photoUrl: user.photoURL,
            };
            commit('setUser', newUser);
            commit('setDB', true);
          },
        )
        .catch(
          () => {
            commit('setLoading', false);
          });
    },
    signUserIn({ commit }, payload) {
      commit('setLoading', true);
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
        .then(
          (user) => {
            commit('setLoading', false);
            commit('setUser', user);
            commit('setDB', true);
          })
        .catch(
          () => {
            commit('setLoading', false);
          });
    },
    autoSignIn({ commit }, payload) {
      commit('setUser', payload);
      commit('setDB', true);
    },
    initializeDB({ commit }) {
      commit('setDB', true);
    },
    logout({ commit }) {
      firebase.auth().signOut();
      commit('setUser', null);
      commit('setDB', null);
    },
  },
  getters: {
    user(state) {
      return state.user;
    },
    db(state) {
      return state.db;
    },
  },
};
