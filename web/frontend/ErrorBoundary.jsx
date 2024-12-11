import { Layout, Text, Page, Card, BlockStack } from "@shopify/polaris";

import React, { useState } from "react";

const ErrorBoundary = ({ children }) => {
    const [hasError, setHasError] = useState(false);

    const handleError = () => {
        setHasError(true);
    };

    if (hasError) {
        return (
            <Page fullWidth>
                <Layout>
                    <Layout.Section>
                        <Card>
                            <BlockStack gap="400">
                                <Text
                                    as="h2"
                                    variant="headingLg"
                                    tone="critical"
                                >
                                    Oops, something went wrong!
                                </Text>
                                <Text as="p" variant="bodyLg">
                                    We apologize for the inconvenience. Please
                                    try again later or contact support.
                                </Text>
                            </BlockStack>
                        </Card>
                    </Layout.Section>
                </Layout>
            </Page>
        );
    }

    return children;
};

export default ErrorBoundary;
