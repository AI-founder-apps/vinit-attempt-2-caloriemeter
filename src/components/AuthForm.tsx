"use client";

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

const floatingFoods = [
  // Left side - big and bold
  { emoji: '🍎', top: '3%', left: '2%', delay: '0s', duration: '6s', sizeRem: '4.5rem' },
  { emoji: '🥑', top: '16%', left: '6%', delay: '1s', duration: '7s', sizeRem: '5.5rem' },
  { emoji: '🍊', top: '32%', left: '1%', delay: '2s', duration: '5s', sizeRem: '4rem' },
  { emoji: '🥦', top: '46%', left: '5%', delay: '0.5s', duration: '8s', sizeRem: '5rem' },
  { emoji: '🍇', top: '60%', left: '2%', delay: '1.5s', duration: '6s', sizeRem: '5.5rem' },
  { emoji: '🥕', top: '74%', left: '6%', delay: '3s', duration: '7s', sizeRem: '4rem' },
  { emoji: '🍋', top: '86%', left: '3%', delay: '2.5s', duration: '5.5s', sizeRem: '4.5rem' },
  { emoji: '🌽', top: '8%', left: '14%', delay: '4s', duration: '6.5s', sizeRem: '3.5rem' },
  { emoji: '🫑', top: '50%', left: '13%', delay: '2.8s', duration: '6s', sizeRem: '3.5rem' },

  // Right side - big and bold
  { emoji: '🍓', top: '3%', right: '2%', delay: '0.8s', duration: '7s', sizeRem: '5rem' },
  { emoji: '🥝', top: '18%', right: '6%', delay: '2s', duration: '6s', sizeRem: '5.5rem' },
  { emoji: '🍌', top: '34%', right: '1%', delay: '1.2s', duration: '8s', sizeRem: '4.5rem' },
  { emoji: '🫐', top: '48%', right: '4%', delay: '3s', duration: '5.5s', sizeRem: '4.5rem' },
  { emoji: '🥬', top: '62%', right: '7%', delay: '0.3s', duration: '7s', sizeRem: '5.5rem' },
  { emoji: '🍑', top: '76%', right: '2%', delay: '2.2s', duration: '6s', sizeRem: '4rem' },
  { emoji: '🥭', top: '88%', right: '5%', delay: '1.8s', duration: '5s', sizeRem: '5rem' },
  { emoji: '🍒', top: '6%', right: '14%', delay: '3.5s', duration: '7.5s', sizeRem: '3.5rem' },
  { emoji: '🍐', top: '70%', right: '13%', delay: '1.3s', duration: '7s', sizeRem: '3.5rem' },

  // Bottom extras
  { emoji: '🥒', top: '93%', left: '10%', delay: '3.2s', duration: '5s', sizeRem: '3.5rem' },
  { emoji: '🍅', top: '93%', right: '10%', delay: '0.7s', duration: '6.5s', sizeRem: '4rem' },
];

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, name, password);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating Food Emojis - BIGGER, BOLDER, BRIGHTER */}
      {floatingFoods.map((food, i) => (
        <div
          key={i}
          className="absolute pointer-events-none select-none food-float"
          style={{
            top: food.top,
            left: (food as any).left,
            right: (food as any).right,
            animationDelay: food.delay,
            animationDuration: food.duration,
            fontSize: food.sizeRem,
            lineHeight: 1,
            opacity: 0.85,
            filter: 'saturate(1.5) brightness(1.15) contrast(1.1)',
            textShadow: '0 4px 12px rgba(0,0,0,0.15)',
          } as React.CSSProperties}
        >
          {food.emoji}
        </div>
      ))}

      {/* Decorative gradient blobs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-pink-300 opacity-20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-300 opacity-20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-blue-300 opacity-15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      <div className="absolute bottom-1/3 right-1/4 w-56 h-56 bg-green-300 opacity-15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="w-full max-w-md relative z-10">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 mb-4 shadow-2xl ring-4 ring-white/50 spin-slow">
            <span className="text-5xl">📸</span>
          </div>
          <h1 className="text-5xl font-extrabold gradient-text mb-3">CalorieMeter</h1>
          <p className="text-gray-600 text-lg font-medium">
            Snap a photo. Know your calories. ✨
          </p>
          <div className="flex items-center justify-center gap-3 mt-3">
            <span className="bounce-1" style={{ fontSize: '2rem', filter: 'saturate(1.4) brightness(1.1)' }}>🍎</span>
            <span className="bounce-2" style={{ fontSize: '2rem', filter: 'saturate(1.4) brightness(1.1)' }}>🥗</span>
            <span className="bounce-3" style={{ fontSize: '2rem', filter: 'saturate(1.4) brightness(1.1)' }}>📊</span>
            <span className="bounce-1" style={{ fontSize: '2rem', filter: 'saturate(1.4) brightness(1.1)' }}>💪</span>
            <span className="bounce-2" style={{ fontSize: '2rem', filter: 'saturate(1.4) brightness(1.1)' }}>🎯</span>
          </div>
        </div>

        {/* Auth Card */}
        <div className="glass-card rounded-3xl p-8 glow-border shadow-2xl">
          {/* Toggle */}
          <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
            <button
              type="button"
              onClick={() => { setIsLogin(true); setError(''); }}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                isLogin
                  ? 'bg-white text-purple-600 shadow-md'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Log In 🔑
            </button>
            <button
              type="button"
              onClick={() => { setIsLogin(false); setError(''); }}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                !isLogin
                  ? 'bg-white text-purple-600 shadow-md'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sign Up 🌟
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all text-gray-800"
                  placeholder="Jamie Oliver 👨‍🍳"
                  required={!isLogin}
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all text-gray-800"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all text-gray-800"
                placeholder="At least 6 characters"
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white font-bold text-lg shadow-lg hover:shadow-2xl transform hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {isLogin ? 'Logging in...' : 'Creating account...'}
                </span>
              ) : (
                isLogin ? "Let's Go! 🚀" : 'Create Account ✨'
              )}
            </button>
          </form>
        </div>

        {/* Bottom tagline */}
        <div className="text-center mt-6 space-y-2">
          <p className="text-gray-500 text-sm font-medium">
            🔒 Your data is safe and secure
          </p>
          <div className="flex items-center justify-center gap-1 text-xs text-gray-400">
            <span>Powered by AI</span>
            <span>•</span>
            <span>Instant Results</span>
            <span>•</span>
            <span>100% Free</span>
          </div>
        </div>
      </div>
    </div>
  );
}
