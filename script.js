document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('transaction-form');
    const descriptionInput = document.getElementById('description');
    const amountInput = document.getElementById('amount');
    const typeInput = document.getElementById('type');
    const transactionList = document.getElementById('transaction-list');
    const totalIncome = document.getElementById('total-income');
    const totalExpense = document.getElementById('total-expense');
    const netBalance = document.getElementById('net-balance');
    const resetButton = document.getElementById('reset-btn');
    const filterOptions = document.querySelectorAll('input[name="filter"]');

    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

    const updateSummary = () => {
        const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const expense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        totalIncome.textContent = `₹${income.toFixed(2)}`;
        totalExpense.textContent = `₹${expense.toFixed(2)}`;
        netBalance.textContent = `₹${(income - expense).toFixed(2)}`;
    };

    const displayTransactions = (filter = 'all') => {
        transactionList.innerHTML = '';
        const filteredTransactions = filter === 'all' ? transactions : transactions.filter(t => t.type === filter);
        filteredTransactions.forEach((transaction, index) => {
            const li = document.createElement('li');
            li.classList.add('transaction');
            li.innerHTML = `
                <span class="description">${transaction.description}</span>
                <span class="amount">${transaction.type === 'income' ? '+' : '-'}₹${transaction.amount.toFixed(2)}</span>
                <button class="edit" onclick="editTransaction(${index})">Edit</button>
                <button class="delete" onclick="deleteTransaction(${index})">Delete</button>
            `;
            transactionList.appendChild(li);
        });
        updateSummary();
    };

    const addTransaction = (e) => {
        e.preventDefault();
        const description = descriptionInput.value.trim();
        const amount = parseFloat(amountInput.value);
        const type = typeInput.value;

        if (description && !isNaN(amount) && amount > 0) {
            transactions.push({ description, amount, type });
            localStorage.setItem('transactions', JSON.stringify(transactions));
            form.reset();
            displayTransactions();
        }
    };

    window.editTransaction = (index) => {
        const transaction = transactions[index];
        descriptionInput.value = transaction.description;
        amountInput.value = transaction.amount;
        typeInput.value = transaction.type;
        transactions.splice(index, 1);
        localStorage.setItem('transactions', JSON.stringify(transactions));
        displayTransactions();
    };

    window.deleteTransaction = (index) => {
        transactions.splice(index, 1);
        localStorage.setItem('transactions', JSON.stringify(transactions));
        displayTransactions();
    };

    resetButton.addEventListener('click', () => {
        form.reset();
    });

    filterOptions.forEach(option => {
        option.addEventListener('change', (e) => {
            displayTransactions(e.target.value);
        });
    });

    form.addEventListener('submit', addTransaction);
    displayTransactions();
});