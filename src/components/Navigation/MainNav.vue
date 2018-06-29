<template>
  <div>
    <div>
      <v-toolbar color='cyan' dark tabs>
        <v-toolbar-title>Its My Money and I want it Now</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn v-on:click='logout'>
          Logout
        </v-btn>
      </v-toolbar>
     </div>
    <v-toolbar color='cyan' dark>
            <v-tabs
        color='cyan'
        grow
      >
        <v-tabs-slider color='yellow'></v-tabs-slider>

        <v-tab to='/overview'>
          Overview
        </v-tab>
        <v-tab to='/budget'>
            Budget
        </v-tab>
        <v-tab to='/transactions'>
            Transactions
        </v-tab>
      </v-tabs>

      <!-- <router-link
       to='/Overview' replace
       >Overview</router-link>
       <router-link
       to='/budget'
       >Budget</router-link>
       <router-link
       to='/transactions'
       >Transactions</router-link> -->
    </v-toolbar>
  </div>
</template>

<script>
import firebase from 'firebase';

export default {
  name: 'MainNav',
  props: ['selected'],
  data() {
    return {
      path: null,
    };
  },
  mounted() {
      this.path = this.selected;
  },
  methods: {
    logout() {
      delete localStorage.user
      this.$store.dispatch('logout')
      this.$router.push('/');
    },
  },
};
</script>
