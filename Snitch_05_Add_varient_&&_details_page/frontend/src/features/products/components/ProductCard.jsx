import React from 'react';
import { ShoppingCart, Heart } from 'lucide-react';
import { Link } from 'react-router';

const ProductCard = ({ product }) => {
    const { _id, title, variants } = product;
    
    // Get default variant (first one)
    const defaultVariant = variants && variants[0] ? variants[0] : null;
    
    // Resilient data extraction
    const price = product.price || defaultVariant?.price;
    const images = (product.images?.length > 0 ? product.images : defaultVariant?.images) || [];
    const imageUrl = images && images[0] ? images[0].url : 'https://via.placeholder.com/400x500?text=No+Image';

    return (
        <div className="group relative flex flex-col gap-4 bg-[var(--theme-card-bg)] rounded-2xl overflow-hidden border border-[var(--theme-border)] transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5">
            {/* Image Container */}
            <Link to={`/products/${_id}`} className="relative aspect-[3/4] overflow-hidden bg-surface-container-highest">
                <img 
                    src={imageUrl} 
                    alt={title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/5" />
                
                <button className="absolute right-4 top-4 p-2 bg-[var(--theme-bg)]/80 backdrop-blur-md rounded-full opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-white text-[var(--theme-text)]">
                    <Heart className="w-5 h-5" />
                </button>

                <button 
                    onClick={(e) => {
                        e.preventDefault();
                        // Add to cart logic
                    }}
                    className="absolute inset-x-4 bottom-4 py-3 bg-primary text-white text-sm font-medium tracking-wider uppercase opacity-0 translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-primary-dark flex items-center justify-center gap-2 rounded-xl"
                >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                </button>
            </Link>

            {/* Product Info */}
            <div className="flex flex-col gap-2 p-4 pt-0">
                <Link to={`/products/${_id}`} className="hover:text-primary transition-colors">
                    <h3 className="font-display text-lg font-semibold text-[var(--theme-text)] line-clamp-1">{title}</h3>
                </Link>
                <div className="flex items-center justify-between">
                    <span className="font-sans font-bold text-primary text-xl">
                        {price?.currency === 'INR' ? '₹' : price?.currency} {price?.amount?.toLocaleString()}
                    </span>
                    <span className="text-xs text-[var(--theme-text-muted)] uppercase tracking-widest font-bold bg-[var(--theme-input-bg)] px-2 py-1 rounded">
                        New
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
