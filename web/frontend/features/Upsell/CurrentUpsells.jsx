import React from "react";
import {
    Badge,
    Button,
    DataTable,
    Layout,
    LegacyCard,
    LegacyStack,
    Text,
} from "@shopify/polaris";

const CurrentUpsells = () => {
    const currentUpsells = [
        [
            // <Button size="slim">No</Button>,
            <Badge status="critical">No</Badge>,
            "testing",
            "Extended Warranty",
            "3 year(s)",
            "780 (GBP)",
            "0",
            "0 (GBP)",
            <Button size="slim">Edit</Button>,
            <Button fullWidth size="slim">
                Edit
            </Button>,
        ],
    ];

    const deletedUpsells = [
        [
            <Button size="slim">Recreate</Button>,
            "testing...",
            "Extended Warranty",
            "juhbn year(s)",
            "400 (GBP)",
            "0",
            "0 (GBP)",
            <Button size="slim">Edit</Button>,
            <Button fullWidth size="slim">
                Edit
            </Button>,
        ],
    ];
    return (
        <>
            <Layout.Section>
                <LegacyCard sectioned title="Current Upsells">
                    {currentUpsells?.length > 0 ? (
                        <DataTable
                            columnContentTypes={[
                                "text",
                                "text",
                                "text",
                                "text",
                                "text",
                                "numeric",
                                "numeric",
                                "text",
                            ]}
                            headings={[
                                "Enabled",
                                "Policy Name",
                                "Type",
                                "Duration",
                                "Price",
                                "Sales",
                                "Total Revenue",
                                "Clauses",
                                "Applicable Product(s)",
                            ]}
                            rows={currentUpsells}
                            truncate={true}
                            fixedFirstColumns={1}
                            hideScrollIndicator={true}
                            // footerContent={`Total Upsells: ${currentUpsells.length}`}
                        />
                    ) : (
                        <LegacyStack
                            alignment="center"
                            spacing="loose"
                            vertical
                        >
                            <Text as="h1" variant="headingLg">
                                You currently have no policy upsells
                            </Text>
                            <Text as="p" color="subdued">
                                Create a new policy to start generating new
                                revenue!
                            </Text>
                        </LegacyStack>
                    )}
                </LegacyCard>
            </Layout.Section>
            <Layout.Section>
                <LegacyCard title="Deleted Upsells">
                    <DataTable
                        columnContentTypes={[
                            "text",
                            "text",
                            "text",
                            "text",
                            "text",
                            "numeric",
                            "numeric",
                            "text",
                        ]}
                        headings={[
                            "Recreate",
                            "Policy Name",
                            "Type",
                            "Duration",
                            "Price",
                            "Sales",
                            "Total Revenue",
                            "Clauses",
                            "Applicable Product(s)",
                        ]}
                        rows={deletedUpsells}
                        truncate={true}
                        fixedFirstColumns={1}
                        hideScrollIndicator={true}
                    />
                </LegacyCard>
            </Layout.Section>
        </>
    );
};

export default CurrentUpsells;
