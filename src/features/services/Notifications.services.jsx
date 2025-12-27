// src/hooks/useNotificationQueries.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosPrivate from '../../core/instance/axiosprivate.instance';

// ============================================
// QUERY HOOKS (For Regular Users)
// ============================================

/**
 * Fetch all notifications with pagination
 */
export const useNotifications = (filters = {}, options = {}) => {
    const axiosPrivate = useAxiosPrivate();
    
    return useQuery({
        queryKey: ['notifications', filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            Object.keys(filters).forEach(key => {
                if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
                    params.append(key, filters[key]);
                }
            });
            const { data } = await axiosPrivate.get(`/api/notifications?${params.toString()}`);
            return data.data;
        },
        staleTime: 1 * 60 * 1000, // 1 minute
        gcTime: 5 * 60 * 1000, // 5 minutes
        ...options,
    });
};

/**
 * Fetch unread notifications
 */
export const useUnreadNotifications = (options = {}) => {
    const axiosPrivate = useAxiosPrivate();
    
    return useQuery({
        queryKey: ['notifications', 'unread'],
        queryFn: async () => {
            const { data } = await axiosPrivate.get('/api/notifications/unread');
            return data.data;
        },
        staleTime: 30 * 1000, // 30 seconds
        gcTime: 2 * 60 * 1000, // 2 minutes
        refetchInterval: 60 * 1000, // Auto-refetch every 60 seconds
        ...options,
    });
};

/**
 * Get unread notification count
 */
export const useUnreadNotificationCount = (options = {}) => {
    const axiosPrivate = useAxiosPrivate();
    
    return useQuery({
        queryKey: ['notifications', 'unread', 'count'],
        queryFn: async () => {
            const { data } = await axiosPrivate.get('/api/notifications/unread');
            return data.count || 0;
        },
        staleTime: 30 * 1000, // 30 seconds
        gcTime: 2 * 60 * 1000,
        refetchInterval: 60 * 1000, // Auto-refetch every 60 seconds
        ...options,
    });
};

/**
 * Fetch single notification by ID
 */
export const useNotification = (notificationId, options = {}) => {
    const axiosPrivate = useAxiosPrivate();
    
    return useQuery({
        queryKey: ['notification', notificationId],
        queryFn: async () => {
            const { data } = await axiosPrivate.get(`/api/notifications/${notificationId}`);
            return data.data;
        },
        enabled: !!notificationId && (options.enabled !== false),
        staleTime: 5 * 60 * 1000,
        ...options,
    });
};

// ============================================
// ADMIN QUERY HOOKS
// ============================================

/**
 * Get notification statistics (Admin ONLY)
 */
export const useNotificationStatistics = (options = {}) => {
    const axiosPrivate = useAxiosPrivate();
    
    return useQuery({
        queryKey: ['notifications', 'statistics'],
        queryFn: async () => {
            // FIXED: Added /admin/ prefix
            const { data } = await axiosPrivate.get('/api/admin/notifications/statistics');
            return data.data;
        },
        staleTime: 2 * 60 * 1000,
        ...options,
    });
};

/**
 * Admin: Get all notifications
 */
export const useAdminNotifications = (filters = {}, options = {}) => {
    const axiosPrivate = useAxiosPrivate();
    
    return useQuery({
        queryKey: ['adminNotifications', filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            Object.keys(filters).forEach(key => {
                if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
                    params.append(key, filters[key]);
                }
            });
            const { data } = await axiosPrivate.get(`/api/admin/notifications/all?${params.toString()}`);
            return data.data;
        },
        staleTime: 1 * 60 * 1000,
        ...options,
    });
};

// ============================================
// MUTATION HOOKS
// ============================================

/**
 * Mark notification as read
 */
export const useMarkNotificationAsRead = (options = {}) => {
    const axiosPrivate = useAxiosPrivate();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (notificationId) => {
            const { data } = await axiosPrivate.patch(`/api/notifications/${notificationId}/read`);
            return data;
        },
        onMutate: async (notificationId) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: ['notifications'] });
            await queryClient.cancelQueries({ queryKey: ['notification', notificationId] });

            // Snapshot previous values
            const previousNotifications = queryClient.getQueryData(['notifications']);
            const previousUnread = queryClient.getQueryData(['notifications', 'unread']);
            const previousCount = queryClient.getQueryData(['notifications', 'unread', 'count']);

            // Optimistically update notification
            queryClient.setQueryData(['notification', notificationId], (old) => {
                if (!old) return old;
                return { ...old, read: true, read_at: new Date().toISOString() };
            });

            // Optimistically update unread list
            queryClient.setQueryData(['notifications', 'unread'], (old) => {
                if (!old) return old;
                return old.filter(n => n.id !== notificationId);
            });

            // Optimistically update count
            queryClient.setQueryData(['notifications', 'unread', 'count'], (old) => {
                return Math.max(0, (old || 0) - 1);
            });

            return { previousNotifications, previousUnread, previousCount };
        },
        onError: (err, notificationId, context) => {
            // Rollback on error
            if (context?.previousNotifications) {
                queryClient.setQueryData(['notifications'], context.previousNotifications);
            }
            if (context?.previousUnread) {
                queryClient.setQueryData(['notifications', 'unread'], context.previousUnread);
            }
            if (context?.previousCount !== undefined) {
                queryClient.setQueryData(['notifications', 'unread', 'count'], context.previousCount);
            }
        },
        onSuccess: () => {
            // Invalidate to ensure consistency
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            queryClient.invalidateQueries({ queryKey: ['adminNotifications'] });
        },
        ...options,
    });
};

/**
 * Mark all notifications as read
 */
export const useMarkAllNotificationsAsRead = (options = {}) => {
    const axiosPrivate = useAxiosPrivate();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const { data } = await axiosPrivate.post('/api/notifications/mark-all-read');
            return data;
        },
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ['notifications'] });

            const previousData = {
                notifications: queryClient.getQueryData(['notifications']),
                unread: queryClient.getQueryData(['notifications', 'unread']),
                count: queryClient.getQueryData(['notifications', 'unread', 'count']),
            };

            // Optimistically clear unread
            queryClient.setQueryData(['notifications', 'unread'], []);
            queryClient.setQueryData(['notifications', 'unread', 'count'], 0);

            return { previousData };
        },
        onError: (err, variables, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(['notifications'], context.previousData.notifications);
                queryClient.setQueryData(['notifications', 'unread'], context.previousData.unread);
                queryClient.setQueryData(['notifications', 'unread', 'count'], context.previousData.count);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            queryClient.invalidateQueries({ queryKey: ['adminNotifications'] });
        },
        ...options,
    });
};

/**
 * Delete notification
 */
export const useDeleteNotification = (options = {}) => {
    const axiosPrivate = useAxiosPrivate();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (notificationId) => {
            const { data } = await axiosPrivate.delete(`/api/notifications/${notificationId}`);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            queryClient.invalidateQueries({ queryKey: ['adminNotifications'] });
        },
        ...options,
    });
};

/**
 * Clear all notifications
 */
export const useClearAllNotifications = (options = {}) => {
    const axiosPrivate = useAxiosPrivate();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const { data } = await axiosPrivate.delete('/api/notifications');
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            queryClient.invalidateQueries({ queryKey: ['adminNotifications'] });
        },
        ...options,
    });
};