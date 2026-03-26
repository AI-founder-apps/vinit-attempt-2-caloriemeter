"use client";

import React, { useState } from 'react';
import Navbar from './Navbar';
import FoodScanner from './FoodScanner';
import History from './History';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'scan' | 'history'>('scan');

  return (
    <div className="min-h-screen">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        {activeTab === 'scan' ? (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold gradient-text mb-2">
                What are you eating? 🍽️
              </h2>
              <p className="text-gray-400">
                Upload a food photo and get instant nutritional insights
              </p>
            </div>
            <FoodScanner />
          </div>
        ) : (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold gradient-text mb-2">
                Your Food Journal 📋
              </h2>
              <p className="text-gray-400">
                Track your nutrition journey over time
              </p>
            </div>
            <History />
          </div>
        )}
      </main>
    </div>
  );
}