"use client";

import { useState } from "react";
import { X } from "lucide-react";
import axios from "axios";

interface SubmitGistProps {
  onClose: () => void;
  onSubmit: () => void;
}

export default function SubmitGist({ onClose, onSubmit }: SubmitGistProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("tech");
  const [isBreaking, setIsBreaking] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("http://localhost:8000/api/gists", {
        title,
        content,
        category,
        is_breaking: isBreaking,
      });
      onSubmit();
    } catch (error) {
      console.error("Error submitting gist:", error);
      alert("Failed to submit gist. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg max-w-2xl w-full p-6 border border-divider">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Submit Intelligence</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's the whisper?"
              required
              className="w-full bg-background border border-divider rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent-breaking transition-colors"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Details
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share what you know..."
              required
              rows={5}
              className="w-full bg-background border border-divider rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent-breaking transition-colors resize-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-background border border-divider rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent-breaking transition-colors"
            >
              <option value="tech">Tech</option>
              <option value="finance">Finance</option>
              <option value="politics">Politics</option>
              <option value="entertainment">Entertainment</option>
              <option value="sports">Sports</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Breaking */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="breaking"
              checked={isBreaking}
              onChange={(e) => setIsBreaking(e.target.checked)}
              className="w-4 h-4 accent-accent-breaking"
            />
            <label htmlFor="breaking" className="text-sm text-gray-300">
              Mark as breaking / urgent
            </label>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-divider text-white font-semibold rounded-lg hover:bg-opacity-80 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-accent-breaking text-black font-semibold rounded-lg hover:bg-opacity-90 transition-all disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Gist"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}  
