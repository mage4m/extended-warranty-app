import React, { createContext, useContext, useState, useCallback } from "react";
import { WarrantyGet } from "../../../utils/api/get";
import { useApiRequest } from "../../../hooks";

const UpsellContext = createContext();

export const UpsellProvider = ({ children }) => {
    const {
        data: Warranty,
        isError,
        isLoading,
        error,
        refetch,
    } = useApiRequest("warranty-get", WarrantyGet);

    const UpsellContextValue = {
        Warranty,
        refetch,
        isError,
        isLoading,
        error,
    };

    return (
        <UpsellContext.Provider value={UpsellContextValue}>
            {children}
        </UpsellContext.Provider>
    );
};

export const useUpsell = () => useContext(UpsellContext);
