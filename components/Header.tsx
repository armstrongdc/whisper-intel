"use client";

import { TrendingUp, Plus, LogIn, User, LogOut } from "lucide-react";
import { useState, useEffect } from "react";

interface HeaderProps {
  onSubmitClick: () => void;
  onAuthClick: () => void;
  currentUser: any;
  onLogout: () => void;
}

export default function Header({ onSubmitClick, onAuthClick, currentUser, onLogout }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-card border-b border-divider backdrop-blur-sm bg-opacity-95">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="text-accent-breaking" size={28} />
          <h1 className="text-xl font-bold text-white">Whisper Intel</h1>
        </div>

        <div className="flex items-center gap-3">
          {currentUser ? (
            <>
              <div className="flex items-center gap-2 text-sm">
                <User size={16} className="text-accent-breaking" />
                <span className="text-white font-semibold">{currentUser.username}</span>
                <span className="text-gray-400">({currentUser.reputation} rep)</span>
              </div>
              <button
                onClick={onSubmitClick}
                className="flex items-center gap-2 bg-accent-breaking hover:bg-opacity-90 text-black font-semibold px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
              >
                <Plus size={20} />
                Submit Gist
              </button>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 bg-divider hover:bg-opacity-80 text-white font-semibold px-4 py-2 rounded-lg transition-all"
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onAuthClick}
                className="flex items-center gap-2 bg-divider hover:bg-opacity-80 text-white font-semibold px-4 py-2 rounded-lg transition-all"
              >
                <LogIn size={18} />
                Login
              </button>
              <button
                onClick={onSubmitClick}
                className="flex items-center gap-2 bg-accent-breaking hover:bg-opacity-90 text-black font-semibold px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
              >
                <Plus size={20} />
                Submit
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
