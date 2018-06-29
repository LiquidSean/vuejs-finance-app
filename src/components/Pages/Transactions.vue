<template>
  <v-container fluid>
    <v-card>
      <v-dialog v-model='dialog' max-width='500px'>
      <v-btn slot='activator' color='primary' dark class='mb-2'>Add New Transaction</v-btn>
      <v-card>
        <v-card-title>
          <span class='headline'>New Transaction</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6 md4>
                <v-text-field
                  label='Amount'
                  value=''
                  prefix='$'
                  type='number'
                  v-model='editedItem.amount'
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-select
                  v-model='editedItem.status'
                  :items='statuses'
                  label='Status'
                ></v-select>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field v-model='editedItem.memo' label='Memo'></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-select
                  v-model='editedItem.transaction_type'
                  :items='tranTypes'
                  label='Type'
                ></v-select>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-menu
                  :close-on-content-click='false'
                  v-model='dateMenu'
                  :nudge-right='40'
                  lazy
                  transition='scale-transition'
                  offset-y
                  full-width
                >
                  <v-text-field
                    slot='activator'
                    v-model='computedDateFormatted'
                    label='Date'
                    hint='MM-DD-YYYY'
                    persistent-hint
                    prepend-icon='event'
                    readonly
                  ></v-text-field>
                  <v-date-picker v-model='date' no-title @input='dateMenu = false'></v-date-picker>
                </v-menu>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-select
                  v-model='editedItem.account_type'
                  :items='acctTypes'
                  label='Account Type'
                ></v-select>
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
    <v-text-field
        v-model='search'
        append-icon='search'
        label='Search'
        single-line
        hide-details
      ></v-text-field>
    <v-data-table
      :headers='fields'
      :items='transactions'
      :search='search'
    >
      <template slot='items' slot-scope='props'>
        <td>{{ props.item.amount }}</td>
        <td class='text-xs-center'>{{ normalizeDate(props.item.transaction_date) }}</td>
        <td class='text-xs-center'>{{ normalizeDate(props.item.created) }}</td>
        <td class='text-xs-center'>{{ props.item.account_type }}</td>
        <td class='text-xs-center'>{{ props.item.transaction_type }}</td>
        <td class='text-xs-center'>{{ props.item.memo }}</td>
        <td class='text-xs-center'>{{ props.item.status }}</td>
        <td class='justify-center layout px-0'>
          <v-btn icon class='mx-0' @click='editItem(props.item)'>
            <v-icon color='teal'>edit</v-icon>
          </v-btn>
          <v-btn icon class='mx-0' @click='deleteItem(props.item)'>
            <v-icon color='pink'>delete</v-icon>
          </v-btn>
        </td>
      </template>
      <v-alert slot='no-results' :value='true' color='error' icon='warning'>
        Your search for '{{ search }}' found no results.
      </v-alert>
    </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import Vue from 'vue';
import { store } from '../../store';
import { mapState, mapActions } from 'vuex'
import transactions from '../../store/modules/transactions';

