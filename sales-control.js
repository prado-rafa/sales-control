const _ = require("lodash");
const prompt = require("prompt-sync")({ sigint: true });
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const EXAMPLE_SELLERS = ["AJ", "Ea", "Io", "On", "Ur"];
const DATE_REGEX = /(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.]\d\d\d\d/;

let sellersAmounts = new Map();

let sales = [];

const readFiles = () => {
  try {
    sales = JSON.parse(fs.readFileSync("./sales.json", "utf8"));
    sellersAmounts = JSON.parse(fs.readFileSync("./amounts.json", "utf8"));
  } catch {
    console.log("Oops, creating new files X-X");
    sales = [];
    sellersAmounts = _.map(EXAMPLE_SELLERS, seller => ({
      seller,
      amount: 0
    }));
    fs.writeFileSync("./amounts.json", JSON.stringify(sellersAmounts));
    fs.writeFileSync("./sales.json", JSON.stringify(sales));
  }
};

const setSellerName = sellToBeRegistered => {
  const sellerName = prompt("Seller name: ");

  if (!_.find(sellersAmounts, ({ seller }) => seller === sellerName)) {
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
  const date = prompt("sale date (dd/mm/yyyy): ");

  if (!date.match(DATE_REGEX)) {
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

function registerSale(sellToBeRegistered) {
  sales.push(sellToBeRegistered);

  fs.writeFileSync("./sales.json", JSON.stringify(sales));

  const sellerToAddAmmout = _.find(
    sellersAmounts,
    ({ seller }) => seller === sellToBeRegistered.sellerName
  );

  sellerToAddAmmout.amount += sellToBeRegistered.value;

  fs.writeFileSync("./amounts.json", JSON.stringify(sellersAmounts));
}

function printList() {
  console.log(
    "List sorted by sellers with the highest to lowest amount sold.\n"
  );

  const sortedAmounts = _.sortBy(sellersAmounts, ({ amount }) => amount * -1);
  const salesMap = _.groupBy(sales, "sellerName");

  _.forEach(sortedAmounts, ({ seller, amount }, index) => {
    const list = salesMap[seller];

    console.log(`#${index} ${seller} (amount: ${amount})`);

    if (list) {
      const transformed = _.reduce(
        list,
        (aux, { uuid, ...x }) => {
          aux[uuid] = _.omit(x, "sellerName");
          return aux;
        },
        {}
      );

      console.table(transformed);
      console.log("\n");
    } else {
      console.log("No sale reported :'(\n");
    }
  });
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
  registerSale(sellToBeRegistered);
  console.log("Registered! :)");
  printList();
}

console.log("Hi :) Reading files...");
readFiles();
console.log("Complete! Let's register a sell. o/");
let another = true;
do {
  startRegister();
  const answer = prompt("Register other? ");
  another = answer !== "no";
} while (another);

console.log("Bye!");
