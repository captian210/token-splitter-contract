const { expect } = require("chai");
const { ethers } = require("hardhat");

const inputData = require("./local.data.json");
const newInputData = require("./new.local.data.json");

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
    expect(await ethSplitter.getPayeesCount()).to.equal(3);
  });
  it("EthSplitter add payees: add existing payees:", async function () {
    const EthSplitter = await ethers.getContractFactory("EthSplitter");
    const ethSplitter = await EthSplitter.deploy(inputData);
    await ethSplitter.deployed();
    const addPayeesTrx = await ethSplitter.addPayees(inputData)
    await addPayeesTrx.wait();
    expect(await ethSplitter.getPayeesCount()).to.equal(3);
  });
  it("EthSplitter add payees: add new payees:", async function () {
    const EthSplitter = await ethers.getContractFactory("EthSplitter");
    const ethSplitter = await EthSplitter.deploy(inputData);
    await ethSplitter.deployed();
    const addPayeesTrx = await ethSplitter.addPayees(newInputData)
    await addPayeesTrx.wait();
    expect(await ethSplitter.getPayeesCount()).to.equal(4);
  });
  it("EthSplitter add payees: remove payees:", async function () {
    const EthSplitter = await ethers.getContractFactory("EthSplitter");
    const ethSplitter = await EthSplitter.deploy(inputData);
    await ethSplitter.deployed();
    const addPayeesTrx = await ethSplitter.removePayees(['0x90f79bf6eb2c4f870365e785982e1f101e93b906'])
    await addPayeesTrx.wait();
    expect(await ethSplitter.getShareWithAddress('0x90f79bf6eb2c4f870365e785982e1f101e93b906')).to.equal(0);
  });
});
