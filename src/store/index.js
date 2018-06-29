import Vue from 'vue';
import Vuex from 'vuex';
import transactions from './modules/transactions';
import accounts from './modules/accounts';
import budgets from './modules/budgets';
import shared from './modules/shared';
import user from './modules/user';

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    accounts,
    budgets,
    transactions,
    user,
    shared,
  },
});
