import { Heart, Bell, ExternalLink, TrendingDown, ShoppingBag } from 'lucide-react';
import type { Deal } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useWishlist } from '@/store/useWishlist';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface DealCardProps {
  deal: Deal;
}

export const DealCard = ({ deal }: DealCardProps) => {
  const { addToWishlist, removeFromWishlist, isInWishlist, toggleAlert, wishlist } = useWishlist();
  const isWishlisted = isInWishlist(deal.id);
  const wishlistItem = wishlist.find(w => w.id === deal.id);
  const alertEnabled = wishlistItem?.alertEnabled;

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isWishlisted) {
      removeFromWishlist(deal.id);
    } else {
      addToWishlist(deal);
    }
  };

  const handleAlertClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      toggleAlert(deal.id);
    }
  };

  const isExpired = new Date(deal.expiryDate) < new Date();

  return (
    <div className={cn("h-full group/card transition-all duration-300", isExpired && "opacity-75 grayscale-[0.5]")}>
      <Card className="h-full overflow-hidden flex flex-col relative border-slate-100 bg-white shadow-sm hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-500 rounded-2xl border-2 hover:border-primary-100">
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          <img 
            src={deal.image || "/Users/ritikgupta/.gemini/antigravity/brain/e9d6a55b-23fe-4390-8d0a-be2cf7d20845/placeholder_deal_1769154352834.png"} 
            alt={deal.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
          
          <div className="absolute top-4 right-4 z-10">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleWishlistClick}
              className={cn(
                "p-2.5 rounded-full backdrop-blur-md shadow-lg transition-all duration-300",
                isWishlisted 
                  ? "bg-red-500 text-white" 
                  : "bg-white/90 text-slate-500 hover:bg-white hover:text-red-500"
              )}
            >
              <Heart className={cn("w-5 h-5", isWishlisted && "fill-current")} />
            </motion.button>
          </div>

          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
            {isExpired ? (
              <Badge variant="secondary" className="font-bold shadow-lg px-3 py-1 bg-slate-500 text-white rounded-lg">
                EXPIRED
              </Badge>
            ) : deal.discount > 0 && (
              <Badge variant="destructive" className="font-bold shadow-lg px-3 py-1 bg-red-600 text-white rounded-lg">
                -{deal.discount}% OFF
              </Badge>
            )}
            <Badge className="bg-white/90 backdrop-blur-sm text-slate-900 border-none shadow-sm flex items-center gap-1.5 px-3 py-1 rounded-lg">
              <ShoppingBag className="w-3.5 h-3.5 text-primary-600" />
              <span className="text-[10px] font-bold tracking-tight uppercase">{deal.store}</span>
            </Badge>
          </div>
        </div>

        <CardContent className="flex-1 p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-bold text-primary-600 uppercase tracking-widest bg-primary-50 px-2 py-0.5 rounded-md">
              {deal.category}
            </span>
            <span className="text-[10px] text-slate-400 font-bold">• {isExpired ? 'OUT OF STOCK' : 'STOCKED'}</span>
          </div>
          
          <h3 className="font-bold text-lg leading-tight line-clamp-2 mb-3 text-slate-900 group-hover/card:text-primary-700 transition-colors">
            {deal.title}
          </h3>
          
          <div className="flex items-center gap-3 mb-4">
            <div className={cn("text-3xl font-black text-slate-900 leading-none", isExpired && "text-slate-400")}>
              <span className="text-xl inline-block mr-0.5 align-top mt-1.5">$</span>
              {deal.price}
            </div>
            {deal.originalPrice > deal.price && (
              <div className="text-sm text-slate-400 line-through font-bold">
                ${deal.originalPrice}
              </div>
            )}
          </div>
          
          <AnimatePresence>
            {!isExpired && deal.bestPrice && deal.price > deal.bestPrice && (
               <motion.div 
                 initial={{ opacity: 0, height: 0 }}
                 animate={{ opacity: 1, height: 'auto' }}
                 className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50/50 p-2.5 rounded-xl mb-2 border border-emerald-100"
               >
                 <TrendingDown className="w-4 h-4" />
                 Low Price Alert: ${deal.bestPrice} detected previously
               </motion.div>
            )}
          </AnimatePresence>
        </CardContent>

        <CardFooter className="p-6 pt-0 gap-3 mt-auto">
          <Button 
            disabled={isExpired}
            className="w-full gap-2 rounded-xl h-12 text-sm font-black uppercase tracking-wider shadow-lg shadow-primary-500/20" 
            variant={isExpired ? "outline" : "default"}
          >
             {isExpired ? 'Deal Ended' : 'Grab Deal'} <ExternalLink className="w-4 h-4" />
          </Button>


          
          {isWishlisted && (
             <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={handleAlertClick}
                className={cn(
                  "p-3 rounded-xl border-2 transition-all duration-300",
                  alertEnabled
                    ? "bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/20"
                    : "bg-white border-slate-100 text-slate-400 hover:border-slate-200 hover:text-slate-600"
                )}
                title={alertEnabled ? "Price alerts enabled" : "Enable price alerts"}
             >
                <Bell className={cn("w-5 h-5", alertEnabled && "fill-current")} />
             </motion.button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};
