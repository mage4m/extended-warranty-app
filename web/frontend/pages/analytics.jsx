import {
    Page,
    Layout,
    Text,
    Card,
    BlockStack,
    Grid,
} from "@shopify/polaris";
import React from "react";

const Analytics = () => {
    return (
        <Page>
            <Layout>
                <Layout.Section>
                    <Grid>
                        {[
                            { title: "Total Sales (Today)", value: "0" },
                            { title: "Total Revenue (Today)", value: "£0" },
                            { title: "Total Sales (Week)", value: "0" },
                            { title: "Total Revenue (Week)", value: "£0" },
                        ].map((metric, index) => (
                            <Grid.Cell
                                key={index}
                                columnSpan={{
                                    xs: 3,
                                    sm: 3,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                }}
                            >
                                <Card>
                                    <BlockStack gap={"400"}>
                                        <Text as="h2" variant="headingMd">
                                            {metric?.title}
                                        </Text>
                                        <Text as="p" variant="headingLg">
                                            {metric?.value}
                                        </Text>
                                    </BlockStack>
                                </Card>
                            </Grid.Cell>
                        ))}
                    </Grid>
                </Layout.Section>

                {/* Chart Section */}
                <Layout.Section>
                    <Card>
                        <Text as="h2" fontWeight="bold" variant="headingMd">
                            Sales - Last 30 Days
                        </Text>
                        <BlockStack inlineAlign="center">
                            <Text as="p" variant="headingSm" tone="subdued">
                                No data available
                            </Text>
                        </BlockStack>
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    );
};

export default Analytics;
