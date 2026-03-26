"use client";

import React from 'react';
import { useAuth } from '@/context/AuthContext';

interface NavbarProps {
  activeTab: 'scan' | 'history';
  onTabChange: (tab: 'scan' | 'history') => void;
}

export default function Navbar({ activeTab, onTabChange }: NavbarProps) {
  const { user, logout } = useAuth();

  return (
    <nav className="glass-card sticky top-0 z-50 border-b border-white/20">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 flex items-center justify-center shadow-md">
            <span className="text-lg">📸</span>
          </div>
          <h1 className="text-xl font-extrabold gradient-text hidden sm:block">CalorieMeter</h1>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100/80 rounded-xl p-1">
          <button
            onClick={() => onTabChange('scan')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
              activeTab === 'scan'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            📸 Scan
          </button>
          <button
            onClick={() => onTabChange('history')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
              activeTab === 'history'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            📋 History
          </button>
        </div>

        {/* User Menu */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-semibold text-gray-700">{user?.name}</p>
            <p className="text-xs text-gray-400">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="px-3 py-2 rounded-xl text-xs font-medium text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all"
            title="Log out"
          >
            👋 Logout
          </button>
        </div>
      </div>
    </nav>
  );
}