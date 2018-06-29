<template>
  <div v-if="user">
    <MainNav :selected='selected'></MainNav>
  </div>
</template>

<script>
import MainNav from './MainNav';

export default {
  name: 'Nav',
  components: { MainNav },
  props: ['selected'],
  computed: {
    user () {
      return this.$store.getters.user
    }
}
};
</script>
