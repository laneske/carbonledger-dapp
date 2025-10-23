'use client';

import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-green-800 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <span className="text-green-800 font-bold text-lg">C</span>
          </div>
          <div>
            <h1 className="text-xl font-bold">CarbonLedger</h1>
            <p className="text-green-200 text-sm">by Francis Mwangi</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="text-green-200">Hedera Testnet</span>
          <button className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition-colors font-medium">
            Connect Wallet
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
