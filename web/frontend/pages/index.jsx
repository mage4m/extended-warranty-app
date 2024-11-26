import { Page, Layout } from "@shopify/polaris";
// import { TitleBar } from "@shopify/app-bridge-react";
import { useTranslation } from "react-i18next";
import { CurrentUpsells, NewWarrantyUpsell } from "../features/Upsell";
import { ModalProvider } from "../features/Upsell/providers/ModalProvider";
import ErrorBoundary from "../ErrorBoundary";
import { UpsellProvider } from "../features/Upsell/providers/UpsellProvider";

export default function HomePage() {
    const { t } = useTranslation();
    return (
        <ErrorBoundary>
            <ModalProvider>
                <UpsellProvider>
                    <div id="homePage">
                        <Page>
                            {/* <TitleBar
                        title={t("HomePage.title")}
                        primaryAction={null}
                    /> */}
                            <Layout>
                                <NewWarrantyUpsell />
                                <CurrentUpsells />
                            </Layout>
                        </Page>
                    </div>
                </UpsellProvider>
            </ModalProvider>
        </ErrorBoundary>
    );
}
