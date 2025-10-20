// hooks/useBusinesses.js
import { useQuery } from '@tanstack/react-query';
import { axiosPrivate } from '../../core/instance/axios.instance';
import { useState } from 'react';
import { fetchCsrfToken } from '../../core/token/csrf.token';

// ============= API FUNCTIONS =============

/**
 * Fetch all businesses with filters and pagination
 */
const fetchBusinesses = async ({ 
    page = 1, 
    perPage = 9, 
    category = '', 
    location = '', 
    search = '',
    minPrice = null,
    maxPrice = null 
}) => {
    const params = new URLSearchParams({
        per_page: perPage.toString(),
        page: page.toString(),
    });

    if (category) params.append('category', category);
    if (location) params.append('location', location);
    if (search) params.append('search', search);
    if (minPrice !== null) params.append('min_price', minPrice.toString());
    if (maxPrice !== null) params.append('max_price', maxPrice.toString());
    await fetchCsrfToken()
    const { data } = await axiosPrivate.get(`/api/busines/businesses?${params.toString()}`);
    return data;
};

/**
 * Fetch single business by ID
 */
const fetchBusinessById = async (id) => {
    await fetchCsrfToken()
    const { data } = await axiosPrivate.get(`/api/busines/businesses/${id}`);
    return data.data;
};

/**
 * Fetch single business by slug
 */
const fetchBusinessBySlug = async (slug) => {
    await fetchCsrfToken()
    const { data } = await axiosPrivate.get(`/api/busines/slug/${slug}`);
    return data.data;
};

/**
 * Fetch single business by business number
 */
const fetchBusinessByNumber = async (businessNumber) => {
    await fetchCsrfToken()
    const { data } = await axiosPrivate.get(`/api/busines/number/${businessNumber}`);
    return data.data;
};

/**
 * Fetch categories with counts
 */
const fetchCategories = async () => {
    await fetchCsrfToken()
    const { data } = await axiosPrivate.get('/api/busines/categories');
    return data.data;
};

/**
 * Fetch locations with counts
 */
const fetchLocations = async () => {
    await fetchCsrfToken()

    const { data } = await axiosPrivate.get('/api/busines/locations');
    return data.data;
};

/**
 * Check submission status by email
 */
const checkSubmissionStatus = async (email) => {
    await fetchCsrfToken()
    const { data } = await axiosPrivate.post('/api/busines/check-status', { email });
    return data.data;
};

// ============= REACT QUERY HOOKS =============

/**
 * Hook to fetch businesses with filters
 */
export const useBusinesses = (filters = {}) => {
    const {
        page = 1,
        perPage = 9,
        category = '',
        location = '',
        search = '',
        minPrice = null,
        maxPrice = null,
        enabled = true
    } = filters;

    return useQuery({
        queryKey: ['businesses', { page, perPage, category, location, search, minPrice, maxPrice }],
        queryFn: () => fetchBusinesses({ page, perPage, category, location, search, minPrice, maxPrice }),
        staleTime: 5 * 60 * 1000, // 5 minutes
        keepPreviousData: true,
        enabled,
    });
};

/**
 * Hook to fetch single business by ID
 */
export const useBusiness = (id, options = {}) => {
    return useQuery({
        queryKey: ['business', id],
        queryFn: () => fetchBusinessById(id),
        staleTime: 10 * 60 * 1000, // 10 minutes
        enabled: !!id && (options.enabled !== false),
        ...options,
    });
};

/**
 * Hook to fetch single business by slug
 */
export const useBusinessBySlug = (slug, options = {}) => {
    return useQuery({
        queryKey: ['business', 'slug', slug],
        queryFn: () => fetchBusinessBySlug(slug),
        staleTime: 10 * 60 * 1000, // 10 minutes
        enabled: !!slug && (options.enabled !== false),
        ...options,
    });
};

/**
 * Hook to fetch single business by business number
 */
export const useBusinessByNumber = (businessNumber, options = {}) => {
    return useQuery({
        queryKey: ['business', 'number', businessNumber],
        queryFn: () => fetchBusinessByNumber(businessNumber),
        staleTime: 10 * 60 * 1000, // 10 minutes
        enabled: !!businessNumber && (options.enabled !== false),
        ...options,
    });
};

/**
 * Hook to fetch categories
 */
export const useCategories = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: fetchCategories,
        staleTime: 30 * 60 * 1000, // 30 minutes
    });
};

/**
 * Hook to fetch locations
 */
export const useLocations = () => {
    return useQuery({
        queryKey: ['locations'],
        queryFn: fetchLocations,
        staleTime: 30 * 60 * 1000, // 30 minutes
    });
};

/**
 * Hook to check submission status
 */
export const useSubmissionStatus = (email, options = {}) => {
    return useQuery({
        queryKey: ['submission-status', email],
        queryFn: () => checkSubmissionStatus(email),
        enabled: !!email && (options.enabled !== false),
        staleTime: 2 * 60 * 1000, // 2 minutes
        ...options,
    });
};

// ============= HELPER HOOK FOR PAGINATION =============

/**
 * Custom hook to manage pagination state
 */
export const usePagination = (initialPage = 1) => {
    const [currentPage, setCurrentPage] = useState(initialPage);

    const handlePageChange = (event, page) => {
        setCurrentPage(page);
        // Smooth scroll to top
        window.scrollTo({
            top: document.querySelector('#business-listings')?.offsetTop - 100 || 0,
            behavior: 'smooth'
        });
    };

    const resetPage = () => setCurrentPage(1);

    return {
        currentPage,
        setCurrentPage,
        handlePageChange,
        resetPage,
    };
};