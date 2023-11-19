/** @format */

import ethers from 'ethers';
const contractABI = [
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'num',
        type: 'uint256',
      },
    ],
    name: 'store',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
const contractAddress = '0xa540b5061908b2a2a873c0000ed3882718b32c23';
const privateKey =
  '32ba4b61b6faf511b67dadb108513cc1e4a68bb73a06f505e479344a5fb9f7e3';
const provider = new ethers.providers.JsonRpcProvider(
  'https://devnet.neonevm.org'
);
let number = 300;
const wallet = new ethers.Wallet(privateKey, provider);

const contract = new ethers.Contract(contractAddress, contractABI, wallet);

async function counter() {
  for (var i = 0; i < 10000000; i++) {
    //const nonce = await wallet.getTransactionCount();

    //console.log(nonce);
    number = number + 50;
    const customGasPrice = ethers.utils.parseUnits(`${number}`, 'gwei');
    console.log(customGasPrice);
    console.log('hey');
    let tx = await contract.store(5, {
      gasPrice: customGasPrice,
    });
    await tx.wait();
  }
}
counter();
