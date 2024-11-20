import {
    Layout,
    Form,
    Text,
    Button,
    TextField,
    Select,
    Box,
    FormLayout,
    Grid,
    Card,
    Stack,
    Modal,
    TextContainer,
    LegacyStack,
} from "@shopify/polaris";
import { useTranslation } from "react-i18next";
import { useState, useCallback } from "react";
import ProductSelector from "../ProductSelector";
import { UpsellProducts } from "../../utils/api/resource";
import { UpsellProducts_Delete } from "../../utils/api/delete";
import { WarrantyClausesModal } from "./components";

const NewWarrantyUpsell = () => {
    const [typeOfUpSell, setTypeOfUpSell] = useState("");
    const [policyName, setPolicyName] = useState("");
    const [warrantyPrice, setWarrantyPrice] = useState("");
    const [selected, setSelected] = useState("Warranty");
    const [daysOrYears, setDaysOrYears] = useState("Days");
    // const [warranty, setWarranty] = useState(false);

    // const WarrantyPopup = useCallback(() => {
    //     setWarranty(!warranty);
    // }, [warranty]);

    const upSellChange = useCallback((value) => setTypeOfUpSell(value));
    const policyChange = useCallback((value) => setPolicyName(value));
    const warrantyPriceChange = useCallback((value) => setWarrantyPrice(value));
    const handleSelectChange = useCallback((value) => {
        setSelected(value);
    });
    const handleDuration = () => {
        setDaysOrYears(daysOrYears === "Days" ? "Years" : "Days");
    };

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        // Handle form submission
        alert("Logs")
    }, []);

    const options = [
        { label: "Warranty", value: "Warranty" },
        { label: "Extended Warranty", value: "Extended Warranty" },
    ];

    return (
        <Layout.Section>
            <Card sectioned title="Create New Warranty Upsell">
                <Form onSubmit={handleSubmit}>
                    <FormLayout>
                        <Text as="h2" variant="headingMd">
                            Step 1: Specify Warranty Terms
                        </Text>
                        <Grid>
                            <Grid.Cell
                                columnSpan={{
                                    lg: 3,
                                    xl: 3,
                                    md: 6,
                                    sm: 6,
                                    xs: 6,
                                }}
                            >
                                <Select
                                    label="Type of Upsell"
                                    options={options}
                                    onChange={handleSelectChange}
                                    value={selected}
                                />
                            </Grid.Cell>
                            <Grid.Cell
                                columnSpan={{
                                    lg: 3,
                                    xl: 3,
                                    md: 6,
                                    sm: 6,
                                    xs: 6,
                                }}
                            >
                                <TextField
                                    label="Policy Name"
                                    value={typeOfUpSell}
                                    onChange={upSellChange}
                                    helpText="The name of the policy your customers will see"
                                />
                            </Grid.Cell>
                            <Grid.Cell
                                columnSpan={{
                                    lg: 3,
                                    xl: 3,
                                    md: 6,
                                    sm: 6,
                                    xs: 6,
                                }}
                            >
                                <div className="d-flex duration-wrapper">
                                    <TextField
                                        label={`Duration (${daysOrYears})`}
                                        value={policyName}
                                        onChange={policyChange}
                                    />
                                    <Button onClick={handleDuration}>
                                        To {daysOrYears}
                                    </Button>
                                </div>
                            </Grid.Cell>
                            <Grid.Cell
                                columnSpan={{
                                    lg: 3,
                                    xl: 3,
                                    md: 6,
                                    sm: 6,
                                    xs: 6,
                                }}
                            >
                                <TextField
                                    label={
                                        selected === "Warranty"
                                            ? "Warranty Price"
                                            : "Extended Warranty Price"
                                    }
                                    value={warrantyPrice}
                                    onChange={warrantyPriceChange}
                                    helpText="Price is in GBP"
                                />
                            </Grid.Cell>
                        </Grid>

                        <hr />

                        <Text as="h2" variant="headingMd">
                            Step 2: Set Warranty Clauses and Products
                        </Text>
                        <Grid>
                            <Grid.Cell
                                columnSpan={{
                                    lg: 6,
                                    xl: 6,
                                    md: 6,
                                    sm: 6,
                                    xs: 6,
                                }}
                            >
                                <ProductSelector
                                    size="large"
                                    title="Qualifying Products"
                                    subtitle="Select"
                                    edtitle="Edit"
                                    getUrl={UpsellProducts}
                                    postUrl={UpsellProducts}
                                    deleteUrl={UpsellProducts_Delete}
                                />
                            </Grid.Cell>
                            <Grid.Cell
                                columnSpan={{
                                    lg: 6,
                                    xl: 6,
                                    md: 6,
                                    sm: 6,
                                    xs: 6,
                                }}
                            >
                                <WarrantyClausesModal />
                            </Grid.Cell>
                        </Grid>

                        <hr />

                        <LegacyStack
                            alignment="trailing"
                            distribution="trailing"
                            spacing="loose"
                        >
                            <Button submit primary>
                                Create New Warranty Upsell
                            </Button>
                        </LegacyStack>
                    </FormLayout>
                </Form>
            </Card>
        </Layout.Section>
    );
};

export default NewWarrantyUpsell;
