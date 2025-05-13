import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProgramsPage from './pages/ProgramsPage';
import SchedulePage from './pages/SchedulePage';
import InstructorsPage from './pages/InstructorsPage';
import ShopPage from './pages/ShopPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import SaleSuccessPage from './pages/SaleSuccessPage';
import SaleErrorPage from './pages/SaleErrorPage';
import DashboardPage from './pages/admin/DashboardPage';
import ProductsPage from './pages/admin/ProductsPage';
import EditProductPage from './pages/admin/EditProductPage';
import NewProductPage from './pages/admin/NewProductPage';
import SettingsPage from './pages/admin/SettingsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import HeroConfigPage from './pages/admin/HeroConfigPage';
import ScheduleConfigPage from './pages/admin/ScheduleConfigPage';
import MediaManagementPage from './pages/admin/MediaManagementPage';
import WhyChooseConfigPage from './pages/admin/WhyChooseConfigPage';
import LocationConfigPage from './pages/admin/LocationConfigPage';
import FeaturedProgramsPage from './pages/admin/FeaturedProgramsPage';
import HomeConfigPage from './pages/admin/HomeConfigPage';
import MethodologyConfigPage from './pages/admin/MethodologyConfigPage';
import FeaturedProductsConfigPage from './pages/admin/FeaturedProductsConfigPage';
import CTAConfigPage from './pages/admin/CTAConfigPage';
import ProtectedRoute from './components/ProtectedRoute';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import ChatWidget from './components/ChatWidget';
import PageTransition from './components/PageTransition';
import AdminProgramsPage from './pages/admin/ProgramsPage';
import NewProgramPage from './pages/admin/NewProgramPage';
import EditProgramPage from './pages/admin/EditProgramPage';
import UpdateDatabasePage from './pages/admin/UpdateDatabasePage';
import ProgramDetailPage from './pages/ProgramDetailPage';
import HomePreviewPage from './pages/preview/HomePreviewPage';
import ShopProductsPage from './pages/shop/ProductsPage';
import CreateAdminPage from './pages/CreateAdminPage';
import SubscriptionPage from './pages/SubscriptionPage';
import SubscriptionSuccessPage from './pages/SubscriptionSuccessPage';
import { GlobalSettingsProvider } from './contexts/GlobalSettingsContext';
import GlobalStylesApplier from './components/GlobalStylesApplier';

function App() {
  return (
    <HelmetProvider>
      <GlobalSettingsProvider>
        <AuthProvider>
          <CartProvider>
            <Router>
              <GlobalStylesApplier />
              <Routes>
                {/* Public Routes with Layout */}
                <Route path="/" element={<Layout><PageTransition><HomePage /></PageTransition></Layout>} />
                <Route path="/about" element={<Layout><PageTransition><AboutPage /></PageTransition></Layout>} />
                <Route path="/programs" element={<Layout><PageTransition><ProgramsPage /></PageTransition></Layout>} />
                <Route path="/programs/:slug" element={<Layout><PageTransition><ProgramDetailPage /></PageTransition></Layout>} />
                <Route path="/schedule" element={<Layout><PageTransition><SchedulePage /></PageTransition></Layout>} />
                <Route path="/instructors" element={<Layout><PageTransition><InstructorsPage /></PageTransition></Layout>} />
                
                {/* Shop Routes */}
                <Route path="/shop" element={<Layout><PageTransition><ShopPage /></PageTransition></Layout>} />
                <Route path="/shop/products" element={<Layout><PageTransition><ShopProductsPage /></PageTransition></Layout>} />
                <Route path="/shop/collections/:collectionHandle" element={<Layout><PageTransition><ShopProductsPage /></PageTransition></Layout>} />
                <Route path="/shop/products/:handle" element={<Layout><PageTransition><ProductPage /></PageTransition></Layout>} />
                
                <Route path="/cart" element={<Layout><PageTransition><CartPage /></PageTransition></Layout>} />
                <Route path="/contact" element={<Layout><PageTransition><ContactPage /></PageTransition></Layout>} />
                <Route path="/login" element={<Layout><PageTransition><LoginPage /></PageTransition></Layout>} />
                <Route path="/register" element={<Layout><PageTransition><RegisterPage /></PageTransition></Layout>} />
                <Route path="/reset-password" element={<Layout><PageTransition><ResetPasswordPage /></PageTransition></Layout>} />
                <Route path="/sale/success" element={<Layout><PageTransition><SaleSuccessPage /></PageTransition></Layout>} />
                <Route path="/sale/error" element={<Layout><PageTransition><SaleErrorPage /></PageTransition></Layout>} />
                
                {/* Subscription Routes */}
                <Route path="/subscription" element={<Layout><PageTransition><SubscriptionPage /></PageTransition></Layout>} />
                <Route path="/subscription/success" element={<Layout><PageTransition><SubscriptionSuccessPage /></PageTransition></Layout>} />
                
                {/* Protected User Routes */}
                <Route 
                  path="/profile" 
                  element={
                    <Layout>
                      <PageTransition>
                        <ProtectedRoute>
                          <ProfilePage />
                        </ProtectedRoute>
                      </PageTransition>
                    </Layout>
                  } 
                />
                
                {/* Admin Routes */}
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute adminOnly>
                      <DashboardPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/dashboard" 
                  element={
                    <ProtectedRoute adminOnly>
                      <DashboardPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/products" 
                  element={
                    <ProtectedRoute adminOnly>
                      <ProductsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/products/new" 
                  element={
                    <ProtectedRoute adminOnly>
                      <NewProductPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/products/edit/:id" 
                  element={
                    <ProtectedRoute adminOnly>
                      <EditProductPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/settings" 
                  element={
                    <ProtectedRoute adminOnly>
                      <SettingsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/users" 
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminUsersPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/hero-config" 
                  element={
                    <ProtectedRoute adminOnly>
                      <HeroConfigPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/schedule-config" 
                  element={
                    <ProtectedRoute adminOnly>
                      <ScheduleConfigPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/media-management" 
                  element={
                    <ProtectedRoute adminOnly>
                      <MediaManagementPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/why-choose" 
                  element={
                    <ProtectedRoute adminOnly>
                      <WhyChooseConfigPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/location-config" 
                  element={
                    <ProtectedRoute adminOnly>
                      <LocationConfigPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/featured-programs" 
                  element={
                    <ProtectedRoute adminOnly>
                      <FeaturedProgramsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/home-config" 
                  element={
                    <ProtectedRoute adminOnly>
                      <HomeConfigPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/methodology-config" 
                  element={
                    <ProtectedRoute adminOnly>
                      <MethodologyConfigPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/featured-products-config" 
                  element={
                    <ProtectedRoute adminOnly>
                      <FeaturedProductsConfigPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/cta-config" 
                  element={
                    <ProtectedRoute adminOnly>
                      <CTAConfigPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/programs" 
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminProgramsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/programs/new" 
                  element={
                    <ProtectedRoute adminOnly>
                      <NewProgramPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/programs/edit/:id" 
                  element={
                    <ProtectedRoute adminOnly>
                      <EditProgramPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/update-database" 
                  element={
                    <ProtectedRoute adminOnly>
                      <UpdateDatabasePage />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/create-admin" element={<Layout><PageTransition><CreateAdminPage /></PageTransition></Layout>} />
                <Route path="/preview/home" element={<HomePreviewPage />} />
              </Routes>
              <ChatWidget />
            </Router>
          </CartProvider>
        </AuthProvider>
      </GlobalSettingsProvider>
    </HelmetProvider>
  );
}

export default App;