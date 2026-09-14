import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import CartDrawer from "./components/CartDrawer.jsx";
import Home from "./pages/Home.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import CartPage from "./pages/CartPage.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import "./styles/layout.css";

export default function App() {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <footer className="site-footer">
        <div className="container footer-inner">
          <span className="eyebrow">NOIR &amp; CO — EST. 2019</span>
          <span className="eyebrow">Cut for the everyday. Made to last.</span>
        </div>
      </footer>
    </>
  );
}
