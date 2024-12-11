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
    Divider,
    BlockStack,
    InlineStack,
    Icon,
    Box,
} from "@shopify/polaris";
import React, { useState, useCallback } from "react";
import { useApiMutation } from "../../hooks";
import { WarrantyCreate } from "../../utils/api/post";
import { QualifyingProducts, WarrantyClausesModal } from "./components";
import { useToast } from "../../providers/ToastProvider";
import { useModal } from "./providers/ModalProvider";
import { useUpsell } from "./providers/UpsellProvider";
import { IconsFilledIcon, NoteAddIcon } from "@shopify/polaris-icons";

const NewWarrantyUpsell = () => {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const { modals, toggleModal } = useModal();
    const { refetch } = useUpsell();

    //! Error State
    const [error, setError] = useState({});

    const [warrantyUpsell, setWarrantyUpsell] = useState({
        typeOfUpSell: "Warranty",
        policyName: "",
        duration: "",
        daysOrYears: "Days",
        warrantyPrice: "",
        warrantyClauses: [],
        products: [],
    });

    const mutation = useApiMutation(WarrantyCreate, "POST", {
        onSuccess: (data) => {
            if (data?.success === true) {
                showToast({
                    content: data?.message,
                    tone: "magic",
                    duration: 4000,
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
                refetch();
            }
        },
        onError: (error) => {
            showToast({
                content: error?.message,
                duration: 3000,
                error: true,
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

    //! Error Validation
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

    //! Submit the Upsell
    const handleSubmit = useCallback(
        async (e) => {
            e.preventDefault();
            if (!validateFields()) return;
            setLoading(true);
            await mutation.mutateAsync({ warrantyUpsell });
        },
        [warrantyUpsell, mutation],
    );

    const options = [
        { label: "Warranty", value: "Warranty" },
        { label: "Extended Warranty", value: "Extended Warranty" },
    ];

    //! Waranty
    const setWarrantyClauses = (updatedClauses) => {
        setWarrantyUpsell((prev) => ({
            ...prev,
            warrantyClauses: updatedClauses,
        }));
        setError((prev) => ({ ...prev, warrantyClauses: "" }));
    };

    //! Products
    const setProducts = (updatedProducts) => {
        setWarrantyUpsell((prev) => ({
            ...prev,
            products: updatedProducts,
        }));
        setError((prev) => ({ ...prev, products: "" }));
    };

    return (
        <Layout.Section>
            <Card>
                <BlockStack gap="300">
                    <Text as="h1" fontWeight="bold" variant="headingMd">
                        Create New Warranty Upsell
                    </Text>
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
                                        {/* <div className="d-flex duration-wrapper"> */}
                                        <InlineStack
                                            gap="200"
                                            blockAlign="center"
                                        >
                                            <div style={{ flex: 1 }}>
                                                <TextField
                                                    fullWidth
                                                    type="text"
                                                    label={`Duration (${warrantyUpsell?.daysOrYears})`}
                                                    value={
                                                        warrantyUpsell?.duration
                                                    }
                                                    onChange={(value) => {
                                                        if (!isNaN(value)) {
                                                            handleInputChange(
                                                                "duration",
                                                            )(value);
                                                        }
                                                    }}
                                                    requiredIndicator
                                                    required
                                                    error={error?.duration}
                                                    helpText={
                                                        !error?.duration &&
                                                        "How long coverage is good for"
                                                    }
                                                />
                                            </div>

                                            <Button
                                                size="slim"
                                                variant="primary"
                                                onClick={handleDurationToggle}
                                            >
                                                {warrantyUpsell?.daysOrYears}
                                            </Button>
                                        </InlineStack>

                                        {/* </div> */}
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
                                            type="text"
                                            label={
                                                warrantyUpsell?.typeOfUpSell ===
                                                "Warranty"
                                                    ? "Warranty Price"
                                                    : "Extended Warranty Price"
                                            }
                                            value={
                                                warrantyUpsell?.warrantyPrice
                                            }
                                            onChange={(value) => {
                                                if (!isNaN(value)) {
                                                    handleInputChange(
                                                        "warrantyPrice",
                                                    )(value);
                                                }
                                            }}
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
                            <Divider borderColor="input-border-active" />
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
                                    <Button
                                        fullWidth
                                        variant="secondary"
                                        size="large"
                                        onClick={() =>
                                            toggleModal("productPickerModal")
                                        }
                                    >
                                        {`${warrantyUpsell?.products?.length ? "Edit" : "Select"} Qualifying Products ${warrantyUpsell?.products?.length > 0 ? `(${warrantyUpsell?.products?.length})` : ""}`}
                                    </Button>

                                    {modals?.productPickerModal && (
                                        <QualifyingProducts
                                            ISOpen={false}
                                            selectedProducts={
                                                warrantyUpsell?.products || []
                                            }
                                            setSelectedProducts={setProducts}
                                            ProductPicker={() =>
                                                toggleModal(
                                                    "productPickerModal",
                                                )
                                            }
                                            open={modals?.productPickerModal}
                                        />
                                    )}
                                    {error?.products && (
                                        <Box paddingBlock={"100"}>
                                            <Text tone="critical" as="p">
                                                {error?.products}
                                            </Text>
                                        </Box>
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
                                    <Button
                                        fullWidth
                                        variant="secondary"
                                        size="large"
                                        onClick={() =>
                                            toggleModal("warrantyModal")
                                        }
                                    >
                                        {`Add Warranty Clauses${warrantyUpsell?.warrantyClauses?.length > 0 ? ` (${warrantyUpsell?.warrantyClauses?.length})` : ""}`}
                                    </Button>
                                    {modals?.warrantyModal && (
                                        <WarrantyClausesModal
                                            warrantyClauses={
                                                warrantyUpsell?.warrantyClauses ||
                                                []
                                            }
                                            setWarrantyClauses={
                                                setWarrantyClauses
                                            }
                                            WarrantyModal={() =>
                                                toggleModal("warrantyModal")
                                            }
                                            open={modals?.warrantyModal}
                                        />
                                    )}
                                    {error?.warrantyClauses && (
                                        <Box paddingBlock={"100"}>
                                            <Text
                                                tone="critical"
                                                as="p"
                                            >
                                                {error?.warrantyClauses}
                                            </Text>
                                        </Box>
                                    )}
                                </Grid.Cell>
                            </Grid>

                            <Divider borderColor="input-border-active" />

                            <InlineStack align="end">
                                <Button
                                    variant="primary"
                                    loading={loading}
                                    submit
                                    size="large"
                                    icon={
                                        <Icon
                                            source={NoteAddIcon}
                                            tone="base"
                                        />
                                    }
                                >
                                    Create New Warranty Upsell
                                </Button>
                            </InlineStack>
                        </FormLayout>
                    </Form>
                </BlockStack>
            </Card>
        </Layout.Section>
    );
};

export default NewWarrantyUpsell;
