//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./EthSplitter.sol";

contract EthSplitterFactory {

  address[] public contracts;

  event SplitterCreated(address indexed contractAddress);

  function registerSplitter(
    address _owner,
    EthSplitter.Payee[] memory _payees
  ) public {
    EthSplitter splitter = new EthSplitter(_payees);
    contracts.push(address(splitter));
    splitter.transferOwnership(_owner);
    emit SplitterCreated(address(splitter));
  }

  function getSplitterCount() external view returns (uint256) {
    return contracts.length;
  }
}
