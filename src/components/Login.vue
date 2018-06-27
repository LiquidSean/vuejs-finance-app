<template>
  <v-container class='login' fluid>
    <img src='../assets/crumb.png'>
    <h3>Sign In</h3>
      <v-container fluid grid-list-xl>
        <v-layout justify-center>
          <v-flex xs12 sm6 md3>

            <v-text-field
          v-model='email'
          label='Email'
          ></v-text-field>


            <v-text-field
            class='align-center'
            v-model='password'
            type='password'
            label='Password'
          ></v-text-field>

          <v-btn v-on:click='signIn'>Connect</v-btn>
          </v-flex>

        </v-layout>
      </v-container>
  </v-container>
</template>

<script>
import firebase from 'firebase';
import { store } from '../store';

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    signIn() {
      const email = this.email;
      const pwd = this.password;
      firebase.auth().signInWithEmailAndPassword(email, pwd).then((user) => {
        store.currentUser = user;
        this.$router.replace('overview');
      }, (err) => {
        alert("Meee Seeks don't like " + err.message);
      }).catch(err => console.log(err));
    },
  },
};
</script>

<style scoped>  /* 'scoped' attribute limit the CSS to this component only */
  .login {
    margin-top: 40px;
  }
</style>
