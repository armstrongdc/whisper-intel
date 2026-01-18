"use client";

import { useEffect, useState } from "react";
import GistCard from "./GistCard";
import Comments from "./Comments";
import SearchFilter from "./SearchFilter";
import axios from "axios";

interface Gist {
  id: string;
  title: string;
  content: string;
  confidence_score: number;
  votes: number;
  created_at: string;
  category: string;
  is_breaking: boolean;
}

export default function GistFeed() {
  const [gists, setGists] = useState<Gist[]>([]);
  const [filteredGists, setFilteredGists] = useState<Gist[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGistId, setSelectedGistId] = useState<string | null>(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [breakingOnly, setBreakingOnly] = useState(false);

  useEffect(() => {
    fetchGists();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [gists, searchQuery, categoryFilter, breakingOnly]);

  const fetchGists = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/gists");
      setGists(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching gists:", error);
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...gists];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (gist) =>
          gist.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          gist.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((gist) => gist.category === categoryFilter);
    }

    // Breaking only filter
    if (breakingOnly) {
      filtered = filtered.filter((gist) => gist.is_breaking);
    }

    setFilteredGists(filtered);
  };

  const handleVote = async (gistId: string, value: number) => {
    try {
      await axios.post(`http://localhost:8000/api/gists/${gistId}/vote`, { value });
      fetchGists();
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  const handleCommentsClick = (gistId: string) => {
    setSelectedGistId(gistId);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card rounded-lg p-6 animate-pulse">
            <div className="h-6 bg-divider rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-divider rounded w-full mb-2"></div>
            <div className="h-4 bg-divider rounded w-5/6"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <SearchFilter
        onSearchChange={setSearchQuery}
        onCategoryChange={setCategoryFilter}
        onBreakingToggle={setBreakingOnly}
      />

      {filteredGists.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">
            {gists.length === 0
              ? "No gists yet. Be the first to submit one!"
              : "No gists match your filters. Try adjusting your search."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredGists.map((gist) => (
            <GistCard
              key={gist.id}
              gist={gist}
              onVote={handleVote}
              onCommentsClick={handleCommentsClick}
            />
          ))}
        </div>
      )}

      {selectedGistId && (
        <Comments
          gistId={selectedGistId}
          onClose={() => setSelectedGistId(null)}
        />
      )}
    </>
  );
}


 