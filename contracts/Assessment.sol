// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

//import "hardhat/console.sol";

contract Assessment {
    address payable public owner;
    uint256 public balance;
    uint public constant MAX_BALANCE = 1000;  // Maximum allowed balance 

    struct AccountInfo {
        string name;           // Name of the account holder
        address accountAddress; // address associated with the account
    }

    mapping(address => AccountInfo) public accounts; // Mapping to store account information for each address
    
    // Function to create an account with a given name
    function createAccount(string memory name) public {
        address accountAddress = msg.sender;
        
        // Check if an account already exists for the sender's address
        require(bytes(accounts[accountAddress].name).length == 0, "Account already exists");
        
        // Create a new account using the sender's address and provided name
        accounts[accountAddress] = AccountInfo(name, accountAddress);
    }

    function resetAccountName() public {
        address accountAddress = msg.sender;

        // Check if an account exists for the sender's address
        require(bytes(accounts[accountAddress].name).length > 0, "Account does not exist");

        // Reset the account name to an empty string
        accounts[accountAddress].name = "";
    }

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);

    constructor(uint initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
    }

    function getBalance() public view returns(uint256){
        return balance;
    }

    function getMaxBalance() public pure returns(uint256){
        return MAX_BALANCE;
    }

    function getCurrentAccountName() public view returns (string memory) {
        return accounts[owner].name;
    }

    modifier isOwner() {
        // make sure this is the owner
        require(msg.sender == owner, "You are not the owner of this account");
        _;
    }

    function deposit(uint256 _amount) public payable {
        uint _previousBalance = balance;

        // perform transaction
        balance += _amount;

        // assert transaction completed successfully
        assert(balance == _previousBalance + _amount);

        // emit the event
        emit Deposit(_amount);
    }

    // custom error
    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function withdraw(uint256 _withdrawAmount) public isOwner{
        uint _previousBalance = balance;
        if (balance < _withdrawAmount) {
            revert InsufficientBalance({
                balance: balance,
                withdrawAmount: _withdrawAmount
            });
        }

        // withdraw the given amount
        balance -= _withdrawAmount;

        // assert the balance is correct
        assert(balance == (_previousBalance - _withdrawAmount));

        // emit the event
        emit Withdraw(_withdrawAmount);
    }
}
