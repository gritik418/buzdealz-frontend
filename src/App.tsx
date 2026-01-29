import { Route, Switch } from 'wouter';
import { WishlistProvider } from '@/store/useWishlist';
import { Navbar } from '@/components/feature/Navbar';
import { Home } from '@/pages/Home';
import { Wishlist } from '@/pages/Wishlist';
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WishlistProvider>
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
          <Navbar />
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/wishlist" component={Wishlist} />
            {/* Fallback 404 */}
            <Route>
              <div className="p-20 text-center">
                 <h1 className="text-4xl font-bold mb-4">404</h1>
                 <p>Page not found</p>
              </div>
            </Route>
          </Switch>
          <Toaster position="bottom-right" />
        </div>
      </WishlistProvider>
    </QueryClientProvider>
  );
}

export default App;

