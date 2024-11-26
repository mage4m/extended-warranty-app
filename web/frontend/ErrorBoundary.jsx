import { Layout, Text, Page, LegacyCard, LegacyStack } from "@shopify/polaris";

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
                        <LegacyCard sectioned>
                            <LegacyStack vertical spacing="loose">
                                <Text
                                    as="h2"
                                    variant="headingLg"
                                    color="critical"
                                >
                                    Oops, something went wrong!
                                </Text>
                                <Text as="p" variant="bodyLg">
                                    We apologize for the inconvenience. Please
                                    try again later or contact support.
                                </Text>
                            </LegacyStack>
                        </LegacyCard>
                    </Layout.Section>
                </Layout>
            </Page>
        );
    }

    return children;
};

export default ErrorBoundary;
