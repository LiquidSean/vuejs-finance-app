<template>
  <div>
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
    </v-toolbar>
  </div>
</template>

<script>
export default {
  name: 'MainNav',
};
</script>
