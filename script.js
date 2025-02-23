let price = 3.26;
let cid = [
  ['PENNY', 1.01],
  ['NICKEL', 2.05],
  ['DIME', 3.1],
  ['QUARTER', 4.25],
  ['ONE', 90],
  ['FIVE', 55],
  ['TEN', 20],
  ['TWENTY', 60],
  ['ONE HUNDRED', 100]
];

const displayChangeDue = document.getElementById('change-due');
const cash = document.getElementById('cash');
const purchaseBtn = document.getElementById('purchase-btn');
const priceScreen = document.getElementById('price-screen');
const cashDrawerDisplay = document.getElementById('cash-drawer-display');
const paymentMethod = document.getElementById('payment-method');
const printReceiptBtn = document.getElementById('print-receipt-btn');


const initializeUI = () => {
  priceScreen.innerHTML = `Total: $${price.toFixed(2)}`;
  updateUI([]);
};


const formatResults = (status, change) => {
  displayChangeDue.innerHTML = `<p>Status: ${status}</p>`;
  change.forEach(money => (displayChangeDue.innerHTML += `<p>${money[0]}: $${money[1].toFixed(2)}</p>`));
};


const adjustLayout = () => {
  const mainContainer = document.querySelector('.main-container');
  mainContainer.style.alignItems = 'flex-start';
};


const checkCashRegister = () => {
  if (Number(cash.value) < price) {
    alert('Customer does not have enough money to purchase the item');
    cash.value = '';
    return;
  }

  if (Number(cash.value) === price) {
    displayChangeDue.innerHTML = '<p>No change due - customer paid with exact cash</p>';
    cash.value = '';
    return;
  }

  let changeDue = Number(cash.value) - price;
  let reversedCid = [...cid].reverse();
  let denominations = [100, 20, 10, 5, 1, 0.25, 0.1, 0.05, 0.01];
  let result = { status: 'OPEN', change: [] };
  let totalCID = parseFloat(
    cid.map(total => total[1])
       .reduce((prev, curr) => prev + curr)
       .toFixed(2)
  );

  if (totalCID < changeDue) {
    return displayChangeDue.innerHTML = '<p>Status: INSUFFICIENT_FUNDS</p>';
  }

  if (totalCID === changeDue) {
    result.status = 'CLOSED';
  }

  for (let i = 0; i < reversedCid.length; i++) {
    if (changeDue >= denominations[i] && reversedCid[i][1] > 0) {
      let count = 0;
      let total = reversedCid[i][1];
      while (total > 0 && changeDue >= denominations[i]) {
        total -= denominations[i];
        changeDue = parseFloat((changeDue - denominations[i]).toFixed(2));
        count++;
      }
      if (count > 0) {
        result.change.push([reversedCid[i][0], count * denominations[i]]);
      }
    }
  }
  if (changeDue > 0) {
    return displayChangeDue.innerHTML = '<p>Status: INSUFFICIENT_FUNDS</p>';
  }

  formatResults(result.status, result.change);
  updateUI(result.change);
  adjustLayout();
  cash.value = '';
};


const printReceipt = () => {
  const receipt = `
    Item: ${paymentMethod.value}
    Payment Method: ${paymentMethod.value}
    Change Due: ${displayChangeDue.innerText}
  `;
  const newWindow = window.open('', 'Print Receipt', 'width=400,height=600');
  newWindow.document.write(`<pre>${receipt}</pre>`);
  newWindow.print();
  newWindow.close();
};


const updateUI = (change) => {
  cashDrawerDisplay.innerHTML = '<h2>Change in Cash Drawer</h2>';
  const currencyNameMap = {
    PENNY: 'Pennies',
    NICKEL: 'Nickels',
    DIME: 'Dimes',
    QUARTER: 'Quarters',
    ONE: 'Ones',
    FIVE: 'Fives',
    TEN: 'Tens',
    TWENTY: 'Twenties',
    'ONE HUNDRED': 'Hundreds'
  };


  cid.forEach(item => {
    const currencyName = currencyNameMap[item[0]];
    const currentValue = parseFloat(item[1]).toFixed(2);
    cashDrawerDisplay.innerHTML += `<p>${currencyName}: $${currentValue}</p>`;
  });
};


purchaseBtn.addEventListener('click', (event) => {
  event.preventDefault();
  checkCashRegister();
});


printReceiptBtn.addEventListener('click', (event) => {
  event.preventDefault();
  printReceipt();
});


document.addEventListener('DOMContentLoaded', () => {
  initializeUI();
});
