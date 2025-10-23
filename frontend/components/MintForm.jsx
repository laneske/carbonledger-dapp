'use client';

import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const MintForm = ({ onMintSuccess }) => {
  const [formData, setFormData] = useState({
    projectId: '',
    projectType: 'reforestation',
    certificationStandard: 'VERRA',
    vintageYear: new Date().getFullYear(),
    co2Tons: 1,
    geographicLocation: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    
    try {
      const response = await axios.post(`${API_BASE_URL}/api/mint`, {
        toAddress: '0x7298a3df6654586c1de7ef6970d038e3ba067141', // Your EVM address
        ...formData,
        metadataUri: `ipfs://carboncredit-${formData.projectId}`
      });
      
      if (response.data.success) {
        setMessage({
          type: 'success',
          text: `✅ Carbon credit minted successfully! Transaction: ${response.data.transactionId}`
        });
        onMintSuccess();
        // Reset form
        setFormData({
          projectId: '',
          projectType: 'reforestation',
          certificationStandard: 'VERRA',
          vintageYear: new Date().getFullYear(),
          co2Tons: 1,
          geographicLocation: ''
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: `❌ Error: ${error.response?.data?.error || error.message}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-green-800">Mint New Carbon Credit</h2>
      
      {message && (
        <div className={`p-4 rounded-lg mb-6 ${
          message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project ID *</label>
            <input
              type="text"
              name="projectId"
              value={formData.projectId}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter unique project identifier"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project Type *</label>
            <select
              name="projectType"
              value={formData.projectType}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="reforestation">🌳 Reforestation</option>
              <option value="renewable-energy">⚡ Renewable Energy</option>
              <option value="carbon-capture">🔬 Carbon Capture</option>
              <option value="energy-efficiency">💡 Energy Efficiency</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Certification Standard *</label>
            <select
              name="certificationStandard"
              value={formData.certificationStandard}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="VERRA">VERRA</option>
              <option value="Gold-Standard">Gold Standard</option>
              <option value="ACR">ACR</option>
              <option value="CAR">CAR</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Vintage Year</label>
            <input
              type="number"
              name="vintageYear"
              value={formData.vintageYear}
              onChange={handleChange}
              min="2000"
              max={new Date().getFullYear()}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">CO2 Tons *</label>
            <input
              type="number"
              name="co2Tons"
              value={formData.co2Tons}
              onChange={handleChange}
              min="1"
              step="0.1"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., 100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Geographic Location *</label>
            <input
              type="text"
              name="geographicLocation"
              value={formData.geographicLocation}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., Kenya, Africa"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-green-600 text-white py-4 px-6 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg transition-colors"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
              Minting Carbon Credit...
            </div>
          ) : (
            '🚀 Mint Carbon Credit NFT'
          )}
        </button>
      </form>
    </div>
  );
};

export default MintForm;
