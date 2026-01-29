import { useRoute } from 'wouter';
import { dummyDeals } from '@/data/dummyDeals';
import { useWishlist } from '@/store/useWishlist';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Heart, Bell, ShoppingBag, ExternalLink, Clock, ShieldCheck, ChevronLeft, TrendingDown } from 'lucide-react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export const DealDetails = () => {
  const [, params] = useRoute('/deal/:id');
  const { addToWishlist, removeFromWishlist, isInWishlist, toggleAlert, wishlist, isSubscriber } = useWishlist();
  
  const deal = dummyDeals.find(d => d.id === params?.id);
  
  if (!deal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Deal not found</h2>
          <Link href="/">
            <Button>Back to Deals</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isWishlisted = isInWishlist(deal.id);
  const wishlistItem = wishlist.find(w => w.id === deal.id);
  const alertEnabled = wishlistItem?.alertEnabled;
  const isExpired = new Date(deal.expiryDate) < new Date();

  return (
    <main className="min-h-screen bg-white pb-20">
      <div className="container mx-auto px-6 max-w-7xl pt-8">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 transition-colors mb-8 font-bold">
          <ChevronLeft className="w-5 h-5" /> Back to Deals
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Image Section */}
          <div className="relative">
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="rounded-[3rem] overflow-hidden border-8 border-slate-50 shadow-2xl bg-slate-100 aspect-square"
            >
               <img 
                 src={deal.image || "/placeholder.png"} 
                 alt={deal.title}
                 className="w-full h-full object-cover"
               />
            </motion.div>
            
            <div className="absolute top-8 left-8 flex flex-col gap-3">
               {isExpired ? (
                 <Badge className="bg-slate-500 text-white border-none px-4 py-2 text-sm font-black rounded-xl">EXPIRED</Badge>
               ) : deal.discount > 0 && (
                 <Badge variant="destructive" className="px-4 py-2 text-sm font-black rounded-xl shadow-lg shadow-red-500/20">
                    -{deal.discount}% OFF
                 </Badge>
               )}
               <Badge className="bg-white/90 backdrop-blur-md text-slate-900 border-none shadow-xl px-4 py-2 text-sm font-black rounded-xl flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-primary-600" />
                  {deal.store.toUpperCase()}
               </Badge>
            </div>
          </div>

          {/* Info Section */}
          <div className="flex flex-col">
            <div className="mb-6">
               <span className="text-xs font-black text-primary-600 tracking-[0.3em] uppercase mb-3 block">
                 {deal.category}
               </span>
               <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-4">
                 {deal.title}
               </h1>
               <div className="flex items-center gap-4 text-slate-400 font-bold">
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Expires {new Date(deal.expiryDate).toLocaleDateString()}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" /> Verified Deal</span>
               </div>
            </div>

            <div className="bg-slate-50 rounded-[2.5rem] p-8 mb-8 border-2 border-slate-100">
               <div className="flex items-end gap-4 mb-6">
                  <div className="text-6xl font-black text-slate-900 leading-none">
                     <span className="text-3xl align-top mt-2 inline-block mr-1">$</span>
                     {deal.price}
                  </div>
                  {deal.originalPrice > deal.price && (
                    <div className="text-2xl text-slate-400 line-through font-bold mb-1">
                      ${deal.originalPrice}
                    </div>
                  )}
               </div>

               {deal.bestPrice && (
                 <div className={cn(
                   "flex items-center gap-3 p-4 rounded-2xl mb-8 border-2",
                   deal.price <= (deal.bestPrice || 0) 
                    ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                    : "bg-amber-50 border-amber-100 text-amber-700"
                 )}>
                   <TrendingDown className="w-6 h-6" />
                   <div>
                      <p className="font-black text-sm uppercase tracking-wider">Price Context</p>
                      <p className="text-sm font-bold opacity-80">All-time low was ${deal.bestPrice}. {deal.price <= deal.bestPrice ? "This is the best price ever!" : "Waiting for it to drop further?"}</p>
                   </div>
                 </div>
               )}

               <div className="flex flex-wrap gap-4">
                  <Button 
                    disabled={isExpired}
                    className="flex-1 h-16 rounded-2xl bg-slate-900 hover:bg-black text-white text-lg font-black shadow-2xl shadow-slate-900/20 group"
                  >
                     Grab This Deal <ExternalLink className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  
                  <Button 
                    variant={isWishlisted ? "danger" : "outline"}
                    className="h-16 w-16 rounded-2xl border-2 shrink-0"
                    onClick={() => isWishlisted ? removeFromWishlist(deal.id) : addToWishlist(deal)}
                  >
                    <Heart className={cn("w-6 h-6", isWishlisted && "fill-current")} />
                  </Button>

                  {isWishlisted && (
                     <Button 
                        variant={alertEnabled ? "default" : "outline"}
                        className={cn("h-16 w-16 rounded-2xl border-2 shrink-0", alertEnabled && "bg-amber-500 border-amber-500 hover:bg-amber-600")}
                        onClick={() => toggleAlert(deal.id)}
                     >
                        <Bell className={cn("w-6 h-6", alertEnabled && "fill-current")} />
                     </Button>
                  )}
               </div>
               
               {!isSubscriber && isWishlisted && (
                 <p className="mt-4 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                   PRO TIP: UPGRADE TO ENABLE PRICE ALERTS
                 </p>
               )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="p-6 rounded-3xl bg-white border-2 border-slate-100">
                  <h4 className="font-black text-slate-900 mb-2 uppercase text-xs tracking-widest">Store info</h4>
                  <p className="font-bold text-slate-600">{deal.store} Official Store</p>
                  <p className="text-sm text-slate-400 mt-1">Verified merchant with 99% positive feedback.</p>
               </div>
               <div className="p-6 rounded-3xl bg-white border-2 border-slate-100">
                  <h4 className="font-black text-slate-900 mb-2 uppercase text-xs tracking-widest">Availability</h4>
                  <p className={cn("font-bold", isExpired ? "text-red-500" : "text-emerald-500")}>
                    {isExpired ? "Deal Expired" : "Currently in Stock"}
                  </p>
                  <p className="text-sm text-slate-400 mt-1">Updated 4 minutes ago.</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
