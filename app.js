let signer;
let contract;
// REMEMBER TO UPDATE THIS LINE WITH YOUR CONTRACT ADDRESS ONCE DEPLOYED:
const contractAddress = "0xYourDeployedContractAddressHere";
const contractABI = ["function transfer(address to, uint amount) returns (bool)", "function balanceOf(address account) view returns (uint256)"];
const connectBtn = document.getElementById("connectBtn");
const dashboard = document.getElementById("dashboard");
const statusText = document.getElementById("status");
connectBtn.addEventListener("click", async () => {
    if (typeof window.ethereum === "undefined") { alert("Please install MetaMask."); return; }
    try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = await provider.getSigner();
        contract = new ethers.Contract(contractAddress, contractABI, signer);
        document.getElementById("walletAddress").innerText = await signer.getAddress();
        statusText.innerText = "Status: Connected smoothly 🟢";
        connectBtn.classList.add("hidden");
        dashboard.classList.remove("hidden");
    } catch (error) {
        statusText.innerText = "Connection failed.";
    }
});
document.getElementById("sendBtn").addEventListener("click", async () => {
    const to = document.getElementById("recipient").value;
    const amount = document.getElementById("amount").value;
    const txStatus = document.getElementById("txStatus");
    if (!to || !amount) return alert("Fill in all fields");
    try {
        txStatus.innerText = "Processing securely...";
        const parsedAmount = ethers.parseUnits(amount, 18);
        const tx = await contract.transfer(to, parsedAmount);
        await tx.wait();
        txStatus.innerText = `Success! TX Hash: ${tx.hash.substring(0,10)}...`;
    } catch (error) {
        txStatus.innerText = "Transaction failed or rejected.";
    }
});
