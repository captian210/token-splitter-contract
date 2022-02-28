
const hrdht = require("hardhat");

const data = require('./local.data.json');

const Web3 = require('web3');

const rpcURL = 'http://127.0.0.1:8545';
const web3 = new Web3(new Web3.providers.HttpProvider(rpcURL));

async function main() {

  const EthSplitter = await hrdht.ethers.getContractFactory("EthSplitter");
  console.log(data);
  const ethSplitter = await EthSplitter.deploy(data);
  await ethSplitter.deployed();

  const EthSplitterFactory = await hrdht.ethers.getContractFactory("EthSplitterFactory");
  const ethSplitterFactory = await EthSplitterFactory.deploy();
  await ethSplitterFactory.deployed();

  const Token = await hrdht.ethers.getContract("CustomERC20");
  const token = await Token.deploy();
  await token.deployed();

  const ethAmount = web3.utils.toWei('100000', "ether");
  console.log(ethAmount);
  await token.mint(ethAmount);

  const TokenSplitter = await hrdht.ethers.getContract("TokenSplitter");
  const tokenSplitter = await TokenSplitter.deploy();
  await tokenSplitter.deployed();

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
