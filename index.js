
// Source code to interact with smart contract

// web3 provider with fallback for old version
window.addEventListener('load', async () => {
  // New web3 provider
  if (window.ethereum) {
      window.web3 = new Web3(ethereum);
      try {
          // ask user for permission
          await ethereum.enable();
          // user approved permission
      } catch (error) {
          // user rejected permission
          console.log('user rejected permission');
      }
  }
  // Old web3 provider
  else if (window.web3) {
      window.web3 = new Web3(web3.currentProvider);
      // no need to ask for permission
  }
  // No web3 provider
  else {
      console.log('No web3 provider detected');
  }
});
console.log (window.web3.currentProvider)
//connection with node
var web3 = new Web3(new Web3.providers.HttpProvider('https://rpc-mumbai.maticvigil.com'));
// contractAddress and abi are setted after contract deploy
var contractAddress = '0x524e0ea548600768846d9cad66c5f26fae509a28';
var abi = JSON.parse( '[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"_scanner","type":"address"},{"internalType":"uint256","name":"eventID","type":"uint256"}],"name":"approveScanner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_supply","type":"uint256"},{"internalType":"string","name":"_name","type":"string"},{"internalType":"uint256","name":"_price","type":"uint256"}],"name":"createEvent","outputs":[{"internalType":"uint256","name":"eventID","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"eventID","type":"uint256"},{"internalType":"uint256","name":"_quantity","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"eventID","type":"uint256"}],"name":"pullFunds","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_scanner","type":"address"},{"internalType":"uint256","name":"eventID","type":"uint256"}],"name":"removeScanner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"eventID","type":"uint256"},{"internalType":"address","name":"_holderID","type":"address"},{"internalType":"uint256","name":"_quantity","type":"uint256"}],"name":"scan","outputs":[],"stateMutability":"nonpayable","type":"function"}]');
//contract instance
contract = new web3.eth.Contract(abi, contractAddress);

// Accounts
var account;

web3.eth.getAccounts(function(err, accounts) {
  if (err != null) {
    alert("Error retrieving accounts.");
    return;
  }
  if (accounts.length == 0) {
    alert("No account found! Make sure the client is configured properly.");
    return;
  }
  account = accounts[0];
  console.log('Account: ' + account);
  web3.eth.defaultAccount = account;
});

// approveScan - adds to the approved scanner list.
function TCapproveScanner() {
    approveID = $("#approveScanner").val();
    addEventID = $("#addEventID").val();
    contract.methods.approveScanner(approveID, addEventID).send( {from: account}).then( function(tx) {
        console.log("Transaction: ", tx);
        document.getElementById('addsubLabel').innerHTML = tx;
    });
    $("#approveScanner").val('');
}
// removeScan removes from the approved scanner list.
function TCremoveScanner() {
    removeID = $("#removeScanner").val();
    subEventID = $("#subEventID").val();
    contract.methods.removeScanner().send(removeID, subEventID).send( {from: account}).then( function(tx) {
        console.log("Transaction: ", tx);
        document.getElementById('addsubLabel').innerHTML = tx;
    });
}
// createEvent - Creates an event with a provided amount of people  
// Roadmap - add description and image, possibly host on ipfs needs to be added to contract first.
function TCcreateEvent() {
    eventSupply= $("#eventSupply").val();
    eventName = $("#eventName").val();
    eventPrice = $("#eventPrice").val();
    contract.methods.createEvent(eventSupply,eventName,eventPrice).send({from: '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1',gasPrice: 2, gas: 10000000000}).then( function(tx) {
        console.log("Transaction: ", tx);
        document.getElementById('createpullLabel').innerHTML = tx;
    });
}
// mint - Mints a token for an event 
// Roadmap - add cost of token to transaction 
function TCmint() {
    mintEventID = $("#mintEventID").val();
    quantity = $("#quantity").val();
    contract.methods.mint(mintEventID,quantity).send( {from: account}).then( function(tx) {
        console.log("Transaction: ", tx);
        document.getElementById('lastInfo').innerHTML = tx;
    });
}
// pullFunds - Pulls the funds for the event organizer. 
function TCpullFunds() {
    drawEventID = $("#drawEventID").val();
    contract.methods.pullFunds(drawEventID).send( {from: account}).then( function(tx) {
        console.log("Transaction: ", tx);
        document.getElementById('createpullLabel').innerHTML = tx;    
    });
}
// scan - confirms the user is who they say they are. 
function TCscanTokens() {
    scanEventID = $("#scanEventID").val();
    scanWallet = $("#scanWallet").val();
    scanQuantity = $("#scanQuantity").val();
    contract.methods.pullFunds(scanEventID,scanWallet,scanQuantity).send( {from: account}, {gasPrice: 200000},{value: 1000000000000000}).then( function(tx) {
        console.log("Transaction: ", tx);
        document.getElementById('').innerHTML = tx;
    });
    
}
