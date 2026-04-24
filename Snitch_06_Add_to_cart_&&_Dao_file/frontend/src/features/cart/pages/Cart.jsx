import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react";
import useCart from "../hooks/useCart";

const Cart = () => {
    const { handleGetCart, handleRemoveFromCart, handleIncrementQuantity, handleDecrementQuantity } = useCart();
    const items = useSelector(state => state.cart.items);

    useEffect(() => {
        handleGetCart();
    }, []);

    const calculateSubtotal = () => {
        return items.reduce((total, item) => {
            const price = item?.price?.amount || 0;
            const quantity = item?.quantity || 0;
            return total + (price * quantity);
        }, 0);
    };

    const handleIncrement = ({ productId, variantId }) => {
        handleIncrementQuantity({ productId, variantId });
    }

    const handleDecrement = ({ productId, variantId }) => {
        handleDecrementQuantity({ productId, variantId });
    }

    const handleRemove = ({ productId, variantId }) => {
        handleRemoveFromCart({ productId, variantId });
    }

    const subtotal = calculateSubtotal();
    const shipping = 0;
    const total = subtotal + shipping;
    const currency = items[0]?.price?.currency || "INR";

    if (!items || items.length === 0) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 bg-[var(--theme-bg)] animate-fade-in">
                <div className="mb-8 p-6 bg-[var(--theme-card-bg)] rounded-full border border-[var(--theme-border)]">
                    <ShoppingBag size={48} strokeWidth={1} className="text-[var(--theme-text-muted)]" />
                </div>
                <h1 className="font-display text-4xl mb-4 tracking-tight">Your Bag is Empty</h1>
                <p className="font-sans text-sm text-[var(--theme-text-muted)] mb-10 max-w-xs text-center leading-relaxed">
                    Looks like you haven't added anything to your bag yet.
                </p>
                <Link
                    to="/"
                    className="px-8 py-4 bg-[var(--theme-text)] text-[var(--theme-bg)] font-sans text-xs uppercase tracking-widest font-bold hover:opacity-90 transition-all rounded-sm"
                >
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--theme-bg)] text-[var(--theme-text)] pb-24">
            {/* Simple Elegant Header */}
            <header className="pt-32 pb-16 px-8 lg:px-24 max-w-7xl mx-auto">
                <div className="flex items-baseline justify-between border-b border-[var(--theme-border)] pb-8">
                    <h1 className="font-display text-5xl tracking-tight">Shopping Bag</h1>
                    <span className="font-sans text-sm text-[var(--theme-text-muted)] uppercase tracking-widest">
                        {items.length} {items.length === 1 ? 'Item' : 'Items'}
                    </span>
                </div>
            </header>

            <main className="px-8 lg:px-24 max-w-7xl mx-auto grid lg:grid-cols-[1fr_380px] gap-16">
                {/* Clean Item List */}
                <section className="space-y-12 animate-fade-up">
                    {items.map((item) => {
                        const variantData = item.product?.variants?.find(v => v._id === item.variant);
                        const image = variantData?.images?.[0]?.url || item.product?.variants?.[0]?.images?.[0]?.url;

                        return (
                            <div key={item._id} className="flex gap-8 group pb-12 border-b border-[var(--theme-border)] last:border-0">
                                {/* Product Image */}
                                <div className="w-32 md:w-44 aspect-[3/4] overflow-hidden bg-[var(--theme-card-bg)] rounded-sm">
                                    <img
                                        src={image}
                                        alt={item?.product?.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                </div>

                                {/* Product Info */}
                                <div className="flex-1 flex flex-col justify-between py-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h2 className="font-display text-2xl mb-2 hover:text-primary transition-colors cursor-default">
                                                {item?.product?.title || "Product"}
                                            </h2>
                                            <div className="space-y-1">
                                                {variantData?.attributes && Object.entries(variantData.attributes).map(([key, value]) => (
                                                    <p key={key} className="font-sans text-xs text-[var(--theme-text-muted)] flex gap-2">
                                                        <span className="uppercase tracking-wider">{key}:</span>
                                                        <span className="text-[var(--theme-text)] font-medium">{value}</span>
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                        <button onClick={() => handleRemove({ productId: item.product._id, variantId: item.variant })} className="text-[var(--theme-text-muted)] hover:text-red-500 transition-colors p-2 -mr-2">
                                            <Trash2 size={18} strokeWidth={1.5} />
                                        </button>
                                    </div>

                                    <div className="flex items-end justify-between mt-6">
                                        {/* Quantity Selector */}
                                        <div className="flex items-center border border-[var(--theme-border)] rounded-sm overflow-hidden">
                                            <button onClick={() => handleDecrement({ productId: item.product._id, variantId: item.variant })} className="p-2 hover:bg-[var(--theme-card-bg)] transition-colors text-[var(--theme-text-muted)] hover:text-[var(--theme-text)]">
                                                <Minus size={14} />
                                            </button>
                                            <span className="px-4 font-sans text-sm font-medium border-x border-[var(--theme-border)] min-w-[3rem] text-center">
                                                {item.quantity}
                                            </span>
                                            <button onClick={() => handleIncrement({ productId: item.product._id, variantId: item.variant })} className="p-2 hover:bg-[var(--theme-card-bg)] transition-colors text-[var(--theme-text-muted)] hover:text-[var(--theme-text)]">
                                                <Plus size={14} />
                                            </button>
                                        </div>

                                        {/* Item Total */}
                                        <div className="text-right">
                                            <p className="font-display text-xl">
                                                <span className="text-xs mr-1 text-[var(--theme-text-muted)] font-sans">{item?.price?.currency || currency}</span>
                                                {((item?.price?.amount || 0) * (item?.quantity || 0)).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </section>

                {/* Simplified Summary Sidebar */}
                <aside className="lg:sticky lg:top-32 h-fit animate-fade-up [animation-delay:200ms]">
                    <div className="bg-[var(--theme-card-bg)] p-8 border border-[var(--theme-border)] rounded-sm">
                        <h3 className="font-display text-2xl mb-8">Order Summary</h3>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-sm">
                                <span className="text-[var(--theme-text-muted)] font-sans">Subtotal</span>
                                <span className="font-sans font-medium">{currency} {subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-[var(--theme-text-muted)] font-sans">Shipping</span>
                                <span className="text-emerald-500 font-sans font-medium uppercase text-[10px] tracking-widest pt-1">Free</span>
                            </div>
                            <div className="pt-4 border-t border-[var(--theme-border)] flex justify-between items-baseline">
                                <span className="font-display text-2xl">Total</span>
                                <span className="font-display text-2xl">{currency} {total.toLocaleString()}</span>
                            </div>
                        </div>

                        <button className="w-full bg-[var(--theme-text)] text-[var(--theme-bg)] py-5 font-sans text-xs uppercase tracking-[0.2em] font-bold hover:opacity-90 transition-all rounded-sm flex items-center justify-center gap-2 group">
                            Checkout
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>

                        <div className="mt-6 flex items-center justify-center gap-2 text-[var(--theme-text-muted)] opacity-60">
                            <ShieldCheck size={14} />
                            <span className="text-[10px] uppercase tracking-widest">Secure Checkout</span>
                        </div>
                    </div>

                    <Link
                        to="/"
                        className="mt-6 flex items-center justify-center py-4 text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] transition-colors group"
                    >
                        <span className="font-sans text-[10px] uppercase tracking-widest">
                            Continue Shopping
                        </span>
                    </Link>
                </aside>
            </main>
        </div>
    );
};

export default Cart;




