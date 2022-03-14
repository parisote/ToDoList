const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("To Do List", function () {
  before(async function(){
    [ this.a, this.a2 ] = await hre.ethers.getSigners();
    const ToDoList = await hre.ethers.getContractFactory("ToDoList");    
    this.contract = await ToDoList.deploy();
    await this.contract.deployed();

    this.c_a = await this.contract.connect(this.a);
    this.c_a2 = await this.contract.connect(this.a2);
  })

  it("Test create task", async function () {
    await this.c_a.createTask("Nueva tarea", "nueva tarea para hacer");
    const all_task = await this.c_a.getAllTask();
    expect(all_task[0].title).to.equal("Nueva tarea");
  });

});
