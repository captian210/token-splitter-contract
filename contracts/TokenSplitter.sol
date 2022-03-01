//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./libs/SafeMath.sol";
import "./interfaces/IERC20.sol";
import "./Ownable.sol";

contract TokenSplitter is Ownable {
    struct Payee {
        address payeeAddress;
        uint256 share;
    }

    IERC20 private token;

    Payee[] private payees;
    uint256 private totalShare;

    event ReceivedEth(address indexed fromAddress, uint256 amount);
    event SplittedEth(uint256 amount, Payee[] payees);
    event AddedPayees(Payee[] payees);
    event RemovedPayees(address[] payees);

    using SafeMath for uint256;

    constructor(
        Payee[] memory _payees,
        address _token
    ) {
        _addPayees(_payees);
        require(_token != address(0), "Zero address: token");
        token = IERC20(_token);
    }

    function getToken() external view returns (address) {
        return address(token);
    }

    function setToken(address _token) external onlyOwner {
        require(_token != address(0), "Zero address: token");
        token = IERC20(_token);
    }

    function getTotalShare() external view returns (uint256) {
        return totalShare;
    }

    function addPayees(
        Payee[] memory _payees
    ) external {
        _addPayees(_payees);
    }

    function removePayees(
        address[] memory _payeeAddresses
    ) external onlyOwner {
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
        return 0;
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

    function split() external {
        _split();
    }

    function getTokenBalance() external view returns (uint256) {
        uint256 balance = _getTokenBalance();
        return balance;
    }

    function _getTokenBalance() internal view returns (uint256) {
        uint256 _balance = token.balanceOf(address(this));
        return _balance;
    }

    function _split() internal onlyOwner {
        uint256 _amount = _getTokenBalance();
        for (uint256 i = 0; i < payees.length; i++) {
            address payee = payees[i].payeeAddress;
            uint256 ethAmount = _amount.div(totalShare).mul(payees[i].share);
            token.transfer(payee, ethAmount); // transfer percentage share
        }
        emit SplittedEth(_amount, payees);
    }
}
