

App = {

  loading: false,
  //Need a place to store App.contracts(2) from loadContract
  //Otherwise TodoList will be undefined, so create empty object...        
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
    //Call function to render information in HTML page
    await App.render()
    web3.eth.defaultAccount = web3.eth.accounts[0]

  },

  //CONNECT TO THE BLOCKCHAIN
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

  //RETRIEVE THE ACCOUNT
  //Show account from Ganache to prove that we are actually connected to the blockchain with the account
  //web3 here was set by loadWeb3 funtion
  //Includes an e.t.h. object that will contain all of the accounts
  loadAccount: async () => {
    App.account = web3.eth.accounts[0]
    console.log(App.account)
  },

  //RETRIEVE THE SMART CONTRACT
  //Load contract from the blockchain by pulling it out of .json file
  loadContract: async () => {
    //Pass in the TodoList.json file  
    const todoList = await $.getJSON('TodoList.json')
    //Create a wrapper around the .json file that we created to allow interaction on the blockchain
    App.contracts.TodoList = TruffleContract(todoList)
    //Set the provider as web3 which we created in loadWeb3 function
    App.contracts.TodoList.setProvider(App.web3Provider)
    // ↑ Both App.contracts will give us a copy of the smart contract in JS
      //Will tell us where it is on blockchain
      //Will allow us to call all the functions we created (tasks, taskCount)
    // ↓ Gets a deployed copy of the smart contract
      //"Hydrates" the smart contract with the values from the blockchain
      //Makes it a live contract
    App.todoList = await App.contracts.TodoList.deployed()
    console.log(todoList)
  },

  //RENDER INFORMATION ON THE PAGE
  render: async () => {
    //Prevent double rendering
      //If app is loading, set state loading: true so does not call this render function
    if (App.loading) {
      return
    }
    //Update state
      //If loading: not true, load the account and update state to loading: false
    App.setLoading(true)
    //Render the account in our HTML
    $('#account').html(App.account)
    //Render tasks
    await App.renderTasks()
    //Update state
    App.setLoading(false)
  },

  //RENDER TO DO LIST TASKS
  renderTasks: async () => {
    //Load the task count from the blockchain (need total number to execute for loop)
    const taskCount = await App.todoList.taskCount()
    //Fetch (from DOM) task template in order to render each task
    const $taskTemplate = $('.taskTemplate')
    //Render each task with a new task template (one by one, because mapping requires this)
      //Do this by using above taskCount
    for (var i = 1; i <= taskCount; i++) {
      //Looping through and fetching task data from blockchain
        // i = task ID, task is an array
      const task = await App.todoList.tasks(i)
        //Have to reference the following values by each item in the array
      const taskId = task[0].toNumber()
      const taskContent = task[1]
      const taskCompleted = task[2]
      //HTML for the task
        //Use task template we fetch from DOM
        
      const $newTaskTemplate = $taskTemplate.clone()
      //Find content from the task (found via for loop)
      $newTaskTemplate.find('.content').html(taskContent)
      //Find input (checkbox)
      $newTaskTemplate.find('input')
                      .prop('name', taskId)
                      .prop('checked', taskCompleted)
                      .on('click', App.toggleCompleted)
      //Put the task in the correct list (completed vs non-completed)
      if (taskCompleted) {
        $('#completedTaskList').append($newTaskTemplate)
      } else {
        $('#taskList').append($newTaskTemplate)
      }
    
      //Show the task
      $newTaskTemplate.show()

    }
  },

  //CREATE TASKS
  createTask: async () => {
    //When this function is called, show app loading on screen
    App.setLoading(true)
    //#newTask is the id/name of the input from the form in index.html
      //From the form, we will fetch the value of the input, give it a value (Whatever is filled in the form)
    const content = $('#newTask').val()
    //Call the smart contract function (add thus web3.js/truffle contract library) so can talk to the blockchain and update it
      //Also will pass in the content from the value
    await App.todoList.createTask(content)
    //Will also include a shortcut to refresh the page after we call the smart contract
      //This will fetch all of the tasks listed on the blockchain again and list them out
      //Another option would be to listen for the event, but could cause a double rendering issue
    window.location.reload()

  },

  //TOGGLE COMPLETED TASKS
    //Has an event listener to call (onClick), so pass in e for event
  toggleCompleted: async (e) => {
    App.setLoading(true)
    //Event will contain name of the task being completed
    const taskId = e.target.name
    await App.todoList.toggleCompleted(taskId)
    window.location.reload()
  },


  //UPDATE PAGE
    //Show loader/hide class=content (the ToDo List) when loading: true
    //Hide loader/show class=content (the ToDo List) when loading: false
  setLoading: (boolean) => {
    App.loading = boolean
    const loader = $('#loader')
    const content = $('#content')
    //If loading: true...
    if (boolean) { 
      loader.show()
      content.hide()
    } else {
      loader.hide()
      content.show()
    }
  }
}
  



$(() => {
  $(window).load(() => {
    App.load()  
  })
})