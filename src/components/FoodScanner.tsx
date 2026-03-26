"use client";

import React, { useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';

interface NutritionResult {
  food_name: string;
  serving_size: string;
  total: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
  };
  items: Array<{
    name: string;
    portion: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }>;
  health_note: string;
}

export default function FoodScanner() {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<NutritionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const { token } = useAuth();

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }
    
    setError('');
    setResult(null);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragActive(false);
  }, []);

  const analyzeFood = async () => {
    if (!image || !token) return;
    
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ image }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetScan = () => {
    setImage(null);
    setResult(null);
    setError('');
  };

  const nutrientColors: Record<string, { bg: string; text: string; icon: string; gradient: string }> = {
    calories: { bg: 'bg-orange-50', text: 'text-orange-600', icon: '🔥', gradient: 'from-orange-400 to-red-500' },
    protein: { bg: 'bg-blue-50', text: 'text-blue-600', icon: '💪', gradient: 'from-blue-400 to-indigo-500' },
    carbs: { bg: 'bg-amber-50', text: 'text-amber-600', icon: '🌾', gradient: 'from-amber-400 to-yellow-500' },
    fat: { bg: 'bg-purple-50', text: 'text-purple-600', icon: '🥑', gradient: 'from-purple-400 to-pink-500' },
    fiber: { bg: 'bg-green-50', text: 'text-green-600', icon: '🥬', gradient: 'from-green-400 to-emerald-500' },
    sugar: { bg: 'bg-pink-50', text: 'text-pink-600', icon: '🍬', gradient: 'from-pink-400 to-rose-500' },
  };

  return (
    <div className="max-w-2xl mx-auto">
      {!result ? (
        <div className="space-y-6">
          {/* Upload Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`upload-zone rounded-3xl p-8 text-center cursor-pointer transition-all duration-300 ${
              dragActive ? 'border-pink-500 bg-pink-50/50 scale-[1.02]' : ''
            } ${image ? 'border-solid border-green-400 bg-green-50/30' : ''}`}
            onClick={() => !image && document.getElementById('file-input')?.click()}
          >
            <input
              id="file-input"
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
            
            {image ? (
              <div className="space-y-4">
                <div className="relative inline-block">
                  <img
                    src={image}
                    alt="Food preview"
                    className="max-h-64 rounded-2xl shadow-lg mx-auto"
                  />
                  <button
                    onClick={(e) => { e.stopPropagation(); resetScan(); }}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md hover:bg-red-600 transition-colors"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-green-600 font-medium">✅ Photo ready! Hit the button below to analyze.</p>
              </div>
            ) : (
              <div className="space-y-4 py-4">
                <div className="text-6xl float-animation">📸</div>
                <h3 className="text-xl font-bold text-gray-700">
                  Drop your food photo here
                </h3>
                <p className="text-gray-400">
                  or tap to take a photo / choose from gallery
                </p>
                <div className="flex items-center justify-center gap-3 text-sm text-gray-400">
                  <span className="px-3 py-1 bg-white rounded-full shadow-sm">🍕 Pizza</span>
                  <span className="px-3 py-1 bg-white rounded-full shadow-sm">🍣 Sushi</span>
                  <span className="px-3 py-1 bg-white rounded-full shadow-sm">🥗 Salad</span>
                  <span className="px-3 py-1 bg-white rounded-full shadow-sm">🍰 Cake</span>
                </div>
              </div>
            )}
          </div>

          {/* Analyze Button */}
          {image && (
            <button
              onClick={analyzeFood}
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:transform-none animate-slide-up"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <div className="relative w-6 h-6">
                    <div className="absolute inset-0 rounded-full border-2 border-white/30"></div>
                    <div className="absolute inset-0 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                  </div>
                  Analyzing your food... 🔍
                </span>
              ) : (
                'Analyze My Food! 🚀'
              )}
            </button>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-600 text-center animate-slide-up">
              😅 {error}
            </div>
          )}
        </div>
      ) : (
        /* Results */
        <div className="space-y-6 animate-fade-in">
          {/* Header */}
          <div className="glass-card rounded-3xl p-6 glow-border text-center">
            <div className="text-4xl mb-2">🎉</div>
            <h2 className="text-2xl font-extrabold gradient-text mb-1">{result.food_name}</h2>
            <p className="text-gray-400 text-sm">📏 Serving: {result.serving_size}</p>
          </div>

          {/* Total Calories Hero */}
          <div className="bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 rounded-3xl p-8 text-center text-white shadow-lg">
            <p className="text-lg font-medium opacity-90 mb-1">Total Calories</p>
            <p className="text-6xl font-extrabold">{Math.round(result.total.calories)}</p>
            <p className="text-lg opacity-75 mt-1">kcal</p>
          </div>

          {/* Nutrient Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.entries(result.total).filter(([key]) => key !== 'calories').map(([key, value]) => {
              const style = nutrientColors[key];
              return (
                <div key={key} className={`nutrient-card ${style.bg} rounded-2xl p-4 text-center`}>
                  <span className="text-2xl">{style.icon}</span>
                  <p className={`text-2xl font-extrabold ${style.text} mt-1`}>
                    {typeof value === 'number' ? Math.round(value * 10) / 10 : value}g
                  </p>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-1">
                    {key}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Items Breakdown */}
          {result.items && result.items.length > 0 && (
            <div className="glass-card rounded-3xl p-6">
              <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                <span className="text-xl">🍽️</span> Food Breakdown
              </h3>
              <div className="space-y-3">
                {result.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                    <div>
                      <p className="font-semibold text-gray-700">{item.name}</p>
                      <p className="text-xs text-gray-400">{item.portion}</p>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="font-bold text-orange-500">{Math.round(item.calories)} cal</span>
                      <span className="text-blue-400">{Math.round(item.protein)}p</span>
                      <span className="text-amber-400">{Math.round(item.carbs)}c</span>
                      <span className="text-purple-400">{Math.round(item.fat)}f</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Health Note */}
          {result.health_note && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-5">
              <p className="text-green-700 flex items-start gap-2">
                <span className="text-xl">💡</span>
                <span className="text-sm leading-relaxed">{result.health_note}</span>
              </p>
            </div>
          )}

          {/* Scan Again */}
          <button
            onClick={resetScan}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            Scan Another Food 📸
          </button>
        </div>
      )}
    </div>
  );
}