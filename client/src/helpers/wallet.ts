import Web3Modal from 'web3modal';
import Web3 from 'web3';
import { provider } from 'web3-core';

class Wallet {
  web3Modal: Web3Modal;

  web3: Web3;

  constructor() {
    this.web3Modal = new Web3Modal({
      network: 'mainnet',
      cacheProvider: true,
    });
    this.web3 = new Web3(window.ethereum);
  }

  async connect(): Promise<[string, provider]> {
    const ethProvider = await this.web3Modal.connect();
    const addresses = await ethProvider.enable();
    const address = addresses[0];

    window.localStorage.setItem('connected', 'true');
    return [address, ethProvider];
  }

  disconnect(): void {
    this.web3Modal.clearCachedProvider();
    window.localStorage.removeItem('connected');
  }

  async getAddress(): Promise<string> {
    const accounts = await this.web3.eth.getAccounts();
    return accounts[0] || '';
  }

  getProvider(): provider {
    return this.web3.currentProvider;
  }

  async getIsConnected(): Promise<boolean> {
    const connected = window.localStorage.getItem('connected');
    if (!connected) return false;

    const accounts = await this.web3.eth.getAccounts();
    return accounts.length > 0;
  }
}

const wallet = new Wallet();

export default wallet;
