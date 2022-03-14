// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract ToDoList{

    event newTask();

    struct Task{
        string title;
        string description;
        bool complete;
        uint complete_time;
        uint time;
    }

    mapping(address => Task[]) public taskToDo;

    function createTask(string memory task, string memory description) public{
        taskToDo[msg.sender].push(Task(task,description,false,0,block.timestamp));
        emit newTask();
    }

    function completeTask(uint index) public{
        taskToDo[msg.sender][index].complete = true;
        taskToDo[msg.sender][index].complete_time = block.timestamp;
    }

    function getAllTask() public view returns(Task[] memory){
        return taskToDo[msg.sender];
    }
}