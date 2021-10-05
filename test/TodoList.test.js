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
    //Ensure the address exists, and that it is not empty
    assert.notEqual(address, 0x0)
    assert.notEqual(address, '')
    assert.notEqual(address, null)
    assert.notEqual(address, undefined)
  })
})