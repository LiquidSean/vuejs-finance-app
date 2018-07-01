const statuses = [
  'pending',
  'processed',
  'canceled',
];
const transactionTypes = [
  'payment',
  'void',
  'refund',
  'authenticate',
];

const gridFields = [
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
    value: 'category',
    sortable: true,
    text: 'Category',
  },
  {
    value: 'actions',
    text: 'Actions',
    sortable: false,
  },
];

export default { statuses, transactionTypes, gridFields };
