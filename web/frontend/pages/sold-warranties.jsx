import {
    Layout,
    Card,
    Page,
    Text,
    TextField,
    Button,
    Pagination,
    BlockStack,
    InlineStack,
} from "@shopify/polaris";
import React, { useState } from "react";

const SoldWarranties = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState(false);

    // Handle search click
    const handleSearch = () => {
        if (!email.trim()) {
            setError(true);
            return;
        }
        setError(false);
        console.log("Searching for:", email);
    };

    // Handle input change
    const OnChange = (value) => {
        setEmail(value);
        if (error) setError(false);
    };

    return (
        <Page>
            <Layout>
                <Layout.Section>
                    <Card>
                        <BlockStack gap="300">
                            <Text as="h2" fontWeight="bold" variant="headingMd">
                                Sold Warranties
                            </Text>

                            <InlineStack gap="200" blockAlign="start" align="center">
                                <div style={{ flex: 1 }}>
                                    <TextField
                                        placeholder="Filter by customer email"
                                        value={email}
                                        onChange={OnChange}
                                        autoComplete="off"
                                        error={error && "Filed are Reuired"}
                                    />
                                </div>
                                <Button
                                    variant="primary"
                                    size="large"
                                    onClick={handleSearch}
                                >
                                    Search
                                </Button>
                            </InlineStack>

                            <BlockStack
                                align="center"
                                gap="400"
                                inlineAlign="center"
                            >
                                <Text as="p" variant="headingMd" tone="subdued">
                                    No policies found
                                </Text>
                                <Pagination
                                    hasPrevious
                                    hasNext
                                    onPrevious={() => alert("Previous page")}
                                    onNext={() => alert("Next page")}
                                />
                            </BlockStack>
                        </BlockStack>
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    );
};

export default SoldWarranties;
