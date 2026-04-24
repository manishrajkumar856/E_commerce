import { useState } from 'react';
import { X, UploadCloud, Trash2, Package, DollarSign, Tag, ChevronDown } from 'lucide-react';
import { toast } from 'react-toastify';

const AddVariantForm = ({ isOpen, onClose, onSubmit, isSubmitting, existingVariants = [] }) => {
    const [images, setImages] = useState([]);
    const [stock, setStock] = useState('');
    const [priceAmount, setPriceAmount] = useState('');
    const [priceCurrency, setPriceCurrency] = useState('INR');
    const [attributes, setAttributes] = useState([{ key: '', value: '' }]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (images.length + files.length > 7) {
            toast.warning("Maximum 7 images allowed per variant");
            return;
        }
        const newImages = files.map(file => ({
            file,
            preview: URL.createObjectURL(file),
        }));
        setImages(prev => [...prev, ...newImages]);
    };

    const removeImage = (index) => {
        setImages(prev => {
            URL.revokeObjectURL(prev[index].preview);
            return prev.filter((_, i) => i !== index);
        });
    };

    const addAttribute = () => setAttributes(prev => [...prev, { key: '', value: '' }]);

    const updateAttribute = (index, field, value) => {
        setAttributes(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const removeAttribute = (index) => {
        setAttributes(prev => prev.filter((_, i) => i !== index));
    };

    // Get unique existing keys and values for suggestions
    const suggestions = (() => {
        const keys = new Set();
        const values = {};
        existingVariants.forEach(v => {
            if (v.attributes) {
                Object.entries(v.attributes).forEach(([k, val]) => {
                    keys.add(k);
                    if (!values[k]) values[k] = new Set();
                    values[k].add(val);
                });
            }
        });
        return {
            keys: Array.from(keys),
            values: Object.fromEntries(Object.entries(values).map(([k, v]) => [k, Array.from(v)]))
        };
    })();

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        images.forEach(img => formData.append('images', img.file));
        formData.append('stock', stock);
        if (priceAmount) {
            formData.append('price', JSON.stringify({ amount: Number(priceAmount), currency: priceCurrency }));
        }
        const filteredAttributes = attributes.filter(a => a.key.trim() && a.value.trim());
        if (filteredAttributes.length > 0) {
            const attributesObject = Object.fromEntries(filteredAttributes.map(a => [a.key.trim(), a.value.trim()]));
            formData.append('attributes', JSON.stringify(attributesObject));
        }
        onSubmit(formData);
    };

    const handleClose = () => {
        images.forEach(img => URL.revokeObjectURL(img.preview));
        setImages([]);
        setStock('');
        setPriceAmount('');
        setPriceCurrency('INR');
        setAttributes([{ key: '', value: '' }]);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={handleClose} />

            <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-2xl shadow-[0_40px_120px_rgba(0,0,0,0.6)] overflow-hidden">

                {/* Header */}
                <div className="shrink-0 flex items-center justify-between px-10 py-7 border-b border-[var(--theme-border)]">
                    <div>
                        <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black tracking-[0.2em] uppercase rounded-full mb-3">
                            Variant Configuration
                        </span>
                        <h2 className="font-display text-4xl font-black text-[var(--theme-text)] uppercase">
                            Add Variant
                        </h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="w-11 h-11 rounded-full border border-[var(--theme-border)] flex items-center justify-center hover:bg-red-500/10 hover:border-red-400 hover:text-red-400 transition-all duration-300"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-10 py-8 space-y-10">

                    {/* Images */}
                    <section>
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                <UploadCloud className="w-4 h-4 text-primary" /> Visual Assets
                            </h3>
                            <span className="text-[10px] font-bold text-[var(--theme-text-muted)] uppercase">{images.length} / 7</span>
                        </div>

                        <div className="h-0.5 w-full bg-[var(--theme-border)] rounded-full mb-5 overflow-hidden">
                            <div className="h-full bg-primary transition-all duration-700" style={{ width: `${(images.length / 7) * 100}%` }} />
                        </div>

                        <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
                            {images.map((img, idx) => (
                                <div key={idx} className="aspect-[3/4] relative rounded-xl overflow-hidden border border-[var(--theme-border)] group">
                                    <img src={img.preview} alt="" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(idx)}
                                        className="absolute top-1.5 right-1.5 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-transform duration-200"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                    <span className="absolute bottom-1.5 left-1.5 text-[8px] font-black text-white bg-black/50 px-1.5 py-0.5 rounded-full uppercase">{idx + 1}</span>
                                </div>
                            ))}
                            {images.length < 7 && (
                                <label className="aspect-[3/4] border-2 border-dashed border-primary/25 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all group">
                                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
                                    <UploadCloud className="w-6 h-6 text-primary/40 group-hover:text-primary transition-colors group-hover:-translate-y-1 duration-300" />
                                    <span className="text-[8px] font-black uppercase tracking-widest text-primary/50 mt-1.5 group-hover:text-primary transition-colors">Add</span>
                                </label>
                            )}
                        </div>
                    </section>

                    {/* Stock + Attributes | Pricing */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-8">
                            {/* Stock */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--theme-text-muted)]">
                                    <Package className="w-3.5 h-3.5 text-primary" /> Stock Quantity <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={stock}
                                    onChange={e => setStock(e.target.value)}
                                    min="0"
                                    required
                                    placeholder="e.g. 100"
                                    className="w-full bg-[var(--theme-card-bg)] border border-[var(--theme-border)] rounded-2xl px-6 py-4 text-2xl font-black focus:outline-none focus:border-primary transition-all"
                                />
                            </div>

                            {/* Attributes */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--theme-text-muted)]">
                                        <Tag className="w-3.5 h-3.5 text-primary" /> Specifications <span className="text-[var(--theme-text-muted)] normal-case font-normal text-[9px]">(optional)</span>
                                    </label>
                                    <button type="button" onClick={addAttribute} className="text-[10px] font-black text-primary hover:underline underline-offset-4 tracking-widest uppercase">
                                        + Add Field
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {attributes.map((attr, idx) => (
                                        <div key={idx} className="flex gap-2 items-center group">
                                            <div className="flex-1 relative">
                                                <input
                                                    placeholder="KEY (e.g. SIZE)"
                                                    value={attr.key}
                                                    onChange={e => updateAttribute(idx, 'key', e.target.value.toUpperCase())}
                                                    className="w-full bg-transparent border-b border-[var(--theme-border)] py-2.5 text-[11px] font-bold uppercase tracking-widest focus:border-primary outline-none transition-colors placeholder:text-[var(--theme-text-muted)]/30"
                                                    list={`keys-list-${idx}`}
                                                />
                                                <datalist id={`keys-list-${idx}`}>
                                                    {suggestions.keys.map(k => <option key={k} value={k} />)}
                                                </datalist>
                                            </div>
                                            <div className="flex-1 relative">
                                                <input
                                                    placeholder="VALUE (e.g. XL)"
                                                    value={attr.value}
                                                    onChange={e => updateAttribute(idx, 'value', e.target.value.toUpperCase())}
                                                    className="w-full bg-transparent border-b border-[var(--theme-border)] py-2.5 text-[11px] font-bold uppercase tracking-widest focus:border-primary outline-none transition-colors placeholder:text-[var(--theme-text-muted)]/30"
                                                    list={`values-list-${idx}-${attr.key}`}
                                                />
                                                <datalist id={`values-list-${idx}-${attr.key}`}>
                                                    {suggestions.values[attr.key]?.map(v => <option key={v} value={v} />)}
                                                </datalist>
                                            </div>
                                            <button type="button" onClick={() => removeAttribute(idx)} className="p-1.5 opacity-0 group-hover:opacity-100 text-red-400 transition-all">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Pricing */}
                        <div className="p-8 rounded-2xl bg-[var(--theme-card-bg)] border border-[var(--theme-border)] space-y-6 relative overflow-hidden">
                            <div className="flex items-center gap-3">
                                <DollarSign className="w-4 h-4 text-primary" />
                                <h3 className="text-[10px] font-black uppercase tracking-widest">Custom Pricing</h3>
                                <span className="text-[9px] text-[var(--theme-text-muted)]">(optional)</span>
                            </div>
                            <p className="text-[10px] text-[var(--theme-text-muted)] leading-relaxed">
                                Leave blank to inherit the base product price.
                            </p>
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-[9px] font-black uppercase tracking-[0.25em] text-[var(--theme-text-muted)] mb-2">Amount</label>
                                    <input
                                        type="number"
                                        value={priceAmount}
                                        onChange={e => setPriceAmount(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full bg-transparent border-b-2 border-[var(--theme-border)] py-3 text-3xl font-black focus:outline-none focus:border-primary transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[9px] font-black uppercase tracking-[0.25em] text-[var(--theme-text-muted)] mb-2">Currency</label>
                                    <div className="relative">
                                        <select
                                            value={priceCurrency}
                                            onChange={e => setPriceCurrency(e.target.value)}
                                            className="w-full bg-transparent border-b-2 border-[var(--theme-border)] py-3 text-sm font-black focus:outline-none focus:border-primary appearance-none cursor-pointer"
                                        >
                                            <option value="INR" className="bg-[var(--theme-bg)]">INR — Indian Rupee</option>
                                            <option value="USD" className="bg-[var(--theme-bg)]">USD — US Dollar</option>
                                            <option value="EUR" className="bg-[var(--theme-bg)]">EUR — Euro</option>
                                        </select>
                                        <ChevronDown className="absolute right-0 bottom-4 w-4 h-4 text-[var(--theme-text-muted)] pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="flex items-center justify-between pt-6 border-t border-[var(--theme-border)]">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="text-[11px] font-black uppercase tracking-widest text-[var(--theme-text-muted)] hover:text-red-400 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !stock}
                            className="flex items-center justify-center gap-3 px-12 py-4 bg-primary text-white font-black text-[11px] tracking-widest uppercase rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all hover:scale-[1.03] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
                        >
                            {isSubmitting ? 'Saving…' : 'Add Variant'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddVariantForm;
