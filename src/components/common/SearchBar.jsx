import { forwardRef } from "react";
import { Search } from "lucide-react";

// Kita bungkus component dengan forwardRef
const SearchBar = forwardRef(({ searchTerm, handleSearch }, ref) => {
  return (
    <div className="relative">
      <input
        ref={ref} // Sambungkan ref di sini
        type="text"
        placeholder="Cari data..."
        className="p-1 pl-10 placeholder-gray-400 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
        onChange={handleSearch}
        value={searchTerm}
      />
      {/* Sedikit saran style: top-1/2 dan -translate-y-1/2 biasanya lebih presisi untuk centering vertikal daripada top-2 fix */}
      <Search className="absolute left-3 top-2 text-gray-400" size={18} />
    </div>
  );
});

// Penting untuk debugging di React DevTools
SearchBar.displayName = "SearchBar";

export default SearchBar;