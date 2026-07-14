import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Layout } from './components/Layout';
import PageTransition from './components/PageTransition';

import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Account from './pages/Account';
import Contact from './pages/Contact';
import About from './pages/About';
import Formations from './pages/Formations';
import LegalMentions from './pages/LegalMentions';
import Privacy from './pages/Privacy';
import CGV from './pages/CGV';
import Services from './pages/Services';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Terms from './pages/Terms';

// Admin imports
import { AdminRoute } from './components/admin/AdminRoute';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboardHome } from './pages/admin/AdminDashboardHome';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminProductForm } from './pages/admin/AdminProductForm';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminMessages } from './pages/admin/AdminMessages';
import { AdminTrainings } from './pages/admin/AdminTrainings';
import { AdminUsers } from './pages/admin/AdminUsers';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Toaster position="top-center" />
        
        <Routes>
          {/* Routes avec Layout (header + footer) */}
          <Route path="/" element={<Layout><PageTransition><Home /></PageTransition></Layout>} />
          <Route path="/boutique" element={<Layout><PageTransition><Shop /></PageTransition></Layout>} />
          <Route path="/produit/:id" element={<Layout><PageTransition><ProductDetail /></PageTransition></Layout>} />
          <Route path="/panier" element={<Layout><PageTransition><Cart /></PageTransition></Layout>} />
          <Route path="/validation-commande" element={<Layout><PageTransition><Checkout /></PageTransition></Layout>} />
          <Route path="/mon-compte" element={<Layout><PageTransition><Account /></PageTransition></Layout>} />
          <Route path="/contact" element={<Layout><PageTransition><Contact /></PageTransition></Layout>} />
          <Route path="/a-propos" element={<Layout><PageTransition><About /></PageTransition></Layout>} />
          <Route path="/formations" element={<Layout><PageTransition><Formations /></PageTransition></Layout>} />
          <Route path="/mentions-legales" element={<Layout><PageTransition><LegalMentions /></PageTransition></Layout>} />
          <Route path="/confidentialite" element={<Layout><PageTransition><Privacy /></PageTransition></Layout>} />
          <Route path="/cgv" element={<Layout><PageTransition><CGV /></PageTransition></Layout>} />
          <Route path="/services" element={<Layout><PageTransition><Services /></PageTransition></Layout>} />
          <Route path="/conditions" element={<Layout><PageTransition><Terms /></PageTransition></Layout>} />

          {/* Routes sans Layout (header/footer) */}
          <Route path="/connexion" element={<PageTransition><Login /></PageTransition>} />
          <Route path="/inscription" element={<PageTransition><Register /></PageTransition>} />
          <Route path="/mot-passe-oublie" element={<PageTransition><ForgotPassword /></PageTransition>} />
          <Route path="/reset-password" element={<PageTransition><ResetPassword /></PageTransition>} />

          {/* Routes Admin */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboardHome />} />
            <Route path="produits" element={<AdminProducts />} />
            <Route path="produits/nouveau" element={<AdminProductForm />} />
            <Route path="produits/:id/modifier" element={<AdminProductForm />} />
            <Route path="commandes" element={<AdminOrders />} />
            <Route path="formations" element={<AdminTrainings />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="utilisateurs" element={<AdminUsers />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<Layout><PageTransition><NotFound /></PageTransition></Layout>} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}
