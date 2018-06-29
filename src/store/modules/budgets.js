import 'firebase/firestore';
import Vue from 'vue';

export default {
  state: {
    budgets: [],
  },
  mutations: {
    setBudgets(state, payload) {
      state.budgets = payload;
    },
    addBudgets(state, budget) {
      state.budgets.push(budget);
    },
    updateAccount(state, budget) {
      const index = state.budgets.findIndex(item => item.id === budget.id);
      Vue.set(state.budgets, index, budget);
    },
    removeAccount(state, id) {
      const index = state.budget.findIndex(item => item.id === id);
      state.budget.budget.splice(index, 1);
    },
  },
  actions: {
    setBudgetsListener({ commit,
    }, payload) {
      const budgets = payload.db.collection('users').doc(payload.user.user.uid).collection('budgets');
      budgets
        .onSnapshot((budgetsRef) => {
          const budgetArray = [];
          budgetsRef.forEach((doc) => {
            const budget = doc.data();
            budget.id = doc.id;
            budgetArray.push(budget);
          });
          commit('setBudgets', budgetArray);
        }, () => {});
    },
    async getBudgets({ commit,
    }, payload) {
      payload.db.collection('users').doc(payload.user.user.uid).collection('budgets').get()
        .then((budgets) => {
          const budgetsAvailable = [];

          budgets.forEach((doc) => {
            const tran = doc.data();
            tran.id = doc.id;
            budgetsAvailable.push(tran);
          });
          commit('setBudgets', budgetsAvailable);
        });
    },
    async saveBudget({ commit,
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
    async deleteBudget({ commit,
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
    budgets(state) {
      return state.budgets;
    },
  },
};
