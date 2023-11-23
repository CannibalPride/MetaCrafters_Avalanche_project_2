import {useState, useEffect} from "react";
import {ethers} from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [maxBalance, setMaxBalance] = useState(undefined);
  const [currentName, setCurrentName] = useState('');
  const [newName, setNewName] = useState('');

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async() => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({method: "eth_accounts"});
      handleAccount(account);
    }
  }

  const handleAccount = (account) => {
    if (account) {
      console.log ("Account connected: ", account);
      setAccount(account);
    }
    else {
      console.log("No account found");
    }
  }

  const connectAccount = async() => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }
  
    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);
    
    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);
 
    setATM(atmContract);
  }

  const getBalance = async() => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  }

  const getMaxBalance = async() => {
    if (atm) {
      setMaxBalance((await atm.getMaxBalance()).toNumber());
    }
  }

  const getCurrentName = async() => {
    if (atm) {
      setCurrentName((await atm.getCurrentAccountName()));
    }
  }

  const createAccount = async(name) => {
    if (atm) {
      await atm.createAccount(name);
      getCurrentName();
    }
  }

  const resetAccountName = async() => {
    if (atm) {
      await atm.resetAccountName();
      getCurrentName();
    }
  }

  const deposit = async() => {
    if (atm) {
      let tx = await atm.deposit(1);
      await tx.wait()
      getBalance();
    }
  }

  const withdraw = async() => {
    if (atm) {
      let tx = await atm.withdraw(1);
      await tx.wait()
      getBalance();
    }
  }

  const initUser = () => {
    const renderSetAccountNameSection = () => {
      return (
        <div>
          Set your name here:
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Enter your account name"
          />
          <button onClick={() => createAccount(newName)}>Create Account</button>
        </div>
      );
    }

    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button onClick={connectAccount}>Please connect your Metamask wallet</button>
    }

    if (balance == undefined) {
      getBalance();
    }
    getCurrentName();
    getMaxBalance();

    if (!currentName) {
      return (
        <div>
          <p>Your Account: {account}</p>
          <p>Your Balance: {balance}</p>
          <p>Max Balance: {maxBalance} ETH</p>
          <p>{renderSetAccountNameSection()}</p>
          <button onClick={deposit}>Deposit 1 ETH</button>
          <button onClick={withdraw}>Withdraw 1 ETH</button>
          <hr />
          <button onClick={initUser}>Refresh</button>
        </div>
      );
    }
  
    // User has a name set, display it along with max balance
    return (
      <div>
        <p>Hello, {currentName}!</p>
        <p>Your Address: {account}</p>
        <p>Your Balance: {balance}</p>
        <p>Max Balance: {maxBalance} ETH</p>
        <button onClick={() => resetAccountName()}>Reset Name</button>
        <button onClick={deposit}>Deposit 1 ETH</button>
        <button onClick={withdraw}>Withdraw 1 ETH</button>
        <hr />
        <button onClick={initUser}>Refresh</button>
      </div>
    );
  }

  useEffect(() => {getWallet();}, []);

  return (
    <main className="container">
      <header><h1>Welcome to the Metacrafters ATM!</h1></header>
      {initUser()}
      <style jsx>{`
      .container {
        text-align: center;
        max-width: 600px;
        margin: auto;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 8px;
        background-color: #f9f9f9;
      }

      input[type="text"] {
        padding: 8px;
        margin: 10px 0;
        border: 1px solid #ddd;
        border-radius: 4px;
      }

      button {
        background-color: #4CAF50; /* Green */
        border: none;
        color: white;
        padding: 10px 15px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        margin: 4px 2px;
        cursor: pointer;
        border-radius: 4px;
      }

      button:hover {
        background-color: #45a049;
      }

      p {
        font-size: 1.1rem;
      }
    `}
    </style>
    </main>
  )
}
