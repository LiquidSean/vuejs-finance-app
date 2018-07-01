const accountTypes = [
  'savings',
  'checking',
  'investment',
];

const gridFields = [
  {
    value: 'type',
    sortable: true,
    text: 'Account Type',
  }, {
    value: 'balance',
    sortable: true,
    text: 'Balance',
  }, {
    value: 'name',
    sortable: true,
    text: 'Account Name',
  }, {
    value: 'memo',
    sortable: true,
    text: 'Memo',
  }, {
    text: 'Actions',
  },
];

export default {
  accountTypes,
  gridFields,
};
