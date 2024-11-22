import {
    Layout,
    LegacyCard,
    Page,
    Text,
    TextField,
    Button,
    Pagination,
    Grid,
    LegacyStack,
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
                    <LegacyCard sectioned title="Sold Warranties">
                        {/* Search bar */}

                        <Grid>
                            <Grid.Cell
                                columnSpan={{
                                    lg: 10,
                                    xl: 10,
                                    md: 6,
                                    sm: 6,
                                    xs: 6,
                                }}
                            >
                                <TextField
                                    placeholder="Filter by customer email"
                                    value={email}
                                    onChange={OnChange}
                                    autoComplete="off"
                                    error={error && "Filed are Reuired"}
                                />
                            </Grid.Cell>
                            <Grid.Cell
                                columnSpan={{
                                    lg: 2,
                                    xl: 2,
                                    md: 6,
                                    sm: 6,
                                    xs: 6,
                                }}
                            >
                                <Button primary onClick={handleSearch}>
                                    Search
                                </Button>
                            </Grid.Cell>
                        </Grid>

                        <LegacyStack
                            distribution="center"
                            alignment="center"
                            spacing="loose"
                            vertical
                        >
                            <div style={{marginTop:"10px"}}>
                                <Text as="p" variant="headingMd" color="subdued">
                                    No policies found
                                </Text>
                            </div>
                            <Pagination
                                hasPrevious
                                hasNext
                                onPrevious={() => console.log("Previous page")}
                                onNext={() => console.log("Next page")}
                            />
                        </LegacyStack>
                    </LegacyCard>
                </Layout.Section>
            </Layout>
        </Page>
    );
};

export default SoldWarranties;
