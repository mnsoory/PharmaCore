// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/Login/LoginPage";
import Dashboard from "./pages/Dashboard/Dashboard";
import MainLayout from "./components/layout/MainLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import InventoryPage from "./pages/Inventory/InventoryPage";
import StockBatchesPage from "./pages/StockBatch/StockBatchesPage";
import PurchaseOrdersPage from "./pages/PurchaseOrder/PurchaseOrdersPage";
import SalesPage from "./pages/Sale/SalesPage";
import ReturnsPage from "./pages/Return/ReturnsPage";
import SupplierPage from "./pages/Supplier/SupplierPage";
import StaffPage from "./pages/Staff/StaffPage";
import ProfilePage from "./pages/Profile/ProfilePage";
import SettingsPage from "./pages/Settings/SettingsPage";
import DrugAlternativesPage from "./pages/DrugAlternative/DrugAlternativesPage";
import { Toaster } from "sonner";

const queryClient = new QueryClient();

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Toaster
        duration={5000}
        richColors
        position="bottom-right"
        toastOptions={{
          classNames: {
            toast: "rounded-xl border border-slate-200 bg-white p-4 shadow-2xl",
            title: "text-sm font-semibold text-slate-900",
            description: "text-xs text-slate-500",
            success: "border-green-500/30 bg-green-50/50 text-green-800",
            error: "border-red-500/30 bg-red-50/50 text-red-800",
            closeButton: "bg-white border-slate-200 hover:bg-slate-50",
          },
        }}
      />
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/drugs" element={<InventoryPage />} />
                <Route path="/stock-batches" element={<StockBatchesPage />} />
                <Route
                  path="/alternatives"
                  element={<DrugAlternativesPage />}
                />
                <Route path="/sales" element={<SalesPage />} />
                <Route path="/returns" element={<ReturnsPage />} />
                <Route path="/suppliers" element={<SupplierPage />} />
                <Route path="/users" element={<StaffPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route
                  path="/purchase-orders"
                  element={<PurchaseOrdersPage />}
                />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </div>
  );
}

export default App;
