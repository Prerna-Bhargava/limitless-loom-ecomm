import { useState, useContext, createContext, useEffect } from "react";

const CartContext = createContext();
const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    let existingCartItem = localStorage.getItem("wishlist");
    if (existingCartItem) setWishlist(JSON.parse(existingCartItem));
  }, []);

  return (
    <CartContext.Provider value={[wishlist, setWishlist]}>
      {children}
    </CartContext.Provider>
  );
};

const useWishlist = () => useContext(CartContext);

export { useWishlist, WishlistProvider };
