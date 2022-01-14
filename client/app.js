const ethUtil = require('ethereumjs-util');
const sigUtil = require('eth-sig-util');
const EthCrypto = require('eth-crypto');

App = {
    web3Provider: '',
    init: async () => {
        await App.loadEthereum()
        await App.loadAccount()
        if(!App.ToDoContract)
            await App.loadContract()
        await App.render()
        await App.renderTasks()
    },
    loadEthereum: async () => {
        if(window.ethereum){
            App.web3Provider = window.ethereum
        } else {
            console.log("No load Web3")
        }
    },
    loadAccount: async () => {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        App.account = accounts[0];
    },
    loadContract: async () =>{
        const res = await fetch("ToDoList.json")
        var contractAbi = await res.json()
        App.provider = new ethers.providers.Web3Provider(App.web3Provider)
        App.ToDoContract = new ethers.Contract('0x1f5E9E9602bEb4D14c38952cB5504E4471E3328F',contractAbi["abi"],App.provider)
        if(!App.ToDoContract){
            const factory = await new ethers.ContractFactory(contractAbi["abi"],contractAbi["bytecode"],App.provider.getSigner())
            App.ToDoContract = await factory.deploy()
        }
        App.ToDoContract = await App.ToDoContract.connect(App.provider.getSigner())
    },
    render: async () => {
        document.getElementById("account").innerText = App.account;
    },
    renderTasks: async () => {
        const tasks = await App.ToDoContract.getAllTask();
    
        let html = "";
    
        for (let i = 0; i < tasks.length; i++) {
          const taskId = i;
          const taskTitle = tasks[i].title;
          const taskDescription = tasks[i].description;
          const taskDone = tasks[i].complete;
          const taskCreatedAt = tasks[i].time;
    
          // Creating a task Card
          let taskElement = `<div class="card bg-dark rounded-0 mb-2">
            <div class="card-header d-flex justify-content-between align-items-center">
              <span>${taskTitle}</span>
              <div class="form-check form-switch">
                <input class="form-check-input" data-id="${taskId}" type="checkbox" onchange="App.toggleDone(this)" ${
                  taskDone === true && "checked"
                }>
              </div>
            </div>
            <div class="card-body">
              <span>${taskDescription}</span>
              <p class="text-muted">Task was created ${new Date(
                taskCreatedAt * 1000
              ).toLocaleString()}</p>
              </label>
            </div>
          </div>`;
          html += taskElement;
        }
    
        document.querySelector("#tasksList").innerHTML = html;
    },
    createTask: async (title, description) =>{
        try{
            const result = await App.ToDoContract.createTask(title,description);
            window.location.reload()
        } catch(error){
            console.log(error);
        }
    },
    toggleDone: async (element) => {
        const taskId = element.dataset.id;
        await App.ToDoContract.completeTask(taskId);
        window.location.reload();
    },
    encryptMessage: async() => {
        await ethereum
        .request({
          method: 'eth_getEncryptionPublicKey',
          params: [App.account], // you must have access to the specified account
        })
        .then((result) => {
          App.encryptionPublicKey = result;
        })
        .catch((error) => {
          if (error.code === 4001) {
            // EIP-1193 userRejectedRequest error
            console.log("We can't encrypt anything without the key.");
          } else {
            console.error(error);
          }
        });

        App.encryptedMessage = await ethUtil.bufferToHex(
            Buffer.from(
              JSON.stringify(
                sigUtil.encrypt(
                    App.encryptionPublicKey,
                  { data: 'HolaTomi' },
                  'x25519-xsalsa20-poly1305'
                )
              ),
              'utf8'
            )
          );
    },
    decryptMessage: async() => {
        ethereum
        .request({
          method: 'eth_decrypt',
          params: [App.encryptedMessage, App.account],
        })
        .then((decryptedMessage) =>
          console.log('The decrypted message is:', decryptedMessage)
        )
        .catch((error) => console.log(error.message));
    }
}