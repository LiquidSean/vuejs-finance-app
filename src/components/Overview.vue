<template>
  <div>
    <Accounts></Accounts>
  </div>

</template>

<script>
import Accounts from './Pages/Accounts';
import { store } from '../store';

export default {
  name: 'Overview',
  components: { Accounts },
  computed: {
    user() {
      return this.$store.getters.user;
    },
    db() {
      return this.$store.getters.db;
    },
  },
  updated() {
    this.$router.replace(this.$route.path);
  },
  created () {
    //this.$store.dispatch('accounts/setAccountsListener', { user: this.user, db: this.db });
    //this.$store.dispatch('setBudgetsListener', { user: this.user, db: this.db });
    //this.$store.dispatch('setTransactionsListener', { user: this.user, db: this.db });
  }

};
</script>
