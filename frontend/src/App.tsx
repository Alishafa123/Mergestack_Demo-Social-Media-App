import AppRouter from "@router/AppRouter";
import { ToastProvider } from '@components/shared/toast';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 2,
    },
    mutations: {
      retry: 1,
    },
  },
});

export default function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AppRouter />
        <ReactQueryDevtools initialIsOpen={false} />
      </ToastProvider>
    </QueryClientProvider>
  );
}
