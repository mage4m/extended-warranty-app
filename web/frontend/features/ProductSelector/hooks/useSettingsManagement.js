import { useEffect, useState } from "react";
import axios from "axios";
import { getSessionToken } from "@shopify/app-bridge-utils";
import { useAppBridge } from "@shopify/app-bridge-react";
import Swal from "sweetalert2";
export const useSettingsManagement = (getUrl, postUrl, deleteUrl) => {
    const app = useAppBridge();
    const [isLoading, setIsLoading] = useState(false);
    const [isSetLoading, setIsSetLoading] = useState(false);
    const [settingsObj, setSettingsObj] = useState([]);
    const [error, setError] = useState("");

    const getSettings = async () => {
        setIsLoading(true);
        try {
            const token = await getSessionToken(app);
            const response = await axios.get(getUrl, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
            });
            setSettingsObj(response?.data);
        } catch (err) {
            setError(err?.message);
            Swal.fire({
                icon: "error",
                title: err,
                text: err,
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (getUrl) {
            getSettings();
        }
    }, [getUrl]);

    const setSettings = async (productId) => {
        setIsSetLoading(true);
        try {
            const token = await getSessionToken(app);
            const response = await axios.post(
                postUrl,
                {
                    productId,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + token,
                    },
                },
            );
            setSettingsObj(response?.data?.products);
            Swal.fire({
                icon: "success",
                text: response?.data?.message,
                showConfirmButton: false,
                timer: 1500,
            });
            // return response?.data?.products;
        } catch (err) {
            setError(err?.message);
        } finally {
            setIsSetLoading(false);
        }
    };

    const deleteSettings = async (productId) => {
        setIsSetLoading(true);
        try {
            const token = await getSessionToken(app);
            const response = await axios.delete(
                deleteUrl,
                {
                    productId,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + token,
                    },
                },
            );
            setSettingsObj(response?.data?.products);
            Swal.fire({
                icon: "success",
                text: response?.data?.message,
                showConfirmButton: false,
                timer: 1500,
            });
            // return response?.data?.products;
        } catch (err) {
            setError(err?.message);
        } finally {
            setIsSetLoading(false);
        }
    };

    const clearError = () => {
        console.log("Clear");
        setSettingsObj([]);
    };

    return {
        settingsObj,
        setSettingsObj,
        isLoading,
        error,
        isSetLoading,
        setSettings,
        deleteSettings,
        clearError,
    };
};
