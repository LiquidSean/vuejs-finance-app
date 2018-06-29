import 'firebase/firestore';
import Vue from 'vue';

export default {
  state: {
    transactions: [],
  },
  mutations: {
    setTransactions(state, payload) {
      state.transactions = payload;
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
    setTransactionsListener({ commit,
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
    async getTransactions({ commit,
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
    async saveTransaction({ commit,
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
            .doc(currentUser.uid)
            .collection('transactions')
            .doc(this.editedItem.id.toString())
            .update(tranObject)
            .then(() => {
              commit('updateTransaction', tranObject);
              return resolve();
            });
        }
        return db
          .collection('users')
          .doc(currentUser.uid)
          .collection('transactions')
          .add(tranObject)
          .then((doc) => {
            tranObject.id = doc.id;
            commit('addTransaction', tranObject);
            return resolve();
          });
      });
    },
    async deleteTransaction({ commit,
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
            .doc(currentUser.uid)
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
  },
};
