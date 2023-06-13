<template>
    <div>
        <h2 style="text-align: center;">Expense Tracker</h2>

        <div class="container">
            <div class="user-details">
                <h4>Your Balance</h4>
                <h2>&#8377;{{ balance }}.00</h2>



                <h1 id="balance"></h1>
            </div>

            <div class="inc-exp-container">
                <div>
                    <h4>Income</h4>
                    <p id="money-plus" class="money plus">+&#8377;{{ income }}.00</p>
                </div>
                <div>
                    <h4>Expense</h4>
                    <p id="money-minus" class="money minus">-&#8377;{{ expense }}.00</p>
                </div>
            </div>

            <h3>History</h3>
            <ul id="list" class="list" v-for="(history, index) in listOfTransactions" :key="index">
                <li v-if="history.typeOfTransaction == 'Income'"> {{ history.purposeToBePushed }}
                    <span>+{{ history.amountToBePushed }}</span>
                </li>
                <li v-else> {{ history.purposeToBePushed }} <span>-{{ history.amountToBePushed }}</span></li>
            </ul>

            <h3>Add new transaction</h3>
            <form id="form">
                <div class="form-control">
                    <label class="transaction-type">Select type of transaction</label>

                    <select id="dropDown" @change="getIncomeOrExpense($event)">
                        <option v-for="(transaction, index) in transactions" :key="index">{{ transaction.label }}</option>
                    </select>
                </div>
                <div class="form-control">
                    <label for="text">Transaction purpose</label>
                    <input @blur="validateTransactionPurpose" v-model="transactionPurpose" type="text" id="text"
                        placeholder="Eg : Bought biriyani or salary credited" />
                    <div class="error-msg">
                        <span id="transactionPurposeErrorMsg">{{ transactionPurposeErrorMsg }}</span>
                    </div>
                </div>
                <div class="form-control">
                    <label id="amount-label" for="amount">{{ setLabel }}</label>
                    <input @blur="validateTransactionAmount" v-model="transactionAmount" type="number" id="amount"
                        placeholder="Enter amount" />
                    <div class="error-msg">
                        <span id="transactionAmountErrorMsg">{{ transactionAmountErrorMsg }}</span>
                    </div>
                </div>
                <button type="button" @click="onSubmit" id="add-transaction" class="btn">
                    Add {{ setLabel }}
                </button>
                <button id="clear" class="btn background-clear-btn" @click="clearAll()">
                    Clear all transactions
                </button>
            </form>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';

const transactionPurpose = ref<string>("");
const transactionAmount = ref<number>(0);
const transactionPurposeErrorMsg = ref<string>();
const transactionAmountErrorMsg = ref<string>();
const setLabel = ref<string>("Income")
const initialAmt = {
    totalBalance: 0,
    income: 0,
    expense: 0
}

interface listOfTransactionsType {
    amountToBePushed: number | string
    purposeToBePushed: string,
    totalBalToBePushed: number | string
    typeOfTransaction: string
}
let listOfTransactions = ref<listOfTransactionsType[]>([]);

const transactions = [
    {
        label: "Income",
        isActive: false
    },
    {
        label: "Expense",
        isActive: false
    },
]

const validateTransactionPurpose = () => {
    if (transactionPurpose.value == "") {
        transactionPurposeErrorMsg.value = "This field is required."
        return true;
    } else {
        transactionPurposeErrorMsg.value = "";
        return false;
    }
}
const validateTransactionAmount = () => {
    if (transactionAmount.value == 0) {
        transactionAmountErrorMsg.value = "This field cannot be empty or 0."
        return true;
    } else {
        transactionAmountErrorMsg.value = "";
        return false;
    }
}

const onSubmit = () => {

    let errorCount = 0;
    let res;
    if (validateTransactionPurpose()) {
        errorCount = errorCount + 1;
    }
    if (validateTransactionAmount()) {
        errorCount = errorCount + 1;
    }
    if (errorCount > 0) {
        res = true;

    } else {
        res = false;
    }
    isAllFieldsValidated(res);

    if (setLabel.value == "Income" && transactionAmount.value > 0) {
        initialAmt.totalBalance = initialAmt.totalBalance + transactionAmount.value
        getInputs(transactionAmount.value, transactionPurpose.value, initialAmt.totalBalance)
    } if (setLabel.value == "Expense" && transactionAmount.value > 0) {
        initialAmt.totalBalance = initialAmt.totalBalance - transactionAmount.value
        getInputs(transactionAmount.value, transactionPurpose.value, initialAmt.totalBalance)

    }

}

const isAllFieldsValidated = (res: boolean) => {
    if (res) {
        alert("Please fill all the fields.")
    } else {
        alert("Your income/expense is successfully noted.")
    }

}

const getIncomeOrExpense = (e: any) => {

    setLabel.value = e.target.value
}

const getInputs = (amt: number, purpose: string, totalBal: number) => {

    let array: listOfTransactionsType = {
        purposeToBePushed: purpose,
        amountToBePushed: convertToINR(amt),
        totalBalToBePushed: convertToINR(totalBal),
        typeOfTransaction: setLabel.value
    };
    listOfTransactions.value.push(array)
    localStorage.setItem('transactions', JSON.stringify(listOfTransactions.value))
    console.log(listOfTransactions.value);



    if (setLabel.value === "Income") {
        initialAmt.income += transactionAmount.value;
    } else {
        initialAmt.expense += transactionAmount.value;
    }

    initialAmt.totalBalance = totalBal;

    transactionAmount.value = 0;
    transactionPurpose.value = "";
    takeTransactionsFromLocalStorage();

    let amountsToStoreInLS = {
        income: convertToINR(initialAmt.income),
        expense: convertToINR(initialAmt.expense),
        totalAmount: convertToINR(initialAmt.totalBalance)
    }

    localStorage.setItem("listOfAmounts", JSON.stringify(amountsToStoreInLS))

    displayAmount()
};

const income = ref(0)
const expense = ref(0)
const balance = ref(0);

const displayAmount = () => {

    let getAmounts = JSON.parse(localStorage.getItem("listOfAmounts") as any)
    if (getAmounts) {
        console.log(getAmounts);
        income.value = getAmounts.income
        expense.value = getAmounts.expense
        balance.value = getAmounts.totalAmount
    }
}

onMounted(() => {
    takeTransactionsFromLocalStorage();
    displayAmount()
})

const takeTransactionsFromLocalStorage = () => {
    let val = JSON.parse(localStorage.getItem("transactions") as any)
    if (val) {
        listOfTransactions.value = val
    }

    console.log(JSON.parse(localStorage.getItem("transactions") as any));

}
const convertToINR = (value: any) => {
    let money = "";

    let price = value > Math.floor(parseFloat(value.toString())) ? value : value;

    if (value > 9999999) {

        price = price / 10000000;

        money =

            price > 2 ? `${price + " " + "Crores"}` : `${price + " " + "Crore"}`;

    } else if (value > 99999) {

        price = price / 100000;

        money = price > 2 ? `${price + " " + "Lakhs"}` : `${price + " " + "Lakh"}`;

    } else {

        money = new Intl.NumberFormat().format(value);

    }


    return money;
}

const clearAll = () => {
    if (confirm("Do you want to clear all your transactions?")) {
        localStorage.clear();
    }

}

</script>
