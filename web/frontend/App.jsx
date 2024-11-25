import { BrowserRouter } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { NavigationMenu } from "@shopify/app-bridge-react";
import Routes from "./Routes";
import "./assets/scss/index.scss";


import { AppBridgeProvider, QueryProvider, PolarisProvider, ToastProvider } from "./providers";

export default function App() {
    // Any .tsx or .jsx files in /pages will become a route
    // See documentation for <Routes /> for more info
    const pages = import.meta.globEager(
        "./pages/**/!(*.test.[jt]sx)*.([jt]sx)",
    );
    const { t } = useTranslation();

    return (
        <PolarisProvider>
            <BrowserRouter>
                <AppBridgeProvider>
                    <ToastProvider>
                        <QueryProvider>
                            <NavigationMenu
                                navigationLinks={[
                                    {
                                        label: "Claims",
                                        destination: "/claims",
                                    },
                                    {
                                        label: "Sold Warranties",
                                        destination: "/sold-warranties",
                                    },
                                    {
                                        label: "Analytics",
                                        destination: "/analytics",
                                    },
                                ]}
                            />
                            <Routes pages={pages} />
                        </QueryProvider>
                    </ToastProvider>
                </AppBridgeProvider>
            </BrowserRouter>
        </PolarisProvider>
    );
}
