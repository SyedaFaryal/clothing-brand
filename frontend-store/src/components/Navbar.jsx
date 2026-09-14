import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

export default function Navbar() {
  const { count, setIsOpen } = useCart();

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand-mark">
          NOIR <span>&amp;</span> CO
        </Link>

        <nav className="nav-links">
          <NavLink to="/" end className={({ isActive }) => `eyebrow ${isActive ? "nav-link-active" : ""}`}>
            Home
          </NavLink>
          <a href="/#shop" className="eyebrow">Shop</a>
          <NavLink to="/about" className={({ isActive }) => `eyebrow ${isActive ? "nav-link-active" : ""}`}>
            About
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => `eyebrow ${isActive ? "nav-link-active" : ""}`}>
            Contact
          </NavLink>
        </nav>

        <button
          className="cart-toggle"
          onClick={() => setIsOpen(true)}
          aria-label="Open cart"
        >
          <span className="eyebrow">Bag</span>
          <span className="cart-count">{count}</span>
        </button>
      </div>
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i}>
              FREE SHIPPING OVER $150 &nbsp;•&nbsp; NEW SEASON DROP &nbsp;•&nbsp;
              CUT FOR THE EVERYDAY &nbsp;•&nbsp;
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}
