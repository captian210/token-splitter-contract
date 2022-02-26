const { expect } = require("chai");
const { ethers } = require("hardhat");

const inputData = require("./local.data.json");
const ownerAddress = "0xdf3e18d64bc6a983f673ab319ccae4f1a57c7097";

describe("EthSplitterFactory", function () {
  it("EthSplitterFactory deploy:", async function () {
    const EthSplitterFactory = await ethers.getContractFactory("EthSplitterFactory");
    const ethSplitterFactory = await EthSplitterFactory.deploy();
    await ethSplitterFactory.deployed();
    const trx = await ethSplitterFactory.registerSplitter(ownerAddress, inputData);
    await trx.wait();
    expect(await ethSplitterFactory.getSplitterCount()).to.equal(1);
  });
});
