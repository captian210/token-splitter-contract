const { expect } = require("chai");
const { ethers } = require("hardhat");
const Web3 = require('web3');
const rpcURL = 'http://127.0.0.1:8545' ;
const web3 = new Web3(new Web3.providers.HttpProvider(rpcURL));
const inputData = require("./local.data.json");

describe("TokenSplitter", function () {
  it("TokenSplitter deploy:", async function () {
    const Token = await ethers.getContractFactory("CustomERC20");
    const token = await Token.deploy();
    await token.deployed();
    const TokenSplitter = await ethers.getContractFactory("TokenSplitter");
    const tokenSplitter = await TokenSplitter.deploy(inputData, token.address);
    await tokenSplitter.deployed();
    expect(await tokenSplitter.getToken()).to.equal(token.address);
  });
  it("TokenSplitter deploy: setToken:", async function () {
    const Token = await ethers.getContractFactory("CustomERC20");
    const token = await Token.deploy();
    await token.deployed();
    const TokenSplitter = await ethers.getContractFactory("TokenSplitter");
    const tokenSplitter = await TokenSplitter.deploy(inputData, token.address);
    await tokenSplitter.deployed();
    const setTokenTrx = await tokenSplitter.setToken(token.address);
    await setTokenTrx.wait();
    expect(await tokenSplitter.getToken()).to.equal(token.address);
  });
  it("Token deploy: mint:", async function () {
    const Token = await ethers.getContractFactory("CustomERC20");
    const token = await Token.deploy();
    await token.deployed();
    const ethAmount = web3.utils.toWei('1', "ether");
    console.log(ethAmount);
    const mintTrx = await token.mint(ethAmount);
    await mintTrx.wait();
    expect(await token.totalSupply()).to.equal(ethAmount);
  });
  it("TokenSplitter: split:", async function () {
    const Token = await ethers.getContractFactory("CustomERC20");
    const token = await Token.deploy();
    await token.deployed();
    const ethAmount = web3.utils.toWei('1', "ether");
    console.log(ethAmount);
    const mintTrx = await token.mint(ethAmount);
    await mintTrx.wait();
    const TokenSplitter = await ethers.getContractFactory("TokenSplitter");
    const tokenSplitter = await TokenSplitter.deploy(inputData, token.address);
    await tokenSplitter.deployed();
    const transferTokenTrx = await token.transfer(tokenSplitter.address, ethAmount);
    await transferTokenTrx.wait();
    const splitTrx = await tokenSplitter.split();
    await splitTrx.wait();
    expect(await tokenSplitter.getTokenBalance()).to.equal(0);
    console.log(await token.balanceOf(inputData[0].payeeAddress));
    console.log(await token.balanceOf(inputData[1].payeeAddress));
    console.log(await token.balanceOf(inputData[2].payeeAddress));
  });
 
});
