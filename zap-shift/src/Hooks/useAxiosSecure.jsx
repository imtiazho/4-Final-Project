import axios from "axios";
import React, { useEffect } from "react";
import useAuth from "./useAuth";
import { useNavigate } from "react-router";

const axiosSecure = axios.create({
  baseURL: "http://localhost:5000",
});

const useAxiosSecure = () => {
  const { user, handleLogOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Intercept Request
    const reqInterceptor = axiosSecure.interceptors.request.use((config) => {
      config.headers.Authorization = `Bearer ${user.accessToken}`;
      return config;
    });

    // Interceptor Response
    const resInterceptor = axiosSecure.interceptors.response.use(
      (res) => {
        return res;
      },
      (err) => {
        const statusCode = err.status;
        if(statusCode === 401  || statusCode === 403)
        {
          handleLogOut().then(() => {
            navigate('/');
          });
        }
        return Promise.reject(err);
      },
    );

    return () => {
      axiosSecure.interceptors.request.eject(reqInterceptor);
      axiosSecure.interceptors.response.eject(resInterceptor);
    };
  }, [user]);

  return axiosSecure;
};

export default useAxiosSecure;
