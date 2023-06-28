

// can do on frontend?
const sortTransactions = (transactions) => {
	if (transactions.length <= 1) {
		return transactions;
	}

	if (transactions.length == 2) {
		const t1 = new Date(transactions[0].date);
		const t2 = new Date(transactions[1].date);

		const sortedArr = t2 > t1 ? [t2, t1] : [t1, t2];
		return sortedArr;
	}

	let transactionsBeforeT = [];
	let transactionsAfterT = [];

	const pivotTransaction = transactions[0];
	const pivotDate = new Date(pivotTransaction.date);
	transactions = transactions.slice(1, transactions.length);

	for (let i = 0; i < transactions.length; i++) {
		const transaction = transactions[i];
		const date = new Date(transaction.date);

		if (date <= pivotDate) {
			transactionsBeforeT.push(transaction);
		} else {
			transactionsAfterT.push(transaction);
		}
	}

	const sortedTransaction1 = sortTransactions(transactionsAfterT);
	sortedTransaction1.push(pivotTransaction);
	return sortedTransaction1.concat(sortTransactions(transactionsBeforeT));
};

const descriptor = (transaction) => {
	if (transaction.type === "DEPOSIT") {
		return `Credited ${transaction.amount} ${transaction.source.description ? "by " + transaction.source.description : ""}`;
	}

	if (transaction.type === "INVESTMENT") {
		return `Invested ${transaction.amount} into ${transaction.destination.description}`;
	}

	if (transaction.type === "TRANSFER") {
		if (transaction.amount < 0) {
			return `Transfered ${transaction.amount} to ${transaction.destination.description}`;
		}
		return `Credited ${transaction.amount} by ${transaction.source.description}`;
	}

	if (transaction.type === "REFUND") {
		return `Got a refund of ${transaction.amount} from ${transaction.source.description}`;
	}

	if (transaction.type === "WITHDRAWAL") {
		return `Withdrawn amount: ${transaction.amount}`;
	}
};


const sanitizeLedger = (ledger) => {
	const uniqueTransactions = {};
	let uniqueTransactionsArr = [];

	// remove duplicate transactions;
	for(let i  = 0; i < ledger.length; i++) {
		let transaction = ledger[i];

		if (uniqueTransactions[transaction.activity_id]) {
			continue;
		}
		uniqueTransactions[transaction.activity_id] = transaction;
		// add description
		transaction.description = descriptor(transaction);
		uniqueTransactionsArr.push(transaction);
	}

	// sort the transactions based on Date
	return sortTransactions(uniqueTransactionsArr);
};

module.exports = {
	sanitizeLedger
}