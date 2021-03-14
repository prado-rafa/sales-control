const readline = require("readline");
const fs = require('fs')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let sellersAmounts = new Map();

fs.readFile('./amounts.json', 'utf8', (err, jsonString) => {
    if (err) {
        console.log("Failed to read sellers amounts T.T\n", err)
        return
    }
    
    sellersAmounts = new Map(JSON.parse(jsonString));
})

/*let sellings = [];

fs.readFile('./sellings.json', 'utf8', (err, jsonString) => {
    if (err) {
        console.log("Failed to read sellings data T.T\n", err)
        return
    }
    
    sellersAmounts = JSON.parse(jsonString);
})*/

const setSellerName = sellToBeRegistered {
  return new Promise((resolve, reject) => rl.question('Seller name: ', sellerName => { 
    if(sellersAmounts.has(sellerName)){
      sellToBeRegistered.sellerName = sellerName;
      resolve();
    } else {
      reject();
    }
  }));
}

const setCustomerName = sellToBeRegistered {
  return new Promise((resolve) => rl.question('Customer name: ', customerName => { 
    sellToBeRegistered.customerName = customerName;
    resolve();
  }));
}

const function setItemName(sellToBeRegistered) {
  return new Promise((resolve) => rl.question('Sale Item: ', itemName => { 
    sellToBeRegistered.itemName = itemName; 
    resolve();
  }));
}

async function setValue(sellToBeRegistered) {
  return new Promise((resolve) => rl.question('Value: ', value => { 
    sellToBeRegistered.value = value;
    resolve();
  }));
}

function registerSelling(sellToBeRegistered){
  fs.writeFile('./sellings.json', JSON.stringify(sellToBeRegistered), (err) => {
        if (err) console.log('Error writing file:', err)
  });
}

//Customer Name, Date of Sale, Sale Item Name, Sale Value)

function startRegister(){
  const sellToBeRegistered = {
    sellerName: null,
    customerName: null,
    date: null,
    itemName: null,
    value: null
  }

  await setSellerName(sellToBeRegistered);
  await setCustomerName(sellToBeRegistered);
  await setItemName(sellToBeRegistered);
  await setValue(sellToBeRegistered);
}

startRegister();

