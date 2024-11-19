import {
    Page,
    Layout,
    Form,
    Text,
    Button,
    TextField,
    Select,
    Box,
    FormLayout,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useTranslation, Trans } from "react-i18next";
import "../assets/css/custom.scss";
import { useState, useCallback } from "react";

export default function HomePage() {
    // Variables
    const [dashboard, setDashboard] = useState("Warranty Upsell");
    const [typeOfUpSell, setTypeOfUpSell] = useState("");
    const [policyName, setPolicyName] = useState("");
    const [warrantyPrice, setWarrantyPrice] = useState(0);
    const [selected, setSelected] = useState("Warranty");

    // Translation
    const { t } = useTranslation();

    // Field Functions
    const upSellChange = useCallback((e) => setTypeOfUpSell(e));
    const policyChange = useCallback((e) => setPolicyName(e));
    const warrantyPriceChange = useCallback((e) => setWarrantyPrice(e));
    const handleSelectChange = useCallback((e) => {
        if (e === "Warranty") {
            setDashboard("Warranty Upsell");
        } else {
            setDashboard("Extended Warranty Upsell");
        }
        setSelected(e);
    });

    // Handle Submit
    const handleSubmit = useCallback((e) => {}, []);

    // Select Options
    const options = [
        { label: "Warranty", value: "Warranty" },
        { label: "Extended Warranty", value: "Extended Warranty" },
    ];

    return (
        <>
            <div id="homePage">
                <Page>
                    <TitleBar
                        title={t("HomePage.title")}
                        primaryAction={null}
                    />
                    <Layout>
                        <Layout.Section>
                            <Box id="title-Box">
                                <Text variant="heading3xl" as="h2">
                                    Create New {dashboard}
                                </Text>
                            </Box>
                            <Form onSubmit={handleSubmit}>
                                <FormLayout>
                                    <FormLayout.Group>
                                        <Select
                                            label="Type of Upsell"
                                            options={options}
                                            onChange={handleSelectChange}
                                            value={selected}
                                        />
                                        <TextField
                                            label="Policy Name"
                                            value={typeOfUpSell}
                                            onChange={upSellChange}
                                        />
                                        <TextField
                                            label="Duration (Years)"
                                            value={policyName}
                                            onChange={policyChange}
                                        />
                                        <TextField
                                            label={
                                                selected === "Warranty"
                                                    ? "Warranty Price"
                                                    : "Extended Warranty Price"
                                            }
                                            value={warrantyPrice}
                                            onChange={warrantyPriceChange}
                                        />
                                    </FormLayout.Group>
                                    <Button submit primary>
                                        Submit
                                    </Button>
                                </FormLayout>
                            </Form>
                        </Layout.Section>
                    </Layout>
                </Page>
            </div>
        </>
    );
}
