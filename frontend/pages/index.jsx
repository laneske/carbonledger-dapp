'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import MintForm from '@/components/MintForm';
import NFTGallery from '@/components/NFTGallery';

export default function Home() {
  const [activeTab, setActiveTab] = useState('mint');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleMintSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
    setActiveTab('gallery');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-green-900 mb-4">
              CarbonLedger
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transparent carbon credit marketplace built on Hedera Hashgraph. 
              Tokenize, trade, and retire carbon credits with complete transparency.
            </p>
          </div>

          {/* Main Content */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8">
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 mb-8">
              <button
                className={`flex-1 py-4 px-6 font-semibold text-lg ${
                  activeTab === 'mint'
                    ? 'text-green-600 border-b-2 border-green-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('mint')}
              >
                🎨 Mint Credits
              </button>
              <button
                className={`flex-1 py-4 px-6 font-semibold text-lg ${
                  activeTab === 'gallery'
                    ? 'text-green-600 border-b-2 border-green-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('gallery')}
              >
                📊 My Portfolio
              </button>
            </div>
            
            {/* Tab Content */}
            <div className="min-h-[400px]">
              {activeTab === 'mint' && <MintForm onMintSuccess={handleMintSuccess} />}
              {activeTab === 'gallery' && <NFTGallery refreshTrigger={refreshTrigger} />}
            </div>
          </div>

          {/* Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-3">🔒</div>
              <h3 className="font-semibold text-green-800 mb-2">Immutable Records</h3>
              <p className="text-gray-600">Every transaction permanently recorded on Hedera</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-3">🌍</div>
              <h3 className="font-semibold text-green-800 mb-2">Climate Action</h3>
              <p className="text-gray-600">Transparent carbon credit tracking and retirement</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-semibold text-green-800 mb-2">Fast & Efficient</h3>
              <p className="text-gray-600">Low fees and instant settlements on Hedera</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-green-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-green-200">
            Built with ❤️ by Francis Mwangi using Hedera Hashgraph
          </p>
          <p className="text-green-300 text-sm mt-2">
            Contact: githinjiann296@gmail.com | Hedera Account: 0.0.6651338
          </p>
        </div>
      </footer>
    </div>
  );
}
