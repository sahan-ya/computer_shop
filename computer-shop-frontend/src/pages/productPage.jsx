import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ProductCard from "../components/productCard";
import LoadingAnimation from "../components/loadingAnimation";
import { IoSearchOutline } from "react-icons/io5";

export default function ProductPage() {
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [category, setCategory]   = useState("All");
  const [sort, setSort]           = useState("featured");

  useEffect(() => {
    if (!loading) return;
    axios
      .get(import.meta.env.VITE_API_URL + "/products")
      .then((res) => { setProducts(res.data); setLoading(false); })
      .catch(() => { toast.error("Failed to fetch products."); setLoading(false); });
  }, [loading]);

  // Derive categories from real product data
  const categories = ["All", ...new Set(products.map((p) => p.category).filter(Boolean))];

  // Filter + sort
  const filtered = products
    .filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.productId?.toLowerCase().includes(search.toLowerCase()) ||
        p.brand?.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "All" || p.category === category;
      return matchSearch && matchCat;
    })
    .sort((a, b) => {
      if (sort === "price-asc")  return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "newest")     return new Date(b.createdAt) - new Date(a.createdAt);
      return 0; // featured — keep original order
    });

  return (
    <div className="min-h-[calc(100vh-100px)] bg-gray-50">

      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 px-5 py-3 flex flex-wrap items-center gap-3 sticky top-[100px] z-10">

        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products, brands..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-700 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
          />
        </div>

        {/* Category pills */}
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors
                ${category === cat
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="ml-auto px-3 py-2 text-xs border border-gray-200 rounded-xl bg-white text-gray-600 focus:outline-none cursor-pointer"
        >
          <option value="featured">Sort: Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="newest">Newest First</option>
        </select>
      </div>

      {/* Results count */}
      {!loading && (
        <div className="px-5 pt-4 pb-1">
          <p className="text-xs text-gray-400">
            {filtered.length} product{filtered.length !== 1 ? "s" : ""} found
            {search && <span> for "<span className="text-gray-600">{search}</span>"</span>}
          </p>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-32">
          <LoadingAnimation />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-gray-400">
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-sm font-medium">No products found</p>
          <p className="text-xs mt-1">Try a different search or category</p>
          <button
            onClick={() => { setSearch(""); setCategory("All"); }}
            className="mt-4 px-4 py-2 text-xs border border-gray-300 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 px-5 py-4">
          {filtered.map((item) => (
            <ProductCard product={item} key={item.productId} />
          ))}
        </div>
      )}
    </div>
  );
}