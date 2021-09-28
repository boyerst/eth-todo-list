
App = {
  //Need a place to store App.contracts(2) from loadContract, otherwise TodoList will be undefined
  contracts: {},
  load: async () => {
    //Async await patterns good for loading data from the blockchain
    //Call function to load Web3 library in order to connect to blockchain
      //Can use config specified by MetaMask (see link below)
    await App.loadWeb3()
    //Call function to load and connect Ganache ETH account 
    await App.loadAccount()
    //Call function to load contracts from /contracts (ie TodoList.json)
    await App.loadContract()
    // console.log("app loading...")
  },

  //https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
  //Load Web3.js to establish blockchain connection, then use browser to connect to MetaMask
  loadWeb3: async () => {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider)
    } else {
      window.alert("Please connect to Metamask.")
    }
    //For modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum)
      try {
          //Request account access if needed
          await ethereum.enable()
          //Acccounts now exposed
          web3.eth.sendTransaction({ /* ... */ })
      } catch (error) {
          //User denied account access...
      }
    }
    //For legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = web3.currentProvider
      window.web3 = new Web3(web3.currentProvider)
      // Acccounts always exposed
      web3.eth.sendTransaction({ /* ... */ })
    }
    //For non-dapp browsers...
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  },

  //Show account from Ganache to prove that we are actually connected to the blockchain with the account
  //web3 here was set by loadWeb3 funtion
  //Includes an e.t.h. object that will contain all of the accounts
  loadAccount: async () => {
    App.account = web3.eth.accounts[0]
    console.log(App.account)
  },
  //Load contract from the blockchain by pulling it out of .json file
  loadContract: async () => {
    const todoList = await $.getJSON('TodoList.json')
    //Pass in the TodoList.json file
    //Will create a wrapper around the .json file that we created to allow interaction
    App.contracts.TodoList = TruffleContract(todoList)
    //Set the provider as web3 which we created in loadWeb3 function
    App.contracts.TodoList.setProvider(App.web3Provider)
    //Both App.contracts will give us a copy of the smart contract in JS
    //Will tell us where it is on blockchain
    //Will allow us to call all the functions we created (tasks, taskCount)
    console.log(todoList)
  }
}




$(() => {
  $(window).load(() => {
    App.load()  
  })
})