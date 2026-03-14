import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('admin_token'));
  const [user, setUser] = useState(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  // Helper to decode token safely
  const decodeToken = (t) => {
    if (!t) return null;
    try {
      const payload = JSON.parse(atob(t.split('.')[1]));
      return payload;
    } catch (e) {
      console.error('Token decode failed', e);
      return null;
    }
  };

  // Sync state on mount and token change
  useEffect(() => {
    if (token) {
      const payload = decodeToken(token);
      if (payload) {
        setUser(payload.sub);
        // FORCE Super Admin for Kaycris username specifically
        const isSuper = payload.sub === 'Kaycris' || payload.is_super_admin === true || payload.is_super_admin === 1;
        setIsSuperAdmin(isSuper);
        localStorage.setItem('is_super_admin', isSuper ? 'true' : 'false');
      } else {
        logout();
      }
    } else {
      setUser(null);
      setIsSuperAdmin(false);
    }
  }, [token]);

  const login = (newToken, isSuper) => {
    localStorage.setItem('admin_token', newToken);
    setToken(newToken);
    // State will be updated by useEffect
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('is_super_admin');
    setToken(null);
    setUser(null);
    setIsSuperAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ token, isLoggedIn: !!token, user, isSuperAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
