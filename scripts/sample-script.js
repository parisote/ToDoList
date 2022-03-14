const hre = require("hardhat");

async function main() {
  const ToDoList = await hre.ethers.getContractFactory("ToDoList");
  const todo = await ToDoList.deploy();

  await todo.deployed();

  console.log("ToDoList deployed to:", todo.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
