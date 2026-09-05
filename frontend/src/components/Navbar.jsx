import React, { useEffect, useRef, useState, useCallback } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Briefcase,
  ChevronDown,
  FileCheck2,
  History,
  LogOut,
  Menu,
  Moon,
  Plus,
  Search,
  Settings,
  Sparkles,
  Sun,
  User,
  ShieldCheck,
  Building2,
  LogIn,
  MapPin,
  IndianRupee,
  ArrowRight,
  X,
  Loader2,
  SlidersHorizontal,
  Check,
  Compass,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import NotificationBell from "./NotificationBell";
import CareerHistoryDrawer from "./CareerHistoryDrawer";
import api from "../services/api";
import NexHireLogo from "./common/NexHireLogo";

/**
 * Navbar Component (Unstop-Inspired Clean Top Navigation Bar)
 * 
 * Features:
 * - Live dynamic search with debounced API calls
 * - Floating search results dropdown
 * - Role-based action pills
 */
const Navbar = ({ isCollapsed, onToggleCollapse, setMobileOpen }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [profileOpen, setProfileOpen] = useState(false);
  const [careerHistoryOpen, setCareerHistoryOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const profileRef = useRef(null);

  // Global Unified Live Search State with Location & Work Arrangement Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [searchJobType, setSearchJobType] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const debounceTimer = useRef(null);

  const activeFilterCount = (searchLocation ? 1 : 0) + (searchJobType ? 1 : 0);

  const TRENDING_SEARCHES = [
    "Remote Frontend",
    "Full-Stack AI",
    "Node.js Backend",
    "Product Designer",
    "Data Analyst",
  ];

  const LOCATION_PRESETS = [
    "Remote",
    "Bengaluru",
    "Mumbai",
    "Delhi NCR",
    "Hyderabad",
    "Pune",
  ];

  const JOB_TYPE_PRESETS = [
    "Full-Time",
    "Part-Time",
    "Remote",
    "Contract",
    "Internship",
  ];

  // Sync search state with URL parameters when on /jobs or /explore
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const kw = params.get("keyword") || "";
    const loc = params.get("location") || "";
    const jt = params.get("jobType") || "";
    if (location.pathname === "/jobs" || location.pathname === "/explore") {
      setSearchQuery(kw);
      setSearchLocation(loc);
      setSearchJobType(jt);
    }
  }, [location.pathname, location.search]);

  // Close profile and search dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
        setShowFilters(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Close search dropdown on route change
  useEffect(() => {
    setShowResults(false);
    setShowFilters(false);
  }, [location.pathname]);

  // Debounced live search hitting /api/job/get
  const performSearch = useCallback(async (query, loc, type) => {
    const trimmedQuery = (query || "").trim();
    const trimmedLoc = (loc || "").trim();
    const trimmedType = (type || "").trim();

    const hasInput = trimmedQuery.length >= 2 || trimmedLoc.length > 0 || trimmedType.length > 0;
    if (!hasInput) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    setSearchLoading(true);
    try {
      const params = { limit: 6 };
      if (trimmedQuery) params.keyword = trimmedQuery;
      if (trimmedLoc) params.location = trimmedLoc;
      if (trimmedType) params.jobType = trimmedType;

      const res = await api.get(`/job/get`, { params });
      if (res.data?.success) {
        setSearchResults(res.data.jobs || []);
        setShowResults(true);
        setSelectedIndex(-1);
      }
    } catch {
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    if (val.trim().length < 2 && !searchLocation && !searchJobType) {
      setSearchResults([]);
      setSearchLoading(false);
      setShowResults(true);
      return;
    }

    setSearchLoading(true);
    setShowResults(true);

    debounceTimer.current = setTimeout(() => {
      performSearch(val, searchLocation, searchJobType);
    }, 300);
  };

  const handleSelectLocation = (loc) => {
    const next = searchLocation === loc ? "" : loc;
    setSearchLocation(next);
    performSearch(searchQuery, next, searchJobType);
  };

  const handleSelectJobType = (type) => {
    const next = searchJobType === type ? "" : type;
    setSearchJobType(next);
    performSearch(searchQuery, searchLocation, next);
  };

  const handleResetFilters = () => {
    setSearchLocation("");
    setSearchJobType("");
    performSearch(searchQuery, "", "");
  };

  const handleTrendingClick = (term) => {
    setSearchQuery(term);
    setShowResults(true);
    performSearch(term, searchLocation, searchJobType);
    inputRef.current?.focus();
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setShowResults(false);
    setShowFilters(false);

    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("keyword", searchQuery.trim());
    if (searchLocation.trim()) params.set("location", searchLocation.trim());
    if (searchJobType.trim()) params.set("jobType", searchJobType.trim());

    const qs = params.toString();
    navigate(qs ? `/jobs?${qs}` : "/jobs");
  };

  const handleResultClick = (jobId) => {
    setShowResults(false);
    setShowFilters(false);
    navigate(`/description/${jobId}`);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchLocation("");
    setSearchJobType("");
    setSearchResults([]);
    setShowResults(false);
    setShowFilters(false);
    if (location.pathname === "/jobs" || location.pathname === "/explore") {
      navigate("/jobs");
    }
  };

  // Keyboard shortcut listener: Ctrl+K or "/" to focus, Arrow navigation, Escape to close
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
        setShowResults(true);
      } else if (
        e.key === "/" &&
        document.activeElement !== inputRef.current &&
        !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName)
      ) {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
        setShowResults(true);
      } else if (e.key === "Escape") {
        setShowResults(false);
        setShowFilters(false);
        setProfileOpen(false);
      } else if (showResults && searchResults.length > 0) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setSelectedIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : 0));
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : searchResults.length - 1));
        } else if (e.key === "Enter" && selectedIndex >= 0 && searchResults[selectedIndex]) {
          e.preventDefault();
          handleResultClick(searchResults[selectedIndex]._id);
        }
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [showResults, searchResults, selectedIndex]);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logout();
      navigate("/", { replace: true });
      setProfileOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const go = (path) => {
    setProfileOpen(false);
    navigate(path);
  };

  return (
    <>
      <header className="sticky top-0 z-30 w-full h-16 border-b border-slate-200/90 dark:border-slate-800/80 bg-white/90 dark:bg-[#0c1322]/90 backdrop-blur-xl transition-colors duration-200">
        <div className="h-full w-full px-2 sm:px-6 flex items-center justify-between gap-1 sm:gap-3">
          
          {/* Left Area: Mobile Hamburger (< 1024px) + Compact Brand Logo Icon Only */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button
              onClick={() => setMobileOpen && setMobileOpen(true)}
              className="lg:hidden flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Mobile Logo Icon Badge (Only Glyph Icon on Mobile for Maximum Viewport Space) */}
            <div className="lg:hidden flex items-center shrink-0">
              <NexHireLogo size="xs" showText={false} asLink={true} to="/" />
            </div>
          </div>

          {/* Center Area: Global Unified Live Search Bar with Built-in Location & Work Arrangement Filters */}
          <div ref={searchRef} className="flex-1 max-w-xl mx-auto relative min-w-0">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <div className="relative flex items-center w-full min-h-[36px] sm:min-h-[40px] px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/90 text-xs sm:text-sm text-slate-900 dark:text-slate-100 shadow-xs transition-all focus-within:border-blue-500 dark:focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-blue-500/15 dark:focus-within:ring-cyan-500/15">
                <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 shrink-0 mr-1.5 sm:mr-2 pointer-events-none" />

                {/* Embedded Active Filter Pills */}
                {searchLocation && (
                  <span className="shrink-0 flex items-center gap-1 mr-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-cyan-400 border border-blue-200/60 dark:border-blue-800/60">
                    <MapPin className="w-2.5 h-2.5" />
                    <span>{searchLocation}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectLocation("");
                      }}
                      className="hover:opacity-75"
                      title="Remove location filter"
                    >
                      <X size={10} />
                    </button>
                  </span>
                )}

                {searchJobType && (
                  <span className="shrink-0 flex items-center gap-1 mr-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-300 border border-violet-200/60 dark:border-violet-800/60">
                    <Briefcase className="w-2.5 h-2.5" />
                    <span>{searchJobType}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectJobType("");
                      }}
                      className="hover:opacity-75"
                      title="Remove job type filter"
                    >
                      <X size={10} />
                    </button>
                  </span>
                )}

                {/* Primary Search Text Input */}
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => {
                    setShowResults(true);
                    setShowFilters(false);
                  }}
                  placeholder={
                    searchLocation || searchJobType
                      ? "Add keyword..."
                      : "Search jobs, skills..."
                  }
                  className="w-full h-7 sm:h-8 bg-transparent border-0 outline-none text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400"
                  autoComplete="off"
                />

                {/* Right Controls: Keyboard hint, Filter trigger & Clear button */}
                <div className="flex items-center gap-1.5 shrink-0 ml-1">
                  {!searchQuery && activeFilterCount === 0 && (
                    <span className="hidden sm:inline-flex items-center text-[10px] font-semibold text-slate-400 border border-slate-200 dark:border-slate-800 rounded px-1.5 py-0.5 bg-slate-50 dark:bg-slate-800/60 select-none">
                      Ctrl K
                    </span>
                  )}

                  {/* Filter Button (Opens Location & Work Arrangement Popover) */}
                  <button
                    type="button"
                    onClick={() => {
                      setShowFilters((prev) => !prev);
                      setShowResults(false);
                    }}
                    className={`relative flex items-center justify-center w-7 h-7 rounded-lg transition-all ${
                      showFilters || activeFilterCount > 0
                        ? "bg-blue-600 text-white dark:bg-cyan-500 dark:text-slate-950 font-bold shadow-xs"
                        : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800/60"
                    }`}
                    title="Filter by City/Remote & Work Arrangement"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    {activeFilterCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white shadow-xs">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>

                  {/* Clear / Loading indicator */}
                  {(searchQuery || activeFilterCount > 0) && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-0.5"
                      title="Clear search and filters"
                    >
                      {searchLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                      ) : (
                        <X className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </form>

            {/* Filter Popover Dropdown */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="fixed inset-x-3 top-16 sm:absolute sm:inset-auto sm:top-[calc(100%+8px)] sm:right-0 sm:w-[380px] max-w-[calc(100vw-24px)] z-50 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#0c1424]/95 backdrop-blur-xl shadow-2xl p-4"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
                      Search Filters
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowFilters(false)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Location Filter: City or Remote */}
                  <div className="pt-3">
                    <label className="flex items-center gap-1 text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                      <MapPin className="w-3 h-3 text-blue-500" />
                      <span>City or Remote...</span>
                    </label>

                    {/* Quick location chips */}
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      <button
                        type="button"
                        onClick={() => handleSelectLocation("")}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                          !searchLocation
                            ? "bg-blue-600 text-white dark:bg-cyan-500 dark:text-slate-950"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200"
                        }`}
                      >
                        All
                      </button>
                      {LOCATION_PRESETS.map((loc) => (
                        <button
                          key={loc}
                          type="button"
                          onClick={() => handleSelectLocation(loc)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                            searchLocation.toLowerCase() === loc.toLowerCase()
                              ? "bg-blue-600 text-white dark:bg-cyan-500 dark:text-slate-950"
                              : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200"
                          }`}
                        >
                          {loc}
                        </button>
                      ))}
                    </div>

                    {/* Custom text location input */}
                    <div className="relative">
                      <MapPin className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="text"
                        value={searchLocation}
                        onChange={(e) => handleSelectLocation(e.target.value)}
                        placeholder="Type city or remote..."
                        className="w-full h-8 pl-8 pr-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Work Arrangement / Job Type Filter */}
                  <div className="pt-3">
                    <label className="flex items-center gap-1 text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                      <Briefcase className="w-3 h-3 text-violet-500" />
                      <span>All Work Arrangements</span>
                    </label>

                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleSelectJobType("")}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                          !searchJobType
                            ? "bg-violet-600 text-white"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200"
                        }`}
                      >
                        All Types
                      </button>
                      {JOB_TYPE_PRESETS.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => handleSelectJobType(type)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                            searchJobType.toLowerCase() === type.toLowerCase()
                              ? "bg-violet-600 text-white"
                              : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200"
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="flex items-center justify-between pt-4 mt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      Reset Filters
                    </button>
                    <button
                      type="button"
                      onClick={handleSearchSubmit}
                      className="btn-primary !h-8 !rounded-lg px-4 text-xs font-bold"
                    >
                      Apply & Search
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Live Search Results Dropdown */}
            <AnimatePresence>
              {showResults && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="fixed inset-x-3 top-16 sm:absolute sm:inset-auto sm:top-[calc(100%+6px)] sm:left-0 sm:right-0 z-50 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0e1628] shadow-2xl shadow-slate-900/10 dark:shadow-black/30 overflow-hidden max-h-[420px] overflow-y-auto"
                >
                  {/* Empty state: Trending & Quick categories */}
                  {!searchQuery && !searchLocation && !searchJobType && searchResults.length === 0 && (
                    <div className="p-4">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                        <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                        <span>Trending Searches</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {TRENDING_SEARCHES.map((term) => (
                          <button
                            key={term}
                            type="button"
                            onClick={() => handleTrendingClick(term)}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-cyan-950/40 dark:hover:text-cyan-400 transition-colors"
                          >
                            {term}
                          </button>
                        ))}
                      </div>

                      <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400">Quick Filters:</span>
                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              handleSelectLocation("Remote");
                              setShowResults(false);
                            }}
                            className="text-[11px] font-bold text-blue-600 dark:text-cyan-400 hover:underline"
                          >
                            🌐 Remote Jobs
                          </button>
                          <span className="text-slate-300 dark:text-slate-700">•</span>
                          <button
                            type="button"
                            onClick={() => {
                              handleSelectJobType("Full-Time");
                              setShowResults(false);
                            }}
                            className="text-[11px] font-bold text-violet-600 dark:text-violet-400 hover:underline"
                          >
                            💼 Full-Time
                          </button>
                          <span className="text-slate-300 dark:text-slate-700">•</span>
                          <button
                            type="button"
                            onClick={() => {
                              handleSelectJobType("Internship");
                              setShowResults(false);
                            }}
                            className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                          >
                            🎓 Internships
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Loading State */}
                  {searchLoading && searchResults.length === 0 && (
                    <div className="flex items-center justify-center gap-2 p-6 text-xs text-slate-400">
                      <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                      <span>Searching open positions...</span>
                    </div>
                  )}

                  {/* No Results */}
                  {!searchLoading &&
                    searchResults.length === 0 &&
                    (searchQuery.trim().length >= 2 || searchLocation || searchJobType) && (
                      <div className="p-6 text-center">
                        <Search className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          No jobs found matching your search
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Try adjusting keywords or clearing location/job type filters
                        </p>
                        <button
                          type="button"
                          onClick={handleClearSearch}
                          className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline"
                        >
                          Clear all filters
                        </button>
                      </div>
                    )}

                  {/* Results List */}
                  {searchResults.length > 0 && (
                    <>
                      <div className="px-3.5 pt-3 pb-1.5 flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {searchResults.length} result{searchResults.length > 1 ? "s" : ""} found
                        </span>
                        {searchLoading && <Loader2 className="w-3 h-3 animate-spin text-blue-500" />}
                      </div>

                      <div className="px-1.5 pb-1.5">
                        {searchResults.map((job, idx) => (
                          <button
                            key={job._id}
                            type="button"
                            onClick={() => handleResultClick(job._id)}
                            className={`w-full flex items-start gap-3 p-2.5 rounded-xl transition-colors text-left group ${
                              selectedIndex === idx
                                ? "bg-blue-50 dark:bg-slate-800/80"
                                : "hover:bg-slate-50 dark:hover:bg-slate-900/60"
                            }`}
                          >
                            {/* Company Logo */}
                            <div className="shrink-0 w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-center overflow-hidden">
                              {job.company?.logo ? (
                                <img
                                  src={job.company.logo}
                                  alt={job.company.companyName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Building2 className="w-4 h-4 text-slate-400" />
                              )}
                            </div>

                            {/* Job Info */}
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                                {job.title}
                              </p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                {job.company?.companyName || "Verified Company"}
                              </p>
                              <div className="flex items-center gap-2.5 mt-1 flex-wrap">
                                {job.location && (
                                  <span className="inline-flex items-center gap-0.5 text-[10px] text-slate-400">
                                    <MapPin className="w-3 h-3" />
                                    {job.location}
                                  </span>
                                )}
                                {job.salary > 0 && (
                                  <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                                    <IndianRupee className="w-3 h-3" />
                                    {job.salary >= 100000
                                      ? `${(job.salary / 100000).toFixed(job.salary % 100000 === 0 ? 0 : 1)} LPA`
                                      : job.salary.toLocaleString("en-IN")}
                                  </span>
                                )}
                                {job.jobType && (
                                  <span className="text-[10px] text-slate-400 font-medium">
                                    {job.jobType}
                                  </span>
                                )}
                              </div>
                            </div>

                            <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 dark:group-hover:text-cyan-400 transition-colors shrink-0 mt-1" />
                          </button>
                        ))}
                      </div>

                      {/* View All Results Footer */}
                      <div className="border-t border-slate-100 dark:border-slate-800">
                        <button
                          type="button"
                          onClick={handleSearchSubmit}
                          className="w-full flex items-center justify-center gap-1.5 p-2.5 text-xs font-bold text-blue-600 dark:text-cyan-400 hover:bg-blue-50/50 dark:hover:bg-cyan-950/20 transition-colors"
                        >
                          <span>
                            View all results {searchQuery ? `for "${searchQuery}"` : ""} →
                          </span>
                        </button>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Area: Actions */}
          <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
            {/* 1. NOT LOGGED IN (Unstop Clean Layout) */}
            {!user ? (
              <>
                {/* "For Employers" Sky-Blue Pill */}
                <button
                  onClick={() => navigate("/register?role=recruiter")}
                  className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200/80 dark:border-sky-800/70 hover:bg-sky-100 dark:hover:bg-sky-900/50 transition-all shadow-xs"
                >
                  <Briefcase className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                  <span>For Employers</span>
                </button>

                {/* "Login" Royal Blue Pill Button */}
                <button
                  onClick={() => navigate("/login")}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs hover:shadow-sm transition-all active:scale-95"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Login</span>
                </button>

                {/* Day / Night Theme Switcher */}
                <button
                  onClick={toggleTheme}
                  title={isDark ? "Switch to Day Mode" : "Switch to Night Mode"}
                  className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
                >
                  {isDark ? (
                    <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                  ) : (
                    <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600" />
                  )}
                </button>
              </>
            ) : (
              /* 2. LOGGED IN STATE */
              <>
                {/* Theme Switcher */}
                <button
                  onClick={toggleTheme}
                  title={isDark ? "Switch to Day Mode" : "Switch to Night Mode"}
                  className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
                >
                  {isDark ? (
                    <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                  ) : (
                    <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600" />
                  )}
                </button>

                {/* Notification Bell */}
                <NotificationBell onNavigate={go} />

                {/* User Profile Avatar Pill & Dropdown */}
                <div ref={profileRef} className="relative shrink-0">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-1 sm:gap-2 p-0.5 sm:px-2.5 sm:py-1 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
                  >
                    <Avatar user={user} />
                    <div className="hidden sm:block text-left">
                      <p className="text-xs font-bold text-slate-900 dark:text-white max-w-[100px] truncate leading-tight">
                        {user.fullname || "User"}
                      </p>
                      <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">
                        {user.role === "student" ? "Candidate" : user.role === "admin" ? "Admin" : "Recruiter"}
                      </p>
                    </div>
                    <ChevronDown className={`hidden sm:block w-3.5 h-3.5 text-slate-400 transition-transform ${profileOpen ? "rotate-180" : ""}`} />
                  </button>

                  {/* Dropdown Panel */}
                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-[calc(100%+8px)] z-50 w-60 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0e1628] p-2 shadow-xl backdrop-blur-xl"
                      >
                        {/* User Header */}
                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 mb-1">
                          <p className="font-bold text-xs text-slate-900 dark:text-white truncate">
                            {user.fullname || "Account"}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {user.email || ""}
                          </p>
                        </div>

                        {/* Navigation Items */}
                        <div className="space-y-0.5">
                          {user.role === "student" && (
                            <>
                              <DropdownItem
                                icon={FileCheck2}
                                label="ATS Resume Checker"
                                onClick={() => go("/ats-checker")}
                              />
                              <DropdownItem
                                icon={History}
                                label="Career History"
                                onClick={() => {
                                  setProfileOpen(false);
                                  setCareerHistoryOpen(true);
                                }}
                              />
                            </>
                          )}

                          {user.role === "recruiter" && (
                            <DropdownItem
                              icon={Briefcase}
                              label="Post a Job"
                              onClick={() => go("/post-job")}
                            />
                          )}

                          {user.role === "admin" && (
                            <DropdownItem
                              icon={ShieldCheck}
                              label="Admin Console"
                              onClick={() => go("/admin-dashboard")}
                            />
                          )}

                          <DropdownItem
                            icon={User}
                            label="Profile Settings"
                            onClick={() => go("/profile")}
                          />
                          <DropdownItem
                            icon={Settings}
                            label="Account Settings"
                            onClick={() => go("/account-settings")}
                          />
                        </div>

                        <div className="my-1.5 h-px bg-slate-100 dark:bg-slate-800" />

                        {/* Logout Button */}
                        <button
                          onClick={handleLogout}
                          disabled={isLoggingOut}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>{isLoggingOut ? "Signing out..." : "Sign out"}</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Candidate Career History Drawer */}
      <CareerHistoryDrawer
        isOpen={careerHistoryOpen}
        onClose={() => setCareerHistoryOpen(false)}
      />
    </>
  );
};

/**
 * DropdownItem Helper Component
 */
const DropdownItem = ({ icon: Icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
  >
    <Icon className="w-4 h-4 text-slate-400" />
    <span>{label}</span>
  </button>
);

/**
 * Avatar Helper Component
 */
const Avatar = ({ user }) => {
  const avatarUrl = user?.profile?.profilePhoto;
  const initial = user?.fullname ? user.fullname.charAt(0).toUpperCase() : "U";

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={user.fullname || "User Avatar"}
        className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-xs"
      />
    );
  }

  return (
    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
      {initial}
    </div>
  );
};

export default Navbar;
