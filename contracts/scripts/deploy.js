const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("🚀 Deploying CarbonCreditNFT contract to Hedera Testnet...");
  
  const CarbonCreditNFT = await ethers.getContractFactory("CarbonCreditNFT");
  const carbonCreditNFT = await CarbonCreditNFT.deploy();
  
  await carbonCreditNFT.deployed();
  
  console.log("✅ CarbonCreditNFT deployed to:", carbonCreditNFT.address);
  console.log("📝 Transaction hash:", carbonCreditNFT.deployTransaction.hash);
  
  // Save contract address for backend
  const envContent = `CONTRACT_ADDRESS=${carbonCreditNFT.address}\n`;
  fs.writeFileSync('../backend/.env.contract', envContent);
  
  console.log("💾 Contract address saved to backend/.env.contract");
  
  return carbonCreditNFT.address;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
