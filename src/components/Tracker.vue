<template>
  <div>
    <!-- <center> -->
    <h2 style="text-align: center">Expense Tracker</h2>
    <!-- </center> -->

    <div class="container">
      <h4>Your Balance</h4>
      <h1 id="balance"><span>&#8377;</span>{{ getBalance }}.00</h1>

      <div class="inc-exp-container">
        <div>
          <h4>Income</h4>
          <p id="money-plus" class="money plus">
            +<span>&#8377;</span>{{ getIncome }}.00
          </p>
        </div>
        <div>
          <h4>Expense</h4>
          <p id="money-minus" class="money minus">
            -<span>&#8377;</span>{{ getExpense }}.00
          </p>
        </div>
      </div>

      <h3>History</h3>
      <ul id="list" class="list">
        <li
          class="minus"
          v-for="(history, index) in transactionHistory"
          :key="index"
        >
          <div>
            <span> {{ history.transactionPurpose }}</span>
            -
            <span>{{ history.date }}</span>
            <span style="margin-left: 140px"
              >{{ history.sign }}&#8377;{{ history.amount }}</span
            >
          </div>
        </li>
      </ul>

      <h3>Add new transaction</h3>
      <label>Type of transaction</label>
      <select
        v-model="typeOfTransaction"
        @change="getTransactionType"
        style="width: 100%; padding: 10px 5px; border: 1px solid lightgrey"
      >
        <option value="Select">Select</option>
        <option value="Income">Income</option>
        <option value="Expense">Expense</option>
      </select>
      <span
        v-if="errorState && typeOfTransaction.length <= 0"
        :style="{ color: 'red' }"
        >please select the transaction type</span
      >
      <div id="form">
        <div class="form-control">
          <label for="text">Transaction purpose</label>
          <input
            type="text"
            v-model="transactionPurpose"
            id="text"
            placeholder="Eg. Bought vegetables "
          />
          <span
            v-if="errorState && transactionPurpose.length <= 0"
            :style="{ color: 'red' }"
            >please fill the transaction purpose</span
          >
        </div>
        <div class="form-control">
          <label for="amount">Amount</label>
          <input
            type="number"
            id="amount"
            v-model="amount"
            placeholder="Enter amount..."
          />
          <span v-if="errorState && amount <= 0" :style="{ color: 'red' }"
            >please fill the amount</span
          >
        </div>
        <button @click="addTransaction" class="btn">{{ btnText }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { addDataToLocal } from "../services/helper";
const transactionPurpose = ref<string>("");
const amount = ref<number>(0);
const typeOfTransaction = ref<string>("");
const btnText = ref<string>("Add income");
const displayHistory = ref<boolean>(false);
const incomeCount = ref<number>(0);
const expenseCount = ref<number>(0);
const balance = ref<number>(0);
const getIncome = ref<string>("0");
const getExpense = ref<string>("0");
const getBalance = ref<string>("0");
const errorState = ref<boolean>(false);
interface history {
  sign: "+" | "-";
  transactionPurpose: string;
  amount: number;
  date: string;
}
const transactionHistory = ref<history[]>([]);
onMounted(() => {
  let val = JSON.parse(localStorage.getItem("trans-history") as any);
  console.log(val);
  if (val != null) {
    transactionHistory.value = val;
  }
  let val1 = JSON.parse(
    localStorage.getItem("income-expense") as any
  ) as expenseIncome;
  if (val1) {
    incomeCount.value = +val1.income;
    expenseCount.value = +val1.expense;
    balance.value = +val1.balance;
    getExpense.value = getMoneyFormat(expenseCount.value);
    getBalance.value = getMoneyFormat(balance.value);
    getIncome.value = getMoneyFormat(incomeCount.value);
  }
});
const addTransaction = () => {
//     errorState.value = true;
//   if (
//     transactionPurpose.value.length <= 0 &&
//     amount.value <= 0 &&
//     typeOfTransaction.value.length <= 0
//   ) {
//     errorState.value = false;
//   } else {
//     errorState.value = true;
//   }
//   if (errorState.value) {
    debugger;
    displayHistory.value = true;
    if (typeOfTransaction.value == "Select" || typeOfTransaction.value == "") {
      alert("Please select type of transaction.");
    }

    if (typeOfTransaction.value == "Income") {
      incomeData();
      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleDateString("en-GB");
      addDataToLocal("trans-history", {
        sign: "+",
        transactionPurpose: transactionPurpose.value,
        amount: amount.value,
        date: formattedDate,
      });
      transactionHistory.value.push({
        sign: "+",
        transactionPurpose: transactionPurpose.value,
        amount: amount.value,
        date: formattedDate,
      });
    }
    if ((typeOfTransaction.value = "Expense")) {
      expenseData();
      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleDateString("en-GB");
      addDataToLocal("trans-history", {
        sign: "-",
        transactionPurpose: transactionPurpose.value,
        amount: amount.value,
        date: formattedDate,
      });
      transactionHistory.value.push({
        sign: "-",
        transactionPurpose: transactionPurpose.value,
        amount: amount.value,
        date: formattedDate,
      });
    }
    errorState.value=true;
    console.log(transactionHistory.value);
//   }
};

const getTransactionType = () => {
  if (typeOfTransaction.value == "Income") {
    btnText.value = "Add income";
  } else {
    btnText.value = "Add expense";
  }
};

interface expenseIncome {
  expense: string;
  income: string;
  balance: string;
}

const setIncomeAndExpense = (
  expense: number,
  income: number,
  balance: number
) => {
  console.log(expense, income, balance);
  let val = JSON.parse(
    localStorage.getItem("income-expense") as any
  ) as expenseIncome;
  if (val) {
    console.log(val);
    val.expense = expense.toString();
    val.income = income.toString();
    val.balance = balance.toString();
    localStorage.setItem("income-expense", JSON.stringify(val));
  } else {
    let val1: expenseIncome = {
      expense: expense.toString(),
      income: income.toString(),
      balance: balance.toString(),
    };
    localStorage.setItem("income-expense", JSON.stringify(val1));
  }
};
const incomeData = () => {
  incomeCount.value = incomeCount.value + amount.value;
  balance.value = incomeCount.value - expenseCount.value;
  getBalance.value = getMoneyFormat(balance.value);
  getIncome.value = getMoneyFormat(incomeCount.value);
  setIncomeAndExpense(expenseCount.value, incomeCount.value, balance.value);
};
const expenseData = () => {
  expenseCount.value = expenseCount.value + amount.value;
  balance.value = incomeCount.value - expenseCount.value;
  getBalance.value = getMoneyFormat(balance.value);
  getExpense.value = getMoneyFormat(expenseCount.value);
  setIncomeAndExpense(expenseCount.value, incomeCount.value, balance.value);
};
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
};
</script>
