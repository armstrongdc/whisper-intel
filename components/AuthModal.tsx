"use client";

import { useState } from "react";
import { X, User, Mail, Lock } from "lucide-react";
import axios from "axios";

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (user: any, token: string) => void;
}

export default function AuthModal({ onClose, onSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";
      const data = isLogin
        ? { username, password }
        : { username, email, password };

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}``, data);

      if (response.data.error) {
        setError(response.data.error);
        setLoading(false);
        return;
      }

      // Store token in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      onSuccess(response.data.user, response.data.token);
    } catch (error) {
      console.error("Auth error:", error);
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg max-w-md w-full p-6 border border-divider">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {isLogin ? "Login" : "Sign Up"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-accent-risk/10 border border-accent-risk text-accent-risk px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              <User size={16} className="inline mr-2" />
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full bg-background border border-divider rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent-breaking transition-colors"
            />
          </div>

          {/* Email (Signup only) */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                <Mail size={16} className="inline mr-2" />
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-background border border-divider rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent-breaking transition-colors"
              />
            </div>
          )}

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              <Lock size={16} className="inline mr-2" />
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full bg-background border border-divider rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent-breaking transition-colors"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent-breaking hover:bg-opacity-90 text-black font-semibold px-6 py-3 rounded-lg transition-all disabled:opacity-50"
          >
            {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        {/* Toggle Login/Signup */}
        <div className="mt-4 text-center text-sm text-gray-400">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
            className="ml-2 text-accent-breaking hover:underline font-semibold"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
}