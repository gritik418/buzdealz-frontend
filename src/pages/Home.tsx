import { useLayoutEffect, useRef } from 'react';
import { DealCard } from '@/components/feature/DealCard';
import { dummyDeals } from '@/data/dummyDeals';
import { Badge } from '@/components/ui/Badge';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Zap, ShieldCheck, Clock, ArrowRight, Mail, LayoutGrid, Laptop, Shirt, Home as HomeIcon, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

const CATEGORIES = [
  { name: 'Electronics', icon: Laptop, color: 'text-blue-600', bg: 'bg-blue-50' },
  { name: 'Fashion', icon: Shirt, color: 'text-rose-600', bg: 'bg-rose-50' },
  { name: 'Home', icon: HomeIcon, color: 'text-amber-600', bg: 'bg-amber-50' },
  { name: 'Gaming', icon: LayoutGrid, color: 'text-violet-600', bg: 'bg-violet-50' },
  { name: 'Mobile', icon: Smartphone, color: 'text-emerald-600', bg: 'bg-emerald-50' },
];

export const Home = () => {
  const mainRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // Hero Animation
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      
      tl.from(badgeRef.current, { y: 20, opacity: 0, duration: 0.8 })
        .from(titleRef.current, { y: 30, opacity: 0, duration: 0.8 }, '-=0.5')
        .from(descriptionRef.current, { y: 20, opacity: 0, duration: 0.8 }, '-=0.6')
        .from('.hero-image-container', { x: 50, opacity: 0, duration: 1, scale: 0.95 }, '-=0.8');

      // Floating background elements
      gsap.to('.hero-blob', {
        x: 'random(-20, 20)',
        y: 'random(-20, 20)',
        duration: 'random(3, 5)',
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.5
      });

      // Categories staggered entrance
      gsap.from('.category-pill', {
        scrollTrigger: {
          trigger: '.categories-section',
          start: 'top 80%',
        },
        y: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power2.out'
      });

      // Grid Animation
      gsap.from('.deal-card-wrapper', {
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 85%',
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        clearProps: 'all'
      });

      // Features section staggered entrance
      gsap.from('.feature-card', {
        scrollTrigger: {
          trigger: '.features-section',
          start: 'top 75%',
        },
        y: 40,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: 'back.out(1.7)'
      });

    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={mainRef} className="min-h-screen bg-white pb-20 overflow-hidden">
      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-16 pb-24 px-6 bg-white overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40">
          <div className="hero-blob absolute top-[-5%] left-[-5%] w-[45%] aspect-square bg-primary-200/50 rounded-full blur-[120px]" />
          <div className="hero-blob absolute bottom-[-10%] right-[-10%] w-[45%] aspect-square bg-indigo-200/50 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="text-left">
              <div ref={badgeRef}>
                <Badge variant="secondary" className="mb-8 px-5 py-2 text-sm font-bold text-primary-700 bg-primary-50 border-primary-100 hover:bg-primary-100 transition-colors shadow-sm rounded-full inline-flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-primary-600 animate-pulse" />
                  LIVE DROPS: 1,429 SAVINGS ACTIVE
                </Badge>
              </div>
              
              <h1 ref={titleRef} className="text-6xl md:text-8xl font-black text-slate-900 tracking-tight mb-8 leading-[0.95]">
                Smart Shopping <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-indigo-600 to-violet-700">
                  Refined.
                </span>
              </h1>
              
              <p ref={descriptionRef} className="text-xl text-slate-500 max-w-lg mb-12 leading-relaxed font-semibold">
                Buzdealz tracks thousands of exclusive discounts across premium brands so you never overpay again.
              </p>

              <div className="flex flex-wrap items-center gap-5">
                 <Button className="h-14 px-8 rounded-2xl bg-slate-900 hover:bg-black text-white text-lg font-black shadow-2xl shadow-slate-900/20 group">
                    Explore Deals <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                 </Button>
                 <Button variant="ghost" className="h-14 px-8 rounded-2xl text-slate-600 text-lg font-bold border-2 border-slate-100 bg-white shadow-sm hover:border-primary-100 hover:text-primary-600">
                    How it Works
                 </Button>
              </div>
            </div>

            <div className="hero-image-container relative">
               <div className="absolute -inset-4 bg-gradient-to-tr from-primary-500 to-violet-500 opacity-10 blur-3xl rounded-[3rem]" />
               <div className="relative rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl">
                 <img 
                    src="/Users/ritikgupta/.gemini/antigravity/brain/e9d6a55b-23fe-4390-8d0a-be2cf7d20845/hero_shopping_deals_1769154352834.png" 
                    alt="Premium Shopping" 
                    className="w-full object-cover scale-105"
                 />
                 <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 shadow-lg">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center text-white">
                          <Zap className="w-6 h-6 fill-current" />
                       </div>
                       <div className="text-left">
                          <p className="text-sm font-black text-slate-900 leading-none">Flash Sale Detection</p>
                          <p className="text-xs text-slate-500 mt-1 font-bold">Algorithms scanned 4s ago</p>
                       </div>
                    </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Pills */}
      <section className="categories-section py-12 border-y border-slate-100">
        <div className="container mx-auto px-6 max-w-7xl">
           <div className="flex flex-wrap justify-center gap-4">
              {CATEGORIES.map((cat) => (
                <button key={cat.name} className="category-pill group flex items-center gap-3 px-6 py-3 rounded-2xl border-2 border-slate-100 hover:border-primary-200 hover:bg-primary-50 transition-all duration-300">
                   <div className={cn("p-2 rounded-xl transition-colors", cat.bg)}>
                      <cat.icon className={cn("w-5 h-5", cat.color)} />
                   </div>
                   <span className="font-bold text-slate-700 group-hover:text-primary-700">{cat.name}</span>
                </button>
              ))}
           </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="features-section py-24 bg-slate-50/50">
        <div className="container mx-auto px-6 max-w-7xl text-center">
           <h2 className="text-sm font-black text-primary-600 tracking-[0.3em] uppercase mb-4">Why Buzdealz</h2>
           <h3 className="text-4xl font-black text-slate-900 mb-16">The gold standard in deal hunting.</h3>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: 'Real-time Monitoring', desc: 'Our crawlers check retail prices every 60 seconds for verified drops.', icon: Zap },
                { title: 'Verified Merchants', desc: 'We only track reputable stores to ensure you get authentic products.', icon: ShieldCheck },
                { title: 'Historical Tracking', desc: 'Every deal includes a price history to ensure it is actually a good value.', icon: Clock }
              ].map((feature, i) => (
                <div key={i} className="feature-card p-10 bg-white rounded-3xl border-2 border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 text-left">
                   <div className="w-14 h-14 rounded-2xl bg-primary-100 flex items-center justify-center text-primary-600 mb-6">
                      <feature.icon className="w-8 h-8" />
                   </div>
                   <h4 className="text-xl font-black text-slate-900 mb-3">{feature.title}</h4>
                   <p className="text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Featured Deals Grid */}
      <section className="py-24 px-6 overflow-visible">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-end justify-between mb-16 px-2">
            <div>
              <h2 className="text-sm font-black text-primary-600 tracking-[0.3em] uppercase mb-4">Curated Selection</h2>
              <h3 className="text-5xl font-black text-slate-900 tracking-tight leading-none">Today's Hot Picks</h3>
              <p className="text-slate-400 mt-4 text-lg font-bold">Limited time offers, moving fast.</p>
            </div>
            <Button variant="ghost" className="hidden sm:flex items-center gap-2 font-black text-primary-600 hover:text-white hover:bg-primary-600 transition-all rounded-xl h-12 px-6">
               View All Deals <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          
          <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {dummyDeals.map((deal) => (
              <div key={deal.id} className="deal-card-wrapper">
                <DealCard deal={deal} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 px-6">
         <div className="container mx-auto max-w-6xl">
            <div className="relative bg-slate-900 rounded-[3rem] p-12 md:p-20 overflow-hidden shadow-2xl">
               <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-600/20 to-transparent blur-3xl pointer-events-none" />
               <div className="relative z-10 text-center max-w-2xl mx-auto">
                  <Mail className="w-16 h-16 text-primary-500 mx-auto mb-8 animate-bounce" />
                  <h3 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">Never miss a price drop again.</h3>
                  <p className="text-xl text-slate-400 mb-10 font-bold">Join 50,000+ smart shoppers receiving our daily curated drops.</p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                     <input 
                        type="email" 
                        placeholder="Enter your email" 
                        className="flex-1 h-14 px-6 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-slate-500 focus:outline-none focus:ring-4 focus:ring-primary-600/30 transition-all font-bold"
                     />
                     <Button className="h-14 px-8 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-black">
                        Invite Me
                     </Button>
                  </div>
                  <p className="mt-6 text-xs text-slate-500 font-bold uppercase tracking-widest">NO SPAM. JUST SAVINGS. UNSUBSCRIBE ANYTIME.</p>
               </div>
            </div>
         </div>
      </section>
    </main>
  );
};
