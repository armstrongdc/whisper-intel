"use client";

import { useState, useEffect } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import axios from "axios";

interface Comment {
  id: string;
  author: string;
  content: string;
  created_at: string;
}

interface CommentsProps {
  gistId: string;
  onClose: () => void;
}

export default function Comments({ gistId, onClose }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, [gistId]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/gists/${gistId}/comments`);
      setComments(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/gists/${gistId}/comments`, {
        author: author.trim() || "Anonymous",
        content: newComment,
      });
      setNewComment("");
      setAuthor("");
      fetchComments();
    } catch (error) {
      console.error("Error posting comment:", error);
    }
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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg max-w-2xl w-full max-h-[80vh] flex flex-col border border-divider">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-divider">
          <div className="flex items-center gap-2">
            <MessageCircle className="text-accent-breaking" size={24} />
            <h2 className="text-xl font-bold text-white">Comments ({comments.length})</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading ? (
            <p className="text-gray-400 text-center">Loading comments...</p>
          ) : comments.length === 0 ? (
            <p className="text-gray-400 text-center">No comments yet. Be the first!</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="bg-background rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-accent-breaking font-semibold">{comment.author}</span>
                  <span className="text-xs text-gray-400">{getTimeAgo(comment.created_at)}</span>
                </div>
                <p className="text-gray-300 text-sm">{comment.content}</p>
              </div>
            ))
          )}
        </div>

        {/* Add Comment Form */}
        <div className="p-6 border-t border-divider">
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Your name (optional)"
              className="w-full bg-background border border-divider rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-accent-breaking transition-colors text-sm"
            />
            <div className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                required
                className="flex-1 bg-background border border-divider rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-accent-breaking transition-colors"
              />
              <button
                type="submit"
                className="bg-accent-breaking hover:bg-opacity-90 text-black font-semibold px-6 py-2 rounded-lg transition-all flex items-center gap-2"
              >
                <Send size={18} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}