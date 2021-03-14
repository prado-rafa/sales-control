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

function getSellerName(sellToBeRegistered) {
  rl.question('Seller name: ', sellerName => { 
    console.log();
    if(sellersAmounts.has(sellerName)){
      sellToBeRegistered.sellerName = sellerName;
    } else {
      console.log("Sorry, these seller isn't registered :'(");
      getSellerName(sellToBeRegistered);
    }
  });
}

function getSellerName(sellToBeRegistered) {
  rl.question('Seller name: ', sellerName => { 
    console.log();
    if(sellersAmounts.has(sellerName)){
      sellToBeRegistered.sellerName = sellerName;
    } else {
      console.log("Sorry, these seller isn't registered :'(");
      getSellerName(sellToBeRegistered);
    }
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

  getSellerName(sellToBeRegistered);

}

startRegister();

