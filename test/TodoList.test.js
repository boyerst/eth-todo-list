//Write tests to ensure contract initialized properly and it actually writes out tasks
const TodoList = artifacts.require('./TodoList.sol')

//Contract will expose all accounts in the blockchain (from Ganache)
  //Will be injected inside of variable 'accounts' as an array
contract('TodoList', (accounts) => {
  //Get a copy of the deployed smart contract before hook..
    //'Before each test runs, pass in this async function (allow use of await keyword), to give us a copy of the TodoList that is deployed to the blockchain'
  before(async () => {
    this.todoList = await TodoList.deployed()
  })
  //Test to ensure contract is on the blockchain and has an address
  it('deploys successfully', async () => {
    //Get the address
    const address = await this.todoList.address
    //Assert that the address exists, and that it is not empty
    assert.notEqual(address, 0x0)
    assert.notEqual(address, '')
    assert.notEqual(address, null)
    assert.notEqual(address, undefined)
  })
  //Test to ensure tasks and task values listed correctly
  it('lists tasks', async () => {
    //Get the taskCount
    const taskCount = await this.todoList.taskCount()
    //Fetch the task out of mapping function (ensuring task exists where the taskCount is)
    const task = await this.todoList.tasks(taskCount)  
    //Assert that the taskID is equal to the taskCount (that it is set correctly)
    assert.equal(task.id.toNumber(), taskCount.toNumber())
    //Test task content
    assert.equal(task.content, 'Here is a really important task that MUST be completed')
    //Task being tested is not completed...
    assert.equal(task.completed, false)
    //In this case we specifiy it is 1 because this is Task 1
    assert.equal(taskCount.toNumber(), 1)
  })

  it('creates tasks', async () => {
    //Get the task, ensure new task was created
    const result = await this.todoList.createTask('A new task')
    //Get the task count
    const taskCount = await this.todoList.taskCount()
    //Assert that the taskCount is the same as we expect  
    assert.equal(taskCount, 2)
    // console.log(result)
    //Test if the new event was actually triggered
      //Do this by analyzing the logs of the newly created task to check if id, content and completed are the same
      //Get the event using the result of the createTask function we get above via async await pattern
      //The event is inside of the result (the first item, thus [0])
      //The args key is going to contain all of the values for the event
    const event = result.logs[0].args
    //Check if all of the information is there (the info given by the args key)
      //ie "assert that this event id is equal to 2, that this event content is equal to <content>...etc.""
    assert.equal(event.id.toNumber(), 2)
    assert.equal(event.content, 'A new task')
    assert.equal(event.completed, false)
  })


  it('toggles task completion', async () => {
    //Pass in (1) for the first task
    //Test process..
      // (1)Toggling completed, passing in id of 1st task (which already made within the contructor)
    const result = await this.todoList.toggleCompleted(1) 
      // (2)Get the task and check if completed (true)
    const task = await this.todoList.tasks(1) 
      // (3)Ensure the event was completed 
    assert.equal(task.completed, true)
      // (4) Get event by digging into the result
    const event = result.logs[0].args
      // (5) Ensure said id = 1
    assert.equal(event.id.toNumber(), 1)
      // (6) Ensure task completed is true
    assert.equal(event.completed, true)
  })


})