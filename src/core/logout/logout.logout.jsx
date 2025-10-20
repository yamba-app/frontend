import { Navigate } from "react-router-dom";
import useAuth from "../contexts/useAth.contexts";
import { ErrorHandler } from "../error/handler.error";
import { axiosPrivate } from "../instance/axios.instance";

export const useLogout = () => {
    const { setAuth } = useAuth();
  
    const logout = async () => {
      try {
        const response = await axiosPrivate.post("/api/auth/logout");
  
        if (response.status === 200) {
          setAuth({}); // Clear auth state after logout
          localStorage.removeItem("refresh_token"); // Remove persisted token
          localStorage.removeItem("persist");
       
           <Navigate to="/login" replace />;
              window.location.reload();

        } else {
          console.warn("Unexpected logout response:", response);
        }
      } catch (error) {
        ErrorHandler(error, import.meta.env.VITE_APP_ENV);
      }
    };
  
    return logout;
  };