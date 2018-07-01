/* eslint no-param-reassign: "error" */
import 'firebase/firestore';
import Vue from 'vue';

export default {
  namespaced: true,
  state: {
    accounts: [],
  },
  mutations: {
    setAccounts(state, payload) {
      state.accounts = payload;
    },
    addAccount(state, account) {
      state.accounts.push(account);
    },
    updateAccount(state, account) {
      const index = state.accounts.findIndex(item => item.id === account.id);
      Vue.set(state.accounts, index, account);
    },
    removeAccount(state, id) {
      const index = state.accounts.findIndex(item => item.id === id);
      state.accounts.accounts.splice(index, 1);
    },
  },
  actions: {
    setAccountsListener({
      commit,
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
    async getAccounts({
      commit,
    }, payload) {
      return new Promise((resolve) => {
        return payload.db.collection('users').doc(payload.user.user.uid).collection('accounts').get()
          .then((accounts) => {
            const accountsAvailable = [];

            accounts.forEach((doc) => {
              const acct = doc.data();
              acct.id = doc.id;
              accountsAvailable.push(acct);
            });
            commit('setAccounts', accountsAvailable);
            return resolve();
          });
      });
    },
    async saveAccount({
      commit,
    }, payload) {
      const self = this;
      return new Promise((resolve) => {
        const id = payload.acctObject.id;
        const acctObject = payload.acctObject;
        const db = payload.db;
        const currentUser = payload.user;
        const findRecord = self.state.accounts.accounts.find(item => item.id === id);

        if (findRecord) {
          return db
            .collection('users')
            .doc(currentUser.user.uid)
            .collection('accounts')
            .doc(acctObject.id.toString())
            .update({
              balance: acctObject.balance,
              memo: acctObject.memo,
              type: acctObject.type,
              name: acctObject.name,
            })
            .then(() => {
              commit('updateAccount', acctObject);
              return resolve();
            });
        }
        return db
          .collection('users')
          .doc(currentUser.user.uid)
          .collection('accounts')
          .add(acctObject)
          .then((doc) => {
            acctObject.id = doc.id;
            commit('addAccount', acctObject);
            return resolve();
          });
      });
    },
    async deleteAccount({
      commit,
    }, payload) {
      const self = this;
      return new Promise((resolve) => {
        const id = payload.id;
        const db = payload.db;
        const currentUser = payload.user;
        const findRecord = self.state.accounts.accounts.find(item => item.id === id);
        if (findRecord) {
          return db
            .collection('users')
            .doc(currentUser.user.uid)
            .collection('accounts')
            .doc(id)
            .delete()
            .then(() => {
              commit('removeAccount', id);
              // Vue.set(this.accounts, this.editedIndex, this.editedItem);
            });
        }
        return resolve();
      });
    },
  },
  getters: {
    accounts(state) {
      return state.accounts;
    },
  },
};
