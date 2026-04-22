import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useProduct } from "../hooks/useProduct";
import { Link } from "react-router";
import {
    Plus,
    TrendingUp,
    Package,
    DollarSign,
    Search,
    Filter,
    MoreVertical,
    Edit,
    Trash2,
    ExternalLink,
    ChevronRight,
    LayoutDashboard,
    ShoppingCart,
    Users,
    Settings,
    HelpCircle,
    Menu,
    X,
    Layers,
} from "lucide-react";

const Dashboard = () => {
    const sellerProducts = useSelector(state => state.product.sellerProducts);
    const { handleGetSellerProduct } = useProduct();
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeNav, setActiveNav] = useState("Overview");

    useEffect(() => {
        handleGetSellerProduct();
    }, []);

    // Calculate Stats
    const totalProducts = sellerProducts?.length || 0;
    const totalValue = sellerProducts?.reduce((acc, curr) => {
        const productPrice = curr.price?.amount || curr.variants?.[0]?.price?.amount || 0;
        return acc + (Number(productPrice) || 0);
    }, 0) || 0;
    const currency = sellerProducts?.[0]?.price?.currency || sellerProducts?.[0]?.variants?.[0]?.price?.currency || 'INR';

    const filteredProducts = sellerProducts?.filter(p =>
        p.title?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    const navItems = [
        { icon: LayoutDashboard, label: "Overview" },
        { icon: Package, label: "Products" },
        { icon: ShoppingCart, label: "Orders" },
        { icon: Users, label: "Customers" },
        { icon: TrendingUp, label: "Analytics" },
        { icon: Settings, label: "Settings" },
    ];

    // ── Seller Product Card (for Products view) ──
    const SellerProductCard = ({ product }) => (
        <Link
            to={`/seller/products/${product._id}`}
            className="group relative flex flex-col bg-[var(--theme-card-bg)] border border-[var(--theme-border)] rounded-[28px] overflow-hidden hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500"
        >
            {/* Image */}
            <div className="aspect-[3/4] relative overflow-hidden bg-[var(--theme-bg)]">
                <img
                    src={product.images?.[0]?.url || product.variants?.[0]?.images?.[0]?.url || 'https://via.placeholder.com/400x500?text=No+Image'}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />

                {/* Top badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <span className="px-3 py-1 bg-primary/90 text-black text-[9px] font-black uppercase tracking-widest">
                        Active
                    </span>
                </div>

                {/* Hover CTA */}
                <div className="absolute inset-x-4 bottom-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="flex items-center justify-center gap-3 py-3 bg-white/90 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-black">
                        <ExternalLink className="w-3.5 h-3.5" />
                        Manage Entity
                    </div>
                </div>

                {/* Variant count chip */}
                {product.variants?.length > 0 && (
                    <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 bg-black/70 backdrop-blur-md text-[9px] font-black uppercase text-white">
                        <Layers className="w-3 h-3" />
                        {product.variants.length}
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="p-5 flex flex-col gap-3">
                <div>
                    <h3 className="font-display font-black text-sm uppercase italic tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
                        {product.title?.replace(/['"]/g, '')}
                    </h3>
                    <p className="text-[9px] font-bold text-[var(--theme-text-muted)] uppercase tracking-[0.2em] mt-1">
                        SKU: {product._id?.slice(-6).toUpperCase()}
                    </p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-[var(--theme-border)]">
                    <span className="font-black text-primary text-lg">
                        {(product.price?.currency || product.variants?.[0]?.price?.currency) === 'INR' ? '₹' : (product.price?.currency || product.variants?.[0]?.price?.currency)}
                        {(product.price?.amount || product.variants?.[0]?.price?.amount)?.toLocaleString()}
                    </span>
                    <div className="text-[9px] font-black text-[var(--theme-text-muted)] uppercase tracking-widest">
                        {product.variants?.length || 0} variants
                    </div>
                </div>
            </div>
        </Link>
    );

    return (
        <div className="min-h-screen bg-[var(--theme-bg)] flex transition-colors duration-700">
            {/* Sidebar - Desktop */}
            <aside className="hidden lg:flex w-72 flex-col border-r border-[var(--theme-border)] bg-[var(--theme-card-bg)]/50 backdrop-blur-xl shrink-0">
                <div className="p-8">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 bg-primary-gradient rounded-xl flex items-center justify-center">
                            <Package className="text-white w-5 h-5" />
                        </div>
                        <span className="font-display font-black tracking-tighter text-xl">SELLER HUB</span>
                    </div>

                    <nav className="space-y-1">
                        {navItems.map((item) => (
                            <button
                                key={item.label}
                                onClick={() => setActiveNav(item.label)}
                                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${activeNav === item.label
                                        ? 'bg-primary/10 text-primary'
                                        : 'hover:bg-primary/5 text-[var(--theme-text-muted)] hover:text-[var(--theme-text)]'
                                    }`}
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="text-sm font-bold uppercase tracking-widest">{item.label}</span>
                                {activeNav === item.label && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="mt-auto p-8 border-t border-[var(--theme-border)]">
                    <div className="p-4 rounded-3xl bg-secondary/5 border border-secondary/10 flex flex-col gap-3">
                        <p className="text-[10px] font-black uppercase text-secondary tracking-widest">Support Center</p>
                        <p className="text-[11px] text-[var(--theme-text-muted)] leading-relaxed">Need help with your entities?</p>
                        <button className="flex items-center gap-2 text-secondary text-[11px] font-bold mt-1">
                            <HelpCircle className="w-3.5 h-3.5" />
                            <span>Read Documents</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow flex flex-col min-w-0">
                {/* Secondary Header */}
                <header className="h-20 border-b border-[var(--theme-border)] flex items-center justify-between px-6 md:px-12 bg-[var(--theme-bg)]/80 backdrop-blur-md sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <button
                            className="lg:hidden p-2 hover:bg-[var(--theme-border)] rounded-full transition-colors"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <div className="hidden md:flex items-center gap-2 text-[10px] uppercase font-bold tracking-[0.2em] text-[var(--theme-text-muted)]">
                            <span className="hover:text-primary cursor-pointer transition-colors">Seller Portal</span>
                            <ChevronRight className="w-3 h-3" />
                            <span className="text-[var(--theme-text)]">{activeNav}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="relative group hidden sm:block">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--theme-text-muted)] group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Search collection..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-[var(--theme-input-bg)] border border-[var(--theme-border)] rounded-full py-2.5 pl-12 pr-6 text-xs focus:outline-none focus:border-primary/50 w-64 transition-all duration-500"
                            />
                        </div>
                        <Link
                            to="/seller/create-product"
                            className="flex items-center gap-2 bg-primary-gradient px-6 py-3 rounded-full text-white font-display font-black uppercase text-[10px] tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all duration-500"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Entity</span>
                        </Link>
                    </div>
                </header>

                <div className="p-6 md:p-12 overflow-y-auto">

                    {/* ══════════════════════════════════════════
                        OVERVIEW VIEW
                    ══════════════════════════════════════════ */}
                    {activeNav === "Overview" && (
                        <div className="max-w-7xl">
                            {/* Hero Stats */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-12 animate-fade-up">
                                {[
                                    { label: "Gross Revenue", value: `${currency} ${totalValue.toLocaleString()}`, icon: DollarSign, trend: "+12.5%", positive: true },
                                    { label: "Active Entities", value: totalProducts, icon: Package, trend: "+2", positive: true },
                                    { label: "Total Orders", value: "142", icon: ShoppingCart, trend: "-3.2%", positive: false },
                                    { label: "Conversion", value: "4.8%", icon: TrendingUp, trend: "+0.4%", positive: true },
                                ].map((stat, i) => (
                                    <div key={i} className="p-6 md:p-8 rounded-[32px] bg-[var(--theme-card-bg)] border border-[var(--theme-border)] relative overflow-hidden group">
                                        <div className="relative z-10 flex flex-col gap-4">
                                            <div className="flex items-center justify-between">
                                                <div className="p-3 rounded-2xl bg-[var(--theme-bg)] border border-[var(--theme-border)]">
                                                    <stat.icon className="w-5 h-5 text-primary" />
                                                </div>
                                                <div className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${stat.positive ? 'bg-primary/10 text-primary' : 'bg-red-500/10 text-red-500'}`}>
                                                    {stat.trend}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--theme-text-muted)] mb-1">{stat.label}</p>
                                                <h3 className="text-3xl font-display font-black tracking-tighter">{stat.value}</h3>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Management Table */}
                            <div className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-2xl font-display font-black tracking-tightest uppercase">My Collection</h2>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setActiveNav("Products")}
                                            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold uppercase tracking-widest hover:bg-primary/20 transition-all"
                                        >
                                            <Package className="w-3.5 h-3.5" />
                                            <span>View as Cards</span>
                                        </button>
                                        <button className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-[var(--theme-border)] text-[10px] font-bold uppercase tracking-widest hover:bg-[var(--theme-border)] transition-all">
                                            <Filter className="w-3.5 h-3.5" />
                                            <span>Filter</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-[var(--theme-card-bg)] rounded-[40px] border border-[var(--theme-border)] overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="border-b border-[var(--theme-border)]">
                                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--theme-text-muted)]">Product</th>
                                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--theme-text-muted)]">Category</th>
                                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--theme-text-muted)]">Price</th>
                                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--theme-text-muted)]">Status</th>
                                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--theme-text-muted)] text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-[var(--theme-border)]">
                                                {filteredProducts.map((product) => (
                                                    <tr key={product._id} className="group hover:bg-primary/5 transition-colors">
                                                        <td className="px-8 py-6">
                                                            <Link to={`/seller/products/${product._id}`} className="flex items-center gap-5">
                                                                <div className="w-16 h-20 rounded-2xl overflow-hidden bg-[var(--theme-bg)] shrink-0 group-hover:scale-105 transition-transform duration-500 border border-[var(--theme-border)] group-hover:border-primary/30">
                                                                    <img
                                                                        src={product.images?.[0]?.url || product.variants?.[0]?.images?.[0]?.url || 'https://via.placeholder.com/600'}
                                                                        className="w-full h-full object-cover"
                                                                        alt=""
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-display font-black text-sm uppercase tracking-tight line-clamp-1 mb-1 group-hover:text-primary transition-colors">
                                                                        {product.title?.replace(/['"]/g, '')}
                                                                    </h4>
                                                                    <p className="text-[10px] font-bold text-[var(--theme-text-muted)] uppercase tracking-widest">
                                                                        SKU: {product._id.slice(-6).toUpperCase()}
                                                                    </p>
                                                                </div>
                                                            </Link>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <span className="text-xs font-bold text-[var(--theme-text-muted)] uppercase tracking-widest">Lifestyle</span>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-black tracking-tight">
                                                                    {product.price?.currency || product.variants?.[0]?.price?.currency} {product.price?.amount || product.variants?.[0]?.price?.amount}
                                                                </span>
                                                                <span className="text-[9px] font-bold text-primary uppercase tracking-widest">Base Rate</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                                                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Active</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <Link
                                                                    to={`/seller/products/${product._id}`}
                                                                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-[var(--theme-bg)] border border-[var(--theme-border)] hover:border-primary hover:text-primary transition-all"
                                                                    title="Manage"
                                                                >
                                                                    <ExternalLink className="w-4 h-4" />
                                                                </Link>
                                                                <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-[var(--theme-bg)] border border-[var(--theme-border)] hover:border-primary hover:text-primary transition-all group/btn">
                                                                    <Edit className="w-4 h-4" />
                                                                </button>
                                                                <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-[var(--theme-bg)] border border-[var(--theme-border)] hover:border-red-500 hover:text-red-500 transition-all group/btn">
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                                <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-[var(--theme-bg)] border border-[var(--theme-border)] hover:border-[var(--theme-text)] transition-all">
                                                                    <MoreVertical className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {filteredProducts.length === 0 && (
                                        <div className="py-20 text-center">
                                            <Package className="w-12 h-12 text-[var(--theme-text-muted)]/30 mx-auto mb-4" />
                                            <p className="text-[var(--theme-text-muted)] text-sm uppercase font-bold tracking-[0.2em] mb-6">No entities found fitting this criteria.</p>
                                            <Link
                                                to="/seller/create-product"
                                                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-black text-[10px] font-black uppercase tracking-widest"
                                            >
                                                <Plus className="w-3.5 h-3.5" /> Create First Entity
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ══════════════════════════════════════════
                        PRODUCTS VIEW — Card Grid
                    ══════════════════════════════════════════ */}
                    {activeNav === "Products" && (
                        <div className="animate-fade-up">
                            {/* Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="w-6 h-0.5 bg-primary" />
                                        <span className="text-[9px] font-black uppercase tracking-[0.35em] text-primary">Seller Inventory</span>
                                    </div>
                                    <h2 className="text-4xl font-display font-black uppercase italic tracking-tighter">
                                        My <span className="text-primary">Collection</span>
                                    </h2>
                                    <p className="text-[11px] text-[var(--theme-text-muted)] uppercase tracking-widest mt-1">
                                        {filteredProducts.length} {filteredProducts.length === 1 ? 'entity' : 'entities'} in archive
                                    </p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Link
                                        to="/seller/create-product"
                                        className="flex items-center gap-2 bg-primary px-6 py-3 text-black font-display font-black uppercase text-[10px] tracking-widest hover:scale-105 active:scale-95 transition-all"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        New Entity
                                    </Link>
                                </div>
                            </div>

                            {/* Card Grid */}
                            {filteredProducts.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                                    {filteredProducts.map((product) => (
                                        <SellerProductCard key={product._id} product={product} />
                                    ))}

                                    {/* Add new card */}
                                    <Link
                                        to="/seller/create-product"
                                        className="group aspect-[3/4] border-2 border-dashed border-primary/20 hover:border-primary/50 bg-primary/5 hover:bg-primary/10 rounded-[28px] flex flex-col items-center justify-center gap-4 transition-all duration-500"
                                    >
                                        <div className="w-14 h-14 border-2 border-primary/30 group-hover:border-primary flex items-center justify-center transition-all duration-300 group-hover:rotate-45">
                                            <Plus className="w-6 h-6 text-primary/40 group-hover:text-primary transition-colors" />
                                        </div>
                                        <div className="text-center px-4">
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60 group-hover:text-primary transition-colors">New Drop</p>
                                            <p className="text-[9px] text-[var(--theme-text-muted)] mt-1">Add to archive</p>
                                        </div>
                                    </Link>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-32 gap-6">
                                    <div className="w-20 h-20 border-2 border-dashed border-[var(--theme-border)] flex items-center justify-center">
                                        <Package className="w-8 h-8 text-[var(--theme-text-muted)]/40" />
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-xl font-display font-black uppercase italic mb-2">Collection Empty</h3>
                                        <p className="text-[11px] text-[var(--theme-text-muted)] uppercase tracking-widest">No products in your archive yet.</p>
                                    </div>
                                    <Link
                                        to="/seller/create-product"
                                        className="flex items-center gap-2 bg-primary px-8 py-4 text-black text-[10px] font-black uppercase tracking-widest"
                                    >
                                        <Plus className="w-3.5 h-3.5" /> Create First Entity
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Coming Soon views */}
                    {!["Overview", "Products"].includes(activeNav) && (
                        <div className="flex flex-col items-center justify-center py-32 gap-4 animate-fade-up">
                            <div className="text-6xl font-display font-black uppercase italic text-[var(--theme-text-muted)]/20">{activeNav}</div>
                            <p className="text-[11px] text-[var(--theme-text-muted)] uppercase tracking-[0.3em]">Coming soon to the archive</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden animate-fade-in" onClick={() => setSidebarOpen(false)}>
                    <div className="absolute inset-y-0 left-0 w-72 bg-[var(--theme-bg)] p-8 animate-slide-right shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-10">
                            <span className="font-display font-black tracking-tighter text-xl uppercase">Seller Hub</span>
                            <button onClick={() => setSidebarOpen(false)}>
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <nav className="space-y-2">
                            {navItems.map((item) => (
                                <button
                                    key={item.label}
                                    onClick={() => { setActiveNav(item.label); setSidebarOpen(false); }}
                                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl ${activeNav === item.label ? 'bg-primary/10 text-primary' : 'text-[var(--theme-text-muted)]'}`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="text-sm font-bold uppercase tracking-widest">{item.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;