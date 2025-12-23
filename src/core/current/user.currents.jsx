import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../instance/axiosprivate.instance';
import { authRoutes } from '../../constants/routes.constans';
import useAuth from '../contexts/useAth.contexts';

const useCurrentUser = () => {
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const { auth, setAuth, clearAuth } = useAuth();

    // ✅ Only fetch if we have a token but no user data
    const shouldFetch = !!auth.accessToken && !auth.user;

    const fetchCurrentUser = async () => {
        try {
            const response = await axiosPrivate.get('/api/auth/verify-token');
            
            // ✅ Update auth context with fresh user data
            if (response.data.isAuthenticated) {
                setAuth(prev => ({
                    ...prev,
                    user: response.data.user,
                }));
            }
            
            return response.data;
        } catch (error) {
            console.error("Error fetching current user:", error);
            
            // ✅ Clear auth on 401
            if (error.response?.status === 401) {
                clearAuth();
                navigate(authRoutes.signIn);
            }
            
            throw error;
        }
    };

    const { data, isError, isLoading, refetch } = useQuery({
        queryKey: ['currentUser'],
        queryFn: fetchCurrentUser,
        enabled: shouldFetch, // ✅ Only fetch when needed
        staleTime: 5 * 60 * 1000,
        retry: 1, // ✅ Reduced retries
        refetchOnWindowFocus: false,
    });

    return {
        // ✅ Prioritize auth.user from context (immediate), fallback to API data
        currentUser: auth.user || data?.user,
        isAuthenticated: auth.accessToken && (auth.user || data?.isAuthenticated),
        isError,
        isLoading,
        refetch,
    };
};

export default useCurrentUser;