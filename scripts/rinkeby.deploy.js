
const hrdht = require("hardhat");

const data = require('./rinkeby.data.json');

const Web3 = require('web3');

const rpcURL = 'https://rinkeby.infura.io/v3/f2620f7c6bca409f9468a3f371905c12';
const web3 = new Web3(new Web3.providers.HttpProvider(rpcURL));

async function main() {

  const EthSplitter = await hrdht.ethers.getContractFactory("EthSplitter");
  console.log(data);
  const ethSplitter = await EthSplitter.deploy(data);
  await ethSplitter.deployed();
  console.log('-------------deployed-eth-splitter------------------------');

  const EthSplitterFactory = await hrdht.ethers.getContractFactory("EthSplitterFactory");
  const ethSplitterFactory = await EthSplitterFactory.deploy();
  await ethSplitterFactory.deployed();
  console.log('-------------deployed-eth-splitter-factory----------------');

  const Token = await hrdht.ethers.getContractFactory("CustomERC20");
  const token = await Token.deploy();
  await token.deployed();
  console.log('-------------deployed-token-------------------------------');

  const ethAmount = web3.utils.toWei('100000', "ether");
  console.log(ethAmount);
  await token.mint(ethAmount);
  console.log('-------------done-mint-token------------------------------');
  
  const TokenSplitter = await hrdht.ethers.getContractFactory("TokenSplitter");
  const tokenSplitter = await TokenSplitter.deploy(data, token.address);
  await tokenSplitter.deployed();
  console.log('-------------deployed-token-splitter----------------------');

  console.log(
    "EthSplitter deployed to:", ethSplitter.address, 
    "\nEthSplitterFactory deployed to:", ethSplitterFactory.address,
    "\nToken deployed to:", token.address,
    "\nTokenSplitter deployed to:", tokenSplitter.address
  );

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
