import { useEffect, useState, useMemo } from "react";
import { useProduct } from "../hooks/useProduct";
import { useSelector } from "react-redux";
import ProductCard from "../components/ProductCard";
import { Filter, ChevronDown, Search, X } from "lucide-react";

const CATEGORIES = ["All", "Shirts", "Pants", "Hoodies", "Accessories"];

const HomePage = () => {
    const { handleGetAllProducts } = useProduct();
    const products = useSelector(state => state.product.products);

    const [selectedCategory, setSelectedCategory] = useState("All");
    const [priceRange, setPriceRange] = useState(10000);
    const [searchQuery, setSearchQuery] = useState("");
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    useEffect(() => {
        handleGetAllProducts();
    }, []);

    const filteredProducts = useMemo(() => {
        if (!products) return [];
        return products.filter(product => {
            const matchesCategory = selectedCategory === "All" ||
                (product.category && product.category.toLowerCase() === selectedCategory.toLowerCase()) ||
                (product.title.toLowerCase().includes(selectedCategory.toLowerCase()));

            const productPrice = product.price?.amount || product.variants?.[0]?.price?.amount || 0;
            const matchesPrice = productPrice <= priceRange;
            const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description?.toLowerCase().includes(searchQuery.toLowerCase());

            return matchesCategory && matchesPrice && matchesSearch;
        });
    }, [products, selectedCategory, priceRange, searchQuery]);

    return (
        <div className="min-h-screen bg-[var(--theme-bg)] transition-colors duration-300">
            {/* Hero Section */}
            <div className="pt-32 pb-16 px-6 md:px-12 lg:px-24">
                <div className="max-w-screen-2xl mx-auto text-center md:text-left">
                    <h1 className="font-display text-5xl md:text-7xl font-black text-[var(--theme-text)] mb-4 leading-tight tracking-tight uppercase">
                        The <span className="text-primary italic">Snitch</span> Drop
                    </h1>
                    <p className="font-sans text-lg text-[var(--theme-text-muted)] max-w-xl leading-relaxed">
                        Explore our latest archival pieces. Minimalist designs for the architectural mind.
                    </p>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="sticky top-0 z-40 bg-[var(--theme-bg)]/80 backdrop-blur-xl border-b border-[var(--theme-border)] px-6 md:px-12 lg:px-24 py-6">
                <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
                    {/* Categories */}
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-6 py-2 text-sm font-bold tracking-widest uppercase transition-all duration-300 rounded-full whitespace-nowrap ${selectedCategory === cat
                                    ? "bg-primary text-white"
                                    : "bg-[var(--theme-input-bg)] text-[var(--theme-text-muted)] hover:text-[var(--theme-text)]"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Filter Actions */}
                    <div className="flex items-center gap-4">
                        <div className="relative group flex-1 md:w-64">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--theme-text-muted)] group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Search archives..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-[var(--theme-input-bg)] rounded-xl border-none focus:ring-2 focus:ring-primary/50 transition-all text-sm font-sans text-[var(--theme-text)]"
                            />
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all ${isFilterOpen ? 'bg-primary text-white' : 'bg-[var(--theme-input-bg)] text-[var(--theme-text)]'
                                    }`}
                            >
                                <Filter className="w-4 h-4" />
                                <span className="text-sm font-bold uppercase tracking-tighter">Budget</span>
                            </button>

                            {isFilterOpen && (
                                <div className="absolute right-0 mt-4 w-72 bg-[var(--theme-card-bg)] shadow-2xl rounded-2xl p-6 border border-[var(--theme-border)] z-50 animate-fade-up">
                                    <div className="flex justify-between items-center mb-6">
                                        <h4 className="font-bold text-[var(--theme-text)]">Price Limit</h4>
                                        <button onClick={() => setIsFilterOpen(false)}><X className="w-4 h-4" /></button>
                                    </div>
                                    <div className="flex flex-col gap-6">
                                        <div>
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="font-sans text-sm text-[var(--theme-text-muted)]">Max</span>
                                                <span className="font-sans font-black text-primary text-lg">₹{priceRange}</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="0"
                                                max="15000"
                                                step="100"
                                                value={priceRange}
                                                onChange={(e) => setPriceRange(parseInt(e.target.value))}
                                                className="w-full accent-primary h-2 bg-[var(--theme-input-bg)] rounded-full appearance-none cursor-pointer"
                                            />
                                        </div>
                                        <button
                                            onClick={() => {
                                                setPriceRange(15000);
                                                setIsFilterOpen(false);
                                            }}
                                            className="w-full py-3 text-xs font-black uppercase bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-colors"
                                        >
                                            Reset Price
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Grid */}
            <div className="px-6 md:px-12 lg:px-24 py-16">
                <div className="max-w-screen-2xl mx-auto">
                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {filteredProducts.map(product => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-32 text-center">
                            <Search className="w-16 h-16 text-[var(--theme-text-muted)] opacity-20 mb-6" />
                            <h3 className="font-display text-2xl font-bold text-[var(--theme-text)] mb-2">No Archives Found</h3>
                            <p className="text-[var(--theme-text-muted)] max-w-xs mx-auto">
                                Adjust your filters to explore deeper into the collection.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default HomePage;