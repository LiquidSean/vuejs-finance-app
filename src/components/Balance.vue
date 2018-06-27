<template>
  <v-container fluid>
    <v-card>
      <v-card-title primary-title>
              <div>
                <h3 class='headline mb-0'>Accounts</h3>
              </div>
      </v-card-title>
      <div v-for='account in accounts'>
        <v-container fluid grid-list-md>
          <v-layout>
            <v-flex>
              <v-card dark color='primary'>
                <v-card-text class='title text-lg-left'>{{accountType(account.type)}}</v-card-text>
                <v-card-text class='title text-lg-left'>${{account.balance}} Balance</v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </div>
    </v-card>
    <v-card>
      <h4 class='text-left'>Usage</h4>
      <pie-chart :chart-data='dataSet' :options='options'></pie-chart>
    </v-card>
  </v-container>
</template>

<script>
import PieChart from './Charts/PieChart';
import { store } from '../store';

export default {
  name: 'Balance',
  data() {
    return { dataSet: null, options: null, accounts: store.accountsAvailable };
  },
  components: { PieChart },
  mounted() {
    this.fillData();
  },
  methods: {
    accountType(type) {
      if (type) {
        return type.charAt(0).toUpperCase() + type.slice(1);
      }
      return type || 'UNKOWN';
    },
    fillData() {
      const state = store;
      if (state.accountsAvailable) {
        const data = state.accountsAvailable
          .sort(x => x.type)
          .reduce((dataSets, account) => {
            dataSets.push(account.balance);
            return dataSets;
          }, []);
        this.dataSet = {
          labels: ['Checking', 'Savings'],
          datasets: [
            {
              backgroundColor: ['#f87979', '#36a2eb'],
              data,
            },
          ],
        };
        this.options = {
          responsive: true,
          maintainAspectRatio: false,
          pieceLabel: {
            mode: 'percentage',
            precision: 1,
          },
        };
      }
    },
  },
};
</script>
