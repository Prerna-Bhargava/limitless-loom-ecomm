import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { HashRouter as Router, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Auth/Login";
import Contact from "./pages/contact/Contact";
import Register from "./pages/Auth/Register";
import ForgetPassword from "./pages/Auth/ForgetPassword";
import ProductCategory from "./pages/products/ProductCategory";
import ProductById from "./pages/products/ProductById";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import CreateCategory from "./pages/Admin/CreateCategory";
import CreateProduct from "./pages/Admin/CreateProduct";
import AllOrders from "./pages/Admin/AllOrders";
import AllProducts from "./pages/Admin/AllProducts";
import { useAuth } from "./context/auth";
import Checkout from "./pages/checkout/Checkout";
import Myorders from "./pages/orders/Myorders";
import NotFound from "./pages/notfound/NotFound";
import SearchProducts from "./components/search/SearchProducts";


function App() {
  const [auth, setAuth] = useAuth();


  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/checkout" element={<Checkout />} />

          {/* Conditionally render admin routes only if user is admin */}
          {auth.user && auth.user.admin === 1 ? (
            <>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/create-category" element={<CreateCategory />} />
              <Route path="/admin/create-product" element={<CreateProduct />} />
              <Route path="/admin/products" element={<AllProducts />} />
              <Route path="/admin/orders" element={<AllOrders />} />
            </>
          ) : (
            <>
            </>
          )}

          <Route path="/myOrders" element={<Myorders />} />

          <Route path="*" element={<NotFound />} />



          <Route path="/product/search" element={<SearchProducts />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgetPassword" element={<ForgetPassword />} />
          <Route path="/product/category/:category" element={<ProductCategory />} />
          <Route path="/product/single/:id" element={<ProductById />} />

        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
