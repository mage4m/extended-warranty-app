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
import { useApiMutation } from "../../hooks";
import Swal from "sweetalert2";

const NewWarrantyUpsell = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({
        policyName: "",
        duration: "",
        warrantyPrice: "",
        warrantyClauses: "",
        products: "",
    });

    const [warrantyUpsell, setWarrantyUpsell] = useState({
        typeOfUpSell: "Warranty",
        policyName: "",
        duration: "",
        daysOrYears: "Days",
        warrantyPrice: "",
        warrantyClauses: [],
        products: [],
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
                products: [],
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

    const handleInputChange = useCallback(
        (field) => (value) => {
            setWarrantyUpsell((prevState) => ({
                ...prevState,
                [field]: value,
            }));
            //! Remove the Error on Respective Filed
            if (value.trim() !== "") {
                setError((prevErrors) => ({
                    ...prevErrors,
                    [field]: "",
                }));
            }
        },
        [],
    );

    const handleDurationToggle = useCallback(() => {
        setWarrantyUpsell((prevState) => ({
            ...prevState,
            daysOrYears: prevState.daysOrYears === "Days" ? "Years" : "Days",
        }));
    }, []);

    const validateFields = () => {
        const errors = {};

        if (!warrantyUpsell?.policyName.trim()) {
            errors.policyName = "Policy name cannot be empty.";
        }
        if (!warrantyUpsell?.duration.trim()) {
            errors.duration = "Duration cannot be empty.";
        }
        if (!warrantyUpsell?.warrantyPrice.trim()) {
            errors.warrantyPrice = "Warranty price cannot be empty.";
        }
        if (warrantyUpsell?.warrantyClauses?.length === 0) {
            errors.warrantyClauses =
                "At least one warranty clause must be added.";
        }
        if (warrantyUpsell?.products?.length === 0) {
            errors.products = "At least one product must be selected.";
        }

        setError(errors);
        return Object.keys(errors).length === 0;
    };
    const handleSubmit = useCallback(
        async (e) => {
            e.preventDefault();
            if (!validateFields()) return;

            setLoading(true);
            console.log("====================================");
            console.log(warrantyUpsell);
            console.log("====================================");
            await mutation.mutateAsync({ warrantyUpsell });
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
                        <FormLayout.Group>
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
                                        onChange={handleInputChange(
                                            "typeOfUpSell",
                                        )}
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
                                        onChange={handleInputChange(
                                            "policyName",
                                        )}
                                        helpText={
                                            !error?.policyName &&
                                            "The name of the policy your customers will see"
                                        }
                                        requiredIndicator
                                        required
                                        error={error?.policyName}
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
                                            onChange={handleInputChange(
                                                "duration",
                                            )}
                                            requiredIndicator
                                            required
                                            error={error?.duration}
                                            // helpText={
                                            //     !error?.duration &&
                                            //     "How long coverage is good for"
                                            // }
                                        />
                                        <Button onClick={handleDurationToggle}>
                                            {warrantyUpsell?.daysOrYears}
                                        </Button>
                                    </div>
                                </Grid.Cell>

                                {/* <Grid.Cell
                                    columnSpan={{
                                        lg: 1,
                                        xl: 1,
                                        md: 6,
                                        sm: 6,
                                        xs: 6,
                                    }}
                                >
                                    <Button onClick={handleDurationToggle}>
                                        {warrantyUpsell?.daysOrYears}
                                    </Button>
                                </Grid.Cell> */}
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
                                        helpText={
                                            !error?.warrantyPrice &&
                                            "Price is in GBP"
                                        }
                                        requiredIndicator
                                        required
                                        error={error?.warrantyPrice}
                                    />
                                </Grid.Cell>
                            </Grid>
                        </FormLayout.Group>
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
                                {error?.products && (
                                    <p style={{ color: "red" }}>
                                        {error?.products}
                                    </p>
                                )}
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
                                {error?.warrantyClauses && (
                                    <p style={{ color: "red" }}>
                                        {error?.warrantyClauses}
                                    </p>
                                )}
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
