import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import Product from "../pages/Products/Product";
import Cart from "../pages/Cart/Cart";
import Contact from "../pages/Contact/Contact";
import Payment from "../pages/Payment/Payment";
import OrderSuccess from "../pages/OrderSucces/OrderSucces";
import AdminLogin from "../pages/Admin/AdminLogin/AdminLogin";
import AdminDashboard from "../pages/Admin/AdminDashboard/AdminDashboard";
import Profil from "../pages/Profile/Profile";
import Navbar from "../components/Navbar/Navbar";
import About from "../components/About/About";
import QuickView from "../components/QuickView/QuickView";

const Rout = ({
  product,
  setProduct,
  detail,
  view,
  close,
  setClose,
  cart,
  setCart,
  addtocart,
}) => {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              detail={detail}
              view={view}
              close={close}
              setClose={setClose}
              addtocart={addtocart}
            />
          }
        />
        <Route
          path="/product"
          element={
            <Product
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
          }
        />
        <Route
          path="/quickview/:id"
          element={
            <QuickView
              addtocart={addtocart}
              cartCount={cart.length}
            />
          }
        />
        <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/payment" element={<Payment cart={cart} setCart={setCart} />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="/nav" element={<Navbar />} />
      </Routes>
    </>
  );
};

export default Rout;
