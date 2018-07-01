<template>
  <v-container v-if="loading" fluid>
    <font-awesome-icon spin icon="spinner" size="5x"></font-awesome-icon>
  </v-container>
  <v-container v-else fluid>
    <v-card>
      <v-dialog v-model="dialog" max-width="500px">
        <v-btn slot="activator" color="primary" dark class="mb-2 align-left">+ Create a Budget</v-btn>
        <v-card>
          <v-card-title>
            <span class="headline">New Budget</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6 md4>
                  <v-text-field
                    v-model="editedItem.name"
                    label="Name"
                    value=""
                  ></v-text-field>
                </v-flex>
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
                  <v-text-field
                    v-model="editedItem.frequency"
                    label="Frequency"
                    value=""
                  ></v-text-field>
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
      <v-container grid-list-xl>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card hover raised>
              <v-card-title>
                <span class="headline">Income</span>
              </v-card-title>
              <v-card-text>
                <v-layout row>
                  <v-flex xs10>
                    <v-progress-linear
                      color="success"
                      height="20"
                      value="75"
                    ></v-progress-linear>
                  </v-flex>
                  <v-flex xs1>
                    <v-btn flat icon color="green" @click="editItem">
                      <v-icon>edit</v-icon>
                    </v-btn>
                  </v-flex>
                  <v-flex xs1>
                    <v-btn flat icon color="red">
                      <v-icon>delete</v-icon>
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex xs12>
            <v-card hover raised>
              <v-card-title>
                <span class="headline">Spending</span>
              </v-card-title>
              <div v-for="budget in budgetsWithTransactionsAmount" :key="budget.id">
                <v-card-text>
                  <span class="headline">{{ budget.name }}</span>
                  <v-layout>
                    <v-flex xs10>
                      <v-progress-linear
                        :value="budget.balance"
                        color="success"
                        height="20"
                      ></v-progress-linear>
                    </v-flex>
                    <v-flex xs1>
                      <v-btn flat icon color="green" @click="editItem(budget)">
                        <v-icon>edit</v-icon>
                      </v-btn>
                    </v-flex>
                    <v-flex xs1>
                      <v-btn flat icon color="red">
                        <v-icon>delete</v-icon>
                      </v-btn>
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </div>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
import Vue from 'vue';
import { mapActions } from 'vuex';
import categories from '../../utils/categories';

export default {
  name: 'Budget',
  data() {
    return {
      loading: true,
      editedItem: {
        amount: 0,
        category: '',
        frequency: '',
        name: '',
      },
      defaultItem: {
        amount: 0,
        category: '',
        frequency: '',
        name: '',
      },
      categories: categories,
      category: {
        value: '',
        text: '',
      },
      editItemIndex: -1,
      dialog: false,
      budgetsWithTransactionsAmount: [],
    };
  },
  computed: {
    budgets() {
      return this.$store.getters.budgets;
    },
    categorizedTransactions() {
      return this.$store.getters.categorizedTransactions;
    },
    user() {
      return this.$store.getters.user;
    },
    db() {
      return this.$store.getters.db;
    },
  },
  created() {
    const promise1 = this.$store.dispatch('getBudgets', {
      user: this.user,
      db: this.db,
    });
    const promise2 = this.$store.dispatch('getTransactions', {
      user: this.user,
      db: this.db,
    });
    Promise.all([promise1, promise2]).then(() => (this.loading = false));
  },
  mounted() {
    this.$store
      .dispatch('getCategorizedTransactions', { user: this.user, db: this.db })
      .then(() => {
        this.mergeData();
      });
  },
  methods: {
    mergeData() {
      const self = this;
      self.budgets.map((budget) => {
        if (!self.categorizedTransactions) {
          return [];
        }
        const categorizedTransaction = self.categorizedTransactions[budget.category];
        budget.balance = (categorizedTransaction / budget.amount) * 100;
        const foundBudgetIndex = this.budgetsWithTransactionsAmount.findIndex(item => item.id === budget.id);
        if (foundBudgetIndex === -1) {
          return this.budgetsWithTransactionsAmount.push(budget);
        }
        return Vue.set(this.budgetsWithTransactionsAmount, foundBudgetIndex, budget);
      });
    },
    ...mapActions({
      saveBudget: 'saveBudget',
      deleteBudget: 'deleteBudget',
    }),
    saveItem() {
      const budgetObject = {
        amount: this.editedItem.amount,
        category: this.category.value,
        name: this.editedItem.name,
        frequency: this.editedItem.frequency,
        id: this.editedItem.id ? this.editedItem.id : 0,
      };
      this.saveBudget({ budgetObject, db: this.db, user: this.user }).then(
        () => {
          this.close();
          this.mergeData();
        });
    },
    deleteItem(item) {
      const shouldDelete = confirm('Are you sure you want to delete this budget?');
      if (shouldDelete) {
        this.deleteBudget({ id: item.id, db: this.db, user: this.user }).then(
          () => this.close());
      }
    },
    close() {
      this.editedItem = Object.assign({}, this.defaultItem);
      this.editItemIndex = -1;
      this.dialog = false;
    },
    editItem(item) {
      this.editedItem = Object.assign({}, item);
      this.category = this.categories.find(categoryItem => item.category === categoryItem.value);
      this.editedIndex = this.budgets.indexOf(item);
      this.dialog = true;
    },
  },
};
</script>

