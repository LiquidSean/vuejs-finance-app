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

          <v-btn :disabled="loading" :loading="loading" v-on:click='signIn'>
            Connect
            <v-icon right>lock_open</v-icon>
            <span slot="loader" class="custom-loader">
              <v-icon light>cached</v-icon>
            </span>
            </v-btn>
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
  computed: {
    loading () {
        return this.$store.getters.loading
      },
      user () {
        return this.$store.getters.user
      },
  },
  created () {
    this.checkCurrentLogin()
  },
  updated () {
    this.checkCurrentLogin()
  },
  methods: {
    signIn() {
      const email = this.email;
      const pwd = this.password;
      firebase.auth().signInWithEmailAndPassword(email, pwd).then((user) => {
        localStorage.user = JSON.stringify(user)
        this.$store.dispatch('signUserIn', {email: this.email, password: this.password})
        this.$router.replace(this.$route.query.redirect || 'overview');
      }, (err) => {
        alert("Meee Seeks don't like " + err.message);
      }).catch(err => console.log(err));
    },
    checkCurrentLogin () {
      if (this.user) {
        this.$store.dispatch('autoSignIn', this.user)
        this.$router.replace(this.$route.query.redirect || 'overview');
      }
    },
  },
}
</script>

<style scoped>  /* 'scoped' attribute limit the CSS to this component only */
  .login {
    margin-top: 40px;
  }
</style>
