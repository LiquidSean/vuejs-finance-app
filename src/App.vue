<template>
  <v-app>
    <v-content>
      <Nav
        v-if="user"
        :selected="path"
        :user="user"></Nav>
      <v-container fluid>
        <router-view/>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Nav from './components/Navigation/Nav';

export default {
  name: 'App',
  components: { Nav },
  computed: {
    user() {
      return this.$store.getters.user;
    },
    db() {
      return this.$store.getters.db;
    },
    path() {
      return this.$route.path;
    },
  },
  created() {
    this.checkCurrentLogin();
  },
  updated() {
    this.checkCurrentLogin();

  },
  methods: {
    checkCurrentLogin() {
      if (!this.user && this.$route.path !== '/') {
        this.$router.push('/?redirect=' + this.$route.path)
      }
    },
  },
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
