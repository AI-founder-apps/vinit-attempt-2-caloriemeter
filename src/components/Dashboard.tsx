"use client";

import React, { useState } from 'react';
import Navbar from './Navbar';
import FoodScanner from './FoodScanner';
import History from './History';

const dashFoods = [
  { emoji: '🥗', top: '12%', left: '1%', delay: '0s', duration: '9s', sizeRem: '3.5rem' },
  { emoji: '🍕', top: '35%', left: '0%', delay: '2s', duration: '7s', sizeRem: '3rem' },
  { emoji: '🌮', top: '58%', left: '2%', delay: '1s', duration: '8s', sizeRem: '3.5rem' },
  { emoji: '🍔', top: '80%', left: '1%', delay: '3s', duration: '10s', sizeRem: '3rem' },
  { emoji: '🥤', top: '15%', right: '1%', delay: '1.5s', duration: '8s', sizeRem: '3rem' },
  { emoji: '🍰', top: '40%', right: '0%', delay: '0.5s', duration: '9s', sizeRem: '3.5rem' },
  { emoji: '🧁', top: '63%', right: '2%', delay: '2.5s', duration: '7s', sizeRem: '3rem' },
  { emoji: '🍜', top: '85%', right: '1%', delay: '3.5s', duration: '10s', sizeRem: '3.5rem' },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'scan' | 'history'>('scan');

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Subtle floating foods on dashboard - bigger & brighter */}
      {dashFoods.map((food, i) => (
        <div
          key={i}
          className="fixed pointer-events-none select-none dash-food-float hidden lg:block"
          style={{
            top: food.top,
            left: (food as any).left,
            right: (food as any).right,
            animationDelay: food.delay,
            animationDuration: food.duration,
            fontSize: food.sizeRem,
            lineHeight: 1,
            opacity: 0.4,
            filter: 'saturate(1.4) brightness(1.1)',
          } as React.CSSProperties}
        >
          {food.emoji}
        </div>
      ))}

      {/* Decorative gradient blobs */}
      <div className="fixed top-20 left-0 w-64 h-64 bg-pink-200 opacity-10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-72 h-72 bg-purple-200 opacity-10 rounded-full blur-3xl pointer-events-none" />

      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="max-w-4xl mx-auto px-4 py-8 relative z-10">
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
