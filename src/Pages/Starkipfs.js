/** @format */

import React, { useState } from "react";
import { create } from "ipfs-http-client";
import { NFTStorage, Blob } from "nft.storage";
import { Provider, constants, Contract, Account, ec, json } from "starknet";
import { Buffer } from "buffer";

window.Buffer = Buffer;
const NFT_STORAGE_TOKEN = "your-api-token";
const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });
const myAddress =
  "0x014cA059A8C20C9FcDE765765df3fA1844207B3d00E381beDE498EF544Cb019a";
const pvtKey =
  "0x0364072c6e86813ea19535ae62923d5554f3c361a77f7c7f7ad9e920d9e89320";
const IPFSUploader = () => {
  const [ipfs, setIpfs] = useState(null);
  const [hash, setHash] = useState("");
  const [fileBuffer, setFileBuffer] = useState(null);
  const [articleContent, setArticleContent] = useState("");

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // You can perform any action with the articleContent, e.g., store it, send it to an API, etc.
    console.log("Article content submitted:", articleContent);
  };
  const projectId = "2MCR81xh4vPrqI0y4SQtv09NTnb";
  const projectSecret = "1db9edb0249dd358814ccfd8f9dfc26d";
  const auth =
    "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");
  const client = create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    apiPath: "/api/v0",
    headers: {
      authorization: auth,
    },
  });

  async function storeOnStarknet() {
    const provider = new Provider({
      rpc: { nodeUrl: "https://free-rpc.nethermind.io/goerli-juno" },
    });
    const account0 = new Account(provider, myAddress, pvtKey);
    // Connect the deployed Test contract in Testnet
    const testAddress =
      "0xb111e57e58e595bc45efcbd38cb1aaec0b5ac1220df25a1b94e570a05633c2";

    // read abi of Test contract
    const { abi: testAbi } = await provider.getClassAt(testAddress);
    if (testAbi === undefined) {
      throw new Error("no abi.");
    }
    const myTestContract = new Contract(testAbi, testAddress, provider);
    myTestContract.connect(account0);
    // Call the store function of Test contract
    const myCall = myTestContract.populate("increase", [20]);
    const tx = await myTestContract.increase(myCall.calldata);
    console.log(tx);
  }
  async function onChange(e) {
    const file = e.target.files[0];
    try {
      const added = await client.add(file);
      const url = `https://polybase.infura-ipfs.io/ipfs/${added.path}`;
      setIpfs(url);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-md shadow-md">
      <h1 className="text-2xl font-bold mb-4">Create Article</h1>
      <form onSubmit={handleSubmit}>
        <label className="block mb-4">
          <span className="text-gray-700">Article Content:</span>
          <textarea
            className="form-input mt-1 block w-full rounded-md border-gray-300"
            value={articleContent}
            onChange={(e) => setArticleContent(e.target.value)}
            rows={5}
            placeholder="Enter your article content here..."
          />
        </label>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default IPFSUploader;
