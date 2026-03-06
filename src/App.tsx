import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LocaleProvider } from "@/contexts/LocaleContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Articles from "./pages/Articles";
import ArticleDetail from "./pages/ArticleDetail";
import Categories from "./pages/Categories";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import DashboardOverview from "./pages/dashboard/DashboardOverview";
import DashboardArticles from "./pages/dashboard/DashboardArticles";
import ArticleNew from "./pages/dashboard/ArticleNew";
import ArticleEdit from "./pages/dashboard/ArticleEdit";
import DashboardCategories from "./pages/dashboard/DashboardCategories";
import DashboardMedia from "./pages/dashboard/DashboardMedia";
import DashboardUsers from "./pages/dashboard/DashboardUsers";
import DashboardSettings from "./pages/dashboard/DashboardSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LocaleProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/articles" element={<Articles />} />
                <Route path="/articles/:slug" element={<ArticleDetail />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/categories/:slug" element={<Categories />} />
                <Route path="/about" element={<About />} />

                {/* Auth routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* Dashboard routes (protected) */}
                <Route path="/dashboard" element={<ProtectedRoute><DashboardOverview /></ProtectedRoute>} />
                <Route path="/dashboard/articles" element={<ProtectedRoute><DashboardArticles /></ProtectedRoute>} />
                <Route path="/dashboard/articles/new" element={<ProtectedRoute><ArticleNew /></ProtectedRoute>} />
                <Route path="/dashboard/articles/:id/edit" element={<ProtectedRoute><ArticleEdit /></ProtectedRoute>} />
                <Route path="/dashboard/categories" element={<ProtectedRoute><DashboardCategories /></ProtectedRoute>} />
                <Route path="/dashboard/media" element={<ProtectedRoute><DashboardMedia /></ProtectedRoute>} />
                <Route path="/dashboard/users" element={<ProtectedRoute requiredRole="admin"><DashboardUsers /></ProtectedRoute>} />
                <Route path="/dashboard/settings" element={<ProtectedRoute requiredRole="admin"><DashboardSettings /></ProtectedRoute>} />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </LocaleProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
