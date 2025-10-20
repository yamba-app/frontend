// src/hooks/useBusinessQueries.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosPrivate from '../../core/instance/axiosprivate.instance';
import { fetchCsrfToken } from '../../core/token/csrf.token';

// ============================================
// QUERY HOOKS
// ============================================

/**
 * Fetch single business by ID (Admin)
 */
export const useAdminBusiness = (businessId, options = {}) => {
    const axiosPrivate = useAxiosPrivate();
    
    return useQuery({
        queryKey: ['adminBusiness', businessId],
        queryFn: async () => {
            const { data } = await axiosPrivate.get(`api/admin/businesses/${businessId}`);
            return data.data;
        },
        enabled: !!businessId && (options.enabled !== false),
        retry: 1,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
        ...options,
    });
};

/**
 * Fetch single business by slug (Public)
 */
export const useBusinessBySlug = (slug, options = {}) => {
    const axiosPrivate = useAxiosPrivate();
    
    return useQuery({
        queryKey: ['business', 'slug', slug],
        queryFn: async () => {
            const { data } = await axiosPrivate.get(`api/busines/slug/${slug}`);
            return data.data;
        },
        enabled: !!slug && (options.enabled !== false),
        retry: 1,
        staleTime: 5 * 60 * 1000,
        ...options,
    });
};

/**
 * Fetch all businesses (Public)
 */
export const useBusinesses = (filters = {}, options = {}) => {
    const axiosPrivate = useAxiosPrivate();
    
    return useQuery({
        queryKey: ['businesses', filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            Object.keys(filters).forEach(key => {
                if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
                    params.append(key, filters[key]);
                }
            });
            const { data } = await axiosPrivate.get(`api/busines/businesses?${params.toString()}`);
            return data.data;
        },
        staleTime: 2 * 60 * 1000, // 2 minutes
        ...options,
    });
};

/**
 * Get categories
 */
export const useCategories = (options = {}) => {
    const axiosPrivate = useAxiosPrivate();
    
    return useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const { data } = await axiosPrivate.get('api/busines/categories');
            return data.data;
        },
        staleTime: 30 * 60 * 1000, // 30 minutes
        gcTime: 60 * 60 * 1000, // 1 hour
        ...options,
    });
};

/**
 * Get locations
 */
export const useLocations = (options = {}) => {
    const axiosPrivate = useAxiosPrivate();
    
    return useQuery({
        queryKey: ['locations'],
        queryFn: async () => {
            const { data } = await axiosPrivate.get('api/busines/locations');
            return data.data;
        },
        staleTime: 30 * 60 * 1000, // 30 minutes
        gcTime: 60 * 60 * 1000, // 1 hour
        ...options,
    });
};

// ============================================
// MUTATION HOOKS
// ============================================

/**
 * Update business mutation with optimistic updates
 */
export const useUpdateBusiness = (businessId, options = {}) => {
    const axiosPrivate = useAxiosPrivate();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (formData) => {
            await fetchCsrfToken();
            const { data } = await axiosPrivate.post(
                `api/admin/businesses/${businessId}`,
                formData,
                { 
                    headers: { 'Content-Type': 'multipart/form-data' },
                    timeout: 60000, // 60 second timeout for large uploads
                }
            );
            return data;
        },
        // Optimistic update
        onMutate: async () => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: ['adminBusiness', businessId] });

            // Snapshot previous value
            const previousBusiness = queryClient.getQueryData(['adminBusiness', businessId]);

            // Optimistically update (optional - depends on your UX preference)
            // queryClient.setQueryData(['adminBusiness', businessId], (old) => ({
            //     ...old,
            //     ...extractFormDataPreview(newData)
            // }));

            return { previousBusiness };
        },
        onError: (err, newData, context) => {
            // Rollback on error
            if (context?.previousBusiness) {
                queryClient.setQueryData(
                    ['adminBusiness', businessId],
                    context.previousBusiness
                );
            }
        },
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['adminBusiness', businessId] });
            queryClient.invalidateQueries({ queryKey: ['adminBusinesses'] });
            queryClient.invalidateQueries({ queryKey: ['businesses'] });
            queryClient.invalidateQueries({ queryKey: ['businessStatistics'] });
        },
        ...options,
    });
};

/**
 * Create business mutation
 */
