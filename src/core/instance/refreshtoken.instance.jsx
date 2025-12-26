import { useCallback, useRef } from 'react';
import useAuth from '../contexts/useAth.contexts';
import { axiosPrivate } from './axios.instance';
import { fetchCsrfToken } from '../token/csrf.token';

const useRefreshToken = () => {
    const { setAuth } = useAuth();
    const refreshPromiseRef = useRef(null);

    const refresh = useCallback(async () => {
        // Return existing refresh promise if already in progress
        if (refreshPromiseRef.current) {
            return refreshPromiseRef.current;
        }

        // Create and store the refresh promise
        refreshPromiseRef.current = (async () => {
            try {
                // Get fresh CSRF token
                await fetchCsrfToken();
                const storedRefreshToken = localStorage.getItem('refresh_token'); // Persisted token
                if (!storedRefreshToken) {
                    throw new Error('No refresh token available');
                }
                // Call refresh endpoint
                const response = await axiosPrivate.post('/api/auth/refresh', {
                    refresh_token: storedRefreshToken, // Pass as body parameter
                });

                const newToken = response.data.token;
                const refreshToken = response.data.refresh_token;

                // Validate response
                if (!newToken) {
                    throw new Error('No access token received from server');
                }
                // Update auth state
                localStorage.setItem('refresh_token', refreshToken); // Save the new refresh token
                setAuth(prev => ({
                    ...prev,
                    role: response.data.role, // Update user roles
                    accessToken: newToken, // Update access token
                    refreshToken: refreshToken,
                    user: response.data.user, // Update user info
                }));
                return newToken; // Return the new access token

            } catch (error) {
                // Handle 401 - Refresh token expired
                if (error.response?.status === 401) {
                    setAuth(null);

                    if (typeof window !== 'undefined') {
                        window.location.href = '/login';
                    }
                    return null;
                }

                // Don't throw on network errors - just return null
                if (!error.response) {
                    console.warn('Network error during refresh - keeping current session');
                    return null;
                }

                return null;

            } finally {
                // Clear the refresh promise when done
                refreshPromiseRef.current = null;
            }
        })();

        return refreshPromiseRef.current;
    }, [setAuth]);

    return refresh;
};

export default useRefreshToken;