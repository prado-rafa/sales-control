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
  } else {
    sellToBeRegistered.sellerName = sellerName;
  }
}

const setCustomerName =  sellToBeRegistered  => {
  const customerName = prompt('Customer name: ');

  if(_.isEmpty(customerName)){
    console.log("Invalid name :'(")
    setCustomerName(sellToBeRegistered)
  } else {
    sellToBeRegistered.customerName = customerName;
  }
}

const setItemName =  sellToBeRegistered  => {
  const itemName = prompt('Item name: ');

  if(_.isEmpty(itemName)){
    console.log("Invalid name :'(")
    setItemName(sellToBeRegistered)
  } else{
    sellToBeRegistered.itemName = itemName;
  }
}

const setValue =  sellToBeRegistered  => {
  const value = _.toNumber(prompt('Value: '));

  if(!_.isNumber(value)){
    console.log("Invalid value :'(")
    setValue(sellToBeRegistered)
  } else{
    sellToBeRegistered.value = value;
  }
}

function registerSelling(sellToBeRegistered){
  sellings.push(sellToBeRegistered);

  fs.writeFileSync('./sellings.json', JSON.stringify(sellings));

  sellersAmounts.set(
    sellToBeRegistered.sellerName,
    sellersAmounts.get(sellToBeRegistered.sellerName) + sellToBeRegistered.value
  );

  fs.writeFileSync('./amounts.json', JSON.stringify([...sellersAmounts]));
}

function printList(){
  const sortedSellings =  _.sortBy(sellings, ({sellerName}) => -1 * sellersAmounts.get(sellerName));
  const transformed = sortedSellings.reduce((list, {id, ...x}) => { list[id] = x; return list}, {})

  console.log("List sorted by sellers total amount.")
  console.table(sortedSellings);
}

function startRegister() {
  const sellToBeRegistered = {
    id: sellings.length,
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
  printList();
}

console.log("Hi :) Reading files...");
readFiles();
console.log("Complete! Let's register a sell. o/");
let another = true;
do {
  startRegister();
  const answer = prompt("Register other? Write 'no' if not.");
  another = answer !== 'no';

} while(another);

console.log("Bye!");
