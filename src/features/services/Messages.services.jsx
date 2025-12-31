// src/features/services/Messages.services.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosPrivate from '../../core/instance/axiosprivate.instance';
import { fetchCsrfToken } from '../../core/token/csrf.token';

// ============================================
// QUERY HOOKS
// ============================================

/**
 * Fetch all businesses for message management dropdown
 * Returns businesses with unread message counts
 * NEW: Uses dedicated optimized endpoint
 */
export const useAllBusinessesForMessages = (options = {}) => {
    const axiosPrivate = useAxiosPrivate();
    
    return useQuery({
        queryKey: ['businesses', 'for-messages'],
        queryFn: async () => {
            // Use the NEW optimized endpoint
            const { data } = await axiosPrivate.get('/api/admin/businesses/for-messages');
            return data; // Contains: { success, data: [...businesses with unread_messages_count] }
        },
        staleTime: 30 * 1000, // 30 seconds - refresh more often for real-time feel
        gcTime: 2 * 60 * 1000, // 2 minutes
        refetchInterval: 60 * 1000, // Auto-refetch every 60 seconds
        ...options,
    });
};

/**
 * Fetch messages for a specific business (Admin/Owner)
 */
export const useBusinessMessages = (businessId, filters = {}, options = {}) => {
    const axiosPrivate = useAxiosPrivate();
    
    return useQuery({
        queryKey: ['messages', 'business', businessId, filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            Object.keys(filters).forEach(key => {
                if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
                    params.append(key, filters[key]);
                }
            });
            const { data } = await axiosPrivate.get(
                `/api/admin/businesses/${businessId}/messages?${params.toString()}`
            );
            return data; // Contains: { success, data, statistics, pagination }
        },
        enabled: !!businessId && (options.enabled !== false),
        staleTime: 30 * 1000, // 30 seconds
        gcTime: 5 * 60 * 1000,
        ...options,
    });
};

/**
 * Get new/unread messages count for a business
 */
export const useBusinessNewMessageCount = (businessId, options = {}) => {
    const axiosPrivate = useAxiosPrivate();
    
    return useQuery({
        queryKey: ['messages', 'business', businessId, 'new', 'count'],
        queryFn: async () => {
            const { data } = await axiosPrivate.get(
                `/api/admin/businesses/${businessId}/messages?status=new`
            );
            return data.statistics?.new || 0;
        },
        enabled: !!businessId && (options.enabled !== false),
        staleTime: 30 * 1000, // 30 seconds
        refetchInterval: 60 * 1000, // Auto-refetch every 60 seconds
        ...options,
    });
};

/**
 * Get total unread messages across all businesses (Admin)
 * This sums up all unread messages from all businesses
 */
export const useTotalUnreadMessageCount = (options = {}) => {
    const axiosPrivate = useAxiosPrivate();
    
    return useQuery({
        queryKey: ['messages', 'unread', 'total'],
        queryFn: async () => {
            try {
                // Get statistics which includes new_messages count
                const { data } = await axiosPrivate.get('/api/admin/messages/statistics');
                console.log('Message statistics response:', data);
                return data.data?.new_messages || 0;
            } catch (error) {
                console.error('Failed to fetch message count:', error);
                return 0;
            }
        },
        staleTime: 30 * 1000, // 30 seconds
        refetchInterval: 60 * 1000, // Auto-refresh every 60 seconds
        retry: 2, // Retry failed requests
        ...options,
    });
};

/**
 * Fetch single message by ID
 */
export const useMessage = (messageId, options = {}) => {
    const axiosPrivate = useAxiosPrivate();
    
    return useQuery({
        queryKey: ['message', messageId],
        queryFn: async () => {
            const { data } = await axiosPrivate.get(`/api/admin/messages/${messageId}`);
            return data.data;
        },
        enabled: !!messageId && (options.enabled !== false),
        staleTime: 5 * 60 * 1000,
        ...options,
    });
};

