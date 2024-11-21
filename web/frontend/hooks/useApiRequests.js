import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from "axios";
import { getSessionToken } from "@shopify/app-bridge-utils";
import { useAppBridge } from "@shopify/app-bridge-react";
import Swal from "sweetalert2";
import { useDebugValue } from 'react';

const fetchData = async (url, app, params = {}, method = 'GET', payload = null) => {
    try {
        const token = await getSessionToken(app);
        const response = await axios({
            method,
            url,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            params,
            data: payload,
        });
        return response?.data;
    } catch (error) {
        Swal.fire({
            showConfirmButton: false,
            timer: 1500,
            icon: "error",
            title: "Error on Request",
            text: error?.message,
            showClass: {
                popup: `
                    animate__animated
                    animate__fadeInUp
                    animate__faster
                    `
            },
            hideClass: {
                popup: `
                    animate__animated
                    animate__fadeOutDown
                    animate__faster
                    `
            }
        });
        console.dir("Error in fetchData:", error);
        throw error;
    }
};

export const useApiRequest = (id, url, method = 'GET', params = {}, options = {}) => {
    const app = useAppBridge();
    const fetch_data = () => fetchData(url, app, params, method);

    const { data, isError, isLoading, error, refetch } = useQuery([id, params], fetch_data, {
        staleTime: 2000,
        refetchOnWindowFocus: false,
        retry: 1,
        retryDelay: 5000,
        ...options,
    });

    useDebugValue(data ?? 'loading.....');
    return { data, isError, isLoading, error, refetch };
};

export const useApiMutation = (url, method = 'POST', options = {}) => {
    const app = useAppBridge();
    const queryClient = useQueryClient();

    return useMutation(
        async (payload) => {
            return await fetchData(url, app, {}, method, payload);
        },
        {
            onSuccess: (data) => {
                if (options.onSuccess) {
                    options.onSuccess(data);
                }
                // Optionally invalidate queries if needed
                if (options.invalidateKey) {
                    queryClient.invalidateQueries(options.invalidateKey);
                }
            },
            onError: (error) => {
                if (options.onError) {
                    options.onError(error);
                }
                Swal.fire({
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 1500,
                    icon: "error",
                    title: "Mutation Error",
                    text: error?.message,
                });
            },
            ...options, // Additional mutation options can be passed in via options
        }
    );
};
