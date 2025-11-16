const {
  Client,
  PrivateKey,
  ContractExecuteTransaction,
  ContractFunctionParameters,
  Hbar,
  ContractCallQuery,
} = require("@hashgraph/sdk");
require("dotenv").config();

// Lazy-load Hedera client to avoid startup failure if env vars are missing
let client = null;
let initialized = false;

function initializeHedera() {
  if (initialized) return;
  
  try {
    if (!process.env.OPERATOR_PRIVATE_KEY || !process.env.OPERATOR_ID) {
      console.warn("⚠️  Hedera env vars not set (OPERATOR_PRIVATE_KEY, OPERATOR_ID). Service will not execute transactions.");
      initialized = true;
      return;
    }
    
    client = Client.forTestnet();
    const operatorPrivateKey = PrivateKey.fromStringECDSA(process.env.OPERATOR_PRIVATE_KEY);
    client.setOperator(process.env.OPERATOR_ID, operatorPrivateKey);
    initialized = true;
    console.log("✅ Hedera client initialized successfully");
  } catch (error) {
    console.error("❌ Failed to initialize Hedera client:", error.message);
    console.warn("⚠️  Service will respond but Hedera operations will fail. Check your OPERATOR_PRIVATE_KEY and OPERATOR_ID.");
    initialized = true;
  }
}

class HederaService {
  constructor() {
    this.contractId = process.env.CONTRACT_ADDRESS;
    console.log(`🔗 Hedera Service: contract ${this.contractId || "(not set)"}`);
  }

  // Execute contract function
  async executeContractFunction(functionName, parameters, value = 0) {
    initializeHedera(); // Ensure client is initialized
    
    if (!client) {
      return { success: false, error: "Hedera client not initialized. Check OPERATOR_PRIVATE_KEY and OPERATOR_ID in environment." };
    }
    
    try {
      console.log(`📝 Executing ${functionName} on contract ${this.contractId}`);
      
      const transaction = new ContractExecuteTransaction()
        .setContractId(this.contractId)
        .setGas(1000000)
        .setFunction(functionName, parameters)
        .setMaxTransactionFee(new Hbar(2));

      const txResponse = await transaction.execute(client);
      const receipt = await txResponse.getReceipt(client);
      
      console.log(`✅ ${functionName} executed successfully. TX: ${receipt.transactionId.toString()}`);
      return { success: true, receipt, transactionId: receipt.transactionId.toString() };
    } catch (error) {
      console.error(`❌ Error executing ${functionName}:`, error);
      return { success: false, error: error.message };
    }
  }

  // Query contract function
  async queryContractFunction(functionName, parameters) {
    initializeHedera(); // Ensure client is initialized
    
    if (!client) {
      return { success: false, error: "Hedera client not initialized. Check OPERATOR_PRIVATE_KEY and OPERATOR_ID in environment." };
    }
    
    try {
      const query = new ContractCallQuery()
        .setContractId(this.contractId)
        .setGas(100000)
        .setFunction(functionName, parameters);

      const response = await query.execute(client);
      return { success: true, response };
    } catch (error) {
      console.error(`❌ Error querying ${functionName}:`, error);
      return { success: false, error: error.message };
    }
  }

  // Mint a new carbon credit NFT
  async mintCarbonCredit(creditData) {
    const {
      toAddress,
      projectId,
      projectType,
      certificationStandard,
      vintageYear,
      co2Tons,
      geographicLocation,
      metadataUri
    } = creditData;

    console.log(`🔄 Minting carbon credit for project: ${projectId}`);

    const parameters = new ContractFunctionParameters()
      .addAddress(toAddress)
      .addString(projectId)
      .addString(projectType)
      .addString(certificationStandard)
      .addUint256(vintageYear)
      .addUint256(co2Tons)
      .addString(geographicLocation)
      .addString(metadataUri);

    return await this.executeContractFunction("mintCarbonCredit", parameters);
  }

  // Retire a carbon credit
  async retireCarbonCredit(tokenId, retirementReason) {
    console.log(`🔄 Retiring carbon credit #${tokenId}`);

    const parameters = new ContractFunctionParameters()
      .addUint256(tokenId)
      .addString(retirementReason);

    return await this.executeContractFunction("retireCarbonCredit", parameters);
  }

  // Get total supply of carbon credits
  async getTotalSupply() {
    const result = await this.queryContractFunction("totalSupply", new ContractFunctionParameters());
    
    if (result.success) {
      return { success: true, totalSupply: result.response.getUint256() };
    }
    return result;
  }
}

module.exports = new HederaService();
