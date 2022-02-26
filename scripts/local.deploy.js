// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hrdht = require("hardhat");

const data = require('./local.data.json');

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hrdht.run('compile');

  // We get the contract to deploy
  const EthSplitter = await hrdht.ethers.getContractFactory("EthSplitter");
  console.log(data);
  const ethSplitter = await EthSplitter.deploy(data);
  await ethSplitter.deployed();

  const EthSplitterFactory = await hrdht.ethers.getContractFactory("EthSplitterFactory");
  const ethSplitterFactory = await EthSplitterFactory.deploy();
  await ethSplitterFactory.deployed();

  console.log("EthSplitter deployed to:", ethSplitter.address, 
  "\nEthSplitterFactory deployed to:", ethSplitterFactory.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
