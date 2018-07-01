/* eslint no-param-reassign: "error" */
import 'firebase/firestore';
import Vue from 'vue';

export default {
  state: {
    transactions: [],
    categorizedTransactions: [],
  },
  mutations: {
    setTransactions(state, payload) {
      state.transactions = payload;
    },
    setCategorizedTransactions(state, payload) {
      state.categorizedTransactions = payload;
    },
    addTransaction(state, transaction) {
      state.transactions.push(transaction);
    },
    updateTransaction(state, transaction) {
      const index = state.transactions.findIndex(item => item.id === transaction.id);
      Vue.set(state.transactions, index, transaction);
    },
    removeTransaction(state, id) {
      const index = state.transactions.findIndex(item => item.id === id);
      state.transactions.transactions.splice(index, 1);
    },
  },
  actions: {
    setTransactionsListener({
      commit,
    }, payload) {
      const transactions = payload.db.collection('users').doc(payload.user.user.uid).collection('transactions');
      transactions
        .onSnapshot((transRef) => {
          const trans = [];
          transRef.forEach((doc) => {
            const tran = doc.data();
            tran.id = doc.id;
            trans.push(tran);
          });
          commit('setTransactions', trans);
        }, () => {});
    },
    async getTransactions({
      commit,
    }, payload) {
      return payload.db.collection('users').doc(payload.user.user.uid).collection('transactions').get()
        .then((transactions) => {
          const transactionsAvailable = [];

          transactions.forEach((doc) => {
            const tran = doc.data();
            tran.id = doc.id;
            transactionsAvailable.push(tran);
          });
          commit('setTransactions', transactionsAvailable);
        });
    },
    async getCategorizedTransactions({ commit }) {
      const self = this;
      return new Promise((resolve) => {
        const categorizedTransactions = self.state.transactions.transactions.reduce((
          tranCategories,
          transaction,
        ) => {
          if (tranCategories[transaction.category]) {
            tranCategories[transaction.category] += Number.parseFloat(transaction.amount);
          } else {
            tranCategories[transaction.category] = Number.parseFloat(transaction.amount);
          }
          return tranCategories;
        }, {});
        commit('setCategorizedTransactions', categorizedTransactions);
        return resolve();
      });
    },
    async saveTransaction({
      commit,
    }, payload) {
      const self = this;
      return new Promise((resolve) => {
        const id = payload.tranObject.id;
        const tranObject = payload.tranObject;
        const db = payload.db;
        const currentUser = payload.user;
        const findRecord = self.state.transactions.transactions.find(item => item.id === id);

        if (findRecord) {
          return db
            .collection('users')
            .doc(currentUser.user.uid)
            .collection('transactions')
            .doc(id)
            .update({
              amount: tranObject.amount,
              memo: tranObject.memo,
              status: tranObject.status,
              created: tranObject.created,
              account_type: tranObject.account_type,
              transaction_type: tranObject.transaction_type,
              transaction_date: tranObject.transaction_date,
              category: tranObject.category,
            })
            .then(() => {
              commit('updateTransaction', tranObject);
              return resolve();
            });
        }

        return db
          .collection('users')
          .doc(currentUser.user.uid)
          .collection('transactions')
          .add({
            amount: tranObject.amount,
            memo: tranObject.memo,
            status: tranObject.status,
            created: tranObject.created,
            account_type: tranObject.account_type,
            transaction_type: tranObject.transaction_type,
            transaction_date: tranObject.transaction_date,
            category: tranObject.category,
          })
          .then((doc) => {
            tranObject.id = doc.id;
            commit('addTransaction', tranObject);
            return resolve();
          });
      });
    },
    async deleteTransaction({
      commit,
    }, payload) {
      const self = this;
      return new Promise((resolve) => {
        const id = payload.id;
        const db = payload.db;
        const currentUser = payload.user;
        const findRecord = self.state.transactions.transactions.find(item => item.id === id);
        if (findRecord) {
          return db
            .collection('users')
            .doc(currentUser.user.uid)
            .collection('transactions')
            .doc(id)
            .delete(id)
            .then(() => {
              commit('deleteTransaction', id);
              return resolve();
            });
        }
        return resolve();
      });
    },
  },
  getters: {
    transactions(state) {
      return state.transactions;
    },
    categorizedTransactions(state) {
      return state.categorizedTransactions;
    },
  },
};
