import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster as ToasterProvider } from "sonner";
import { type ReactNode, useState } from "react";
import { AuthProvider } from "@/context/AuthContext";
import ErrorBoundary from "./ErrorBoundary";

const RootLayout = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            staleTime: 30_000,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 0,
          },
        },
      }),
  );

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          {children}
          <ToasterProvider position="top-center" richColors />
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default RootLayout;
