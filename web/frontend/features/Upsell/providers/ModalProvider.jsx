import React, { createContext, useContext, useState, useCallback } from "react";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
    const [modals, setModals] = useState({
        warrantyModal: false,
        productPickerModal: false,
        edit_warrantyModal: false,
        edit_productPickerModal: false,
    });

 const toggleModal = useCallback((modalName) => {
     setModals((prevModals) => ({
         ...prevModals,
         [modalName]: !prevModals[modalName],
     }));
 }, []);

    const ModalContextValue = {
        modals,
        toggleModal,
    };

    return (
        <ModalContext.Provider value={ModalContextValue}>
            {children}
        </ModalContext.Provider>
    );
};

export const useModal = () => useContext(ModalContext);
