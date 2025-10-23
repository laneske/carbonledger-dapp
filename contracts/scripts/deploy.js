const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Starting CarbonCreditNFT deployment to Hedera Testnet...");
  
  // Verify environment variables
  if (!process.env.OPERATOR_ID || !process.env.OPERATOR_PRIVATE_KEY) {
    throw new Error("❌ Missing Hedera environment variables. Check your .env file.");
  }
  
  console.log("📝 Using account:", process.env.OPERATOR_ID);
  
  const CarbonCreditNFT = await ethers.getContractFactory("CarbonCreditNFT");
  console.log("⏳ Deploying contract...");
  
  const carbonCreditNFT = await CarbonCreditNFT.deploy();
  await carbonCreditNFT.deployed();
  
  console.log("✅ CarbonCreditNFT deployed to:", carbonCreditNFT.address);
  console.log("📄 Transaction hash:", carbonCreditNFT.deployTransaction.hash);
  
  // Save contract address for backend (project root backend directory)
  const contractEnvPath = path.join(__dirname, '..', '..', 'backend', '.env.contract');
  const envContent = `CONTRACT_ADDRESS=${carbonCreditNFT.address}\n`;
  fs.writeFileSync(contractEnvPath, envContent);
  
  console.log("💾 Contract address saved to backend/.env.contract");
  console.log("🎉 Deployment completed successfully!");
  
  return carbonCreditNFT.address;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error.message);
    process.exit(1);
  });
