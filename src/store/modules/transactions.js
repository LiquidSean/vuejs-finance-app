import 'firebase/firestore';

export default {
  state: {
    transactions: [],
  },
  mutations: {
    setTransactions(state, payload) {
      state.transactions = payload;
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
  },
  getters: {
    transactions(state) {
      return state.transactions;
    },
  },
};
