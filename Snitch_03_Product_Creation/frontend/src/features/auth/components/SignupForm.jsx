import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router';
import { useSelector } from 'react-redux';

const SignupForm = () => {
  const { handleRegister } = useAuth();
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    contact: '',
    password: '',
    isSeller: false,
  });

  const {user} = useSelector((state) => state.auth);

  console.log(user);

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Reset error when user starts typing
    // if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic Validation
    if (!formData.fullname || !formData.email || !formData.password) {
      // setError('Please fill all required fields');
      setIsLoading(false);
      return;
    }

    try {
      handleRegister(formData);
      console.log("Answer:",user);
    } catch (err) {
      // setError('Registration failed. Please try again.');
    }
  };

  const togglePassword = () => setShowPassword(!showPassword);

  const hangelGoogleAuth = () => {
    window.location.href = '/api/auth/google';
  }

  return (
    <div className="w-full max-w-lg px-8 py-10 animate-fade-up">
      <div className="mb-10">
        <h2 className="text-4xl font-display font-black text-[var(--theme-text)] tracking-tightest mb-2">
          JOIN THE <span className="text-secondary text-glow-secondary">CULT</span>
        </h2>
        <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-[var(--theme-text)]/40">
          Unapologetic Premium Streetwear
        </p>
      </div>

      {success ? (
        <div className="bg-secondary/10 border border-secondary/20 p-6 rounded-3xl animate-scale-in text-center">
          <svg className="w-12 h-12 text-secondary mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <h3 className="text-xl font-display font-bold text-[var(--theme-text)] mb-2">Authenticated successfully</h3>
          <p className="text-sm text-[var(--theme-text)]/60">Welcome to the entity. Redirecting...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-bold animate-fade-in">
              {error}
            </div>
          )}

          <div className="space-y-1 group">
            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--theme-text)]/30 ml-1 group-focus-within:text-primary transition-colors">
              Identity (Full Name)
            </label>
            <input
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              placeholder="e.g. Manish Kumar"
              className="w-full px-6 py-4 bg-[var(--theme-input-bg)] border border-[var(--theme-border)] rounded-2xl focus:outline-none focus:ring-1 focus:ring-primary focus:bg-[var(--theme-border)] transition-all duration-300 text-sm placeholder:text-[var(--theme-text)]/20"
              required
            />
          </div>

          <div className="space-y-1 group">
            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--theme-text)]/30 ml-1 group-focus-within:text-primary transition-colors">
              Communication (Email)
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. xxxxx@snitch.com"
              className="w-full px-6 py-4 bg-[var(--theme-input-bg)] border border-[var(--theme-border)] rounded-2xl focus:outline-none focus:ring-1 focus:ring-primary focus:bg-[var(--theme-border)] transition-all duration-300 text-sm placeholder:text-[var(--theme-text)]/20"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
            <div className="space-y-1 group text-left">
              <label className="text-[10px] font-black uppercase tracking-widest text-[var(--theme-text)]/30 ml-1 group-focus-within:text-primary transition-colors">
                Contact
              </label>
              <input
                type="tel"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="+91 XXXXX XXXXX"
                className="w-full px-6 py-4 bg-[var(--theme-input-bg)] border border-[var(--theme-border)] rounded-2xl focus:outline-none focus:ring-1 focus:ring-primary focus:bg-[var(--theme-border)] transition-all duration-300 text-sm placeholder:text-[var(--theme-text)]/20"
                required
              />
            </div>
            <div className="space-y-1 group relative text-left">
              <label className="text-[10px] font-black uppercase tracking-widest text-[var(--theme-text)]/30 ml-1 group-focus-within:text-primary transition-colors">
                Secure Key
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-6 py-4 bg-[var(--theme-input-bg)] border border-[var(--theme-border)] rounded-2xl focus:outline-none focus:ring-1 focus:ring-primary focus:bg-[var(--theme-border)] transition-all duration-300 text-sm placeholder:text-[var(--theme-text)]/20 pr-12"
                required
              />
              <button
                type="button"
                onClick={togglePassword}
                className="absolute right-4 bottom-4 text-[var(--theme-text)]/20 hover:text-[var(--theme-text)] transition-colors"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878l4.242 4.242M21 12a9.504 9.504 0 00-1.557-3.007c.183.396.308.82.367 1.257m-4.57 3.442l4.242 4.242" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" /></svg>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-3 px-1 py-1">
            <input
              id="isSeller"
              name="isSeller"
              type="checkbox"
              checked={formData.isSeller}
              onChange={handleChange}
              className="w-5 h-5 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-input-bg)] accent-secondary cursor-pointer"
            />
            <label htmlFor="isSeller" className="text-[11px] font-bold text-[var(--theme-text)]/50 cursor-pointer hover:text-[var(--theme-text)] transition-colors uppercase tracking-widest">
              Join as a Seller
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4.5 bg-primary-gradient text-black font-display font-black rounded-2xl shadow-xl shadow-primary/10 hover:shadow-primary/30 hover:-translate-y-1 active:scale-[0.98] transition-all duration-500 uppercase tracking-[0.2em] text-xs mt-6 flex items-center justify-center"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Initialize Entity'
            )}
          </button>

          <div className="flex items-center space-x-4 py-2">
            <div className="h-[1px] flex-1 bg-[var(--theme-border)]" />
            <span className="text-[10px] uppercase font-black text-[var(--theme-text)]/20 tracking-tighter">OR</span>
            <div className="h-[1px] flex-1 bg-[var(--theme-border)]" />
          </div>

          <button
            type="button"
            onClick={hangelGoogleAuth}
            className="w-full py-4 bg-[var(--theme-input-bg)] border border-[var(--theme-border)] rounded-2xl flex items-center justify-center space-x-3 hover:bg-[var(--theme-border)] transition-all duration-300 group"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span className="text-[11px] font-bold text-[var(--theme-text)]/50 group-hover:text-[var(--theme-text)] transition-colors uppercase tracking-widest">Continue with Google</span>
          </button>

          <p className="text-center text-[10px] font-bold text-[var(--theme-text)]/40 uppercase tracking-widest mt-6">
            Already part of the cult?{' '}
            <Link to="/login" className="text-primary hover:text-secondary transition-colors underline-offset-4 hover:underline">
              Resume Access
            </Link>
          </p>
        </form>
      )}
    </div>
  );
};

export default SignupForm;