export const useCreateBusiness = (options = {}) => {
    const axiosPrivate = useAxiosPrivate();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (formData) => {
            await fetchCsrfToken();
            const { data } = await axiosPrivate.post(
                'api/busines/submit',
                formData,
                { 
                    headers: { 'Content-Type': 'multipart/form-data' },
                    timeout: 60000,
                }
            );
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['businesses'] });
            queryClient.invalidateQueries({ queryKey: ['adminBusinesses'] });
            queryClient.invalidateQueries({ queryKey: ['pendingBusinesses'] });
        },
        ...options,
    });
};

/**
 * Delete photo mutation with optimistic update
 */
export const useDeletePhoto = (businessId, options = {}) => {
    const axiosPrivate = useAxiosPrivate();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (photoPath) => {
            // Extract relative path
            const path = photoPath.replace(/^.*\/storage\//, '');
            
            await axiosPrivate.delete(
                `api/admin/businesses/${businessId}/photos`,
                { data: { path } }
            );
            
            return photoPath;
        },
        onMutate: async (photoPath) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: ['adminBusiness', businessId] });

            // Snapshot previous value
            const previousBusiness = queryClient.getQueryData(['adminBusiness', businessId]);

            // Optimistically remove photo
            queryClient.setQueryData(['adminBusiness', businessId], (old) => {
                if (!old) return old;
                return {
                    ...old,
                    photos: (old.photos || []).filter(p => p !== photoPath)
                };
            });

            return { previousBusiness };
        },
        onError: (err, photoPath, context) => {
            // Rollback on error
            if (context?.previousBusiness) {
                queryClient.setQueryData(
                    ['adminBusiness', businessId],
                    context.previousBusiness
                );
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminBusiness', businessId] });
        },
        ...options,
    });
};

/**
 * Delete video mutation with optimistic update
 */
export const useDeleteVideo = (businessId, options = {}) => {
    const axiosPrivate = useAxiosPrivate();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (videoPath) => {
            // Extract relative path
            const path = videoPath.replace(/^.*\/storage\//, '');
            
            await axiosPrivate.delete(
                `api/admin/businesses/${businessId}/videos`,
                { data: { path } }
            );
            
            return videoPath;
        },
        onMutate: async (videoPath) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: ['adminBusiness', businessId] });

            // Snapshot previous value
            const previousBusiness = queryClient.getQueryData(['adminBusiness', businessId]);

            // Optimistically remove video
            queryClient.setQueryData(['adminBusiness', businessId], (old) => {
                if (!old) return old;
                return {
                    ...old,
                    videos: (old.videos || []).filter(v => v !== videoPath)
                };
            });

            return { previousBusiness };
        },
        onError: (err, videoPath, context) => {
            // Rollback on error
            if (context?.previousBusiness) {
                queryClient.setQueryData(
                    ['adminBusiness', businessId],
                    context.previousBusiness
                );
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminBusiness', businessId] });
        },
        ...options,
    });
};

/**
 * Approve business mutation
 */
export const useApproveBusiness = (options = {}) => {
    const axiosPrivate = useAxiosPrivate();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ businessId, notes }) => {
            await fetchCsrfToken();
            const { data } = await axiosPrivate.post(
                `api/admin/businesses/${businessId}/approve`,
                { admin_notes: notes }
            );
            return data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['adminBusiness', variables.businessId] });
            queryClient.invalidateQueries({ queryKey: ['businesses'] });
            queryClient.invalidateQueries({ queryKey: ['adminBusinesses'] });
            queryClient.invalidateQueries({ queryKey: ['pendingBusinesses'] });
            queryClient.invalidateQueries({ queryKey: ['businessStatistics'] });
        },
        ...options,
    });
};

/**
 * Reject business mutation
 */
export const useRejectBusiness = (options = {}) => {
    const axiosPrivate = useAxiosPrivate();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ businessId, reason, notes }) => {
            await fetchCsrfToken();
            const { data } = await axiosPrivate.post(
                `api/admin/businesses/${businessId}/reject`,
                { reason, admin_notes: notes }
            );
            return data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['adminBusiness', variables.businessId] });
            queryClient.invalidateQueries({ queryKey: ['businesses'] });
            queryClient.invalidateQueries({ queryKey: ['adminBusinesses'] });
            queryClient.invalidateQueries({ queryKey: ['pendingBusinesses'] });
            queryClient.invalidateQueries({ queryKey: ['businessStatistics'] });
        },
        ...options,
    });
};

