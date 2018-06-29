<template>
  <v-container fluid>
    <v-card>
    <v-dialog v-model='dialog' max-width='500px'>
            <v-btn slot='activator' color='primary' dark class='mb-2 align-left'>+ Create a Budget</v-btn>
              <v-card>
                <v-card-title>
                  <span class='headline'>New Budget</span>
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
                        <v-text-field
                          label='Frequency'
                          value=''
                          v-model='editedItem.frequency'
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
                  <v-btn color='blue darken-1' flat @click.native='close'>Cancel</v-btn>
                  <v-btn color='blue darken-1' flat @click.native='saveItem'>Save</v-btn>
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
                        <v-btn @click='editItem' flat icon color="green">
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
                  <div v-for='budget in budgets' :key='budget.id'>
                    <v-card-text>
                      <span class="headline">{{budget.category}}</span>
                      <v-layout>
                        <v-flex xs10>
                          <v-progress-linear
                            color="success"
                            height="20"
                            value="75"
                          ></v-progress-linear>
                        </v-flex>
                        <v-flex xs1>
                          <v-btn @click='editItem' flat icon color="green">
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
                </div>
              </v-flex>
            </v-layout>
          </v-container>
    </v-card>
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: "Budget",
  data() {
    return {
      editedItem: {
        amount: 0,
        category: '',
        frequency: '',
      },
      categories: [
        {value: 'auto', text: 'Auto & Transport'},
        {value: 'bills', text: 'Bills & Utilities'},
        {value: 'education', text: 'Education'},
        {value: 'entertainment', text: 'Entertainment'},
        {value: 'food', text: 'Food & Dining'},
        {value: 'gifts', text: 'Gifts & Donations'},
        {value: 'health', text: 'Health & Fitness'},
        {value: 'home', text: 'Home'},
        {value: 'investments', text: 'Investments'},
        {value: 'kids', text: 'Kids'},
        {value: 'misc', text: 'Misc Expenses'},
        {value: 'personal', text: 'Personal Care'},
        {value: 'pets', text: 'Pets'},
        {value: 'shopping', text: 'Shopping'},
        {value: 'taxes', text: 'Taxes'},
        {value: 'travel', text: 'Travel'},
        {value: 'uncategorized', text: 'Uncategorized'},
      ],
      category: {
        value: '', text: '',
      },
      editItemIndex: -1,
      dialog: false
    };
  },
  computed: {
    budgets() {
      return this.$store.getters.budgets;
    },
    user() {
    return this.$store.getters.user;
    },
    db() {
      return this.$store.getters.db;
    },
  },
  mounted() {
    this.$store.dispatch('getBudgets', { user: this.user, db: this.db });
  },
  methods: {
    ...mapActions({
      saveBudget: 'saveBudget',
      deleteBudget: 'deleteBudget',
    }),
    saveItem() {
      //const state = store;
      const state = null;
      // Don't send ID as part of payload
      const budgetObject = {
        amount: this.editedItem.amount,
        name: this.editedItem.name,
        category: this.editedItem.category,
        frequency: this.editedItem.frequency,
      };
      this.saveBudget(budgetObject, this.editedIndex)
        .then(() => {
          this.close();
      });

      // if (this.editedIndex > -1) {
      //   Vue.set(this.accounts, this.editedIndex, this.editedItem);
      //   state.db
      //     .collection('users')
      //     .doc(state.currentUser.uid)
      //     .collection('accounts')
      //     .doc(this.editedItem.id.toString())
      //     .update(acctObject)
      //     .then(() => {
      //       this.close();
      //     });
      // } else { // add new transaction
      //   state.db
      //     .collection('users')
      //     .doc(state.currentUser.uid)
      //     .collection('accounts')
      //     .add(acctObject)
      //     .then((doc) => {
      //       this.editedItem.id = doc.id;
      //       this.accounts.push(this.editedItem);
      //       this.close();
      //     });
      // }
    },
    deleteItem(item) {
      //const state = store;
      const state = null;
      const index = this.budgets.indexOf(item);
      const shouldDelete = confirm('Are you sure you want to delete this account?');
      if (shouldDelete) {
        this.deleteBudget(item, index)
        .then(() => {
          this.close();
      });
      //   this.accounts.splice(index, 1);
      //   state.db
      //     .collection('users')
      //     .doc(state.currentUser.uid)
      //     .collection('accounts')
      //     .doc(item.id)
      //     .delete();
      //
      }
    },
    close() {
      this.dialog = false;
    },
    editItem() {
      this.dialog = true;
    },
  }
};
</script>

