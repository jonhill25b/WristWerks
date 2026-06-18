import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.js";
import { ThemeProvider } from "./context/ThemeContext.js";
import Layout from "./components/Layout.js";
import Home from "./pages/Home.js";
import Shop from "./pages/Shop.js";
import ProductDetail from "./pages/ProductDetail.js";
import CustomBuilder from "./pages/CustomBuilder.js";
import Cart from "./pages/Cart.js";
import Checkout from "./pages/Checkout.js";
import Orders from "./pages/Orders.js";
import OrderDetail from "./pages/OrderDetail.js";
import Login from "./pages/Login.js";
import Register from "./pages/Register.js";
import Contact from "./pages/Contact.js";
import AdminDashboard from "./pages/admin/Dashboard.js";
import AdminProducts from "./pages/admin/Products.js";
import AdminOrders from "./pages/admin/Orders.js";
import AdminUsers from "./pages/admin/Users.js";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/:id" element={<ProductDetail />} />
            <Route path="/custom" element={<CustomBuilder />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/users" element={<AdminUsers />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </ThemeProvider>
  );
}
