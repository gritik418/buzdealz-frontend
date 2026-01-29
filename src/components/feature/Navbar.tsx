import { Link, useLocation } from 'wouter';
import { ShoppingBag, Heart, Menu, Search, User, Bell, Sparkles, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useWishlist } from '@/store/useWishlist';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

export const Navbar = () => {
  const [location] = useLocation();
  const { wishlist, user, isAuthenticated, logout } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const wishlistCount = wishlist.length;

  const NavLink = ({ href, children, isActive }: { href: string; children: React.ReactNode; isActive: boolean }) => (
    <Link 
      href={href}
      className={cn(
        "relative py-2 px-1 text-sm font-semibold transition-all duration-300 hover:text-primary-600",
        isActive ? "text-primary-600" : "text-slate-500"
      )}
    >
      {children}
      {isActive && (
        <motion.div
          layoutId="nav-underline"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-600 to-indigo-600 rounded-full"
        />
      )}
    </Link>
  );

  return (
    <header 
      className={cn(
        "sticky top-0 z-[100] w-full transition-all duration-500",
        scrolled 
          ? "bg-white/70 backdrop-blur-2xl border-b border-slate-200/50 py-2 shadow-sm" 
          : "bg-transparent py-4"
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-8">
           <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 via-indigo-600 to-violet-700 flex items-center justify-center text-white shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/40 group-hover:scale-105 transition-all duration-300">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-2xl tracking-tighter bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent leading-none">
                  Buzdealz
                </span>
                <span className="text-[10px] font-bold text-primary-600 tracking-[0.2em] uppercase leading-none mt-1 flex items-center gap-1">
                  Premium {user?.isSubscriber && <Sparkles className="w-2.5 h-2.5" />}
                </span>
              </div>
           </Link>

           {/* Desktop Nav */}
           <nav className="hidden lg:flex items-center gap-8 ml-4">
             <NavLink href="/" isActive={location === '/'}>Deals</NavLink>
             <NavLink href="/categories" isActive={location === '/categories'}>Categories</NavLink>
             <NavLink href="/stores" isActive={location === '/stores'}>Stores</NavLink>
           </nav>
        </div>

        {/* Desktop Search */}
        <div className="hidden xl:flex flex-1 max-w-md mx-8 group">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
            <input 
               type="text" 
               placeholder="Search for premium deals..." 
               className="w-full pl-11 pr-4 py-2.5 text-sm bg-white border-2 border-slate-100 rounded-2xl focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none shadow-sm font-medium"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
               <span className="px-1.5 py-0.5 rounded border border-slate-200 text-[10px] font-bold text-slate-400 bg-slate-50">⌘K</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 md:gap-5">
           <button className="hidden md:flex p-2 text-slate-400 hover:text-primary-600 transition-colors relative">
             <Bell className="w-5 h-5" />
             {isAuthenticated && <span className="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full border-2 border-white"></span>}
           </button>

           <Link 
             href="/wishlist"
             className={cn(
               "relative p-2.5 rounded-xl transition-all duration-300",
               location === '/wishlist' 
                 ? "bg-primary-50 text-primary-600 shadow-inner" 
                 : "text-slate-500 hover:bg-slate-50 hover:text-primary-600"
             )}
           >
             <Heart className={cn("w-5.5 h-5.5", location === '/wishlist' && "fill-current")} />
             <AnimatePresence>
               {wishlistCount > 0 && (
                 <motion.span
                   initial={{ scale: 0 }}
                   animate={{ scale: 1 }}
                   exit={{ scale: 0 }}
                   className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-br from-red-500 to-rose-600 text-white text-[10px] font-black flex items-center justify-center rounded-full ring-4 ring-white shadow-lg"
                 >
                   {wishlistCount}
                 </motion.span>
               )}
             </AnimatePresence>
           </Link>

           <div className="hidden md:block w-px h-8 bg-slate-200 mx-1 opacity-50"></div>

           {isAuthenticated ? (
             <div className="flex items-center gap-2">
                <div className="hidden lg:block text-right">
                  <p className="text-xs font-black text-slate-900 leading-none truncate max-w-[120px]">{user?.email}</p>
                  <p className="text-[10px] font-bold text-primary-600 uppercase tracking-widest mt-0.5">{user?.isSubscriber ? 'Pro Member' : 'Free Plan'}</p>
                </div>
                <Button 
                  onClick={logout}
                  variant="ghost" 
                  size="icon" 
                  className="rounded-xl h-11 w-11 text-slate-400 hover:text-red-500 hover:bg-red-50"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </Button>
             </div>
           ) : (
             <Link href="/login">
               <Button className="hidden md:flex gap-2 rounded-xl bg-slate-900 hover:bg-black text-white px-5 h-11 shadow-xl shadow-slate-900/10 font-bold transition-all hover:-translate-y-0.5" size="sm">
                 <User className="w-4 h-4" />
                 Account
               </Button>
             </Link>
           )}


           <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden rounded-xl h-11 w-11"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
           >
             <Menu className="w-6 h-6" />
           </Button>
        </div>
      </div>
    </header>
  );
};

