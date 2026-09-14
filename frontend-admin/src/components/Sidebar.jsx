import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const links = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/products", label: "Products" },
  { to: "/orders", label: "Orders" },
  { to: "/sales", label: "Sales Reports" },
];

export default function Sidebar() {
  const { admin, logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        NOIR <span>&amp;</span> CO
        <span className="eyebrow" style={{ display: "block", marginTop: 4, opacity: 0.5 }}>
          Admin Console
        </span>
      </div>

      <nav className="sidebar-nav">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({ isActive }) => `sidebar-link ${isActive ? "sidebar-link-active" : ""}`}
          >
            {l.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-foot">
        <span className="eyebrow" style={{ color: "var(--bone)" }}>
          {admin?.name}
        </span>
        <button className="btn btn-outline btn-sm sidebar-logout" onClick={logout}>
          Log Out
        </button>
      </div>
    </aside>
  );
}
