import { Card, Layout,  Page, Text } from "@shopify/polaris";
import React from "react";
import { useTranslation } from "react-i18next";

const claims = () => {
    const { t } = useTranslation();
    return (
        <Page>
            <Layout>
                <Layout.Section>
                    <Card title="claims">
                        <Text as="h2" fontWeight="bold" variant="headingLg">Claims</Text>
                        <Text as="p" tone="subdued" alignment="center">
                            Congratulations, no claims found!
                        </Text>
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    );
};

export default claims;
