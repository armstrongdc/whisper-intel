"use client";

import { Search, Filter } from "lucide-react";
import { useState } from "react";

interface SearchFilterProps {
  onSearchChange: (search: string) => void;
  onCategoryChange: (category: string) => void;
  onBreakingToggle: (breaking: boolean) => void;
}

export default function SearchFilter({ 
  onSearchChange, 
  onCategoryChange,
  onBreakingToggle 
}: SearchFilterProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [breakingOnly, setBreakingOnly] = useState(false);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    onSearchChange(value);
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    onCategoryChange(value);
  };

  const handleBreakingToggle = () => {
    const newValue = !breakingOnly;
    setBreakingOnly(newValue);
    onBreakingToggle(newValue);
  };

  return (
    <div className="bg-card rounded-lg p-4 mb-6 border border-divider">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search gists..."
            className="w-full bg-background border border-divider rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-accent-breaking transition-colors"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <Filter className="text-gray-400" size={20} />
          <select
            value={category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="bg-background border border-divider rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-accent-breaking transition-colors"
          >
            <option value="all">All Categories</option>
            <option value="tech">Tech</option>
            <option value="finance">Finance</option>
            <option value="politics">Politics</option>
            <option value="entertainment">Entertainment</option>
            <option value="sports">Sports</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Breaking Only Toggle */}
        <button
          onClick={handleBreakingToggle}
          className={`px-4 py-2.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
            breakingOnly
              ? "bg-accent-breaking text-black"
              : "bg-background border border-divider text-gray-400 hover:text-white"
          }`}
        >
          Breaking Only
        </button>
      </div>
    </div>
  );
}