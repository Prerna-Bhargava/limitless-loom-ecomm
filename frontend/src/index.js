import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { CartProvider } from "./context/cart";
import { AuthProvider } from "./context/auth";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'react-hot-toast';
import { WishlistProvider } from './context/wishlist';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId="156392476042-jr8mel5pqjjiuuvbj3f7l8jl2ugb5bij.apps.googleusercontent.com">
  <AuthProvider>
    <CartProvider>
    <WishlistProvider>

      <Toaster/>
      <App />
    </WishlistProvider>
    </CartProvider>
   </AuthProvider>
   </GoogleOAuthProvider>
);

reportWebVitals();
