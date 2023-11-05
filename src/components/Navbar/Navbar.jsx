import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './Navbar.css';
import { useNavigate } from 'react-router-dom'; 

function formatAddress(address) {
  if (address && address.length > 10) {
    const start = address.substring(0, 6);
    const end = address.substring(address.length - 4);
    return `${start}......${end}`;
  }
  return address;
}

function Navbar() {
  const [walletAddress, setWalletAddress] = useState('');
  const [walletConnected, setWalletConnected] = useState(false);
  
  const [value,setValue] = useState('')
  const navigate = useNavigate();

  useEffect(()=>{
    const walletAddress = localStorage.getItem('walletAddress');
    
    setValue(walletAddress);
    if (walletAddress!=='') {
      navigate('/panel');
    }else{
      navigate('/');
    }
  },[walletAddress])

  useEffect(() => {
    checkIfWalletConnected();
  }, []);

  async function requestAccount() {
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      setWalletAddress(accounts[0]);
      setWalletConnected(true);
      localStorage.setItem('walletAddress', walletAddress);
      navigate('/panel');
    } catch (error) {
      console.error('Error connecting:', error);
      setWalletConnected(false); // Update walletConnected state on error
    }
  }

  async function checkIfWalletConnected() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_accounts',
        });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setWalletConnected(true);
          localStorage.setItem('walletAddress', walletAddress);
          navigate('/panel');
        }
      } catch (error) {
        console.error('Error checking connection:', error);
        setWalletConnected(false); // Update walletConnected state on error
        localStorage.setItem('walletAddress', '');
      }
    }
  }

  function logout() {
    setWalletConnected(false);
    setWalletAddress(''); 
    localStorage.setItem('walletAddress', '');
  }

  return (
    <div className="App">
      <nav className="navbar">
        <div className="logo">MedAI</div>
        {walletConnected ? (
          <div className="user-info">
            <div className="user-avatar">
              <img src="https://pbs.twimg.com/media/E6MnxVsXIAMmTv6.png" alt="User Avatar" />
            </div>
            <div className="user-name">Welcome {formatAddress(walletAddress)}</div>
            <button className="logout-button" onClick={logout}>
              Logout
            </button>
          </div>
        ) : (
          <button onClick={requestAccount} className="wallet-button">
            Request Wallet
          </button>
        )}
      </nav>
    </div>
  );
}

export default Navbar;
