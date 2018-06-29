<template>
  <v-container fluid grid-list-xl>
    <v-card>
      <v-card-title primary-title>
              <div>
                <h3 class='headline mb-0'>Accounts</h3>
              </div>
      </v-card-title>
      <v-layout d-block>
        <v-flex>
          <v-dialog v-model='dialog' max-width='500px'>
            <v-btn slot='activator' color='primary' dark class='mb-2 align-left'>Add New Account</v-btn>
              <v-card>
                <v-card-title>
                  <span class='headline'>{{buttonText}}</span>
                </v-card-title>
                <v-card-text>
                  <v-container grid-list-md>
                    <v-layout wrap>
                      <v-flex xs12 sm6 md4>
                        <v-text-field
                          label='Account Balance'
                          value=''
                          prefix='$'
                          type='number'
                          v-model='editedItem.balance'
                      ></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6 md4>
                        <v-select
                          v-model='editedItem.type'
                          :items='types'
                          label='Account Type'
                        ></v-select>
                      </v-flex>
                      <v-flex xs12 sm6 md4>
                        <v-text-field
                          label='Account Name'
                          value=''
                          v-model='editedItem.name'
                      ></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6 md4>
                        <v-text-field
                          label='Memo'
                          value=''
                          v-model='editedItem.memo'
                      ></v-text-field>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color='blue darken-1' flat @click.native='close'>Cancel</v-btn>
                  <v-btn color='blue darken-1' flat @click.native='saveItem'>Save</v-btn>
                </v-card-actions>
              </v-card>
          </v-dialog>
        </v-flex>
        <v-flex xs12>
          <v-data-table
            :headers='fields'
            :items='accounts'
          >
            <template slot='items' slot-scope='props'>
              <td class='text-xs-center'>{{ props.item.type }}</td>
              <td class='text-xs-center'>{{ props.item.balance.toLocaleString('en-US', {style: 'currency', currency: 'USD'}) }}</td>
              <td class='text-xs-center'>{{ props.item.name }}</td>
              <td class='text-xs-center'>{{ props.item.memo }}</td>
              <td class='justify-center layout px-0'>
                <v-btn icon class='mx-0' @click='editItem(props.item)'>
                  <v-icon color='teal'>edit</v-icon>
                </v-btn>
                <v-btn icon class='mx-0' @click='deleteItem(props.item)'>
                  <v-icon color='pink'>delete</v-icon>
                </v-btn>
              </td>
            </template>

          </v-data-table>
        </v-flex>
      </v-layout>
    </v-card>
    <v-card>
      <h4 class='text-left'>Balance</h4>
      <pie-chart :chart-data='dataSet' :options='options'></pie-chart>
    </v-card>
  </v-container>
</template>

<script>
import Vue from 'vue';
import PieChart from "../Charts/PieChart";
import { mapState, mapActions } from 'vuex'

export default {
  name: "Accounts",
  data() {
    return {
      editedItem: {
        type: '',
        balance: 0,
        memo: '',
        name: '',

      },
      editedIndex: -1,
      defaultItem: {
        type: '',
        balance: 0,
        memo: '',
        name: '',

      },
      dataSet: null,
      options: null,
      types: [
        'savings',
        'checking',
        'investment',
      ],
      fields: [
        {
          value: 'type',
          sortable: true,
          text: 'Account Type',
        },
        {
          value: 'balance',
          sortable: true,
          text: 'Balance',
        },
        {
          value: 'name',
          sortable: true,
          text: 'Account Name',
        },
        {
          value: 'memo',
          sortable: true,
          text: 'Memo',
        },
        {
          text: 'Actions',
        },
      ],
      dialog: false
    };
  },
  components: { PieChart },
  mounted() {
    this.$store.dispatch('accounts/getAccounts', { user: this.user, db: this.db })
    .then(() => {
      this.fillData();
    })
  },
  computed: {
    accounts() {
      return this.$store.getters['accounts/accounts'];
    },
    user() {
      return this.$store.getters.user;
    },
    db() {
      return this.$store.getters.db;
    },
    buttonText() {
      return this.editedIndex > -1 ? 'Edit Account' : 'New Account';
    },
  },
  methods: {
    ...mapActions({
      saveAccount: 'accounts/saveAccount',
      deleteAccount: 'accounts/deleteAccount',
    }),
    accountType(type) {
      if (type) {
        return type.charAt(0).toUpperCase() + type.slice(1);
      }
      return type || "UNKOWN";
    },
    saveItem() {
      //const state = store;
      const state = null;
      // Don't send ID as part of payload
      const acctObject = {
        balance: this.editedItem.balance,
        name: this.editedItem.name,
        memo: this.editedItem.memo,
        type: this.editedItem.type,
        id: this.editedItem.id ? this.editedItem.id : 0,
      };
      this.saveAccount({acctObject, db: this.db, user: this.user})
        .then(() => {
          this.close();
      });
    },
    deleteItem(item) {
      //const state = store;
      const state = null;
      const index = this.accounts.indexOf(item);
      const shouldDelete = confirm('Are you sure you want to delete this account?');
      if (shouldDelete) {
        this.deleteAccount({id: item.id, db: this.db, user: this.user})
          .then(() => {
            this.close();
        });
      }
    },
    editItem(item) {
      this.editedItem = Object.assign({}, item);
      this.editedIndex = this.accounts.indexOf(item);
      this.dialog = true;
    },
    close() {
      this.dialog = false;
      this.editedItem = Object.assign({}, this.defaultItem);
      this.editedIndex = -1;
    },
    fillData() {
      if (this.accounts !== null) {
        const data = this.accounts
          .sort(x => x.type)
          .reduce((dataSets, account) => {
            dataSets.push(account.balance);
            return dataSets;
          }, []);
        this.dataSet = {
          labels: ["Checking", "Savings"],
          datasets: [
            {
              backgroundColor: ["#f87979", "#36a2eb"],
              data
            }
          ]
        };
        this.options = {
          responsive: true,
          maintainAspectRatio: false,
          pieceLabel: {
            mode: "percentage",
            precision: 1
          }
        };
      }
    }
  }
};
</script>
