import { NavLink } from "react-router-dom";

const tabs = [
  { to: "/login", label: "Login" },
  { to: "/signup", label: "Sign Up" },
  { to: "/forgot-password", label: "Forgot Password" },
];

export default function AuthTabs() {
  return (
    <div className="auth-tabs">
      {tabs.map((t) => (
        <NavLink
          key={t.to}
          to={t.to}
          className={({ isActive }) => `auth-tab ${isActive ? "auth-tab-active" : ""}`}
        >
          {t.label}
        </NavLink>
      ))}
    </div>
  );
}