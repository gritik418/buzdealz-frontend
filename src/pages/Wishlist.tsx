import { motion } from 'framer-motion';
import { DealCard } from '@/components/feature/DealCard';
import { useWishlist } from '@/store/useWishlist';
import { Bell,  Heart,  Info } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/Button';

export const Wishlist = () => {
  const { wishlist } = useWishlist();

  return (
    <main className="min-h-screen bg-slate-50/50 pb-20 pt-8">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">My Wishlist</h1>
          <p className="text-slate-500">
             Track prices and get notified when your favorite items go on sale.
          </p>
        </div>

        {/* Stats / Info Banner */}
        {wishlist.length > 0 && (
           <div className="bg-white border boundary-slate-200 rounded-xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center text-primary-600">
                    <Bell className="w-6 h-6" />
                 </div>
                 <div>
                    <h3 className="font-semibold text-slate-900">Deal Alerts Active</h3>
                    <p className="text-sm text-slate-500">You are tracking {wishlist.filter(w => w.alertEnabled).length} items for price drops.</p>
                 </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-4 py-2 rounded-lg">
                 <Info className="w-4 h-4" />
                 <span>Free users can track up to 5 items.</span>
              </div>
           </div>
        )}

        {/* Empty State */}
        {wishlist.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 px-4"
          >
             <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
                <Heart className="w-12 h-12" />
             </div>
             <h2 className="text-xl font-semibold text-slate-900 mb-2">Your wishlist is empty</h2>
             <p className="text-slate-500 mb-8 max-w-md mx-auto">
               Start saving deals you love! Tap the heart icon on any deal to add it here and track its price.
             </p>
             <Link href="/">
               <Button size="lg">Explore Deals</Button>
             </Link>
          </motion.div>
        ) : (
          /* Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};
