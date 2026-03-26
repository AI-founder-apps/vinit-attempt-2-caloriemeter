"use client";

import React from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import AuthForm from '@/components/AuthForm';
import Dashboard from '@/components/Dashboard';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 mb-4 shadow-lg spin-slow">
            <span className="text-3xl">📸</span>
          </div>
          <p className="text-gray-400 font-medium">Loading CalorieMeter...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  return <Dashboard />;
}

export default function Home() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}