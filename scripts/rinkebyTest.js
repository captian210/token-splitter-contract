const Web3 = require('web3');
const rpcURL = 'https://rinkeby.infura.io/v3/f2620f7c6bca409f9468a3f371905c12' ;
const web3 = new Web3(new Web3.providers.HttpProvider(rpcURL));
const abi = [
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "payeeAddress",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "share",
            "type": "uint256"
          }
        ],
        "internalType": "struct TokenSplitter.Payee[]",
        "name": "_payees",
        "type": "tuple[]"
      },
      {
        "internalType": "address",
        "name": "_token",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "oldOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "LogTransferredOwnership",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "fromAddress",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "ReceivedEth",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "components": [
          {
            "internalType": "address",
            "name": "payeeAddress",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "share",
            "type": "uint256"
          }
        ],
        "indexed": false,
        "internalType": "struct TokenSplitter.Payee[]",
        "name": "payees",
        "type": "tuple[]"
      }
    ],
    "name": "SplittedEth",
    "type": "event"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "payeeAddress",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "share",
            "type": "uint256"
          }
        ],
        "internalType": "struct TokenSplitter.Payee[]",
        "name": "_payees",
        "type": "tuple[]"
      }
    ],
    "name": "addPayees",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getPayees",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "payeeAddress",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "share",
            "type": "uint256"
          }
        ],
        "internalType": "struct TokenSplitter.Payee[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getPayeesCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getToken",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTokenBalance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalShare",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "isOwner",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_token",
        "type": "address"
      }
    ],
    "name": "setToken",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "split",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];
const tokenSplitterAddress = '0x831657E0039158C576C5d584267CDd44D5Ae9C9c';
// const tokenSplitterContract = new web3.eth.Contract(abi, tokenSplitterAddress);
// tokenSplitterContract.methods.split().call().then(console.log)

require('dotenv').config();
const ethers = require('ethers')
async function main() {
  
  const infuraProvider = new ethers.providers.InfuraProvider('rinkeby', 'f2620f7c6bca409f9468a3f371905c12');
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, infuraProvider);
  const signer = wallet.connect(infuraProvider);
  contract = new ethers.Contract(tokenSplitterAddress, abi, signer);

  // const splitTx = await contract.split();
  // await splitTx.wait()
  console.log(await contract.getTokenBalance())
  console.log(await contract.getToken())
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