export default {
  name: 'Transactions',
  data() {
    return {
      search: '',
      dateMenu: false,
      date: null,
      dialog: false,
      editedIndex: -1,
      statuses: ['pending', 'processed', 'canceled'],
      acctTypes: ['checking', 'savings'],
      tranTypes: ['payment', 'void', 'refund', 'authenticate'],
      editedItem: {
        id: '',
        amount: 0,
        memo: '',
        status: '',
        created: {
          seconds: 0,
        },
        account_type: '',
        transaction_type: '',
        transaction_date: {
          seconds: 0,
        },
      },
      defaultItem: {
        id: '',
        amount: 0,
        memo: '',
        status: '',
        created: {
          seconds: 0,
        },
        account_type: '',
        transaction_type: '',
        transaction_date: {
          seconds: 0,
        },
      },
      fields: [
        {
          value: 'amount',
          sortable: true,
          text: 'Amount',
        },
        {
          value: 'transaction_date',
          sortable: true,
          text: 'Transaction Date',
        },
        {
          value: 'created',
          sortable: true,
          text: 'Created Date',
        },
        {
          value: 'account_type',
          sortable: true,
          text: 'Account Type',
        },
        {
          value: 'transaction_type',
          sortable: true,
          text: 'Transaction Type',
        },
        {
          value: 'memo',
          sortable: true,
          text: 'Memo',
        },
        {
          value: 'status',
          sortable: true,
          text: 'Status',
        },
        {
          value: 'actions',
          text: 'Actions',
          sortable: false,
        },
      ],
    };
  },
  computed: {
    computedDateFormatted () {
      return this.formatDate(this.date)
    },
    transactions() {
      return this.$store.getters['transactions'];
    },
    user() {
    return this.$store.getters.user;
    },
    db() {
      return this.$store.getters.db;
    },
  },
  mounted() {
    this.$store.dispatch('getTransactions', { user: this.user, db: this.db })
      .then(() => {
      this.totalRows = transactions.length;
      this.search = '';
    });
  },
  methods: {
    ...mapActions({
      saveTransaction: 'saveTransaction',
      deleteTransaction: 'deleteTransaction',
    }),
    editItem(item) {
      this.editedItem = Object.assign({}, item);
      // Set date property for picker
      this.date = this.dateToISO(item.transaction_date);
      this.editedIndex = this.transactions.indexOf(item);
      this.dialog = true;
    },
    deleteItem(item) {
      // const state = store;
      // const index = this.transactions.indexOf(item);
      // const shouldDelete = confirm('Are you sure you want to delete this item?');
      // if (shouldDelete) {
      //   this.transactions.splice(index, 1);
      //   state.db
      //     .collection('users')
      //     .doc(state.currentUser.uid)
      //     .collection('transactions')
      //     .doc(item.id)
      //     .delete();
      // }
      const index = this.transactions.indexOf(item);
      const shouldDelete = confirm('Are you sure you want to delete this account?');
      if (shouldDelete) {
        this.deleteTransaction(item, index)
        .then(() => {
          this.close();
        });
      }
    },
    saveItem() {
      const tranObject = {
        amount: this.editedItem.amount,
        status: this.editedItem.status,
        memo: this.editedItem.memo,
        account_type: this.editedItem.account_type,
        transaction_date:  {
          seconds: this.computedDateFormatted ? Date.parse(this.computedDateFormatted) / 1000: null,
        },
      };
      this.saveTransaction(tranObject, this.editedIndex)
        .then(() => {
          this.close();
      });

      // const state = store;
      // // Don't send ID as part of payload
      // const tranObject = {
      //   amount: this.editedItem.amount,
      //   status: this.editedItem.status,
      //   memo: this.editedItem.memo,
      //   account_type: this.editedItem.account_type,
      //   transaction_date:  {
      //     seconds: this.computedDateFormatted ? Date.parse(this.computedDateFormatted) / 1000: null,
      //   },
      //   transaction_type: this.editedItem.transaction_type,
      //   created: this.editedItem.created,
      // };
      // this.editedItem.transaction_date = tranObject.transaction_date;

      // if (this.editedIndex > -1) {

      //   Vue.set(this.transactions, this.editedIndex, this.editedItem);
      //   state.db
      //     .collection('users')
      //     .doc(state.currentUser.uid)
      //     .collection('transactions')
      //     .doc(this.editedItem.id.toString())
      //     .update(tranObject)
      //     .then(() => {
      //       this.close();
      //     });
      // } else { // add new transaction
      //   tranObject.created = {
      //     seconds: Date.now() / 1000,
      //   };
      //   state.db
      //     .collection('users')
      //     .doc(state.currentUser.uid)
      //     .collection('transactions')
      //     .add(tranObject)
      //     .then((doc) => {
      //       this.editedItem.id = doc.id;
      //       this.transactions.push(this.editedItem);
      //       this.close();
      //     });
      // }
    },
    close() {
      this.dialog = false;
      this.editedIndex = -1;
      this.editedItem = Object.assign({}, this.defaultItem);
    },
    normalizeDate(date) {
      if (date && date.seconds) {
        return new Date(1000 * date.seconds).toLocaleDateString();
      }
      return null;
    },
    dateToISO(date) {
      if (date && date.seconds) {
        return new Date(1000 * date.seconds).toISOString();
      }
      return null;
    },
    formatDate(date) {
      if (!date) return null;

      if (date.includes('T')) { // ISO String
        const formattedDate = new Date(date);
        return `${formattedDate.getMonth() + 1}/${formattedDate.getDate()}/${formattedDate.getFullYear()}`;
      } else {
        const [year, month, day] = date.split('-');
        return `${month}/${day}/${year}`;
      }
      return date;

    },
  },
};
</script>
