import { motion } from 'framer-motion';
import { DealCard } from '@/components/feature/DealCard';
import { useWishlist } from '@/store/useWishlist';
import { Bell, Heart, Info, Loader2 } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/Button';
import { useEffect } from 'react';
import { toast } from 'sonner';

export const Wishlist = () => {
  const { wishlist, isLoading, isAuthenticated } = useWishlist();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation('/login');
      toast.error('Please login to view your wishlist');
    }
  }, [isLoading, isAuthenticated, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
        <p className="text-slate-500 font-bold">Syncing your wishlist...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50/50 pb-20 pt-8">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <div className="p-2 bg-primary-100 rounded-lg">
                  <Bell className="w-5 h-5 text-primary-600" />
               </div>
               <h2 className="text-sm font-black text-primary-600 tracking-[0.2em] uppercase">Your Tracking List</h2>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
               Saved Deals <span className="text-slate-300 ml-2">({wishlist.length})</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
             <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center border border-amber-100">
                <Info className="w-5 h-5 text-amber-600" />
             </div>
             <div>
                <p className="text-xs font-black text-slate-900 uppercase tracking-wider">How it works</p>
                <p className="text-xs text-slate-500 font-bold">We notify you the instant a price drops.</p>
             </div>
          </div>
        </div>

        {wishlist.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-32 px-6 bg-white rounded-[3rem] border-2 border-dashed border-slate-200 text-center"
          >
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-8">
               <Heart className="w-12 h-12 text-slate-200" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-3">Your wishlist is empty</h3>
            <p className="text-slate-500 max-w-sm mb-10 font-bold leading-relaxed">
               Start hunting for premium deals and save them here to track their price history.
            </p>
            <Link href="/">
              <Button className="h-14 px-10 rounded-2xl bg-slate-900 hover:bg-black text-white font-black shadow-xl shadow-slate-900/10">
                 Explore Hot Picks
              </Button>
            </Link>
          </motion.div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {wishlist.map((deal: any) => (
              <motion.div layout key={deal.id}>
                <DealCard deal={deal} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </main>
  );
};
