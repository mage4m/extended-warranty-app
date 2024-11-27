import React from "react";
import { ModalProvider } from "./providers/ModalProvider";
import { UpsellProvider } from "./providers/UpsellProvider";
import { Layout, Page } from "@shopify/polaris";
import NewWarrantyUpsell from "./NewWarrantyUpsell";
import CurrentUpsells from "./CurrentUpsells";
import { useTranslation } from "react-i18next";
// import { TitleBar } from "@shopify/app-bridge-react";

const Upsells = () => {
    const { t } = useTranslation();
    return (
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
    );
};

export default Upsells;
