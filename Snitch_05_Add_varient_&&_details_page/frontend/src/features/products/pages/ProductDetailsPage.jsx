import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router";
import { useProduct } from "../hooks/useProduct";
import { useSelector } from "react-redux";
import { ShoppingBag, ChevronRight, Heart, Share2, ShieldCheck, Truck, RefreshCw, Check } from "lucide-react";
import ProductCard from "../components/ProductCard";

const ProductDetailsPage = () => {
    const { id } = useParams();
    const { handleGetProductById, handleGetAllProducts } = useProduct();
    const [product, setProduct] = useState(null);
    const allProducts = useSelector(state => state.product.products);
    const currentUser = useSelector(state => state.auth.user);

    const [activeImage, setActiveImage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [selectedAttributes, setSelectedAttributes] = useState({});

    useEffect(() => {
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
        fetchProduct();
        window.scrollTo(0, 0);
    }, [id]);

    const isSeller = currentUser?._id === product?.seller;

    // Support both spellings if necessary, but prioritize 'varients' based on user data
    const variants = product?.varients || product?.variants || [];

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
                
                // Find matching attribute key (case-insensitive)
                const vAttrKey = Object.keys(variant.attributes).find(k => k.toUpperCase() === key.toUpperCase());
                if (!vAttrKey) return false;
                
                return variant.attributes[vAttrKey].toString().toUpperCase() === selectedValue.toUpperCase();
            });
        });
    }, [selectedAttributes, variants, attributeKeys]);

    const canAddToCart = useMemo(() => {
        if (isSeller) return false;
        if (attributeKeys.length === 0) return true; // Base product if no variants
        // Check if all attributes (including SIZE as requested) are selected
        const allSelected = attributeKeys.every(key => selectedAttributes[key]);
        const hasSize = selectedAttributes['SIZE'] || !attributeOptions['SIZE'];
        return allSelected && hasSize && selectedVariant && selectedVariant.stock > 0;
    }, [isSeller, attributeKeys, selectedAttributes, selectedVariant, attributeOptions]);

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
                <Link to="/" className="px-8 py-4 bg-primary text-white rounded-xl uppercase tracking-widest text-xs font-black shadow-xl shadow-primary/20">
                    Return to Drops
                </Link>
            </div>
        );
    }

    // Display price: if variant selected, use variant price, else base product price or first variant's price
    const defaultVariant = variants[0];
    const displayedPrice = selectedVariant?.price || product.price || defaultVariant?.price;
    const currentImages = (selectedVariant?.images?.length > 0 ? selectedVariant.images : (product.images?.length > 0 ? product.images : defaultVariant?.images)) || [];

    return (
        <div className="min-h-screen bg-[var(--theme-bg)] pb-32">
            {/* Breadcrumbs */}
            <div className="pt-24 px-6 md:px-12 lg:px-24">
                <nav className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[var(--theme-text-muted)] mb-12">
                    <Link to="/" className="hover:text-primary transition-colors">Archive</Link>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-[var(--theme-text)] line-clamp-1">{product.title}</span>
                </nav>
            </div>

            {/* Main Content */}
            <div className="px-6 md:px-12 lg:px-24 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
                {/* Image Gallery */}
                <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-6">
                    {/* Thumbnails */}
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

                    {/* Main Image */}
                    <div className="flex-1 aspect-[3/4] overflow-hidden bg-[var(--theme-card-bg)] rounded-2xl group border border-[var(--theme-border)] relative">
                        <img
                            src={currentImages?.[activeImage]?.url}
                            alt={product.title}
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                        {isSeller && (
                            <div className="absolute top-4 left-4">
                                <span className="px-3 py-1.5 bg-black/60 backdrop-blur-md text-primary text-[9px] font-black uppercase tracking-widest rounded-full">
                                    Your Product
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Product Info */}
                <div className="lg:col-span-5 flex flex-col pt-4">
                    <div className="mb-8">
                        <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black tracking-[0.2em] uppercase rounded-full mb-6">
                            {isSeller ? "Managed by You" : "Limited Drop"}
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

                    {/* Attribute Selection */}
                    {attributeKeys.length > 0 && (
                        <div className="space-y-8 mb-10">
                            {attributeKeys.map(key => (
                                <div key={key} className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--theme-text-muted)]">
                                            Select {key}
                                        </h4>
                                        {selectedAttributes[key] && (
                                            <span className="text-[10px] font-bold uppercase text-primary tracking-widest">
                                                {selectedAttributes[key]}
                                            </span>
                                        )}
                                    </div>
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

                    {/* Actions */}
                    <div className="flex flex-col gap-4 mb-12">
                        <button 
                            disabled={!canAddToCart}
                            className={`
                                flex items-center justify-center gap-3 w-full py-5 font-black tracking-widest uppercase text-sm transition-all rounded-2xl shadow-xl
                                ${canAddToCart 
                                    ? 'bg-primary text-white shadow-primary/20 hover:bg-primary-dark hover:scale-[1.02] active:scale-95' 
                                    : 'bg-[var(--theme-card-bg)] text-[var(--theme-text-muted)] border border-[var(--theme-border)] opacity-50 cursor-not-allowed'
                                }
                            `}
                        >
                            <ShoppingBag className="w-5 h-5" />
                            {isSeller ? "Own Product" : (canAddToCart ? "Acquire Item" : (selectedVariant && selectedVariant.stock === 0 ? "Out of Stock" : "Select Variant"))}
                        </button>
                        
                        {!isSeller && (
                            <button className="flex items-center justify-center gap-3 w-full py-5 border border-[var(--theme-border)] text-[var(--theme-text)] font-black tracking-widest uppercase text-sm hover:bg-[var(--theme-input-bg)] transition-all rounded-2xl">
                                <Heart className="w-5 h-5" />
                                Add to Registry
                            </button>
                        )}

                        {isSeller && (
                            <p className="text-center text-[9px] text-[var(--theme-text-muted)] uppercase tracking-widest mt-2">
                                Inventory management is available in your seller dashboard
                            </p>
                        )}
                    </div>

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
                            <span className="text-[10px] font-bold uppercase tracking-tighter">Share Selection</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recommended Items */}
            <div className="mt-32 px-6 md:px-12 lg:px-24">
                <div className="max-w-screen-2xl mx-auto">
                    <div className="flex items-end justify-between gap-8 mb-16">
                        <div>
                            <span className="text-primary font-black tracking-[0.3em] uppercase text-xs mb-4 block underline underline-offset-8">Complementary</span>
                            <h2 className="font-display text-4xl md:text-5xl font-black text-[var(--theme-text)] uppercase">Refined <span className="text-primary italic font-normal">Selections</span></h2>
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
        </div>
    );
};

export default ProductDetailsPage;
