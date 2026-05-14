// leiloai-frontend/src/components/Navbar.tsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          🏠 Leiloaí
        </Link>

        <div className="navbar-links">
          {isAuthenticated ? (
            <>
              <Link to="/auctions" className="nav-link">
                Leilões
              </Link>
              <Link to="/auctions/create" className="nav-link">
                Criar Leilão
              </Link>
              <div className="navbar-user">
                <span className="user-name">{user?.name}</span>
                <button onClick={handleLogout} className="btn btn-danger btn-sm">
                  Sair
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Entrar
              </Link>
              <Link to="/register" className="nav-link">
                Registrar
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}