/**
 * Delete business mutation
 */
export const useDeleteBusiness = (options = {}) => {
    const axiosPrivate = useAxiosPrivate();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (businessId) => {
            await fetchCsrfToken();
            const { data } = await axiosPrivate.delete(`api/admin/businesses/${businessId}`);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['businesses'] });
            queryClient.invalidateQueries({ queryKey: ['adminBusinesses'] });
            queryClient.invalidateQueries({ queryKey: ['pendingBusinesses'] });
            queryClient.invalidateQueries({ queryKey: ['businessStatistics'] });
        },
        ...options,
    });
};

/**
 * Mark business as bought mutation
 */
export const useMarkBusinessAsBought = (options = {}) => {
    const axiosPrivate = useAxiosPrivate();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ businessId, buyerEmail, buyerNotes }) => {
            await fetchCsrfToken();
            const { data } = await axiosPrivate.post(
                `api/admin/businesses/${businessId}/mark-as-bought`,
                { buyer_email: buyerEmail, buyer_notes: buyerNotes }
            );
            return data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['adminBusiness', variables.businessId] });
            queryClient.invalidateQueries({ queryKey: ['businesses'] });
            queryClient.invalidateQueries({ queryKey: ['adminBusinesses'] });
            queryClient.invalidateQueries({ queryKey: ['businessStatistics'] });
        },
        ...options,
    });
};

/**
 * Revert business to pending mutation
 */
export const useRevertBusinessToPending = (options = {}) => {
    const axiosPrivate = useAxiosPrivate();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ businessId, adminNotes }) => {
            await fetchCsrfToken();
            const { data } = await axiosPrivate.post(
                `api/admin/businesses/${businessId}/revert-to-pending`,
                { admin_notes: adminNotes }
            );
            return data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['adminBusiness', variables.businessId] });
            queryClient.invalidateQueries({ queryKey: ['businesses'] });
            queryClient.invalidateQueries({ queryKey: ['adminBusinesses'] });
            queryClient.invalidateQueries({ queryKey: ['pendingBusinesses'] });
            queryClient.invalidateQueries({ queryKey: ['businessStatistics'] });
        },
        ...options,
    });
};

/**
 * Bulk approve businesses mutation
 */
export const useBulkApproveBusiness = (options = {}) => {
    const axiosPrivate = useAxiosPrivate();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ businessIds, adminNotes }) => {
            await fetchCsrfToken();
            const { data } = await axiosPrivate.post(
                'api/admin/businesses/bulk/approve',
                { business_ids: businessIds, admin_notes: adminNotes }
            );
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['businesses'] });
            queryClient.invalidateQueries({ queryKey: ['adminBusinesses'] });
            queryClient.invalidateQueries({ queryKey: ['pendingBusinesses'] });
            queryClient.invalidateQueries({ queryKey: ['businessStatistics'] });
        },
        ...options,
    });
};

/**
 * Bulk reject businesses mutation
 */
export const useBulkRejectBusiness = (options = {}) => {
    const axiosPrivate = useAxiosPrivate();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ businessIds, reason, adminNotes }) => {
            await fetchCsrfToken();
            const { data } = await axiosPrivate.post(
                'api/admin/businesses/bulk/reject',
                { business_ids: businessIds, reason, admin_notes: adminNotes }
            );
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['businesses'] });
            queryClient.invalidateQueries({ queryKey: ['adminBusinesses'] });
            queryClient.invalidateQueries({ queryKey: ['pendingBusinesses'] });
            queryClient.invalidateQueries({ queryKey: ['businessStatistics'] });
        },
        ...options,
    });
};

/**
 * Bulk delete businesses mutation
 */
export const useBulkDeleteBusiness = (options = {}) => {
    const axiosPrivate = useAxiosPrivate();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (businessIds) => {
            await fetchCsrfToken();
            const { data } = await axiosPrivate.post(
                'api/admin/businesses/bulk/delete',
                { business_ids: businessIds }
            );
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['businesses'] });
            queryClient.invalidateQueries({ queryKey: ['adminBusinesses'] });
            queryClient.invalidateQueries({ queryKey: ['pendingBusinesses'] });
            queryClient.invalidateQueries({ queryKey: ['businessStatistics'] });
        },
        ...options,
    });
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Helper to extract preview data from FormData (for optimistic updates)
 * Note: This is limited as FormData cannot be easily read
 */
