<template>
  <div>
    <Accounts />
  </div>
</template>

<script>
import Accounts from './Pages/Accounts';

export default {
  name: 'Overview',
  components: { Accounts },
  data() {
    return {
      loading: true,
    };
  },
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
};
</script>
