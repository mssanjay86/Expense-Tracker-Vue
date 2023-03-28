<template>
    <div>
        <!-- <center> -->
        <h2 style="text-align: center;">Expense Tracker</h2>
        <!-- </center> -->

        <div class="container">
            <h4>Your Balance</h4>
            <h1 id="balance"><span>&#8377;</span>{{ getBalance }}.00</h1>

            <div class="inc-exp-container">
                <div>
                    <h4>Income</h4>
                    <p id="money-plus" class="money plus">+<span>&#8377;</span>{{ getIncome }}.00</p>
                </div>
                <div>
                    <h4>Expense</h4>
                    <p id="money-minus" class="money minus">-<span>&#8377;</span>{{ getExpense }}.00</p>
                </div>
            </div>

            <h3>History</h3>
            <ul id="list" class="list">
                <li class="minus" v-for="history in transactionHistory" :key=history>
                    <div v-if="displayHistory">
                        <span> {{ history.transactionPurpose }}</span> <span style="margin-left:140px;">{{
                            history.sign
                        }}&#8377;{{ history.amount }}</span>
                    </div>

                </li>
            </ul>

            <h3>Add new transaction</h3>
            <label>Type of transaction</label>
            <select v-model="typeOfTransaction" @change="getTransactionType"
                style="width: 100%; padding: 10px 5px; border: 1px solid lightgrey;">
                <option value="Select">Select</option>
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
            </select>

            <div id="form">
                <div class="form-control">
                    <label for="text">Transaction purpose</label>
                    <input type="text" v-model="transactionPurpose" id="text" placeholder="Eg. Bought vegetables " />
                </div>
                <div class="form-control">
                    <label for="amount">Amount</label>
                    <input type="number" id="amount" v-model="amount" placeholder="Enter amount..." />
                </div>
                <button @click="addTransaction" class="btn">{{ btnText }}</button>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const transactionPurpose = ref<string>('')
const amount = ref<number>(0);
const typeOfTransaction = ref<string>('')
const btnText = ref<string>('Add income')
const displayHistory = ref<boolean>(false)
const transactionHistory = ref<any>(
    [

    ]
)
const addTransaction = () => {
    displayHistory.value = true;


    if (typeOfTransaction.value == "Select" || typeOfTransaction.value == "") {
        alert("Please select type of transaction.")
        return
    }

    if (typeOfTransaction.value == "Income") {
        incomeData()
        transactionHistory.value.push({
            sign: '+',
            transactionPurpose: transactionPurpose.value,
            amount: amount.value
        })
        return

    } if (typeOfTransaction.value = "Expense") {

        expenseData()
        transactionHistory.value.push({
            sign: '-',
            transactionPurpose: transactionPurpose.value,
            amount: amount.value
        })
        return
    }

    console.log(transactionHistory.value);
}

const incomeCount = ref<number>(0);
const expenseCount = ref<number>(0);
const balance = ref<number>(0)

const getTransactionType = () => {
    if (typeOfTransaction.value == "Income") {
        btnText.value = "Add income"
    } else {
        btnText.value = "Add expense"
    }
}

const getIncome = ref<string>('0');
const getExpense = ref<string>('0');
const getBalance = ref<string>('0')
const incomeData = () => {
    incomeCount.value = incomeCount.value + amount.value
    balance.value = incomeCount.value - expenseCount.value
    getBalance.value = getMoneyFormat(balance.value)
    getIncome.value = getMoneyFormat(incomeCount.value)
}
const expenseData = () => {
    expenseCount.value = expenseCount.value + amount.value;
    balance.value = incomeCount.value - expenseCount.value
    getBalance.value = getMoneyFormat(balance.value)
    getExpense.value = getMoneyFormat(expenseCount.value)
}
const getMoneyFormat = (value: number) => {

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


</script>