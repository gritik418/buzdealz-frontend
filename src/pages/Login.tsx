import { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/lib/api';
import { useWishlist } from '@/store/useWishlist';
import { Button } from '@/components/ui/Button';
import { Mail, Lock, ShoppingBag, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { gsap } from 'gsap';

export const Login = () => {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useWishlist();
  const formRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (isAuthenticated) {
      setLocation('/');
    }
  }, [isAuthenticated, setLocation]);

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.login-card', {
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

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['me'] });
        toast.success('Welcome back!');
        setLocation('/');
      } else {
        toast.error(data.message || 'Login failed');
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Something went wrong. Please try again.');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    loginMutation.mutate({ email, password });
  };

  return (
    <main ref={formRef} className="min-h-[calc(100vh-80px)] bg-white relative overflow-hidden flex items-center justify-center px-6 py-12">
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40">
        <div className="hero-blob absolute top-[-10%] right-[-5%] w-[50%] aspect-square bg-primary-200/50 rounded-full blur-[120px]" />
        <div className="hero-blob absolute bottom-[-15%] left-[-10%] w-[50%] aspect-square bg-indigo-200/50 rounded-full blur-[120px]" />
      </div>

      <div className="login-card w-full max-w-md relative z-10 transition-all">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-600 to-indigo-700 flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <span className="font-black text-3xl tracking-tighter text-slate-900">Buzdealz</span>
          </Link>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">Welcome Back</h1>
          <p className="text-slate-500 font-bold">Log in to manage your premium deal alerts.</p>
        </div>

        <div className="bg-white/70 backdrop-blur-3xl p-8 rounded-[2.5rem] border-2 border-white shadow-2xl shadow-slate-200/50">
          <form onSubmit={handleSubmit} className="space-y-6">
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
              <div className="flex items-center justify-between px-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Password</label>
                <a href="#" className="text-xs font-black text-primary-600 hover:text-primary-700">Forgot?</a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-14 pl-12 pr-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={loginMutation.isPending}
              className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-black text-white text-lg font-black shadow-xl shadow-slate-900/20 group mt-2"
            >
              {loginMutation.isPending ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>Sign In Now <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-500 font-bold">
              New to Buzdealz? <Link href="/register" className="text-primary-600 hover:text-primary-700 underline underline-offset-4">Create an account</Link>
            </p>
          </div>
        </div>
        
        <div className="mt-10 flex items-center justify-center gap-6 opacity-50 grayscale transition-all hover:grayscale-0 hover:opacity-100">
          <div className="flex items-center gap-1.5 text-[10px] font-black tracking-widest text-slate-400 uppercase">
            <Sparkles className="w-3 h-3 text-primary-600" /> Secure Payments
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-black tracking-widest text-slate-400 uppercase">
             Encrypted Data
          </div>
        </div>
      </div>
    </main>
  );
};
