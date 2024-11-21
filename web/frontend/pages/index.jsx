import { Page, Layout } from "@shopify/polaris";
// import { TitleBar } from "@shopify/app-bridge-react";
import { useTranslation } from "react-i18next";
import {
    CurrentUpsells,
    NewWarrantyUpsell,
} from "../features/Upsell";

export default function HomePage() {
    const { t } = useTranslation();
    return (
        <>
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
        </>
    );
}
