import { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types'; // 1. ADD THIS IMPORT
import Fuse from 'fuse.js';
import { Search, X, Users, AlertTriangle, CheckCircle } from 'lucide-react';

const AdvancedSearch = ({ data, onFilter, placeholder = "Search name, school, or class..." }) => {
    const [query, setQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");

    const fuse = useMemo(() => new Fuse(data, {
        keys: ['name', 'school', 'class', 'district'],
        threshold: 0.3,
        distance: 100,
    }), [data]);

    const handleLogic = (searchQuery, filterType) => {
        let results = [...data];

        if (searchQuery.trim() !== "") {
            const fuzzyResults = fuse.search(searchQuery);
            results = fuzzyResults.map(r => r.item);
        }

        if (filterType === "critical") {
            results = results.filter(s => parseInt(s.riskScore) >= 55);
        } else if (filterType === "stable") {
            results = results.filter(s => parseInt(s.riskScore) < 30);
        }

        onFilter(results);
    };

    useEffect(() => {
        handleLogic("", "all");
    }, [data]);

    const handleSearchChange = (e) => {
        const val = e.target.value;
        setQuery(val);
        handleLogic(val, activeFilter);
    };

    const toggleFilter = (filter) => {
        const newFilter = activeFilter === filter ? "all" : filter;
        setActiveFilter(newFilter);
        handleLogic(query, newFilter);
    };

    return (
        <div className="w-full space-y-6 mb-10">
            {/* Search Bar Container */}
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={handleSearchChange}
                    placeholder={placeholder}
                    className="block w-full pl-14 pr-12 py-5 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-[30px] shadow-xl dark:shadow-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 dark:focus:border-indigo-500 outline-none transition-all text-sm font-bold dark:text-white"
                />
                {query && (
                    <button
                        onClick={() => { setQuery(""); handleLogic("", activeFilter); }}
                        className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-400 hover:text-red-500"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* Categorical Filter Pills */}
            <div className="flex flex-wrap gap-3">
                <button
                    onClick={() => toggleFilter("all")}
                    className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeFilter === 'all' ? 'bg-slate-900 dark:bg-indigo-600 text-white shadow-lg' : 'bg-white dark:bg-slate-800 text-gray-400 border border-gray-100 dark:border-slate-700'}`}
                >
                    <Users className="w-3 h-3" /> All Registry
                </button>

                <button
                    onClick={() => toggleFilter("critical")}
                    className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeFilter === 'critical' ? 'bg-red-600 text-white shadow-lg shadow-red-200/20' : 'bg-white dark:bg-slate-800 text-red-500 border border-red-50 dark:border-red-900/20'}`}
                >
                    <AlertTriangle className="w-3 h-3" /> High Risk
                </button>

                <button
                    onClick={() => toggleFilter("stable")}
                    className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeFilter === 'stable' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200/20' : 'bg-white dark:bg-slate-800 text-emerald-500 border border-emerald-50 dark:border-emerald-900/20'}`}
                >
                    <CheckCircle className="w-3 h-3" /> Stable
                </button>
            </div>
        </div>
    );
};
AdvancedSearch.propTypes = {
    data: PropTypes.array.isRequired,
    onFilter: PropTypes.func.isRequired,
    placeholder: PropTypes.string
};

export default AdvancedSearch;