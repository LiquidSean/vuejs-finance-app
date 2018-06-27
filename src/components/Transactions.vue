<template>
  <div>
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
                    v-model='editedItem.transaction_date_formatted'
                    label='Date'
                    hint='MM-DD-YYYY'
                    persistent-hint
                    prepend-icon='event'
                    readonly
                  ></v-text-field>
                  <v-date-picker v-model='editedItem.transaction_date_formatted' no-title @input='dateMenu = false'></v-date-picker>
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
  </div>
</template>

<script>
import { store } from '../store';

export default {
  name: 'Transactions',
  data() {
    return {
      search: '',
      dateMenu: false,
      date: '',
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
        created: '',
        account_type: '',
        transaction_type: '',
        transaction_date: '',
        transaction_date_formatted: '',
      },
      defaultItem: {
        id: '',
        amount: 0,
        memo: '',
        status: '',
        created: '',
        account_type: '',
        transaction_type: '',
        transaction_date: '',
        transaction_date_formatted: '',
      },
      transactions: [],
      fields: [
        {
          value: 'amount',
          sortable: true,
          text: 'Amount',
        },
        {
          value: 'created',
          sortable: true,
          text: 'Created Data',
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
  watch: {
    dialog(val) {
      (val || this.close());
    },
  },
  mounted() {
    const state = store;
    const normailized = state.transactionsAvailable.map(tran => ({
      id: tran.id,
      amount: tran.amount,
      created: tran.created,
      transaction_type: tran.transaction_type,
      memo: tran.memo,
      status: tran.status,
      account_type: tran.account_type,
      transaction_date: tran.transaction_date,
      transaction_date_formatted: this.normalizeDate(tran.transaction_date),
    }));
    this.totalRows = normailized.length;
    this.transactions = normailized;
    this.search = '';
  },
  methods: {
    editItem(item) {
      this.editedItem = Object.assign({}, item);
      this.editedIndex = this.transactions.indexOf(item);
      this.dialog = true;
    },
    deleteItem(item) {
      const state = store;
      const index = this.transactions.indexOf(item);
      const shouldDelete = confirm('Are you sure you want to delete this item?');
      if (shouldDelete) {
        this.desserts.splice(index, 1);
        state.db
          .collection('transactions')
          .doc(item.id)
          .delete();
      }
    },
    saveItem() {
      const state = store;
      // Don't send ID as part of payload
      const tranObject = {
        amount: this.editedItem.amount,
        status: this.editedItem.status,
        memo: this.editedItem.memo,
        account_type: this.editedItem.account_type,
        transaction_date: this.editedItem.transaction_date,
        transaction_type: this.editedItem.transaction_type,
        created: this.editItem.created,
      };
      if (this.editedIndex > -1) {
        Object.assign(this.transactions[this.editedIndex], this.editedItem);
        state.db
          .collection('users')
          .doc(state.currentUser.uid)
          .collection('transactions')
          .doc(this.editedItem.id.toString())
          .update(tranObject)
          .then(() => {
            this.close();
          });
      } else {
        state.db
          .collection('users')
          .doc(state.currentUser.uid)
          .collection('transactions')
          .add(tranObject)
          .then((doc) => {
            this.editedItem.id = doc.id;
            this.transactions.push(this.editedItem);
          });
      }
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
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split('-');
      return `${month}/${day}/${year}`;
    },
  },
};
</script>
