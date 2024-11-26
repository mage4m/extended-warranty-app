import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { getSessionToken } from "@shopify/app-bridge-utils";
import { useAppBridge } from "@shopify/app-bridge-react";
import { useDebugValue } from "react";
import { useToast } from "../providers/ToastProvider";

const fetchData = async (
    url,
    app,
    params = {},
    method = "GET",
    payload = null,
) => {
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
        console.table("Error in fetchData:", error);
        throw error;
    }
};

export const useApiRequest = (
    id,
    url,
    method = "GET",
    params = {},
    options = {},
) => {
    const app = useAppBridge();
    const { showToast } = useToast();

const fetch_data = async () => {
    try {
        return await fetchData(url, app, params, method);
    } catch (error) {
        showToast({
            content: error?.message,
            error,
        });
    }
};

    // const fetch_data = () => fetchData(url, app, params, method);

    const { data, isError, isLoading, error, refetch } = useQuery(
        [id, params],
        fetch_data,
        {
            staleTime: 2000,
            refetchOnWindowFocus: false,
            retry: 1,
            retryDelay: 5000,
            ...options,
        },
    );

    useDebugValue(data ?? "loading.....");
    return { data, isError, isLoading, error, refetch };
};

export const useApiMutation = (url, method = "POST", options = {}) => {
    const app = useAppBridge();
    const queryClient = useQueryClient();

    const { showToast } = useToast();

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
                showToast({
                    content: error?.message,
                    error: true,
                });
            },
            ...options, // Additional mutation options can be passed in via options
        },
    );
};
