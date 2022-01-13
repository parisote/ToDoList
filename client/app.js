App = {
    web3Provider: '',

    init: () => {
        App.loadEthereum()
        App.loadContract()
    },
    loadEthereum: async () => {
        if(window.ethereum){
            App.web3Provider = window.ethereum
            this.accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        } else {
            console.log("no load")
        }
    },
    loadContract: async () =>{
        const res = await fetch("ToDoList.json")
        this.contractAbi = await res.json()
        const provider = new ethers.providers.Web3Provider(App.web3Provider)
        const factory = await new ethers.ContractFactory(this.contractAbi["abi"],this.contractAbi["bytecode"],provider.getSigner())
        this.contract = await factory.deploy()
    },
    createTask: async () =>{
        //this.contract = new ethers.Contract(this.contract.address,this.contractAbi["abi"],ethers.providers.getDefaultProvider())

        this.contract = this.contract.connect(provider.getSigner())
        await this.contract.createTask('Hello World');
        const all_task = await this.contract.getAllTask()
        console.log(all_task)
    }
}

App.init()