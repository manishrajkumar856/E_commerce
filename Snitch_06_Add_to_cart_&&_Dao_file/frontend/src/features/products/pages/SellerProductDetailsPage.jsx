import { useEffect, useState, useMemo } from "react";
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
    const currentUser = useSelector(state => state.auth.user);

    const [activeImage, setActiveImage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isVariantFormOpen, setVariantFormOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [selectedAttributes, setSelectedAttributes] = useState({});

    const fetchProduct = async () => {
        setLoading(true);
        const data = await handleGetProductById(id);
        const productData = Array.isArray(data) ? data[0] : data;
        setProduct(productData);

        // Set default attributes from the first variant
        const productVariants = productData?.varients || productData?.variants || [];
        if (productVariants.length > 0 && productVariants[0].attributes) {
            const initialAttrs = {};
            Object.entries(productVariants[0].attributes).forEach(([k, v]) => {
                initialAttrs[k.toUpperCase()] = v.toString().toUpperCase();
            });
            setSelectedAttributes(initialAttrs);
        }

        await handleGetAllProducts();
        setLoading(false);
    };

    useEffect(() => {
        fetchProduct();
        window.scrollTo(0, 0);
    }, [id]);

    const variants = product?.varients || product?.variants || [];
    const variantCount = variants.length;

    // Extract unique attribute keys and their values
    const attributeOptions = useMemo(() => {
        const options = {};
        variants.forEach(variant => {
            if (variant.attributes) {
                Object.entries(variant.attributes).forEach(([key, value]) => {
                    const normalizedKey = key.toUpperCase();
                    const normalizedValue = value.toString().toUpperCase();
                    if (!options[normalizedKey]) options[normalizedKey] = new Set();
                    options[normalizedKey].add(normalizedValue);
                });
            }
        });
        const result = {};
        Object.keys(options).forEach(key => {
            result[key] = Array.from(options[key]);
        });
        return result;
    }, [variants]);

    const attributeKeys = Object.keys(attributeOptions);

    const isOptionAvailable = (key, value) => {
        const targetKey = key.toUpperCase();
        const targetValue = value.toUpperCase();

        return variants.some(variant => {
            if (!variant.attributes) return false;
            
            // Normalize current variant attribute values
            const vAttrs = Object.fromEntries(
                Object.entries(variant.attributes).map(([k, v]) => [k.toUpperCase(), v.toString().toUpperCase()])
            );

            if (vAttrs[targetKey] !== targetValue) return false;
            
            // Check all other selected attributes
            return Object.entries(selectedAttributes).every(([sKey, sValue]) => {
                if (!sValue || sKey.toUpperCase() === targetKey) return true;
                return vAttrs[sKey.toUpperCase()] === sValue.toUpperCase();
            });
        });
    };

    // Find selected variant
    const selectedVariant = useMemo(() => {
        if (attributeKeys.length === 0) return null;
        return variants.find(variant => {
            if (!variant.attributes) return false;
            return attributeKeys.every(key => {
                const selectedValue = selectedAttributes[key];
                if (!selectedValue) return false;
                
                const vAttrKey = Object.keys(variant.attributes).find(k => k.toUpperCase() === key.toUpperCase());
                if (!vAttrKey) return false;
                
                return variant.attributes[vAttrKey].toString().toUpperCase() === selectedValue.toUpperCase();
            });
        });
    }, [selectedAttributes, variants, attributeKeys]);

    const handleAttributeSelect = (key, value) => {
        setSelectedAttributes(prev => {
            const nextValue = prev[key] === value ? undefined : value;
            const newAttributes = { ...prev, [key]: nextValue };

            // If we selected a value, ensure other selections are still valid
            if (nextValue) {
                attributeKeys.forEach(k => {
                    if (k === key || !newAttributes[k]) return;
                    
                    const targetK = k.toUpperCase();
                    const targetV = newAttributes[k].toUpperCase();
                    const targetKey = key.toUpperCase();
                    const targetNextValue = nextValue.toUpperCase();

                    const stillValid = variants.some(v => {
                        if (!v.attributes) return false;
                        const vAttrs = Object.fromEntries(
                            Object.entries(v.attributes).map(([attrK, attrV]) => [attrK.toUpperCase(), attrV.toString().toUpperCase()])
                        );
                        return vAttrs[targetKey] === targetNextValue && vAttrs[targetK] === targetV;
                    });

                    if (!stillValid) newAttributes[k] = undefined;
                });
            }
            return newAttributes;
        });
    };

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

    const defaultVariant = variants[0];
    const displayedPrice = selectedVariant?.price || product.price || defaultVariant?.price;
    const currentImages = (selectedVariant?.images?.length > 0 ? selectedVariant.images : (product.images?.length > 0 ? product.images : defaultVariant?.images)) || [];

    return (
        <div className="min-h-screen bg-[var(--theme-bg)] pb-32">
            {successMsg && (
                <div className="fixed top-6 right-6 z-50 px-6 py-4 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/30 animate-fade-in">
                    {successMsg}
                </div>
            )}

            <div className="pt-24 px-6 md:px-12 lg:px-24">
                <nav className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[var(--theme-text-muted)] mb-12">
                    <Link to="/seller/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
                    <ChevronRight className="w-3 h-3" />
                    <Link to="/seller/dashboard" className="hover:text-primary transition-colors">Collection</Link>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-[var(--theme-text)] line-clamp-1">{product.title}</span>
                </nav>
            </div>

            <div className="px-6 md:px-12 lg:px-24 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
                {/* Image Gallery */}
                <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-6">
                    <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible no-scrollbar">
                        {currentImages?.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveImage(idx)}
                                className={`flex-shrink-0 w-20 aspect-[3/4] overflow-hidden rounded-xl border-2 transition-all duration-300 ${activeImage === idx ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'}`}
                            >
                                <img src={img.url} alt="" className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 aspect-[3/4] overflow-hidden bg-[var(--theme-card-bg)] rounded-2xl group border border-[var(--theme-border)] relative">
                        <img
                            src={currentImages?.[activeImage]?.url}
                            alt={product.title}
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                        <div className="absolute top-4 left-4">
                            <span className="px-3 py-1.5 bg-black/60 backdrop-blur-md text-primary text-[9px] font-black uppercase tracking-widest rounded-full">
                                Your Product
                            </span>
                        </div>
                    </div>
                </div>

                {/* Product Info */}
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
                                {displayedPrice?.currency === 'INR' ? '₹' : displayedPrice?.currency} {displayedPrice?.amount?.toLocaleString()}
                            </span>
                        </div>
                    </div>

                    {/* Attribute Selection Preview */}
                    {attributeKeys.length > 0 && (
                        <div className="space-y-8 mb-10">
                            {attributeKeys.map(key => (
                                <div key={key} className="space-y-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--theme-text-muted)]">
                                        Preview {key}
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {attributeOptions[key].map(value => {
                                            const isSelected = selectedAttributes[key] === value;
                                            const isAvailable = isOptionAvailable(key, value);
                                            
                                            return (
                                                <button
                                                    key={value}
                                                    onClick={() => handleAttributeSelect(key, value)}
                                                    className={`
                                                        px-5 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl border-2 transition-all duration-300
                                                        ${isSelected 
                                                            ? 'border-primary bg-primary text-white shadow-lg shadow-primary/25' 
                                                            : isAvailable
                                                                ? 'border-[var(--theme-border)] text-[var(--theme-text)] hover:border-primary/50 bg-[var(--theme-card-bg)]'
                                                                : 'border-[var(--theme-border)] text-[var(--theme-text-muted)] opacity-40 bg-[var(--theme-bg)]'
                                                        }
                                                    `}
                                                >
                                                    {!isAvailable && !isSelected && <span className="mr-2 opacity-30">✕</span>}
                                                    {value}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="bg-[var(--theme-card-bg)] border border-[var(--theme-border)] rounded-2xl p-6 mb-8">
                        <h4 className="text-xs font-black uppercase tracking-widest text-[var(--theme-text)] mb-3">Manifesto</h4>
                        <p className="font-sans text-[var(--theme-text-muted)] leading-relaxed text-sm">
                            {product.description || "A masterfully crafted piece designed for those who appreciate archival silhouettes and high-performance textiles."}
                        </p>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex flex-col gap-4 mb-12">
                        <button
                            onClick={() => setVariantFormOpen(true)}
                            className="flex items-center justify-center gap-3 w-full py-5 bg-primary text-white font-black tracking-widest uppercase text-sm hover:bg-primary-dark transition-all rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95"
                        >
                            <Plus className="w-5 h-5" />
                            Add Variant
                        </button>

                        <button
                            disabled
                            className="flex items-center justify-center gap-3 w-full py-5 bg-[var(--theme-card-bg)] text-[var(--theme-text-muted)] font-black tracking-widest uppercase text-sm rounded-2xl border border-[var(--theme-border)] cursor-not-allowed opacity-40"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            Own Product
                        </button>

                        <p className="text-center text-[10px] text-[var(--theme-text-muted)] uppercase tracking-widest">
                            Purchase actions are disabled for your own products
                        </p>
                    </div>

                    {/* Variant Overview */}
                    {variantCount > 0 && (
                        <div className="bg-[var(--theme-card-bg)] border border-[var(--theme-border)] rounded-2xl p-6 mb-8">
                            <div className="flex items-center gap-3 mb-4">
                                <Layers className="w-4 h-4 text-primary" />
                                <h4 className="text-xs font-black uppercase tracking-widest text-[var(--theme-text)]">Inventory Overview</h4>
                            </div>
                            <div className="space-y-3">
                                {variants.slice(0, 3).map((v, i) => (
                                    <div key={i} className="flex items-center justify-between py-2 border-b border-[var(--theme-border)] last:border-0">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-10 rounded overflow-hidden border border-[var(--theme-border)]">
                                                <img src={v.images?.[0]?.url || product.images?.[0]?.url} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest">
                                                {v.attributes ? Object.values(v.attributes).join(' · ') : `Config #${i + 1}`}
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

                    {/* Meta Info */}
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
                            <span className="text-[10px] font-bold uppercase tracking-tighter">Promote Drop</span>
                        </div>
                    </div>
                </div>
            </div>

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

            <AddVariantForm
                isOpen={isVariantFormOpen}
                onClose={() => setVariantFormOpen(false)}
                onSubmit={onAddVariant}
                isSubmitting={isSubmitting}
                existingVariants={variants}
            />
        </div>
    );
};

export default SellerProductDetailsPage;
