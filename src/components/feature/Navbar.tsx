import {
  Bell,
  Clock,
  Heart,
  LogOut,
  Menu,
  ShoppingBag,
  Sparkles,
  User,
} from "lucide-react";
import { Link, useLocation } from "wouter";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/store/useWishlist";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export const Navbar = () => {
  const [location] = useLocation();
  const {
    wishlist,
    user,
    isAuthenticated,
    logout,
    unreadCount,
    markNotificationsAsRead,
    notifications,
  } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const wishlistCount = wishlist.length;

  const NavLink = ({
    href,
    children,
    isActive,
  }: {
    href: string;
    children: React.ReactNode;
    isActive: boolean;
  }) => (
    <Link
      href={href}
      className={cn(
        "relative py-2 px-1 text-sm font-semibold transition-all duration-300 hover:text-primary-600",
        isActive ? "text-primary-600" : "text-slate-500",
      )}
    >
      {children}
      {isActive && (
        <motion.div
          layoutId="nav-underline"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-primary-600 to-indigo-600 rounded-full"
        />
      )}
    </Link>
  );

  return (
    <header
      className={cn(
        "sticky top-0 z-100 w-full transition-all duration-500",
        scrolled
          ? "bg-white/70 backdrop-blur-2xl border-b border-slate-200/50 py-2 shadow-sm"
          : "bg-transparent py-4",
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary-600 via-indigo-600 to-violet-700 flex items-center justify-center text-white shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/40 group-hover:scale-105 transition-all duration-300">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-2xl tracking-tighter bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent leading-none">
                Buzdealz
              </span>
              <span className="text-[10px] font-bold text-primary-600 tracking-[0.2em] uppercase leading-none mt-1 flex items-center gap-1">
                Premium{" "}
                {user?.isSubscriber && <Sparkles className="w-2.5 h-2.5" />}
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8 ml-4">
            <NavLink href="/" isActive={location === "/"}>
              Deals
            </NavLink>
          </nav>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 md:gap-5">
          <div className="relative">
            <button
              onClick={() => {
                if (notifOpen) {
                  markNotificationsAsRead();
                }
                setNotifOpen(!notifOpen);
              }}
              className={cn(
                "hidden md:flex p-2 rounded-xl transition-all duration-300",
                notifOpen
                  ? "bg-primary-50 text-primary-600"
                  : "text-slate-400 hover:text-primary-600",
              )}
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              <AnimatePresence>
                {isAuthenticated && unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute top-1.5 right-1.5 w-4 h-4 bg-primary-600 text-white text-[8px] font-black flex items-center justify-center rounded-full border-2 border-white ring-1 ring-primary-500/20"
                  >
                    {unreadCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <AnimatePresence>
              {notifOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[-1]"
                    onClick={() => {
                      markNotificationsAsRead();
                      setNotifOpen(false);
                    }}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-80 bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden py-2 z-50"
                  >
                    <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                      <span className="font-black text-slate-900 text-sm uppercase tracking-wider">
                        Alert Center
                      </span>
                      {unreadCount > 0 && (
                        <span className="bg-primary-50 text-primary-600 text-[10px] font-black px-2 py-0.5 rounded-full">
                          {unreadCount} New
                        </span>
                      )}
                    </div>

                    <div className="max-h-100 overflow-y-auto no-scrollbar">
                      {notifications.length > 0 ? (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            className={cn(
                              "px-5 py-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors relative",
                              !n.isRead && "bg-primary-50/30",
                            )}
                          >
                            {!n.isRead && (
                              <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary-500 rounded-full" />
                            )}
                            <p className="text-sm font-black text-slate-900 leading-tight mb-1">
                              {n.title}
                            </p>
                            <p className="text-xs text-slate-500 font-bold leading-relaxed">
                              {n.message}
                            </p>
                            <p className="text-[10px] text-slate-300 font-bold mt-2 flex items-center gap-1 uppercase tracking-tighter">
                              <Clock className="w-2.5 h-2.5" />
                              {new Date(n.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="p-10 text-center">
                          <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-200">
                            <Bell className="w-6 h-6" />
                          </div>
                          <p className="text-slate-400 font-bold text-sm">
                            No new price alerts yet.
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="p-3 bg-slate-50/50">
                      <button
                        onClick={() => {
                          markNotificationsAsRead();
                          setNotifOpen(false);
                        }}
                        className="w-full py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-colors"
                      >
                        Close Panel
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <Link
            href="/wishlist"
            className={cn(
              "relative p-2.5 rounded-xl transition-all duration-300",
              location === "/wishlist"
                ? "bg-primary-50 text-primary-600 shadow-inner"
                : "text-slate-500 hover:bg-slate-50 hover:text-primary-600",
            )}
          >
            <Heart
              className={cn(
                "w-5.5 h-5.5",
                location === "/wishlist" && "fill-current",
              )}
            />
            <AnimatePresence>
              {wishlistCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 h-5 w-5 bg-linear-to-br from-red-500 to-rose-600 text-white text-[10px] font-black flex items-center justify-center rounded-full ring-4 ring-white shadow-lg"
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
                <p className="text-xs font-black text-slate-900 leading-none truncate max-w-30">
                  {user?.name}
                </p>
                <p className="text-[10px] font-bold text-primary-600 uppercase tracking-widest mt-0.5">
                  {user?.isSubscriber ? "Pro Member" : "Free Plan"}
                </p>
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
              <Button
                className="hidden md:flex gap-2 rounded-xl bg-slate-900 hover:bg-black text-white px-5 h-11 shadow-xl shadow-slate-900/10 font-bold transition-all hover:-translate-y-0.5"
                size="sm"
              >
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
