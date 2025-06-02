import React, { useState } from "react";
import Nav from "./components/Navbar/Navbar";
import Rout from "./router/Router";
import Footer from "./components/Footer/Footer";
import HomeProducts from "./components/HomeProduct/HomeProducts";
import { useLocation } from "react-router-dom";
import Notification from "./utils/Notification/Notification";
import { useNotification } from "./hook/useNotification";

const App = () => {
  // add to cart
  const [cart, setCart] = useState([]);
  //product Detail
  const [close, setClose] = useState(false);
  const [detail, setDetail] = useState([]);
  //filter product
  const [product, setProduct] = useState(HomeProducts);
  const { notifications, showNotification, removeNotification } =
    useNotification();

  const searchbtn = (product) => {
    const change = HomeProducts.filter((x) => {
      return x.Cat === product;
    });
    setProduct(change);
  };

  //product detail
  const view = (product) => {
    setDetail([{ ...product }]);
    setClose(true);
  };

  // add to cart
  const addtocart = (product) => {
    const exsit = cart.find((x) => {
      return x.id === product.id;
    });
    if (exsit) {
      showNotification(
        "warning",
        "Produk ini sudah ada di keranjang! ⚠️",
        3000
      );
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
      showNotification(
        "success",
        "Produk berhasil ditambahkan ke keranjang! 🛒",
        3000
      );
    }
  };

  const location = useLocation();
  
  // Updated logic to hide navbar and footer on both admin and profile pages
  const hideNavFooter = location.pathname.startsWith("/admin") || 
                        location.pathname.startsWith("/profile") ||
                        location.pathname.startsWith("/cart") ||
                        location.pathname.startsWith("/payment") ||
                        location.pathname.startsWith("/order-success") ||
                        location.pathname === "/profil";

  return (
    <>
      {/* Render notifications */}
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          type={notification.type}
          message={notification.message}
          isVisible={notification.isVisible}
          onClose={() => removeNotification(notification.id)}
          duration={notification.duration}
        />
      ))}

      {!hideNavFooter && <Nav searchbtn={searchbtn} />}
      <Rout
        product={product}
        setProduct={setProduct}
        detail={detail}
        view={view}
        close={close}
        setClose={setClose}
        cart={cart}
        setCart={setCart}
        addtocart={addtocart}
      />
      {!hideNavFooter && <Footer />}
    </>
  );
};

export default App;