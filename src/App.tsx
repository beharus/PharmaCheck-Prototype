import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppPrototype from "./pages/AppPrototype";
import NotFound from "./pages/NotFound";
// Rename the Toast component import to avoid conflict
import ProductVerificationPage from "./pages/ProductVerificationPage"; // Changed from 'Toast'

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppPrototype />} />
          {/* Product Verification routes for demo examples */}
          <Route 
            path="/e0d892c-e530-4077-b79e-61b99c837984" 
            element={<ProductVerificationPage type="valid" />} 
          />
          <Route 
            path="/eb8c56d3-68bd-41b9-af2e-0e263b345443" 
            element={<ProductVerificationPage type="counterfeit" />} 
          />
          <Route 
            path="/0ff7920b-2183-4a7a-87fd-357b96a510a2" 
            element={<ProductVerificationPage type="undefined" />} 
          />
          {/* Dynamic product route */}
          <Route path="/product/:id" element={<ProductVerificationPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;