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
                          label='Name'
                          value=''
                          v-model='editedItem.name'
                        ></v-text-field>
                      </v-flex>
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
                      <span class="headline">{{budget.name}}</span>
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
import categories from '../../utils/categories';

export default {
  name: "Budget",
  data() {
    return {
      editedItem: {
        amount: 0,
        category: '',
        frequency: '',
        name: '',
      },
      categories: categories,
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
        category: this.category.value,
        name: this.editedItem.name,
        frequency: this.editedItem.frequency,
        id: this.editedItem.id ? this.editedItem.id : 0,
      };
      this.saveBudget({budgetObject, db: this.db, user: this.user})
        .then(() => {
          this.close();
      });
    },
    deleteItem(item) {
      //const state = store;
      const state = null;
      const shouldDelete = confirm('Are you sure you want to delete this budget?');
      if (shouldDelete) {
        this.deleteBudget({id: item.id, db: this.db, user: this.user})
          .then(() => {
            this.close();
        });
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

