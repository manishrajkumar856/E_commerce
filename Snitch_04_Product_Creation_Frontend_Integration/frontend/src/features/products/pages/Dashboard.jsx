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
  X
} from "lucide-react";

const Dashboard = () => {
    const sellerProducts = useSelector(state => state.product.sellerProducts);
    const { handleGetSellerProduct } = useProduct();
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        handleGetSellerProduct();
    }, []);

    // Calculate Stats
    const totalProducts = sellerProducts?.length || 0;
    const totalValue = sellerProducts?.reduce((acc, curr) => acc + (Number(curr.price?.amount) || 0), 0) || 0;
    const currency = sellerProducts?.[0]?.price?.currency || 'INR';

    const filteredProducts = sellerProducts?.filter(p => 
        p.title?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    const navItems = [
        { icon: LayoutDashboard, label: "Overview", active: true },
        { icon: Package, label: "Products", active: false },
        { icon: ShoppingCart, label: "Orders", active: false },
        { icon: Users, label: "Customers", active: false },
        { icon: TrendingUp, label: "Analytics", active: false },
        { icon: Settings, label: "Settings", active: false },
    ];

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
                        {navItems.map((item, i) => (
                            <button 
                                key={i} 
                                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${item.active ? 'bg-primary/10 text-primary' : 'hover:bg-primary/5 text-[var(--theme-text-muted)] hover:text-[var(--theme-text)]'}`}
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="text-sm font-bold uppercase tracking-widest">{item.label}</span>
                                {item.active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
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
                            <span className="text-[var(--theme-text)]">Products</span>
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

                <div className="p-6 md:p-12 overflow-y-auto max-w-7xl">
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
                            <button className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-[var(--theme-border)] text-[10px] font-bold uppercase tracking-widest hover:bg-[var(--theme-border)] transition-all">
                                <Filter className="w-3.5 h-3.5" />
                                <span>Filter</span>
                            </button>
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
                                                    <div className="flex items-center gap-5">
                                                        <div className="w-16 h-20 rounded-2xl overflow-hidden bg-[var(--theme-bg)] shrink-0 group-hover:scale-105 transition-transform duration-500">
                                                            <img 
                                                                src={product.images?.[0]?.url || 'https://via.placeholder.com/600'} 
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
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className="text-xs font-bold text-[var(--theme-text-muted)] uppercase tracking-widest">Lifestyle</span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-black tracking-tight">{product.price?.currency} {product.price?.amount}</span>
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
                                    <p className="text-[var(--theme-text-muted)] text-sm uppercase font-bold tracking-[0.2em]">No entities found fitting this criteria.</p>
                                </div>
                            )}
                        </div>
                    </div>
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
                            {navItems.map((item, i) => (
                                <button key={i} className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl ${item.active ? 'bg-primary/10 text-primary' : 'text-[var(--theme-text-muted)]'}`}>
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