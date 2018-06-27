<template>

    <v-toolbar color='cyan' dark tabs>
      <v-toolbar-title>Its My Money and I want it Now</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn v-on:click='logout'>
        Logout
      </v-btn>
    </v-toolbar>

</template>

<script>
import firebase from 'firebase';

export default {
  name: 'AccountNav',
  methods: {
    logout() {
      const self = this;
      firebase.auth().signOut().then(() => {
        self.$router.replace('login');
      });
    },
  },
};
</script>
