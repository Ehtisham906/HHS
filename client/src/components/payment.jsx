import React, { useState, useEffect } from 'react';
import {Web3} from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import PaymentContract from '../../../build/contracts/PaymentContract.json'; // Add your contract's ABI JSON here

const Payment = () => {
  const [account, setAccount] = useState('');
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [error, setError] = useState('');
  const [contractBalance, setContractBalance] = useState('0');

  const contractAddress = "0xdD885fC28c5c7538e28b3Bf0AB0607Ea7f185a37"; // Replace with your contract address

  useEffect(() => {
    const connectWallet = async () => {
      const provider = await detectEthereumProvider();

      if (provider) {
        const web3Instance = new Web3(provider);
        setWeb3(web3Instance);

        try {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          setAccount(accounts[0]);

          // Load the contract
          const contractInstance = new web3Instance.eth.Contract(PaymentContract.abi, contractAddress);
          setContract(contractInstance);

          // Get contract balance
          const balance = await contractInstance.methods.getBalance().call();
          setContractBalance(web3Instance.utils.fromWei(balance, 'ether'));
        } catch (err) {
          setError('Error connecting to wallet');
        }
      } else {
        setError('Please install MetaMask');
      }
    };

    connectWallet();
  }, []);

  const handlePayment = async () => {
    if (!web3 || !contract) return;

    try {
      const transaction = {
        from: account,
        value: web3.utils.toWei('0.01', 'ether'), // Payment amount in Ether
        gas: 30000,
      };

      // Interact with the smart contract 'pay' function
      await contract.methods.pay().send(transaction);
      alert('Payment successful');

      // Update contract balance
      const balance = await contract.methods.getBalance().call();
      setContractBalance(web3.utils.fromWei(balance, 'ether'));
    } catch (error) {
      console.error(error);
      alert('Payment failed');
    }
  };

  const handleWithdraw = async () => {
    if (!web3 || !contract) return;

    try {
      await contract.methods.withdraw().send({ from: account });
      alert('Withdrawal successful');

      // Update contract balance
      const balance = await contract.methods.getBalance().call();
      setContractBalance(web3.utils.fromWei(balance, 'ether'));
    } catch (error) {
      console.error(error);
      alert('Withdrawal failed');
    }
  };

  return (
    <div>
      <h1>Blockchain Payment</h1>
      {account ? (
        <div>
          <p>Connected Wallet: {account}</p>
          <p>Contract Balance: {contractBalance} ETH</p>
          <button onClick={handlePayment}>Pay with Ethereum</button>
          <button onClick={handleWithdraw}>Withdraw Funds</button>
        </div>
      ) : (
        <p>{error || 'Connecting to wallet...'}</p>
      )}
    </div>
  );
};

export default Payment;
