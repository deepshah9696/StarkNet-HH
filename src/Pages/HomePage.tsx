/** @format */

import {useState, useCallback } from 'react';
import { Dialog } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import React from 'react'
import Web3Modal from 'web3modal';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { IDKitWidget,  ISuccessResult, CredentialType } from '@worldcoin/idkit';
import { BigNumber, ethers } from 'ethers';
import { decode } from './wld.ts';
const navigation = [
  { name: 'Set Preferences', href: '/preferences' },
  { name: 'Send Assets', href: '/assets' },
];
const abi =[
	{
		"inputs": [
			{
				"internalType": "contract IWorldID",
				"name": "_worldId",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "_appId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_actionId",
				"type": "string"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "InvalidNullifier",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "signal",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "root",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "nullifierHash",
				"type": "uint256"
			},
			{
				"internalType": "uint256[8]",
				"name": "proof",
				"type": "uint256[8]"
			}
		],
		"name": "verifyAndExecute",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]
const Contractaddress = '0xA6488CB7BBd8Cc3F4a7081e2c375579AAE1814FB';
const web3Modal = new Web3Modal();
const connection = await web3Modal.connect();
const provider = new ethers.providers.Web3Provider(connection);
const signer = await provider.getSigner();
const address = await signer.getAddress();
const contract = new ethers.Contract(Contractaddress, abi, signer);
export default function HomePage({ pageContents: Content }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hideWorldCoin, setHideWorldCoin] = useState(false);
  const [proof, setProof] = useState<ISuccessResult | null>(null)
  const { open } = useWeb3Modal();
  // const handleProof = useCallback((result) => {
  //   return new ((resolve) => {
  //     console.log('The result after verification is : ', result);
  //     setTimeout(() => {
  //       resolve();
  //     }, 1000);
  //     // NOTE: Example of how to decline the verification request and show an error message to the user
  //   })();
  // }, []);
  const handleProof = (result) => {
    setProof(result);
    console.log(result);
  };
  const onSuccess = async () => {
    await contract.verifyAndExecute(
      address,
      proof?.merkle_root
        ? decode < BigNumber > ('uint256', proof?.merkle_root ?? '')
        : BigNumber.from(0),
      proof?.nullifier_hash
        ? decode < BigNumber > ('uint256', proof?.nullifier_hash ?? '')
        : BigNumber.from(0),
      proof?.proof
        ? decode <
            [
              BigNumber,
              BigNumber,
              BigNumber,
              BigNumber,
              BigNumber,
              BigNumber,
              BigNumber,
              BigNumber,
            ] >
            ('uint256[8]', proof?.proof ?? '')
        : [
            BigNumber.from(0),
            BigNumber.from(0),
            BigNumber.from(0),
            BigNumber.from(0),
            BigNumber.from(0),
            BigNumber.from(0),
            BigNumber.from(0),
            BigNumber.from(0),
          ]
    );
    setHideWorldCoin(true);
    
  };
  return (
    <div className="bg-white">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav
          className="flex items-center justify-between p-6 lg:px-8"
          aria-label="Global">
          <div className="flex lg:flex-1">
            <a
              href="#"
              className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img
                className="h-8 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                alt=""
              />
            </a>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}>
              <span className="sr-only">Open main menu</span>
              <Bars3Icon
                className="h-6 w-6"
                aria-hidden="true"
              />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-semibold leading-6 text-gray-900">
                {item.name}
              </a>
            ))}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            {!hideWorldCoin && (
              <div className="flex self-center">
                <IDKitWidget
                  action="my_action"
                  signal={address}
                  onSuccess={onSuccess}
                  credential_types={[CredentialType.Orb]}
                  handleVerify={handleProof}
                  app_id="app_staging_0b150dd450c76fcaa2d8b4c21ac9ec32">
                  {({ open }) => (
                    <button
                      style={{
                        marginRight: '30px',
                        border: '1px solid #000', // Replace #000 with your desired border color
                        padding: '10px 20px', // Add some padding to make the button look better
                        borderRadius: '5px', // Optionally, add some border-radius for rounded corners
                      }}
                      className="btn btn-primary btn-sm text-black"
                      onClick={open}>
                      Connect with world coin
                    </button>
                  )}
                </IDKitWidget>
              </div>
            )}
            <w3m-button />
          </div>
        </nav>
        <Dialog
          as="div"
          className="lg:hidden"
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}>
          <div className="fixed inset-0 z-50" />
          <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <a
                href="#"
                className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <img
                  className="h-8 w-auto"
                  src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                  alt=""
                />
              </a>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}>
                <span className="sr-only">Close menu</span>
                <XMarkIcon
                  className="h-6 w-6"
                  aria-hidden="true"
                />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                      {item.name}
                    </a>
                  ))}
                </div>
                <div className="py-6">
                  <a
                    href="#"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                    Log in
                  </a>
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
      </header>

      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true">
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#315bf4] to-[#28777b] opacity-50 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
        <Content />
        <div
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          aria-hidden="true">
          <div
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#50eeff] to-[#08dcf4] opacity-50 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
