"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

interface Scan {
  id: number;
  food_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  serving_size: string;
  items: Array<{ name: string; portion: string; calories: number; protein: number; carbs: number; fat: number }>;
  created_at: string;
}

export default function History() {
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    fetchHistory();
  }, [token]);

  const fetchHistory = async () => {
    if (!token) return;
    
    try {
      const res = await fetch('/api/history', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setScans(data.scans);
      }
    } catch (err) {
      console.error('Failed to fetch history');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getTodayCalories = () => {
    const today = new Date().toDateString();
    return scans
      .filter(s => new Date(s.created_at).toDateString() === today)
      .reduce((sum, s) => sum + (s.calories || 0), 0);
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="loading-shimmer h-24 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Today's Summary */}
      <div className="bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 rounded-3xl p-6 text-white shadow-lg">
        <p className="text-sm font-medium opacity-80">Today&apos;s Total</p>
        <div className="flex items-end gap-2">
          <p className="text-5xl font-extrabold">{Math.round(getTodayCalories())}</p>
          <p className="text-lg opacity-75 pb-1">kcal</p>
        </div>
        <p className="text-sm opacity-70 mt-1">
          {scans.filter(s => new Date(s.created_at).toDateString() === new Date().toDateString()).length} scans today
        </p>
      </div>

      {/* History List */}
      {scans.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center">
          <div className="text-6xl mb-4">🍽️</div>
          <h3 className="text-xl font-bold text-gray-600 mb-2">No scans yet!</h3>
          <p className="text-gray-400">Upload your first food photo to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-gray-700 px-1">Recent Scans</h3>
          {scans.map((scan, index) => (
            <div
              key={scan.id}
              className="glass-card rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-md cursor-pointer"
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => setExpandedId(expandedId === scan.id ? null : scan.id)}
            >
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white text-xl shadow-md">
                    🔥
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-700">{scan.food_name}</h4>
                    <p className="text-xs text-gray-400">{formatDate(scan.created_at)} · {scan.serving_size}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-extrabold text-orange-500">{Math.round(scan.calories)}</p>
                  <p className="text-xs text-gray-400">kcal</p>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedId === scan.id && (
                <div className="px-4 pb-4 space-y-3 animate-slide-up">
                  <div className="h-px bg-gray-100" />
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      { label: 'Protein', value: scan.protein, color: 'text-blue-500', icon: '💪' },
                      { label: 'Carbs', value: scan.carbs, color: 'text-amber-500', icon: '🌾' },
                      { label: 'Fat', value: scan.fat, color: 'text-purple-500', icon: '🥑' },
                      { label: 'Fiber', value: scan.fiber, color: 'text-green-500', icon: '🥬' },
                      { label: 'Sugar', value: scan.sugar, color: 'text-pink-500', icon: '🍬' },
                    ].map(({ label, value, color, icon }) => (
                      <div key={label} className="text-center bg-gray-50 rounded-xl p-2">
                        <p className="text-xs">{icon}</p>
                        <p className={`font-bold text-sm ${color}`}>{Math.round((value || 0) * 10) / 10}g</p>
                        <p className="text-[10px] text-gray-400">{label}</p>
                      </div>
                    ))}
                  </div>

                  {scan.items && scan.items.length > 0 && (
                    <div className="space-y-1">
                      {scan.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm bg-gray-50 rounded-lg px-3 py-2">
                          <span className="text-gray-600">{item.name}</span>
                          <span className="text-orange-500 font-semibold">{Math.round(item.calories)} cal</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}