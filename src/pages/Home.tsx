import { useLayoutEffect, useRef } from 'react';
import { DealCard } from '@/components/feature/DealCard';
import { useQuery } from '@tanstack/react-query';
import { dealsApi } from '@/lib/api';
import { Badge } from '@/components/ui/Badge';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Zap, ShieldCheck, ArrowRight, Mail, Loader2, Target } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

export const Home = () => {
  const mainRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  const { data: deals = [], isLoading, isError } = useQuery({
    queryKey: ['deals'],
    queryFn: dealsApi.getDeals,
  });

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

      if (!isLoading && deals.length > 0) {
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
      }

      // Gold Standard section entrance
      gsap.from('.feature-card', {
        scrollTrigger: {
          trigger: '.features-section',
          start: 'top 75%',
        },
        y: 40,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power3.out'
      });

    }, mainRef);

    return () => ctx.revert();
  }, [isLoading, deals.length]);

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
                  LIVE DROPS: {deals.length}+ SAVINGS ACTIVE
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
                    src="/hero.png" 
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

      {/* Gold Standard Section */}
      <section className="features-section py-32 bg-slate-900 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-full h-full pointer-events-none overflow-hidden opacity-30">
          <div className="absolute top-[-10%] right-[-10%] w-[40%] aspect-square bg-primary-500/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] aspect-square bg-violet-500/20 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto px-6 max-w-7xl relative z-10">
           <div className="text-center max-w-3xl mx-auto mb-20">
              <Badge variant="outline" className="text-primary-400 border-primary-500/30 mb-6 px-4 py-1.5 rounded-full font-black tracking-widest uppercase text-xs">
                The Gold Standard
              </Badge>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight leading-tight">
                Engineered for <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-violet-400">Extreme Savings.</span>
              </h2>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { 
                  title: 'Instant Detection', 
                  desc: 'Our proprietary high-frequency crawlers scan retail giants every 60 seconds for unauthorized price drops.', 
                  icon: Zap,
                  gradient: 'from-blue-600/20 to-cyan-500/20',
                  iconColor: 'text-blue-400'
                },
                { 
                  title: 'Elite Verification', 
                  desc: 'Every single deal is manually verified by our team of expert analysts to ensure 100% authenticity.', 
                  icon: ShieldCheck,
                  gradient: 'from-primary-600/20 to-violet-600/20',
                  iconColor: 'text-primary-400'
                },
                { 
                  title: 'Flash Precision', 
                  desc: 'Algorithm-driven history tracking tells you exactly when to buy and when to wait for the ultimate low.', 
                  icon: Target,
                  gradient: 'from-rose-600/20 to-amber-500/20',
                  iconColor: 'text-rose-400'
                }
              ].map((feature, i) => (
                <div key={i} className="feature-card group relative p-px bg-gradient-to-b from-white/20 to-transparent rounded-[2.5rem] hover:from-primary-500/50 transition-all duration-500">
                   <div className="relative p-10 bg-slate-800/40 backdrop-blur-3xl rounded-[2.4rem] h-full border border-white/5 group-hover:bg-slate-800/80 transition-all duration-500 flex flex-col">
                      <div className={cn("w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-8 shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500", feature.gradient)}>
                         <feature.icon className={cn("w-8 h-8", feature.iconColor)} />
                      </div>
                      <h4 className="text-2xl font-black text-white mb-4 group-hover:text-primary-400 transition-colors">{feature.title}</h4>
                      <p className="text-slate-400 font-bold leading-relaxed mb-8 flex-1">{feature.desc}</p>
                      
                      <button className="flex items-center gap-2 text-primary-400 text-sm font-black uppercase tracking-widest group/btn w-fit">
                         <span className="relative overflow-hidden inline-block">
                            <span className="inline-block transition-transform duration-300 group-hover/btn:-translate-y-full">Core Specs</span>
                            <span className="absolute top-0 left-0 inline-block transition-transform duration-300 translate-y-full group-hover/btn:translate-y-0">Learn More</span>
                         </span>
                         <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Featured Deals Grid */}
      <section className="py-24 px-6 overflow-visible max-w-7xl mx-auto">
        <div className="container mx-auto">
          <div className="flex items-end justify-between mb-16 px-2">
            <div>
              <Badge className="bg-primary-50 text-primary-600 border-primary-100 mb-4 px-4 py-1.5 rounded-full font-black uppercase text-[10px] tracking-widest">
                 Premium Curated Selection
              </Badge>
              <h3 className="text-5xl font-black text-slate-900 tracking-tight leading-none">Today's Hot Picks</h3>
            </div>
            <Button variant="ghost" className="hidden sm:flex items-center gap-2 font-black text-primary-600 hover:text-white hover:bg-primary-600 transition-all rounded-xl h-12 px-6">
               View All Deals <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
              <p className="text-slate-500 font-bold">Hunting for the best deals...</p>
            </div>
          ) : isError ? (
            <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
               <p className="text-slate-500 font-bold">Failed to load deals. Please try again later.</p>
            </div>
          ) : (
            <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {deals.map((deal: any) => (
                <div key={deal.id} className="deal-card-wrapper">
                  <DealCard deal={deal} />
                </div>
              ))}
            </div>
          )}
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
               </div>
            </div>
         </div>
      </section>
    </main>
  );
};
