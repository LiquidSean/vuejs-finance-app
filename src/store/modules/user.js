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
        const db = firebase.firestore();
        db.settings(settings);
        state.db = db;
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
          (error) => {
            commit('setLoading', false);
            console.log(error);
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
          (error) => {
            commit('setLoading', false);
            console.log(error);
          });
    },
    autoSignIn({ commit }, payload) {
      commit('setUser', payload);
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




// The shared state object that any vue component can get access to.
// Has some placeholders that we’ll use further on!
// export const store = {
//   db,
//   currentUser: null,
//   transactionsAvailable: null,
//   budgetsAvailable: null,
//   accountsAvailable: null,
//   initCollections: null,
// };

// const users = store.db.collection('users');

// store.seedCollections = async function seedCollections() {
//   if (store.currentUser && store.currentUser.uid) {
//     const transactions = await users.doc(store.currentUser.uid).collection('transactions').get();
//     const budgets = await users.doc(store.currentUser.uid).collection('budgets').get();
//     const accounts = await users.doc(store.currentUser.uid).collection('accounts').get();

//     store.transactionsAvailable = [];
//     store.accountsAvailable = [];
//     store.budgetsAvailable = [];

//     transactions.forEach((doc) => {
//       const tran = doc.data();
//       tran.id = doc.id;
//       store.transactionsAvailable.push(tran);
//     });

//     accounts.forEach((doc) => {
//       const acct = doc.data();
//       acct.id = doc.id;
//       store.accountsAvailable.push(acct);
//     });

//     budgets.forEach((doc) => {
//       const budget = doc.data();
//       budget.id = doc.id;
//       store.budgetsAvailable.push(budget);
//     });
//   }
// };

// store.subscribeToCollections = function initCollections() {
//   if (store.currentUser && store.currentUser.uid) {
//     const transactions = users.doc(store.currentUser.uid).collection('transactions');
//     const budgets = users.doc(store.currentUser.uid).collection('budgets');
//     const accounts = users.doc(store.currentUser.uid).collection('accounts');

//     transactions
//       .onSnapshot((transRef) => {
//         const trans = [];
//         transRef.forEach((doc) => {
//           const tran = doc.data();
//           tran.id = doc.id;
//           trans.push(tran);
//         });
//         store.transactionsAvailable = trans;
//       }, () => {});

//     budgets
//       .onSnapshot((budgetsRef) => {
//         const budgetsList = [];
//         budgetsRef.forEach((doc) => {
//           const budget = doc.data();
//           budget.id = doc.id;
//           budgetsList.push(budget);
//         });
//         store.budgetsAvailable = budgetsList;
//       }, () => {});

//     accounts
//       .onSnapshot((acctsRef) => {
//         const accts = [];
//         acctsRef.forEach((doc) => {
//           const account = doc.data();
//           account.id = doc.id;
//           accts.push(account);
//         });
//         store.accountsAvailable = accts;
//       }, () => {});
//   }
// };

// if (store.currentUser) {
//   users
//     .onSnapshot((transRef) => {
//       const trans = [];
//       transRef.forEach((doc) => {
//         const tran = doc.data();
//         trans.push(tran);
//       });
//       store.usersAvailable = trans;
//     }, () => {});
// }
