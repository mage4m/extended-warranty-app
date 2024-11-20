import { Card, Layout, LegacyStack, Stack, Text } from "@shopify/polaris";
import React from "react";

const CurrentUpsells = () => {
    return (
        <Layout.Section>
            <Card sectioned title="Current Upsells">
                <LegacyStack alignment="center" spacing="loose" vertical>
                    <Text as="h1" variant="headingLg">
                        You currently have no policy upsells
                    </Text>
                    <Text as="p" color="subdued">
                        Create a new policy to start generating new revenue!
                    </Text>
                </LegacyStack>
            </Card>
        </Layout.Section>
    );
};

export default CurrentUpsells;
