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
 */
export const useAllBusinessesForMessages = (options = {}) => {
    const axiosPrivate = useAxiosPrivate();
    
    return useQuery({
        queryKey: ['businesses', 'for-messages'],
        queryFn: async () => {
            const { data } = await axiosPrivate.get('/api/admin/businesses?per_page=all');
            return data; // Contains: { success, data: [...businesses] }
        },
        staleTime: 2 * 60 * 1000, // 2 minutes
        gcTime: 5 * 60 * 1000,
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
            return data; // Contains: { success, data, statistics }
        },
        enabled: !!businessId && (options.enabled !== false),
        staleTime: 1 * 60 * 1000, // 1 minute
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
 */
export const useTotalUnreadMessageCount = (options = {}) => {
    const axiosPrivate = useAxiosPrivate();
    
    return useQuery({
        queryKey: ['messages', 'unread', 'total'],
        queryFn: async () => {
            const { data } = await axiosPrivate.get('/api/admin/messages/statistics');
            return data.data?.new_messages || 0;
        },
        staleTime: 30 * 1000,
        refetchInterval: 60 * 1000,
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

// ============================================
// MUTATION HOOKS
// ============================================

/**
 * Send message/inquiry (Public - no auth required)
 * Note: Field names match Laravel validation rules
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
        onMutate: async (messageId) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: ['messages'] });
            await queryClient.cancelQueries({ queryKey: ['message', messageId] });

            // Snapshot previous values
            const previousMessage = queryClient.getQueryData(['message', messageId]);

            // Optimistically update message
            queryClient.setQueryData(['message', messageId], (old) => {
                if (!old) return old;
                return { ...old, status: 'read', read_at: new Date().toISOString() };
            });

            return { previousMessage };
        },
        onError: (err, messageId, context) => {
            // Rollback on error
            if (context?.previousMessage) {
                queryClient.setQueryData(['message', messageId], context.previousMessage);
            }
        },
        onSuccess: () => {
            // Invalidate to ensure consistency
            queryClient.invalidateQueries({ queryKey: ['messages'] });
            queryClient.invalidateQueries({ queryKey: ['messages', 'statistics'] });
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
        onMutate: async (messageId) => {
            await queryClient.cancelQueries({ queryKey: ['messages'] });
            await queryClient.cancelQueries({ queryKey: ['message', messageId] });

            const previousMessage = queryClient.getQueryData(['message', messageId]);

            // Optimistically update message
            queryClient.setQueryData(['message', messageId], (old) => {
                if (!old) return old;
                return { ...old, status: 'replied', replied_at: new Date().toISOString() };
            });

            return { previousMessage };
        },
        onError: (err, messageId, context) => {
            if (context?.previousMessage) {
                queryClient.setQueryData(['message', messageId], context.previousMessage);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['messages'] });
            queryClient.invalidateQueries({ queryKey: ['messages', 'statistics'] });
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
        },
        ...options,
    });
};