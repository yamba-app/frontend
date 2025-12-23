import PropTypes from 'prop-types';
import { createContext, useState, useEffect } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    // ✅ State only - no localStorage initialization
    const [auth, setAuth] = useState({});
    
    // ✅ Only store "persist" flag and refresh_token (needed for token refresh)
    const [persist, setPersist] = useState(
        JSON.parse(localStorage.getItem("persist")) || false
    );

    // ✅ Only sync refresh_token to localStorage (needed for auto-refresh)
    // Everything else stays in memory only
    useEffect(() => {
        if (persist && auth.refreshToken) {
            localStorage.setItem('refresh_token', auth.refreshToken);
        }
    }, [auth.refreshToken, persist]);

    // Helper to check if user is authenticated
    const isAuthenticated = () => {
        return !!(auth.accessToken && auth.user);
    };

    // Helper to clear auth (logout)
    const clearAuth = () => {
        setAuth({});
        localStorage.removeItem('persist');
    };

    return (
        <AuthContext.Provider 
            value={{ 
                auth, 
                setAuth, 
                persist, 
                setPersist,
                isAuthenticated: isAuthenticated(),
                clearAuth,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AuthContext;