import { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/lib/api';
import { useWishlist } from '@/store/useWishlist';
import { Button } from '@/components/ui/Button';
import { Mail, Lock, ShoppingBag, Loader2, UserPlus, CheckCircle2, Eye, EyeOff } from 'lucide-react';
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
  
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    onSuccess: (data: any) => {
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
    if (!name || !username || !email || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    registerMutation.mutate({ name, username, email, password, passwordConfirmation: confirmPassword });
  };


  return (
    <main ref={formRef} className="min-h-[calc(100vh-80px)] bg-white relative overflow-hidden flex items-center justify-center px-6 py-12">
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40">
        <div className="hero-blob absolute top-[-10%] left-[-5%] w-[50%] aspect-square bg-emerald-100/50 rounded-full blur-[120px]" />
        <div className="hero-blob absolute bottom-[-15%] right-[-10%] w-[50%] aspect-square bg-primary-100/50 rounded-full blur-[120px]" />
      </div>

      <div className="register-card w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 relative z-10 items-center">
        {/* Left Side: Marketing/Value Prop */}
        <div className="hidden lg:flex flex-col justify-center animate-in fade-in slide-in-from-left-8 duration-700">
           <Link href="/" className="inline-flex items-center gap-3 mb-10 group w-fit">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-600 to-indigo-700 flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <span className="font-black text-3xl tracking-tighter text-slate-900">Buzdealz</span>
           </Link>
           
           <h1 className="text-5xl xl:text-7xl font-black text-slate-900 tracking-tight leading-[0.9] mb-8">
             Join the elite tier of <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">shoppers.</span>
           </h1>
           
           <div className="space-y-6 max-w-lg">
              {[
                { title: 'Real-time Notifications', desc: 'Get alerted the second a price drops.' },
                { title: 'Price History', desc: 'See if a deal is actually a good value.' },
                { title: 'Verified Deals', desc: 'Zero spam. Only authentic premium offers.' }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                   <div className="mt-1 flex-shrink-0">
                      <CheckCircle2 className="w-6 h-6 text-emerald-500 fill-emerald-50" />
                   </div>
                   <div>
                      <p className="font-black text-slate-900 text-lg leading-none mb-1">{item.title}</p>
                      <p className="font-bold text-slate-500">{item.desc}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full max-w-md mx-auto">
          <div className="lg:hidden text-center mb-8">
             <Link href="/" className="inline-flex items-center gap-2 mb-4">
                <ShoppingBag className="w-6 h-6 text-primary-600" />
                <span className="font-black text-xl tracking-tighter text-slate-900">Buzdealz</span>
             </Link>
             <h2 className="text-3xl font-black text-slate-900 tracking-tight">Create Account</h2>
          </div>

          <div className="bg-white/70 backdrop-blur-3xl p-8 rounded-[2.5rem] border-2 border-white shadow-2xl shadow-slate-200/50">
            <div className="hidden lg:block mb-8">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Create Account</h2>
                <p className="text-slate-500 font-bold">Start saving hundreds on your favorite brands.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Full Name</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
                    <UserPlus className="w-5 h-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                  </div>
                  <input 
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full h-14 pl-12 pr-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Username</label>
                <div className="relative group">
                   <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
                    <span className="text-slate-400 font-black text-lg group-focus-within:text-primary-600">@</span>
                  </div>
                  <input 
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase())}
                    placeholder="unique_handle"
                    className="w-full h-14 pl-12 pr-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Email Address</label>
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
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full h-14 pl-12 pr-12 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Confirm Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                  <input 
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-14 pl-12 pr-12 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
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

            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
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
