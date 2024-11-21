import {
    Layout,
    Form,
    Text,
    Button,
    TextField,
    Select,
    FormLayout,
    Grid,
    Card,
    LegacyStack,
} from "@shopify/polaris";
import { useState, useCallback } from "react";
import ProductSelector from "../ProductSelector";
import { UpsellPolicy, UpsellProducts } from "../../utils/api/resource";
import { UpsellProducts_Delete } from "../../utils/api/delete";
import { WarrantyClausesModal } from "./components";
import { useApiMutation } from "../../hooks/useApiRequests";
import Swal from "sweetalert2";

const NewWarrantyUpsell = () => {
    const [loading, setLoading] = useState(false);
    const [warrantyUpsell, setWarrantyUpsell] = useState({
        typeOfUpSell: "Warranty",
        policyName: "",
        duration: "",
        daysOrYears: "Days",
        warrantyPrice: "",
        warrantyClauses: [],
        products: []
    });

    const mutation = useApiMutation(UpsellPolicy, "POST", {
        onSuccess: (data) => {
            setRates(false);
            Swal.fire({
                icon: "success",
                title: "Success",
                text: data?.message,
            });
            setWarrantyUpsell({
                typeOfUpSell: "Warranty",
                policyName: "",
                duration: "",
                daysOrYears: "Days",
                warrantyPrice: "",
                warrantyClauses: [],
                products: []
            });
            setLoading(false);
            // refetch();
        },
        onError: (error) => {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: `Failed: ${error?.message}`,
            });
            setLoading(false);
        },
    });

    // const handleSubmit2 = async () => {
    //     if (!rateName || !price || isNaN(price)) {
    //         Swal.fire({
    //             icon: "warning",
    //             title: "Validation Error",
    //             text: "Please enter a valid rate name and price.",
    //         });
    //         return;
    //     }

    //     setLoading(true);

    //     const shippingRate = {
    //         rateName,
    //         rateDescription: rateDescription || null,
    //         price: parseFloat(price),
    //         conditions: {
    //             applyToCountries,
    //             applyToProvinces,
    //             condition_type: conditionType,
    //             min_value: parseFloat(minValue),
    //             max_value: parseFloat(maxValue),
    //         },
    //     };
    //     await mutation.mutateAsync({ shippingRate });
    // };

    const handleInputChange = useCallback(
        (field) => (value) => {
            setWarrantyUpsell((prevState) => ({
                ...prevState,
                [field]: value,
            }));
        },
        [],
    );

    const handleDurationToggle = useCallback(() => {
        setWarrantyUpsell((prevState) => ({
            ...prevState,
            daysOrYears: prevState.daysOrYears === "Days" ? "Years" : "Days",
        }));
    }, []);

    const handleSubmit = useCallback(
        async (e) => {
            e.preventDefault();
            console.log("====================================");
            setLoading(true);
            console.log(warrantyUpsell);
            console.log("====================================");
            await mutation.mutateAsync({ warrantyUpsell });
            // setWarrantyUpsell({
            //     typeOfUpSell: "Warranty",
            //     policyName: "",
            //     duration: "",
            //     daysOrYears: "Days",
            //     warrantyPrice: "",
            //     warrantyClauses: [
            //         "testcheckoutfunction will replace your item once per warranty period if your item is lost or stolen",
            //     ],
            // });
        },
        [warrantyUpsell],
    );

    const options = [
        { label: "Warranty", value: "Warranty" },
        { label: "Extended Warranty", value: "Extended Warranty" },
    ];

    const setWarrantyClauses = (updatedClauses) => {
        setWarrantyUpsell((prev) => ({
            ...prev,
            warrantyClauses: updatedClauses,
        }));
    };
    const setProducts = (updatedProducts) => {
        setWarrantyUpsell((prev) => ({
            ...prev,
            products: updatedProducts,
        }));
    };

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
                                    onChange={handleInputChange("typeOfUpSell")}
                                    value={warrantyUpsell?.typeOfUpSell}
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
                                    value={warrantyUpsell?.policyName}
                                    onChange={handleInputChange("policyName")}
                                    helpText="The name of the policy your customers will see"
                                    requiredIndicator
                                    required
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
                                        label={`Duration (${warrantyUpsell?.daysOrYears})`}
                                        value={warrantyUpsell?.duration}
                                        onChange={handleInputChange("duration")}
                                        requiredIndicator
                                        required
                                    />
                                    <Button onClick={handleDurationToggle}>
                                        To {warrantyUpsell?.daysOrYears}
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
                                    type="number"
                                    label={
                                        warrantyUpsell?.typeOfUpSell ===
                                        "Warranty"
                                            ? "Warranty Price"
                                            : "Extended Warranty Price"
                                    }
                                    value={warrantyUpsell?.warrantyPrice}
                                    onChange={handleInputChange(
                                        "warrantyPrice",
                                    )}
                                    helpText="Price is in GBP"
                                    requiredIndicator
                                    required
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
                                    ISOpen={false}
                                    selectedProducts={
                                        warrantyUpsell?.products || []
                                    }
                                    setSelectedProducts={setProducts}
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
                                <WarrantyClausesModal
                                    warrantyClauses={
                                        warrantyUpsell?.warrantyClauses || []
                                    }
                                    setWarrantyClauses={setWarrantyClauses}
                                />
                            </Grid.Cell>
                        </Grid>

                        <hr />

                        <LegacyStack
                            alignment="trailing"
                            distribution="trailing"
                            spacing="loose"
                        >
                            <Button loading={loading} submit primary>
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
