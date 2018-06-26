import firebase from 'firebase/app';
import 'firebase/firestore';

// Initialize Firebase, copy this from the cloud console
// Or use mine :)
const config = {
  apiKey: 'AIzaSyCzSukjC23k1fTiLiQEDfVG5a_-WDyMMr0',
  authDomain: 'finance-app-9099c.firebaseapp.com',
  databaseURL: 'https://finance-app-9099c.firebaseio.com',
  projectId: 'finance-app-9099c',
  storageBucket: 'finance-app-9099c.appspot.com',
  messagingSenderId: '793643547458',
};

firebase.initializeApp(config);

const settings = {
  timestampsInSnapshots: true,
};
const db = firebase.firestore();
db.settings(settings);


// The shared state object that any vue component can get access to.
// Has some placeholders that we’ll use further on!
export const store = {
  db,
  currentUser: null,
  transactionsAvailable: null,
  budgetsAvailable: null,
  accountsAvailable: null,
  initCollections: null,
};

const users = store.db.collection('users');

store.seedCollections = async function seedCollections() {
  if (store.currentUser) {
    const transactions = await users.doc(store.currentUser.uid).collection('transactions').get();
    const budgets = await users.doc(store.currentUser.uid).collection('budgets').get();
    const accounts = await users.doc(store.currentUser.uid).collection('accounts').get();

    store.transactionsAvailable = [];
    store.accountsAvailable = [];
    store.budgetsAvailable = [];

    transactions.forEach((doc) => {
      const tran = doc.data();
      tran.id = doc.id;
      store.transactionsAvailable.push(tran);
    });

    accounts.forEach((doc) => {
      const acct = doc.data();
      acct.id = doc.id;
      store.accountsAvailable.push(acct);
    });

    budgets.forEach((doc) => {
      const budget = doc.data();
      budget.id = doc.id;
      store.budgetsAvailable.push(budget);
    });
  }
};

store.subscribeToCollections = function initCollections() {
  if (store.currentUser && store.currentUser.uid) {
    const transactions = users.doc(store.currentUser.uid).collection('transactions');
    const budgets = users.doc(store.currentUser.uid).collection('budgets');
    const accounts = users.doc(store.currentUser.uid).collection('accounts');

    transactions
      .onSnapshot((transRef) => {
        const trans = [];
        transRef.forEach((doc) => {
          const tran = doc.data();
          tran.id = doc.id;
          trans.push(tran);
        });
        store.transactionsAvailable = trans;
      });

    budgets
      .onSnapshot((budgetsRef) => {
        const budgetsList = [];
        budgetsRef.forEach((doc) => {
          const budget = doc.data();
          budget.id = doc.id;
          budgetsList.push(budget);
        });
        store.budgetsAvailable = budgetsList;
      });

    accounts
      .onSnapshot((acctsRef) => {
        const accts = [];
        acctsRef.forEach((doc) => {
          const account = doc.data();
          account.id = doc.id;
          accts.push(account);
        });
        store.accountsAvailable = accts;
      });
  }
};

if (store.currentUser) {
  users
    .onSnapshot((transRef) => {
      const trans = [];
      transRef.forEach((doc) => {
        const tran = doc.data();
        trans.push(tran);
      });
      store.usersAvailable = trans;
    });
}
