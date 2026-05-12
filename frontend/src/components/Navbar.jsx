import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/Useauth";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setOpen(false);
  };

  const isActive = (path) => location.pathname === path ? "active" : "";

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo" onClick={() => setOpen(false)}>
          🛒 MiniMarket
        </Link>

        {/* Burger mobile */}
        <button className="burger" onClick={() => setOpen(!open)} aria-label="Menu">
          <span /><span /><span />
        </button>

        <ul className={`navbar-links ${open ? "open" : ""}`}>
          <li><Link to="/"       className={isActive("/")}       onClick={() => setOpen(false)}>Accueil</Link></li>
          <li><Link to="/shop"   className={isActive("/shop")}   onClick={() => setOpen(false)}>Boutique</Link></li>
          <li><Link to="/blog"   className={isActive("/blog")}   onClick={() => setOpen(false)}>Blog</Link></li>
          <li><Link to="/contact" className={isActive("/contact")} onClick={() => setOpen(false)}>Contact</Link></li>

          {isAdmin && (
            <>
              <li><Link to="/admin/products" className={`admin-link ${isActive("/admin/products")}`} onClick={() => setOpen(false)}>Produits</Link></li>
              <li><Link to="/admin/blog"     className={`admin-link ${isActive("/admin/blog")}`}     onClick={() => setOpen(false)}>Blog admin</Link></li>
            </>
          )}

          {user ? (
            <li className="navbar-user">
              <span className="user-name">👤 {user.name}</span>
              <button className="btn-logout" onClick={handleLogout}>Déconnexion</button>
            </li>
          ) : (
            <>
              <li><Link to="/login"    className="nav-btn"          onClick={() => setOpen(false)}>Connexion</Link></li>
              <li><Link to="/register" className="nav-btn primary"  onClick={() => setOpen(false)}>Inscription</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;