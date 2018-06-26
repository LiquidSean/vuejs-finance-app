<template>
  <div v-if="user">
    <AccountNav></AccountNav>
    <MainNav></MainNav>
  </div>
</template>

<script>
import AccountNav from './AccountNav';
import MainNav from './MainNav';
import firebase from 'firebase';

export default {
  name: 'Nav',
  props: ['user'],
  components: { AccountNav, MainNav },
};
</script>
