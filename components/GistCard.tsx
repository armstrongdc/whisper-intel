"use client";

import { ArrowUp, ArrowDown, TrendingUp, Clock, MessageCircle } from "lucide-react";
import { useState } from "react";

interface GistCardProps {
  gist: {
    id: string;
    title: string;
    content: string;
    confidence_score: number;
    votes: number;
    created_at: string;
    category: string;
    is_breaking: boolean;
  };
  onVote: (gistId: string, value: number) => void;
  onCommentsClick: (gistId: string) => void;
}

export default function GistCard({ gist, onVote, onCommentsClick }: GistCardProps) {
  const [voted, setVoted] = useState<number | null>(null);

  const handleVote = (value: number) => {
    if (voted === value) return;
    setVoted(value);
    onVote(gist.id, value);
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 80) return "text-accent-confirmed";
    if (score >= 50) return "text-accent-breaking";
    return "text-accent-risk";
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - past.getTime()) / 60000);
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="bg-card rounded-lg p-6 border border-divider hover:border-accent-breaking/30 transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          {gist.is_breaking && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent-breaking bg-accent-breaking/10 px-2 py-1 rounded mb-2">
              <TrendingUp size={12} />
              BREAKING
            </span>
          )}
          <h3 className="text-lg font-semibold text-white mb-2">{gist.title}</h3>
          <p className="text-gray-300 text-sm leading-relaxed">{gist.content}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-divider">
        {/* Voting */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleVote(1)}
            className={`p-1.5 rounded hover:bg-divider transition-colors ${
              voted === 1 ? "text-accent-confirmed" : "text-gray-400"
            }`}
          >
            <ArrowUp size={18} />
          </button>
          <span className="text-sm font-semibold text-white">{gist.votes}</span>
          <button
            onClick={() => handleVote(-1)}
            className={`p-1.5 rounded hover:bg-divider transition-colors ${
              voted === -1 ? "text-accent-risk" : "text-gray-400"
            }`}
          >
            <ArrowDown size={18} />
          </button>

          {/* Comments Button */}
          <button
            onClick={() => onCommentsClick(gist.id)}
            className="flex items-center gap-1 ml-4 p-1.5 rounded hover:bg-divider transition-colors text-gray-400 hover:text-accent-breaking"
          >
            <MessageCircle size={18} />
          </button>
        </div>

        {/* Metadata */}
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <Clock size={14} />
            {getTimeAgo(gist.created_at)}
          </div>
          <div className={`font-semibold ${getConfidenceColor(gist.confidence_score)}`}>
            {gist.confidence_score}% confidence
          </div>
          <span className="px-2 py-1 bg-divider rounded text-gray-300">
            {gist.category}
          </span>
        </div>
      </div>
    </div>
  );
}