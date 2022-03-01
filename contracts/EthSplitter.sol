//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

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
    event AddedPayees(Payee[] payees);
    event RemovedPayees(address[] payees);

    using SafeMath for uint256;

    constructor(
        Payee[] memory _payees
    ) {
        _addPayees(_payees);
    }

    function addPayees(
        Payee[] memory _payees
    ) external payable {
        _addPayees(_payees);
    }

    function removePayees(
        address[] memory _payeeAddresses
    ) external payable onlyOwner {
        for (uint256 i = 0; i < payees.length; i++) {
            for (uint256 j = 0; j < _payeeAddresses.length; j++) {
                if(payees[i].payeeAddress == _payeeAddresses[j]) {
                    payees[i].share = 0;
                }
            }
        }
        emit RemovedPayees(_payeeAddresses);
    }

    function getShareWithAddress(
        address _payeeAddress
    ) external view returns (uint256) {
        for (uint256 i = 0; i < payees.length; i++) {
            if(payees[i].payeeAddress == _payeeAddress) {
                uint256 payeeShare = payees[i].share;
                return payeeShare;
            }
        }
    }

    function getPayeesCount() public view returns (uint256) {
        uint256 payeesCount = payees.length;
        return payeesCount;
    }

    function getPayees() public view returns (Payee[] memory) {
        return payees;
    }

    function _addPayees(
        Payee[] memory _payees
    ) internal onlyOwner {
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
        emit AddedPayees(_payees);
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
