import { Layout, LegacyCard, Page, Text } from "@shopify/polaris";
import React from "react";
import { useTranslation } from "react-i18next";

const claims = () => {
    const { t } = useTranslation();
    return (
        <Page>
            <Layout>
                <Layout.Section>
                    <LegacyCard
                        sectioned
                        title="claims"
                    >
                        <Text as="p" color="subdued" alignment="center">
                            Congratulations, no claims found!
                        </Text>
                    </LegacyCard>
                </Layout.Section>
            </Layout>
        </Page>
    );
};

export default claims;
