<template>
  <div>
    <Balance :accounts="accounts"></Balance>
  </div>

</template>

<script>
import Balance from './Balance';
import { store } from '../store';

export default {
  name: 'Overview',
  data: function() { return { accounts: null } },
  components: { Balance },
  mounted () {
    const state = store;
    this.accounts = state.accountsAvailable;
  }
};
</script>
