const express = require('express');
const ledger = require('../data/complicated_ledger.json');
const { sanitizeLedger } = require('./ledger');

const app = express()
app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.static('public'))

const port = 3000

app.get('/', (req, res) => {
	const transactions = sanitizeLedger(ledger);
	const balance = transactions[0].balance;
	const startDate = transactions[transactions.length - 1].date;
	const endDate = transactions[0].date;
	res.render('index', { transactions: transactions, balance: balance, startDate: startDate, endDate: endDate });
  //res.status(200).json(sanitizeLedger(ledger));
})

app.listen(port, () => {
  console.log(`EquityList app listening on port ${port}`)
})