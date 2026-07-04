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
import Formations from './pages/Formations';
import About from './pages/About';
import Trainings from './pages/Trainings';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Toaster position="top-center" />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/boutique" element={<Shop />} />
            <Route path="/produit/:id" element={<ProductDetail />} />
            <Route path="/panier" element={<Cart />} />
            <Route path="/validation-commande" element={<Checkout />} />
            <Route path="/connexion" element={<Login />} />
            <Route path="/inscription" element={<Register />} />
            <Route path="/mon-compte" element={<Account />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/formations" element={<Formations />} />
            <Route path="/a-propos" element={<About />} />
            <Route path="/formations" element={<Trainings />} />
          </Routes>
        </Layout>
      </CartProvider>
    </AuthProvider>
  );
}
