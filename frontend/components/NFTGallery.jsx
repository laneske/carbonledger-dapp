'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const NFTGallery = ({ refreshTrigger }) => {
  const [supply, setSupply] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [retirementData, setRetirementData] = useState({
    tokenId: '',
    retirementReason: ''
  });
  const [isRetiring, setIsRetiring] = useState(false);

  useEffect(() => {
    fetchTotalSupply();
  }, [refreshTrigger]);

  const fetchTotalSupply = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/supply`);
      if (response.data.success) {
        setSupply(response.data.totalSupply);
      }
    } catch (error) {
      console.error('Error fetching supply:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetire = async (e) => {
    e.preventDefault();
    if (!retirementData.tokenId || !retirementData.retirementReason) return;

    setIsRetiring(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/retire`, retirementData);
      if (response.data.success) {
        alert(`✅ Carbon credit #${retirementData.tokenId} retired successfully!`);
        setRetirementData({ tokenId: '', retirementReason: '' });
        fetchTotalSupply(); // Refresh supply
      }
    } catch (error) {
      alert(`❌ Error: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsRetiring(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Card */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-2">Carbon Credits Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold">{supply}</p>
            <p className="text-green-100">Total Minted</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold">0</p>
            <p className="text-green-100">Available</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold">0</p>
            <p className="text-green-100">Retired</p>
          </div>
        </div>
      </div>

      {/* Retirement Form */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-green-800">Retire Carbon Credit</h3>
        <form onSubmit={handleRetire} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Token ID *</label>
              <input
                type="number"
                value={retirementData.tokenId}
                onChange={(e) => setRetirementData({...retirementData, tokenId: e.target.value})}
                min="1"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter token ID to retire"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Retirement Reason *</label>
              <input
                type="text"
                value={retirementData.retirementReason}
                onChange={(e) => setRetirementData({...retirementData, retirementReason: e.target.value})}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Corporate sustainability goal"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isRetiring}
            className="w-full bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
          >
            {isRetiring ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Retiring...
              </div>
            ) : (
              '♻️ Retire Carbon Credit'
            )}
          </button>
        </form>
      </div>

      {/* Placeholder for NFT Display */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-green-800">My Carbon Credit NFTs</h3>
        <div className="text-center py-8 text-gray-500">
          <p>🎨 NFT display will appear here once integrated with Hedera Mirror Node</p>
          <p className="text-sm mt-2">Currently tracking {supply} minted carbon credits</p>
        </div>
      </div>
    </div>
  );
};

export default NFTGallery;
