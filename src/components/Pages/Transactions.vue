<template>
  <v-container v-if="loading" fluid>
    <font-awesome-icon spin icon="spinner" size="5x"></font-awesome-icon>
  </v-container>
  <v-container v-else fluid>
    <v-card>
      <v-dialog v-model="dialog" max-width="500px">
        <v-btn slot="activator" color="primary" dark class="mb-2">Add New Transaction</v-btn>
        <v-card>
          <v-card-title>
            <span class="headline">New Transaction</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6 md4>
                  <v-text-field
                    v-model="editedItem.amount"
                    label="Amount"
                    value=""
                    prefix="$"
                    type="number"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-select
                    v-model="editedItem.status"
                    :items="statuses"
                    label="Status"
                  ></v-select>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.memo" label="Memo"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-select
                    v-model="editedItem.transaction_type"
                    :items="tranTypes"
                    label="Type"
                  ></v-select>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-menu
                    :close-on-content-click="false"
                    v-model="dateMenu"
                    :nudge-right="40"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                  >
                    <v-text-field
                      slot="activator"
                      v-model="computedDateFormatted"
                      label="Date"
                      hint="MM-DD-YYYY"
                      persistent-hint
                      prepend-icon="event"
                      readonly
                    ></v-text-field>
                    <v-date-picker v-model="date" no-title @input="dateMenu = false"></v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-select
                    v-model="editedItem.account_type"
                    :items="acctTypes"
                    label="Account Type"
                  ></v-select>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-select
                    v-model="category"
                    :items="categories"
                    item-text="text"
                    item-value="value"
                    label="Category"
                    return-object
                    single-line
                  ></v-select>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
            <v-btn color="blue darken-1" flat @click.native="saveItem">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-text-field
        v-model="search"
        append-icon="search"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
      <v-data-table
        :headers="fields"
        :items="transactions"
        :search="search"
      >
        <template slot="items" slot-scope="props">
          <td>{{ props.item.amount }}</td>
          <td class="text-xs-center">{{ normalizeDate(props.item.transaction_date) }}</td>
          <td class="text-xs-center">{{ normalizeDate(props.item.created) }}</td>
          <td class="text-xs-center">{{ props.item.account_type }}</td>
          <td class="text-xs-center">{{ props.item.transaction_type }}</td>
          <td class="text-xs-center">{{ props.item.memo }}</td>
          <td class="text-xs-center">{{ props.item.status }}</td>
          <td class="text-xs-center">{{ props.item.category }}</td>
          <td class="justify-center layout px-0">
            <v-btn icon class="mx-0" @click="editItem(props.item)">
              <v-icon color="teal">edit</v-icon>
            </v-btn>
            <v-btn icon class="mx-0" @click="deleteItem(props.item)">
              <v-icon color="pink">delete</v-icon>
            </v-btn>
          </td>
        </template>
        <v-alert slot="no-results" :value="true" color="error" icon="warning">
          Your search for '{{ search }}' found no results.
        </v-alert>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'
import categories from '../../utils/categories';
import { accountTypes } from '../../utils/accounts/constants';
import { transactionTypes, statuses, gridFields } from '../../utils/transactions/constants';

export default {
  name: 'Transactions',
  data() {
    return {
      search: '',
      category: '',
      categories: categories,
      dateMenu: false,
      date: null,
      dialog: false,
      editedIndex: -1,
      statuses: statuses,
      acctTypes: accountTypes,
      tranTypes: transactionTypes,
      loading: true,
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
        category: '',
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
        category: '',
      },
      fields: gridFields,
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
    this.totalRows = this.transactions.length;
    this.search = '';
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
      const shouldDelete = confirm('Are you sure you want to delete this transaction?');
      if (shouldDelete) {
        this.deleteTransaction({ id: item.id, db: this.db, user: this.user })
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
          seconds: this.computedDateFormatted ? Date.parse(this.computedDateFormatted) / 1000 : null,
        },
        id: this.editedItem.id ? this.editedItem.id : 0,
        category: this.category.value,
        created: {
          seconds: this.editedItem.created.seconds ? this.editedItem.created.seconds : Date.now() / 1000,
        },
        transaction_type: this.editedItem.transaction_type,
      };
      this.saveTransaction({ tranObject, db: this.db, user: this.user })
        .then(() => this.close());
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
      }
      const [year, month, day] = date.split('-');
      return `${month}/${day}/${year}`;
    },
  },
};
</script>
