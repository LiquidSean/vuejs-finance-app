import 'firebase/firestore';

export default {
  state: {
    budgets: [],
  },
  mutations: {
    setBudgets(state, payload) {
      state.budgets = payload;
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
  },
  getters: {
    budgets(state) {
      return state.budgets;
    },
  },
};
