const _ = require("lodash");
const prompt = require("prompt-sync")({ sigint: true });
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const EXAMPLE_VENDORS = ["AJ", "Ea", "Io", "On", "Ur"];

let sellersAmounts = new Map();

let sellings = [];

const readFiles = () => {
  try {
    sellings = JSON.parse(fs.readFileSync("./sellings.json", "utf8"));
    sellersAmounts = new Map(
      JSON.parse(fs.readFileSync("./amounts.json", "utf8"))
    );
  } catch {
    console.log("Oops, creating new files X-X");
    sellings = [];
    sellersAmounts = new Map(_.map(EXAMPLE_VENDORS, vendor => [vendor, 0]));
    fs.writeFileSync("./amounts.json", JSON.stringify([...sellersAmounts]));
    fs.writeFileSync("./sellings.json", JSON.stringify(sellings));
  }
};

const setSellerName = sellToBeRegistered => {
  const sellerName = prompt("Seller name: ");

  if (!sellersAmounts.has(sellerName)) {
    console.log("Seller not registered :'(");
    setSellerName(sellToBeRegistered);
  } else {
    sellToBeRegistered.sellerName = sellerName;
  }
};

const setCustomerName = sellToBeRegistered => {
  const customerName = prompt("Customer name: ");

  if (_.isEmpty(customerName)) {
    console.log("Invalid name :'(");
    setCustomerName(sellToBeRegistered);
  } else {
    sellToBeRegistered.customerName = customerName;
  }
};

const setDate = sellToBeRegistered => {
  const date = prompt("Selling date (dd/mm/yyyy): ");
  const dateSplitted = date.split("/");

  const validDate =
    dateSplitted.length === 3 &&
    _.every(
      dateSplitted,
      fragment => !_.isNaN(_.toNumber(fragment)) && _.toNumber(fragment) > 0
    );

  if (!validDate) {
    console.log("Invalid date :'(");
    setDate(sellToBeRegistered);
  } else {
    sellToBeRegistered.date = date;
  }
};

const setItemName = sellToBeRegistered => {
  const itemName = prompt("Item name: ");

  if (_.isEmpty(itemName)) {
    console.log("Invalid name :'(");
    setItemName(sellToBeRegistered);
  } else {
    sellToBeRegistered.itemName = itemName;
  }
};

const setValue = sellToBeRegistered => {
  const value = _.toNumber(prompt("Value: "));

  if (_.isNaN(value) || value <= 0) {
    console.log("Invalid value :'(");
    setValue(sellToBeRegistered);
  } else {
    sellToBeRegistered.value = value;
  }
};

function registerSelling(sellToBeRegistered) {
  sellings.push(sellToBeRegistered);

  fs.writeFileSync("./sellings.json", JSON.stringify(sellings));

  sellersAmounts.set(
    sellToBeRegistered.sellerName,
    sellersAmounts.get(sellToBeRegistered.sellerName) + sellToBeRegistered.value
  );

  fs.writeFileSync("./amounts.json", JSON.stringify([...sellersAmounts]));
}

function printList() {
  const sortedSellings = _.sortBy(
    sellings,
    ({ sellerName }) => -1 * sellersAmounts.get(sellerName)
  );
  const transformed = sortedSellings.reduce((aux, { uuid, ...x }) => {
    aux[uuid] = x;
    return aux;
  }, {});

  console.log("List sorted by sellers with the highest to lowest amount sold.");
  console.table(transformed);
}

function startRegister() {
  const sellToBeRegistered = {
    uuid: uuidv4(),
    sellerName: null,
    customerName: null,
    date: null,
    itemName: null,
    value: null
  };

  setSellerName(sellToBeRegistered);
  setCustomerName(sellToBeRegistered);
  setDate(sellToBeRegistered);
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
  const answer = prompt("Register other? Write 'no' if not.\n");
  another = answer !== "no";
} while (another);

console.log("Bye!");
