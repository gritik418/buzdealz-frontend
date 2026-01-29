import { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/lib/api';
import { useWishlist } from '@/store/useWishlist';
import { Button } from '@/components/ui/Button';
import { Mail, Lock, ShoppingBag, Loader2, UserPlus, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { gsap } from 'gsap';

export const Register = () => {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useWishlist();
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAuthenticated) {
      setLocation('/');
    }
  }, [isAuthenticated, setLocation]);
  
  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.register-card', {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power4.out'
      });
      
      gsap.to('.hero-blob', {
        x: 'random(-40, 40)',
        y: 'random(-40, 40)',
        duration: 'random(4, 6)',
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.5
      });
    }, formRef);
    return () => ctx.revert();
  }, []);

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Account created successfully!');
        setLocation('/login');
      } else {
        toast.error(data.message || 'Registration failed');
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create account. Please try again.');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    registerMutation.mutate({ email, password });
  };

  return (
    <main ref={formRef} className="min-h-[calc(100vh-80px)] bg-white relative overflow-hidden flex items-center justify-center px-6 py-12">
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40">
        <div className="hero-blob absolute top-[-10%] left-[-5%] w-[50%] aspect-square bg-emerald-100/50 rounded-full blur-[120px]" />
        <div className="hero-blob absolute bottom-[-15%] right-[-10%] w-[50%] aspect-square bg-primary-100/50 rounded-full blur-[120px]" />
      </div>

      <div className="register-card w-full max-w-lg grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10 transition-all">
        {/* Left Side: Marketing/Value Prop */}
        <div className="hidden lg:flex flex-col justify-center">
           <Link href="/" className="inline-flex items-center gap-3 mb-10 group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-600 to-indigo-700 flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <span className="font-black text-3xl tracking-tighter text-slate-900">Buzdealz</span>
           </Link>
           
           <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none mb-8">
             Join the elite tier of <span className="text-primary-600">shoppers.</span>
           </h1>
           
           <div className="space-y-6">
              {[
                'Real-time price drop notifications',
                'Advanced historical price tracking',
                'Verified exclusive premium deals',
                'Customizable wishlist alerts'
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3">
                   <CheckCircle2 className="w-6 h-6 text-emerald-500 fill-emerald-50" />
                   <span className="font-bold text-slate-600">{text}</span>
                </div>
              ))}
           </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full">
          <div className="bg-white/70 backdrop-blur-3xl p-8 rounded-[2.5rem] border-2 border-white shadow-2xl shadow-slate-200/50">
            <div className="text-center lg:text-left mb-8">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Create Account</h2>
                <p className="text-slate-500 font-bold">Start saving hundreds on your favorite brands.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                  <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full h-14 pl-12 pr-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                  <input 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full h-14 pl-12 pr-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Confirm Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                  <input 
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-14 pl-12 pr-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={registerMutation.isPending}
                className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-black text-white text-lg font-black shadow-xl shadow-slate-900/20 group mt-4"
              >
                {registerMutation.isPending ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>Create FREE Account <UserPlus className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" /></>
                )}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 text-center lg:text-left">
              <p className="text-slate-500 font-bold">
                Already have an account? <Link href="/login" className="text-primary-600 hover:text-primary-700 underline underline-offset-4">Sign in here</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
