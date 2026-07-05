import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Layout } from './components/Layout';

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

// Admin imports
import { AdminRoute } from './components/admin/AdminRoute';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboardHome } from './pages/admin/AdminDashboardHome';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminMessages } from './pages/admin/AdminMessages';
import { AdminTrainings } from './pages/admin/AdminTrainings';
import { AdminUsers } from './pages/admin/AdminUsers';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Toaster position="top-center" />
        
        <Routes>
          {/* Routes avec Layout (header + footer) */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/boutique" element={<Layout><Shop /></Layout>} />
          <Route path="/produit/:id" element={<Layout><ProductDetail /></Layout>} />
          <Route path="/panier" element={<Layout><Cart /></Layout>} />
          <Route path="/validation-commande" element={<Layout><Checkout /></Layout>} />
          <Route path="/mon-compte" element={<Layout><Account /></Layout>} />
          <Route path="/contact" element={<Layout><Contact /></Layout>} />
          <Route path="/a-propos" element={<Layout><About /></Layout>} />
          <Route path="/formations" element={<Layout><Formations /></Layout>} />

          {/* Routes sans Layout (header/footer) */}
          <Route path="/connexion" element={<Login />} />
          <Route path="/inscription" element={<Register />} />

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
            <Route path="commandes" element={<AdminOrders />} />
            <Route path="formations" element={<AdminTrainings />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="utilisateurs" element={<AdminUsers />} />
          </Route>
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}
