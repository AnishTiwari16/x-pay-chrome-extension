import Web3 from 'web3';

export default class EthereumRpc {
  constructor(provider) {
    this.provider = provider;
  }

  async getChainId() {
    try {
      const web3 = new Web3(this.provider);
      const chainId = await web3.eth.getChainId();
      return chainId.toString();
    } catch (error) {
      return error;
    }
  }

  async getAccounts() {
    try {
      const web3 = new Web3(this.provider);
      const address = await web3.eth.getAccounts();
      return address;
    } catch (error) {
      return error;
    }
  }

  async getBalance() {
    try {
      const web3 = new Web3(this.provider);
      const address = (await web3.eth.getAccounts())[0];
      const balance = web3.utils.fromWei(
        await web3.eth.getBalance(address),
        'ether'
      );
      return balance;
    } catch (error) {
      return error;
    }
  }

  async sendTransaction() {
    try {
      const web3 = new Web3(this.provider);
      const fromAddress = (await web3.eth.getAccounts())[0];
      const destination = fromAddress;

      const req = await fetch(
        'https://7866-129-126-214-63.ngrok-free.app/api/contracts/txn-data',
        {
          method: 'POST',
          body: JSON.stringify({
            id: '66e6dae092e5dd1952968734',
            functionName: 'increment',
            signerAddress: fromAddress,
            args: [],
          }),
        }
      );
      const res = await req.json();
      console.log(res, 'Res');
      // const amount = web3.utils.toWei('0.001', 'ether');
      // let transaction = {
      //   from: fromAddress,
      //   to: destination,
      //   data: '0x',
      //   value: amount,
      // };
      // transaction = {
      //   ...transaction,
      //   gas: await web3.eth.estimateGas(transaction),
      // };
      // const receipt = await web3.eth.sendTransaction(transaction);
      // return this.toStringJson(receipt);
    } catch (error) {
      return error;
    }
  }

  async signMessage() {
    try {
      const web3 = new Web3(this.provider);
      const fromAddress = (await web3.eth.getAccounts())[0];
      const originalMessage = 'YOUR_MESSAGE';
      const signedMessage = await web3.eth.personal.sign(
        originalMessage,
        fromAddress,
        'test password!'
      );
      return signedMessage;
    } catch (error) {
      return error;
    }
  }

  async getPrivateKey() {
    try {
      const privateKey = await this.provider.request({
        method: 'eth_private_key',
      });
      return privateKey;
    } catch (error) {
      return error;
    }
  }

  toStringJson(data) {
    return JSON.parse(
      JSON.stringify(data, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      )
    );
  }
}
