import axios from 'axios';
import { ErrorHandler } from '../error/handler.error';

export const fetchCsrfToken = async () => {
    try {
        const baseUrl = import.meta.env.VITE_API_URL;
        const response = await axios.get(`${baseUrl}/sanctum/csrf-cookie`, {
            withCredentials: true, // This is correct
            headers: { 
                'Content-Type': 'application/json' 
            },
        });        
       if (response.status === 204) {
            return response.data.csrfToken;
        } else {
            console.error('Invalid CSRF token response:', response.data);
            return null;
        }
    } catch (error) {
        console.error('CSRF token fetch error:', error);
        ErrorHandler(error, import.meta.env.VITE_APP_ENV);
        return null;
    }
};