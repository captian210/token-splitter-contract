//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

// import "hardhat/console.sol";
import "./libs/SafeMath.sol";
import "./Ownable.sol";

contract EthSplitter is Ownable {
    struct Payee {
        address payable payeeAddress;
        uint256 share;
    }

    Payee[] public payees;
    uint256 public totalShare;

    event ReceivedEth(address indexed fromAddress, uint256 amount);
    event SplittedEth(uint256 amount, Payee[] payees);

    using SafeMath for uint256;

    constructor(
        Payee[] memory _payees
    ) {
        _addPayees(_payees);
    }

    function addPayees(
        Payee[] memory _payees
    ) external payable onlyOwner {
        _addPayees(_payees);
    }

    function getPayeesCount() public view returns (uint256) {
        return payees.length;
    }

    function getPayees() public view returns (Payee[] memory) {
        return payees;
    }

    function _addPayees(
        Payee[] memory _payees
    ) internal {
        for (uint256 i = 0; i < _payees.length; i++) {
            (uint256 index, bool isExist, bool hasShare) = _checkPayee(_payees[i]);
            if(!hasShare) continue;
            totalShare = totalShare.add(_payees[i].share);
            if(isExist) {
                payees[index] = _payees[i];
            } else {
                payees.push(_payees[i]);
            }
        }
    }

    function _checkPayee(
        Payee memory _payee
    ) internal returns (uint256, bool, bool) {
        if(_payee.share == 0) return (0, false, false);
        for (uint256 i = 0; i < payees.length; i++) {
            if(payees[i].payeeAddress == _payee.payeeAddress) {
                totalShare = totalShare.sub(payees[i].share);
                return (i, true, true);
            }
        }
        return (0, false, true);
    }

    receive() external payable {
        emit ReceivedEth(msg.sender, msg.value);
        require(msg.value > 0, "Fund value 0 is not allowed");
        _split(msg.value);
    }

    function split(
        uint256 _amount
    ) external {
        _split(_amount);
    }

    function _split(uint256 _amount) internal {

        for (uint256 i = 0; i < payees.length; i++) {
            address payable payee = payees[i].payeeAddress;
            uint256 ethAmount = _amount.div(totalShare).mul(payees[i].share);
            payee.transfer(ethAmount); // transfer percentage share
        }
        emit SplittedEth(_amount, payees);
    }
}
