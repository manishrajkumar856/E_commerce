import React from 'react';
import { UploadCloud, X, Plus, Terminal } from 'lucide-react';

const ProductForm = ({ 
  title, setTitle, 
  description, setDescription, 
  priceAmount, setPriceAmount, 
  priceCurrency, setPriceCurrency, 
  images, handleImageChange, removeImage,
  handleSubmit, isSubmitting 
}) => {
  return (
    <form onSubmit={handleSubmit} className="w-full max-w-5xl mx-auto space-y-24 pb-24">
      {/* Header Section */}
      <div className="space-y-4 animate-fade-up">
        <div className="flex items-center gap-3">
          <div className="h-px w-12 bg-primary"></div>
          <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-primary">Creation Portal</span>
        </div>
        <h1 className="text-6xl md:text-8xl font-display font-black tracking-tighter leading-none italic text-[var(--theme-text)]">
          NEW <span className="text-primary text-glow-primary">DROP</span>
        </h1>
        <p className="text-[var(--theme-text-muted)] text-sm uppercase tracking-widest max-w-sm">
          Define the identity of your next masterpiece.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left: Basic Info */}
        <div className="lg:col-span-7 space-y-16 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <div className="group relative">
            <span className="absolute -left-4 top-0 text-primary font-bold opacity-0 group-focus-within:opacity-100 transition-opacity">/</span>
            <label className="block text-[10px] uppercase tracking-[0.3em] font-bold text-[var(--theme-text-muted)] mb-6">Product Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.G. AZURE VELVET BOMBER"
              className="w-full bg-transparent border-b-2 border-[var(--theme-border)] py-6 text-4xl font-display font-black focus:outline-none focus:border-primary transition-all duration-500 placeholder:text-[var(--theme-text-muted)]/20 uppercase italic"
              required
            />
          </div>

          <div className="group relative">
            <label className="block text-[10px] uppercase tracking-[0.3em] font-bold text-[var(--theme-text-muted)] mb-6">Narrative</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the soul of this piece..."
              rows={4}
              className="w-full bg-[var(--theme-input-bg)] border border-[var(--theme-border)] p-8 text-lg font-sans focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-500 resize-none leading-relaxed rounded-2xl"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="group relative">
              <label className="block text-[10px] uppercase tracking-[0.3em] font-bold text-[var(--theme-text-muted)] mb-6">Valuation</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={priceAmount}
                  onChange={(e) => setPriceAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-transparent border-b-2 border-[var(--theme-border)] py-4 text-3xl font-black focus:outline-none focus:border-primary transition-all duration-500"
                  required
                />
                <span className="absolute right-0 bottom-4 text-sm font-bold text-primary">{priceCurrency}</span>
              </div>
            </div>

            <div className="group relative">
              <label className="block text-[10px] uppercase tracking-[0.3em] font-bold text-[var(--theme-text-muted)] mb-6">Currency</label>
              <select 
                value={priceCurrency}
                onChange={(e) => setPriceCurrency(e.target.value)}
                className="w-full bg-transparent border-b-2 border-[var(--theme-border)] py-5 text-lg font-bold focus:outline-none focus:border-primary transition-all duration-500 appearance-none cursor-pointer"
                required
              >
                <option value="INR" className="bg-surface">INR — Indian Rupee</option>
                <option value="USD" className="bg-surface">USD — US Dollar</option>
                <option value="EUR" className="bg-surface">EUR — Euro</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right: Visuals */}
        <div className="lg:col-span-5 space-y-12 animate-fade-up" style={{ animationDelay: '0.4s' }}>
          <div>
            <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary mb-2">Visual Heritage</h2>
            <p className="text-[var(--theme-text-muted)] text-xs">Curate up to 7 unique perspectives.</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {images.map((img, index) => (
              <div key={index} className="aspect-[3/4] relative group overflow-hidden rounded-2xl bg-surface border border-white/5 shadow-2xl">
                <img 
                  src={img.preview} 
                  alt="Preview" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <button 
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-transform hover:bg-red-500/80"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}

            {images.length < 7 && (
              <label className="aspect-[3/4] flex flex-col items-center justify-center border-2 border-dashed border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 transition-all cursor-pointer rounded-2xl group relative overflow-hidden">
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageChange}
                />
                <UploadCloud className="w-12 h-12 text-primary/40 group-hover:text-primary transition-all duration-500 mb-4 group-hover:-translate-y-2" />
                <span className="text-[10px] uppercase tracking-widest font-bold text-primary/60 group-hover:text-primary">Upload Media</span>
                {/* Decorative lines */}
                <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-primary/20"></div>
                <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-primary/20"></div>
              </label>
            )}
          </div>

          <div className="p-8 rounded-3xl bg-primary/5 border border-primary/10 space-y-6">
            <div className="flex items-center gap-4">
              <Terminal className="w-5 h-5 text-primary" />
              <span className="text-[10px] uppercase tracking-widest font-bold text-primary">System Parameters</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] uppercase tracking-tighter">
                <span className="text-[var(--theme-text-muted)]">Upload Progress</span>
                <span className="text-primary">{Math.round((images.length / 7) * 100)}%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all duration-1000 shadow-[0_0_10px_#10b981]" style={{ width: `${(images.length / 7) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="flex flex-col md:flex-row items-center gap-12 pt-12 border-t border-[var(--theme-border)]">
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="relative w-full md:w-auto px-20 py-8 bg-primary text-black font-display font-black text-xl tracking-tighter hover:bg-white hover:scale-105 transition-all duration-500 group rounded-none shadow-[0_20px_40px_rgba(16,185,129,0.2)] disabled:opacity-50"
        >
          <span className="relative z-10">{isSubmitting ? 'INITIALIZING...' : 'LAUNCH PRODUCT'}</span>
          <div className="absolute top-0 left-0 w-full h-full bg-black scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 -z-0"></div>
          <span className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-white scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 z-10">{isSubmitting ? 'PENDING...' : 'LAUNCH PRODUCT'}</span>
        </button>
        
        <button 
          type="button"
          className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--theme-text-muted)] hover:text-red-500 transition-colors underline underline-offset-8"
        >
          Abort Creation
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
