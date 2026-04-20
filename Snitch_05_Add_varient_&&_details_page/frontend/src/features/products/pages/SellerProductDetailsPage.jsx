import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { useProduct } from "../hooks/useProduct";
import { useSelector } from "react-redux";
import {
    ShoppingBag,
    ChevronRight,
    Heart,
    Share2,
    ShieldCheck,
    Truck,
    RefreshCw,
    Plus,
    Layers,
} from "lucide-react";
import ProductCard from "../components/ProductCard";
import AddVariantForm from "../components/AddVariantForm";

const SellerProductDetailsPage = () => {
    const { id } = useParams();
    const { handleGetProductById, handleGetAllProducts, handleAddVariant } = useProduct();
    const [product, setProduct] = useState(null);
    const allProducts = useSelector(state => state.product.products);

    const [activeImage, setActiveImage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isVariantFormOpen, setVariantFormOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");

    const fetchProduct = async () => {
        setLoading(true);
        const data = await handleGetProductById(id);
        // handleGetProductById may return array (same as ProductDetailsPage) or object
        setProduct(Array.isArray(data) ? data[0] : data);
        await handleGetAllProducts();
        setLoading(false);
    };

    useEffect(() => {
        fetchProduct();
        window.scrollTo(0, 0);
    }, [id]);

    const recommendedItems = allProducts
        ? allProducts.filter(p => p._id !== id).slice(0, 4)
        : [];

    const onAddVariant = async (formData) => {
        setIsSubmitting(true);
        try {
            await handleAddVariant(id, formData);
            await fetchProduct();
            setVariantFormOpen(false);
            setSuccessMsg("Variant added successfully!");
            setTimeout(() => setSuccessMsg(""), 3000);
        } catch (error) {
            console.error("Failed to add variant:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--theme-bg)]">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--theme-bg)] gap-6">
                <h2 className="font-display text-4xl font-black text-[var(--theme-text)]">Product Lost in Archive</h2>
                <Link to="/seller/dashboard" className="px-8 py-4 bg-primary text-white rounded-xl uppercase tracking-widest text-xs font-black shadow-xl shadow-primary/20">
                    Return to Dashboard
                </Link>
            </div>
        );
    }

    const variantCount = product.variants?.length || 0;

    return (
        <div className="min-h-screen bg-[var(--theme-bg)] pb-32">

            {/* Success Toast */}
            {successMsg && (
                <div className="fixed top-6 right-6 z-50 px-6 py-4 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/30 animate-fade-in">
                    {successMsg}
                </div>
            )}

            {/* Breadcrumbs — same as ProductDetailsPage */}
            <div className="pt-24 px-6 md:px-12 lg:px-24">
                <nav className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[var(--theme-text-muted)] mb-12">
                    <Link to="/seller/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
                    <ChevronRight className="w-3 h-3" />
                    <Link to="/seller/dashboard" className="hover:text-primary transition-colors">Collection</Link>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-[var(--theme-text)] line-clamp-1">{product.title}</span>
                </nav>
            </div>

            {/* Main Content — identical layout to ProductDetailsPage */}
            <div className="px-6 md:px-12 lg:px-24 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">

                {/* Image Gallery — exact copy */}
                <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-6">
                    {/* Thumbnails */}
                    <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible no-scrollbar">
                        {product.images?.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveImage(idx)}
                                className={`flex-shrink-0 w-20 aspect-[3/4] overflow-hidden rounded-xl border-2 transition-all duration-300 ${activeImage === idx ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'}`}
                            >
                                <img src={img.url} alt="" className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>

                    {/* Main Image */}
                    <div className="flex-1 aspect-[3/4] overflow-hidden bg-[var(--theme-card-bg)] rounded-2xl group border border-[var(--theme-border)] relative">
                        <img
                            src={product.images?.[activeImage]?.url}
                            alt={product.title}
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                        {/* Seller badge overlay — only difference from consumer page */}
                        <div className="absolute top-4 left-4">
                            <span className="px-3 py-1.5 bg-black/60 backdrop-blur-md text-primary text-[9px] font-black uppercase tracking-widest rounded-full">
                                Your Product
                            </span>
                        </div>
                    </div>
                </div>

                {/* Product Info — same structure as ProductDetailsPage */}
                <div className="lg:col-span-5 flex flex-col pt-4">
                    <div className="mb-8">
                        <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black tracking-[0.2em] uppercase rounded-full mb-6">
                            Seller Managed · {variantCount} {variantCount === 1 ? 'Variant' : 'Variants'}
                        </span>
                        <h1 className="font-display text-4xl md:text-5xl font-black text-[var(--theme-text)] mb-6 leading-tight uppercase">
                            {product.title}
                        </h1>
                        <div className="flex items-center gap-4">
                            <span className="font-sans text-4xl font-black text-primary">
                                {product.price?.currency === 'INR' ? '₹' : product.price?.currency} {product.price?.amount?.toLocaleString()}
                            </span>
                        </div>
                    </div>

                    <div className="bg-[var(--theme-card-bg)] border border-[var(--theme-border)] rounded-2xl p-6 mb-8">
                        <h4 className="text-xs font-black uppercase tracking-widest text-[var(--theme-text)] mb-3">Manifesto</h4>
                        <p className="font-sans text-[var(--theme-text-muted)] leading-relaxed text-sm">
                            {product.description || "A masterfully crafted piece designed for those who appreciate archival silhouettes and high-performance textiles."}
                        </p>
                    </div>

                    {/* ── ACTIONS ── */}
                    <div className="flex flex-col gap-4 mb-12">

                        {/* ── PRIMARY: Add Variant — active & primary ── */}
                        <button
                            onClick={() => setVariantFormOpen(true)}
                            className="flex items-center justify-center gap-3 w-full py-5 bg-primary text-white font-black tracking-widest uppercase text-sm hover:bg-primary-dark transition-all rounded-2xl shadow-xl shadow-primary/20"
                        >
                            <Plus className="w-5 h-5" />
                            Add Variant
                        </button>

                        {/* ── DISABLED: Acquire Item (same as "Acquire Item" in ProductDetailsPage) ── */}
                        <button
                            disabled
                            className="flex items-center justify-center gap-3 w-full py-5 bg-[var(--theme-card-bg)] text-[var(--theme-text-muted)] font-black tracking-widest uppercase text-sm rounded-2xl border border-[var(--theme-border)] cursor-not-allowed opacity-50 line-through"
                            title="Sellers cannot purchase their own products"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            Acquire Item
                        </button>

                        {/* ── DISABLED: Add to Registry ── */}
                        <button
                            disabled
                            className="flex items-center justify-center gap-3 w-full py-5 border border-[var(--theme-border)] text-[var(--theme-text-muted)] font-black tracking-widest uppercase text-sm rounded-2xl cursor-not-allowed opacity-50"
                            title="Sellers cannot add their own products to registry"
                        >
                            <Heart className="w-5 h-5" />
                            Add to Registry
                        </button>

                        {/* Disabled notice */}
                        <p className="text-center text-[10px] text-[var(--theme-text-muted)] uppercase tracking-widest">
                            Purchase actions are disabled for your own products
                        </p>
                    </div>

                    {/* Variant Overview */}
                    {variantCount > 0 && (
                        <div className="bg-[var(--theme-card-bg)] border border-[var(--theme-border)] rounded-2xl p-6 mb-8">
                            <div className="flex items-center gap-3 mb-4">
                                <Layers className="w-4 h-4 text-primary" />
                                <h4 className="text-xs font-black uppercase tracking-widest text-[var(--theme-text)]">Variant Overview</h4>
                            </div>
                            <div className="space-y-3">
                                {product.variants.slice(0, 3).map((v, i) => (
                                    <div key={i} className="flex items-center justify-between py-2 border-b border-[var(--theme-border)] last:border-0">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-10 rounded overflow-hidden border border-[var(--theme-border)]">
                                                <img src={v.images?.[0]?.url || product.images?.[0]?.url} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest">
                                                {v.attributes?.map(a => a.value).join(' · ') || `Config #${i + 1}`}
                                            </span>
                                        </div>
                                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{v.stock ?? 0} in stock</span>
                                    </div>
                                ))}
                                {variantCount > 3 && (
                                    <p className="text-[10px] text-[var(--theme-text-muted)] uppercase tracking-widest text-center pt-1">+{variantCount - 3} more variants</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Meta Info — same as ProductDetailsPage */}
                    <div className="grid grid-cols-2 gap-4 pb-12 border-b border-[var(--theme-border)] mb-12">
                        <div className="flex items-center gap-3 text-[var(--theme-text-muted)]">
                            <Truck className="w-4 h-4 text-primary" />
                            <span className="text-[10px] font-bold uppercase tracking-tighter">Complimentary Logistics</span>
                        </div>
                        <div className="flex items-center gap-3 text-[var(--theme-text-muted)]">
                            <RefreshCw className="w-4 h-4 text-primary" />
                            <span className="text-[10px] font-bold uppercase tracking-tighter">Archival Exchange</span>
                        </div>
                        <div className="flex items-center gap-3 text-[var(--theme-text-muted)]">
                            <ShieldCheck className="w-4 h-4 text-primary" />
                            <span className="text-[10px] font-bold uppercase tracking-tighter">Authenticity Verified</span>
                        </div>
                        <div className="flex items-center gap-3 text-[var(--theme-text-muted)]">
                            <Share2 className="w-4 h-4 text-primary" />
                            <span className="text-[10px] font-bold uppercase tracking-tighter">Share & Promote</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recommended Items — same as ProductDetailsPage */}
            <div className="mt-32 px-6 md:px-12 lg:px-24">
                <div className="max-w-screen-2xl mx-auto">
                    <div className="flex items-end justify-between gap-8 mb-16">
                        <div>
                            <span className="text-primary font-black tracking-[0.3em] uppercase text-xs mb-4 block underline underline-offset-8">Complementary</span>
                            <h2 className="font-display text-4xl md:text-5xl font-black text-[var(--theme-text)] uppercase">
                                Refined <span className="text-primary italic font-normal">Selections</span>
                            </h2>
                        </div>
                        <Link to="/" className="hidden md:flex items-center gap-2 font-black text-xs tracking-widest uppercase text-primary hover:gap-4 transition-all">
                            Explore All Archives <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {recommendedItems.map(p => (
                            <ProductCard key={p._id} product={p} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Add Variant Form Modal */}
            <AddVariantForm
                isOpen={isVariantFormOpen}
                onClose={() => setVariantFormOpen(false)}
                onSubmit={onAddVariant}
                isSubmitting={isSubmitting}
            />
        </div>
    );
};

export default SellerProductDetailsPage;
