//Declare version
pragma solidity ^0.5.0;

//Declare contract
contract  TodoList {
  //taskCount function
  uint public taskCount = 0;

  struct Task {
    uint id;
    //attributes as id
    string content;
    //defines task content as strings
    bool completed;
    //defines checkbox for completed items
  }
  //tasks function...
  mapping(uint => Task) public tasks;

  //Broadcast an event that this task was created (avail for end user to be notified of event)
  event TaskCreated(
    //Pass in 3 args
    uint id,
    string content, 
    bool completed
  );

  //For emiting in toggleCompleted function
  event TaskCompleted(
    //Pass in 2 args
    uint id,
    bool completed
  );


  constructor() public {
    createTask("Here is a really important task that MUST be completed");
  }
 //takes single argument - the content of the task
  function createTask(string memory _content) public {
    //want to increment task struct value anytime we are creating new task to go inside of mapping
    taskCount ++;
    //put it inside of mapping
    //taskCount = new ID, content = content of task, false bc not completed yet    
    tasks[taskCount] = Task(taskCount, _content, false);
    //Emit event TaskCreated()...
      //Pass in the args: id from taskCount, _content from this function, false from completed bool)
    emit TaskCreated(taskCount, _content, false);
  }
  //Pass in parameter (the id of the task to toggle)
  function toggleCompleted(uint _id) public {
    //Get the task out of the mapping (same way we did in createTask)
      //Assign it to a variable with the type Task
    Task memory _task = tasks[_id];
    //Mark as opposite of whatever did before
    _task.completed = !_task.completed;
    //Put it back into the mapping
    tasks[_id] = _task;
    //Emit event TaskCompleted()...
    emit TaskCompleted(_id, _task.completed);
  }

}


