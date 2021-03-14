const _ = require('lodash');
const prompt = require('prompt-sync')({sigint: true});
const fs = require('fs')

let sellersAmounts = new Map();

let sellings = [];

const readFiles = () => {
  sellersAmounts = new Map(JSON.parse(fs.readFileSync('./amounts.json', 'utf8')));
  sellings = JSON.parse(fs.readFileSync('./sellings.json', 'utf8'))
}

const setSellerName =  sellToBeRegistered  => {
  const sellerName = prompt('Seller name: ');

  if(!sellersAmounts.has(sellerName)){
    console.log("Seller not registered :'(")
    setSellerName(sellToBeRegistered)
  }
}

const setCustomerName =  sellToBeRegistered  => {
  const customerName = prompt('Customer name: ');

  if(_.isEmpty(customerName)){
    console.log("Invalid name :'(")
    setCustomerName(sellToBeRegistered)
  } else{
    sellToBeRegistered.customerName = customerName;
  }
}

const setItemName =  sellToBeRegistered  => {
  const itemName = prompt('Item name: ');

  if(_.isEmpty(itemName)){
    console.log("Invalid name :'(")
    setCustomerName(sellToBeRegistered)
  } else{
    sellToBeRegistered.itemName = itemName;
  }
}

const setValue =  sellToBeRegistered  => {
  const value = prompt('Value: ');

  if(!_.isNumber(value)){
    console.log("Invalid value :'(")
    setCustomerName(sellToBeRegistered)
  } else{
    sellToBeRegistered.itemName = _.toNumber(itemName);
  }
}

function registerSelling(sellToBeRegistered){
  sellings.push(sellToBeRegistered);

  fs.writeFile('./sellings.json', JSON.stringify(sellToBeRegistered), (err) => {
        if (err) console.log('Error writing file:', err)
  });
}

//Customer Name, Date of Sale, Sale Item Name, Sale Value)

function startRegister() {
  const sellToBeRegistered = {
    sellerName: null,
    customerName: null,
    date: null,
    itemName: null,
    value: null
  }

  setSellerName(sellToBeRegistered)
  setCustomerName(sellToBeRegistered);
  setItemName(sellToBeRegistered);
  setValue(sellToBeRegistered);

  console.log("Thanks! Now registering...");
  registerSelling(sellToBeRegistered);
  console.log("Registered! :)");
}

console.log("Hi :) Reading files...");
readFiles();
console.log("Complete! Let's register a sell. o/");
startRegister();