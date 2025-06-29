import { useState } from "react";

export default function AlumniSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) {
      setStatus("❗ Please enter a valid search query.");
      return;
    }

    setLoading(true);
    setStatus("🔍 Searching...");
    setResults([]);

    try {
      const res = await fetch("http://127.0.0.1:8000/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
      if (Array.isArray(data.results) && data.results.length > 0) {
        setResults(data.results);
        setStatus(`✅ Found ${data.results.length} result(s).`);
      } else {
        setStatus("🚫 No alumni found.");
      }
    } catch (error) {
      console.error("❌ Search error:", error);
      setStatus(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setStatus("");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-center text-blue-800 mb-6">
        🎓 Alumni Search Portal
      </h2>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g., Data Scientist Google"
          className="w-full sm:w-80 border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div className="flex gap-2">
          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
          <button
            onClick={clearSearch}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition"
          >
            Clear
          </button>
        </div>
      </div>

      {status && (
        <p className="text-center text-sm text-gray-600 mb-4">{status}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((alumni, idx) => (
          <div
            key={idx}
            className="bg-white border border-gray-200 rounded-xl p-4 shadow hover:shadow-md transition"
          >
            <h3 className="text-lg font-semibold text-blue-700">
              {alumni.name}
            </h3>
            <div className="text-sm text-gray-700 mt-2 space-y-1">
              <p>🏢 <span className="font-medium">{alumni.current_company}</span></p>
              <p>💼 <span className="font-medium">{alumni.domain}</span></p>
              <p>🏫 <span className="font-medium">{alumni.department}</span></p>
              <p>🎓 Batch: <span className="font-medium">{alumni.batch}</span></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
