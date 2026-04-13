import { useState } from "react";
import { ethers } from "ethers";

const ADMIN_ADDRESS = "0xYourAdminWalletHere";

// ⚠️ USDT (BSC example - change if needed)
const USDT_ADDRESS = "0x55d398326f99059fF775485246999027B3197955";

const ABI = [
  "function transfer(address to, uint amount) returns (bool)"
];

export default function App() {
  const [signer, setSigner] = useState(null);
  const [wallet, setWallet] = useState("");
  const [amount, setAmount] = useState("");

  // 🔌 CONNECT WALLET
const connectWallet = async () => {
  try {
    if (!window.ethereum) {
      alert("Open in Trust Wallet / MetaMask");
      return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);

    // 🔥 CHECK NETWORK (BSC = 56)
    const network = await provider.getNetwork();
    if (network.chainId !== 56n) {
      alert("Please switch to BSC Network");
      return;
    }

    const s = await provider.getSigner();
    const address = await s.getAddress();

    setSigner(s);
    setWallet(address);

    alert("Wallet Connected ✔");
  } catch (err) {
    console.log(err);
    alert("Connection failed");
  }
};

  // 💰 SEND USDT
  const pay = async () => {
    try {
      if (!signer) return alert("Connect wallet first");
      if (!amount || Number(amount) <= 0) return alert("Enter valid amount");

      const contract = new ethers.Contract(USDT_ADDRESS, ABI, signer);

      const parsedAmount = ethers.parseUnits(amount, 6); // USDT = 6 decimals

      const tx = await contract.transfer(ADMIN_ADDRESS, parsedAmount);

      alert("Transaction sent... confirm in wallet");

      await tx.wait();

      alert("Payment Successful 🚀");
    } catch (err) {
      console.log(err);
      alert("Transaction rejected or failed");
    }
  };

  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h1>💰 USDT Payment DApp</h1>

      <button onClick={connectWallet}>
        {wallet ? "Wallet Connected" : "Connect Wallet"}
      </button>

      <p style={{ marginTop: 10 }}>{wallet}</p>

      <input
        style={{ padding: 10, marginTop: 20 }}
        placeholder="Enter USDT amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <br />

      <button onClick={pay} style={{ marginTop: 20 }}>
        Pay Now
      </button>
    </div>
  );
}