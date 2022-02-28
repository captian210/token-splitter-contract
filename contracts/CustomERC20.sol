//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./ERC20.sol";
import "./Ownable.sol";

contract CustomERC20 is ERC20, Ownable {
  constructor() ERC20("CustomTKN", "CTKN") {}

  function mint(uint256 amount) public virtual onlyOwner returns (bool) {
    address owner = _msgSender();
    _mint(owner, amount);
    return true;
  }
}