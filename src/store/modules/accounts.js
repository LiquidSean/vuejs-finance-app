import 'firebase/firestore';

export default {
  namespaced: true,
  state: {
    accounts: [],
  },
  mutations: {
    setAccounts(state, payload) {
      state.accounts = payload;
    },
  },
  actions: {
    setAccountsListener({ commit,
    }, payload) {
      const accounts = payload.db.collection('users').doc(payload.user.user.uid).collection('accounts');
      accounts
        .onSnapshot((acctsRef) => {
          const acctArray = [];
          acctsRef.forEach((doc) => {
            const acct = doc.data();
            acct.id = doc.id;
            acctArray.push(acct);
          });
          commit('setAccounts', acctArray);
        }, () => {});
    },
    async getAccounts({ commit,
    }, payload) {
      return payload.db.collection('users').doc(payload.user.user.uid).collection('accounts').get()
        .then((accounts) => {
          const accountsAvailable = [];

          accounts.forEach((doc) => {
            const acct = doc.data();
            acct.id = doc.id;
            accountsAvailable.push(acct);
          });
          commit('setAccounts', accountsAvailable);
        });
    },
  },
  getters: {
    accounts(state) {
      return state.accounts;
    },
  },
};
