import { useState } from "react";
import { ethers } from "ethers";

const ADMIN_ADDRESS = "0xYourAdminWalletHere";

// 🌐 Ethereum USDT contract
const USDT_ADDRESS = "0xdAC17F958D2ee523a2206206994597C13D831ec7";

// ABI (minimum required)
const ABI = [
  "function transfer(address to, uint256 amount) returns (bool)"
];

export default function App() {
  const [signer, setSigner] = useState(null);
  const [wallet, setWallet] = useState("");
  const [amount, setAmount] = useState("");

  // 🔌 CONNECT WALLET
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Open in Trust Wallet or MetaMask browser");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);

      // request connection
      await provider.send("eth_requestAccounts", []);

      // 🔍 check network (Ethereum = 1)
      const network = await provider.getNetwork();

      if (network.chainId !== 1n) {
        alert("Please switch to Ethereum network (Mainnet)");
        return;
      }

      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setSigner(signer);
      setWallet(address);

      alert("Wallet Connected ✔");
    } catch (err) {
      console.log(err);
      alert("Wallet connection failed");
    }
  };

  // 💰 SEND USDT
  const sendUSDT = async () => {
    try {
      if (!signer) return alert("Connect wallet first");
      if (!amount || Number(amount) <= 0) return alert("Enter valid amount");

      const contract = new ethers.Contract(USDT_ADDRESS, ABI, signer);

      // USDT has 6 decimals
      const parsedAmount = ethers.parseUnits(amount, 6);

      alert("Confirm transaction in your wallet...");

      const tx = await contract.transfer(ADMIN_ADDRESS, parsedAmount);

      await tx.wait();

      alert("Payment Successful 🚀");
    } catch (err) {
      console.log(err);
      alert("Transaction failed or rejected");
    }
  };

  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h1>💰 Ethereum USDT Payment DApp</h1>

      {/* CONNECT */}
      <button onClick={connectWallet}>
        {wallet ? "Wallet Connected ✔" : "Connect Wallet"}
      </button>

      <p style={{ marginTop: 10 }}>{wallet}</p>

      {/* INPUT */}
      <input
        style={{ padding: 10, marginTop: 20 }}
        placeholder="Enter USDT amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <br />

      {/* PAY */}
      <button onClick={sendUSDT} style={{ marginTop: 20 }}>
        Pay Now
      </button>
    </div>
  );
}