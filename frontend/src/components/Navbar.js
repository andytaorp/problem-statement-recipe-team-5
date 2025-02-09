import { Link } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
import { useEffect } from 'react';

const Navbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();

  const handleClick = () => {
    logout();
  };

  useEffect(() => {
    // Any side effects when user logs out can be handled here
  }, [user]);

  return (
    <header className="navbar-header">
      <div className="container">
        <Link to="/">
          <h1>Recipe Management Web App</h1>
        </Link>
        <nav className="navbar-nav">
          {user ? (
            <div>
              <span>{user.email}</span>
              <button onClick={handleClick}>Log out</button>
              <Link to="/upload">Upload Image</Link>
            </div>
          ) : (
            <div>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;