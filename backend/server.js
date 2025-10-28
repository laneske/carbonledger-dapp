const express = require('express');
const cors = require('cors');
require('dotenv').config();

const hederaService = require('./services/hedera');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://carbonledger.netlify.app',
    'https://*.netlify.app',
    'https://*.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Welcome route
app.get('/', (req, res) => {
  res.json({
    message: '🌱 CarbonLedger Backend API',
    version: '1.0.0',
    developer: 'Francis Mwangi',
    endpoints: {
      health: '/api/health',
      contract: '/api/contract',
      mint: '/api/mint (POST)',
      retire: '/api/retire (POST)',
      supply: '/api/supply'
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    network: process.env.HEDERA_NETWORK,
    contract: process.env.CONTRACT_ADDRESS
  });
});

// Minimal platform health endpoint (some hosts expect a simple 200 at /healthz)
app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

// Get contract info
app.get('/api/contract', (req, res) => {
  res.json({
    address: process.env.CONTRACT_ADDRESS,
    network: process.env.HEDERA_NETWORK,
    operatorId: process.env.OPERATOR_ID
  });
});

// Get total supply
app.get('/api/supply', async (req, res) => {
  try {
    const result = await hederaService.getTotalSupply();
    
    if (result.success) {
      res.json({
        success: true,
        totalSupply: result.totalSupply.toString()
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Mint a new carbon credit
app.post('/api/mint', async (req, res) => {
  try {
    const {
      toAddress,
      projectId,
      projectType = 'reforestation',
      certificationStandard = 'VERRA',
      vintageYear,
      co2Tons,
      geographicLocation,
      metadataUri = 'ipfs://placeholder'
    } = req.body;

    // Validate required fields
    if (!toAddress || !projectId || !co2Tons || !geographicLocation) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: toAddress, projectId, co2Tons, geographicLocation'
      });
    }

    console.log(`🔄 Received mint request for project: ${projectId}`);

    const result = await hederaService.mintCarbonCredit({
      toAddress,
      projectId,
      projectType,
      certificationStandard,
      vintageYear: vintageYear || new Date().getFullYear(),
      co2Tons,
      geographicLocation,
      metadataUri
    });

    if (result.success) {
      res.json({
        success: true,
        transactionId: result.transactionId,
        message: 'Carbon credit minted successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Mint error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Retire a carbon credit
app.post('/api/retire', async (req, res) => {
  try {
    const { tokenId, retirementReason } = req.body;

    if (!tokenId || !retirementReason) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: tokenId, retirementReason'
      });
    }

    console.log(`🔄 Retiring token #${tokenId}`);

    const result = await hederaService.retireCarbonCredit(tokenId, retirementReason);

    if (result.success) {
      res.json({
        success: true,
        transactionId: result.transactionId,
        message: 'Carbon credit retired successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Retire error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🌱 CarbonLedger Backend Server running on port ${PORT}`);
  console.log(`🔗 Contract: ${process.env.CONTRACT_ADDRESS}`);
  console.log(`🌐 Network: ${process.env.HEDERA_NETWORK}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
});
