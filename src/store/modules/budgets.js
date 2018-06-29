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
    addBudget(state, budget) {
      state.budgets.push(budget);
    },
    updateBudget(state, budget) {
      const index = state.budgets.findIndex(item => item.id === budget.id);
      Vue.set(state.budgets, index, budget);
    },
    removeBudget(state, id) {
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
        const id = payload.budgetObject.id;
        const budgetObject = payload.budgetObject;
        const db = payload.db;
        const currentUser = payload.user;
        const findRecord = self.state.budgets.budgets.find(item => item.id === id);

        if (findRecord) {
          return db
            .collection('users')
            .doc(currentUser.user.uid)
            .collection('budgets')
            .doc(id)
            .update({ amount: budgetObject.amount, name: budgetObject.name, frequency: budgetObject.frequency, category: budgetObject.category })
            .then(() => {
              commit('updateBudget', budgetObject);
              return resolve();
            });
        }
        return db
          .collection('users')
          .doc(currentUser.user.uid)
          .collection('transactions')
          .add({ amount: budgetObject.amount, name: budgetObject.name, frequency: budgetObject.frequency, category: budgetObject.category })
          .then((doc) => {
            budgetObject.id = doc.id;
            commit('addBudget', budgetObject);
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
        const findRecord = self.state.budgets.budgets.find(item => item.id === id);
        if (findRecord) {
          return db
            .collection('users')
            .doc(currentUser.user.uid)
            .collection('budgets')
            .doc(id)
            .delete(id)
            .then(() => {
              commit('deleteBudget', id);
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
