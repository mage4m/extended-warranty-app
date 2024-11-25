import React, { useState, createContext, useContext } from "react";
import { Frame, Toast } from "@shopify/polaris";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

const ToastProvider = ({ children }) => {
  const emptyToastProps = { content: null };
  const [toastProps, setToastProps] = useState(emptyToastProps);

  const showToast = (content) => {
    setToastProps(content);
  };

  const hideToast = () => {
    setToastProps(emptyToastProps);
  };
  const toastMarkup = toastProps?.content && (
    <Toast {...toastProps} onDismiss={hideToast} />
  );

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      <Frame>
        {toastMarkup}
        {children}
      </Frame>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
