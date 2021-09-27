//Declare version
pragma solidity ^0.5.0;

//Declare contract
contract  TodoList {
  uint public taskCount = 0;

  struct Task {
    uint id;
    //attributes as id
    string content;
    //defines task content as strings
    bool completed;
    //defines checkbox for completed items
  }

  mapping(uint => Task) public tasks;

  constructor() public {
    createTask("Here is a really important task that MUST be completed");
  }

  function createTask(string memory _content) public {
  //takes single argument = the content of the task
    taskCount ++;
    //want to increment task struct value anytime we are creating new task to go inside of mapping
    tasks[taskCount] = Task(taskCount, _content, false);
    //put it inside of mapping
    //taskCount = new ID, content = content of task, false bc not completed yet
  }

}


