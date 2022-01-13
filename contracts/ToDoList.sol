// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract ToDoList{

    event newTask();

    struct Task{
        string task;
        bool complete;
        uint complete_time;
        uint time;
    }

    mapping(address => Task[]) public taskToDo;

    function createTask(string memory task) public{
        taskToDo[msg.sender].push(Task(task,false,0,block.timestamp));
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