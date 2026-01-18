"use client";

import { useState, useEffect } from "react";
import GistFeed from "@/components/GistFeed";
import Header from "@/components/Header";
import SubmitGist from "@/components/SubmitGist";
import AuthModal from "@/components/AuthModal";

export default function Home() {
  const [showSubmit, setShowSubmit] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    
    if (token && user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  const handleGistSubmitted = () => {
    setShowSubmit(false);
    setRefreshKey(prev => prev + 1);
  };

  const handleAuthSuccess = (user: any, token: string) => {
    setCurrentUser(user);
    setShowAuth(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onSubmitClick={() => setShowSubmit(true)}
        onAuthClick={() => setShowAuth(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
      />
      
      <main className="max-w-4xl mx-auto px-4 py-6">
        <GistFeed key={refreshKey} />
      </main>

      {showSubmit && (
        <SubmitGist 
          onClose={() => setShowSubmit(false)}
          onSubmit={handleGistSubmitted}
        />
      )}

      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onSuccess={handleAuthSuccess}
        />
      )}
    </div>
  );
}
