import React, { useContext } from 'react';
import { useTheme } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

/**
 * Site header with theme toggle and authentication controls.
 * - Shows login/logout buttons based on auth state.
 * - Includes link to favorites page for logged-in users.
 */
const Header = () => {
  // Get theme and auth state from context
  const { darkMode, toggleTheme } = useTheme();
  const { user, logout } = useContext(AuthContext);

  return (
    <header className={`header ${!darkMode ? 'light-theme' : ''}`}>
      {/* Site title with home link */}
      <div>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h1>Where in the world?</h1>
        </Link>
      </div>
      {/* Right-aligned controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* Theme toggle button */} 
        <div onClick={toggleTheme} style={{ cursor: 'pointer' }}>
          {darkMode ? <i className="fas fa-sun"></i> : <i className="fas fa-moon"></i>}
        </div>
        {/* Auth controls - shows logout if authenticated, login if not */}
        {user ? (
          <button onClick={logout} className="btn">
            Logout
          </button>
        ) : (
          <Link to="/login" className="btn">
            Login
          </Link>
        )}
        {/* Favorites link (visible only when logged in) */}
        {user && (
          <Link to="/favorites" className="btn">
            <i className="fas fa-heart"></i>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;