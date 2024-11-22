import {
    Page,
    Layout,
    LegacyCard,
    Text,
    LegacyStack,
} from "@shopify/polaris";
import React from "react";

const Analytics = () => {
    return (
        <Page>
            <Layout>
                {/* Metrics Section */}
                <Layout.Section>
                    <LegacyStack spacing="loose" distribution="fillEvenly">
                        {[
                            { title: "Total Sales (Today)", value: "0" },
                            { title: "Total Revenue (Today)", value: "£0" },
                            { title: "Total Sales (Week)", value: "0" },
                            { title: "Total Revenue (Week)", value: "£0" },
                        ]?.map((metric, index) => (
                            <LegacyCard sectioned key={index}>
                                <LegacyStack vertical spacing="loose">
                                    <Text as="h2" variant="headingMd">
                                        {metric?.title}
                                    </Text>
                                    <Text as="p" variant="headingLg">
                                        {metric?.value}
                                    </Text>
                                </LegacyStack>
                            </LegacyCard>
                        ))}
                    </LegacyStack>
                </Layout.Section>

                {/* Chart Section */}
                <Layout.Section>
                    <LegacyCard sectioned title="Sales - Last 30 Days">
                        <LegacyStack
                            distribution="center"
                            alignment="center"
                            vertical
                        >
                            <Text  as="p" color="subdued">
                                No data available
                            </Text>
                        </LegacyStack>
                    </LegacyCard>
                </Layout.Section>
            </Layout>
        </Page>
    );
};

export default Analytics;
