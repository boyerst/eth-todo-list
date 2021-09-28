
App = {

  load: async () => {
    //Load Web3 library in order to connect to blockchain
    //Can use config specified by MetaMask (see link below)
    await App.loadWeb3()
    await App.loadAccount()
    //Async await patterns good for loading data from the blockchain
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
  }

}



$(() => {
  $(window).load(() => {
    App.load()  
  })
})