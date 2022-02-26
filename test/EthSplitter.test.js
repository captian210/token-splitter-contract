const { expect } = require("chai");
const { ethers } = require("hardhat");
// const Web3 = require('web3');

// const myAddress = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266";
// const rpcURL = 'http://127.0.0.1:8545' ;
// const web3 = new Web3(new Web3.providers.HttpProvider(rpcURL));
const inputData = require("./local.data.json");

describe("EthSplitter", function () {
  it("EthSplitter deploy: totalShare:", async function () {
    const EthSplitter = await ethers.getContractFactory("EthSplitter");
    const ethSplitter = await EthSplitter.deploy(inputData);
    await ethSplitter.deployed();
    expect(await ethSplitter.totalShare()).to.equal(20);
  });
  it("EthSplitter deploy: the count of initial payees:", async function () {
    const EthSplitter = await ethers.getContractFactory("EthSplitter");
    const ethSplitter = await EthSplitter.deploy(inputData);
    await ethSplitter.deployed();
    // console.log('payees ->');
    // console.log(await ethSplitter.getPayees());
    expect(await ethSplitter.getPayeesCount()).to.equal(3);
  });
  it("EthSplitter add payees: add existing payees:", async function () {
    const EthSplitter = await ethers.getContractFactory("EthSplitter");
    const ethSplitter = await EthSplitter.deploy(inputData);
    await ethSplitter.deployed();
    const addPayeesTrx = await ethSplitter.addPayees(inputData)
    await addPayeesTrx.wait();
    // console.log(await ethSplitter.getPayees());
    expect(await ethSplitter.getPayeesCount()).to.equal(3);
  });
  // it("EthSplitter receive:", async function () {
  //   const EthSplitter = await ethers.getContractFactory("EthSplitter");
  //   const ethSplitter = await EthSplitter.deploy(inputData);
  //   await ethSplitter.deployed();
  //   console.log("initial this => ", ethSplitter.address, await web3.eth.getBalance(ethSplitter.address));
  //   console.log("initial source => ", myAddress, await web3.eth.getBalance(myAddress));
  //   console.log("initial A => ", inputData[0].payeeAddress, await web3.eth.getBalance(inputData[0].payeeAddress));
  //   console.log("initial B => ", inputData[1].payeeAddress, await web3.eth.getBalance(inputData[1].payeeAddress));
  //   console.log("initial C => ", inputData[2].payeeAddress, await web3.eth.getBalance(inputData[2].payeeAddress));
  //   let one_eth = web3.utils.toWei('1', "ether");
  //   await web3.eth.sendTransaction({from: myAddress, to: ethSplitter.address, value: one_eth}); // 1 eth
  //   // // await splitTrx.wait();
  //   // console.log("initial this => ", ethSplitter.address, await web3.eth.getBalance(ethSplitter.address));
  //   // console.log("initial source => ", myAddress, await web3.eth.getBalance(myAddress));
  //   // console.log("initial A => ", inputData[0].payeeAddress, await web3.eth.getBalance(inputData[0].payeeAddress));
  //   // console.log("initial B => ", inputData[1].payeeAddress, await web3.eth.getBalance(inputData[1].payeeAddress));
  //   // console.log("initial C => ", inputData[2].payeeAddress, await web3.eth.getBalance(inputData[2].payeeAddress));
  //   // console.log('one => ', one_eth);
  //   // await ethSplitter.split(one_eth);
  //   // console.log(await ethSplitter.getPayees());
  //   // expect(await ethSplitter.getPayeesCount()).to.equal(3);
  // });
});
