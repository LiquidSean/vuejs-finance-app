<template>
  <v-app>
    <v-content>
      <Nav :user='user' v-if='user'></Nav>
      <v-container fluid>
      <router-view/>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Nav from './components/Nav';

export default {
  name: 'App',
  props: ['user'],
  components: { Nav },
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