/**
 * Get message statistics (Admin)
 */
export const useMessageStatistics = (options = {}) => {
    const axiosPrivate = useAxiosPrivate();
    
    return useQuery({
        queryKey: ['messages', 'statistics'],
        queryFn: async () => {
            const { data } = await axiosPrivate.get('/api/admin/messages/statistics');
            return data.data;
        },
        staleTime: 2 * 60 * 1000,
        ...options,
    });
};

/**
 * Get all messages across all businesses (Admin)
 */
export const useAllMessages = (filters = {}, options = {}) => {
    const axiosPrivate = useAxiosPrivate();
    
    return useQuery({
        queryKey: ['messages', 'all', filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            Object.keys(filters).forEach(key => {
                if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
                    params.append(key, filters[key]);
                }
            });
            const { data } = await axiosPrivate.get(`/api/admin/messages?${params.toString()}`);
            return data; // Contains: { success, data, pagination }
        },
        staleTime: 1 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        ...options,
    });
};

// ============================================
// MUTATION HOOKS
// ============================================

/**
 * Send message/inquiry (Public - no auth required)
 */
export const useSendMessage = (options = {}) => {
    const axiosPrivate = useAxiosPrivate();

    return useMutation({
        mutationFn: async (messageData) => {
            await fetchCsrfToken();
            const { data } = await axiosPrivate.post('/api/messages', messageData);
            return data;
        },
        ...options,
    });
};

/**
 * Forward message to business owner (Admin only)
 */
export const useForwardMessageToOwner = (options = {}) => {
    const axiosPrivate = useAxiosPrivate();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (messageId) => {
            const { data } = await axiosPrivate.post(`/api/admin/messages/${messageId}/forward`);
            return data;
        },
        onSuccess: (data, messageId) => {
            // Invalidate queries to refresh data
            queryClient.invalidateQueries({ queryKey: ['messages'] });
            queryClient.invalidateQueries({ queryKey: ['message', messageId] });
            queryClient.invalidateQueries({ queryKey: ['messages', 'statistics'] });
            queryClient.invalidateQueries({ queryKey: ['businesses', 'for-messages'] }); // Refresh business list
        },
        ...options,
    });
};

/**
 * Mark message as read
 */
export const useMarkMessageAsRead = (options = {}) => {
    const axiosPrivate = useAxiosPrivate();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (messageId) => {
            const { data } = await axiosPrivate.patch(`/api/admin/messages/${messageId}/read`);
            return data;
        },
        onSuccess: () => {
            // Invalidate to ensure consistency
            queryClient.invalidateQueries({ queryKey: ['messages'] });
            queryClient.invalidateQueries({ queryKey: ['messages', 'statistics'] });
            queryClient.invalidateQueries({ queryKey: ['businesses', 'for-messages'] }); // Refresh counts
        },
        ...options,
    });
};

/**
 * Mark message as replied
 */
export const useMarkMessageAsReplied = (options = {}) => {
    const axiosPrivate = useAxiosPrivate();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (messageId) => {
            const { data } = await axiosPrivate.patch(`/api/admin/messages/${messageId}/replied`);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['messages'] });
            queryClient.invalidateQueries({ queryKey: ['messages', 'statistics'] });
            queryClient.invalidateQueries({ queryKey: ['businesses', 'for-messages'] }); // Refresh counts
        },
        ...options,
    });
};

/**
 * Delete message
 */
export const useDeleteMessage = (options = {}) => {
    const axiosPrivate = useAxiosPrivate();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (messageId) => {
            const { data } = await axiosPrivate.delete(`/api/admin/messages/${messageId}`);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['messages'] });
            queryClient.invalidateQueries({ queryKey: ['messages', 'statistics'] });
            queryClient.invalidateQueries({ queryKey: ['businesses', 'for-messages'] }); // Refresh counts
        },
        ...options,
    });
};