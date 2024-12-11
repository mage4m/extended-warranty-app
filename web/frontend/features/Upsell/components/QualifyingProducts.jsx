import React, { useCallback, useState } from "react";
import {
    ButtonGroup,
    Thumbnail,
    ResourceItem,
    ResourceList,
    Text,
    Scrollable,
    SkeletonBodyText,
    Tooltip,
    LegacyStack,
} from "@shopify/polaris";
import { ResourcePicker } from "@shopify/app-bridge-react";
import { useToast } from "../../../providers/ToastProvider";
import { WarrantyProductsUpdate } from "../../../utils/api/put";
import { useApiMutation } from "../../../hooks";
import { useUpsell } from "../providers/UpsellProvider";
// import { XIcon } from "@shopify/polaris-icons";

const QualifyingProducts = ({
    ISOpen = true,
    selectedProducts,
    setSelectedProducts,
    ProductPicker,
    open = false,
    id,
    updatedProducts = false,
}) => {
    const { refetch } = useUpsell();
    // const [selectedProducts, setSelectedProducts] = useState([]);
    //! Save the Products in Edit
    const { showToast } = useToast();
    const mutation = useApiMutation(WarrantyProductsUpdate, "PUT", {
        onSuccess: (data) => {
            if (data?.success === true) {
                showToast({
                    content: data?.message,
                    tone: "magic",
                    duration: 2000,
                });
                refetch();
                ProductPicker();
            }
        },
        onError: (error) => {
            showToast({
                content: error?.message,
                duration: 3000,
                error,
            });
        },
    });

    const handleSelectProduct = async ({ selection }) => {
        const newSettings = selection?.map((product) => ({ id: product?.id }));
        console.log(newSettings);

        setSelectedProducts(newSettings);
        ProductPicker();
    };

    const handleUpdateProduct = async ({ selection }) => {
        const newSettings = selection?.map((product) => ({ id: product?.id }));
        await mutation.mutateAsync({ id, products: newSettings });
    };

    const handleDelete = async (valueID) => {
        const updatedSettings = selectedProducts.filter(
            (item) => item.id !== valueID,
        );
        setSelectedProducts(updatedSettings);
    };

    console.log("chnage", selectedProducts);
    const isLoading = false;

    return (
        <>
            {!ISOpen ? null : isLoading ? (
                <SkeletonBodyText />
            ) : (
                setSelectedProducts?.length > 0 && (
                    <Scrollable
                        shadow
                        style={{
                            height: "200px",
                            width: "100%",
                        }}
                        focusable
                        scrollbarGutter="stable"
                        scrollbarWidth="thin"
                        allowFullScreen={true}
                    >
                        <div
                            style={{
                                borderRadius: "6px",
                                border: "1.5px solid #cfcfcf",
                                width: "100%",
                            }}
                        >
                            <ResourceList
                                resourceName={{
                                    singular: "product",
                                    plural: "products",
                                }}
                                items={setSelectedProducts}
                                renderItem={(item) => {
                                    const { id, title, images } = item;
                                    const splitArray = id.split("/");
                                    const number =
                                        splitArray[splitArray.length - 1];
                                    return (
                                        <ResourceItem
                                            id={id}
                                            media={
                                                <Thumbnail
                                                    size="small"
                                                    source={
                                                        images[0]?.originalSrc
                                                    }
                                                    alt={images[0]?.altText}
                                                />
                                            }
                                            name={title}
                                            verticalAlignment="center"
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent:
                                                        "space-between",
                                                    alignItems: "center",
                                                    width: "100%",
                                                }}
                                            >
                                                <LegacyStack
                                                    spacing="tight"
                                                    vertical
                                                >
                                                    <Text
                                                        variant="headingSm"
                                                        as="h4"
                                                        tone="subdued"
                                                        fontWeight="bold"
                                                    >
                                                        {title}
                                                    </Text>
                                                    <Text
                                                        as="span"
                                                        tone="subdued"
                                                        fontWeight="regular"
                                                    >
                                                        <Text
                                                            as="span"
                                                            tone="caution"
                                                        >
                                                            ID:
                                                        </Text>
                                                        {number}
                                                    </Text>
                                                </LegacyStack>
                                                <ButtonGroup
                                                    segmented
                                                    spacing="loose"
                                                >
                                                    <Tooltip
                                                        content="Delete"
                                                        dismissOnMouseOut
                                                    >
                                                        <div
                                                            onClick={() =>
                                                                handleDelete(id)
                                                            }
                                                        >
                                                            {/* <Icon
                                                                source={XIcon}
                                                                style={{
                                                                    color: "red",
                                                                }}
                                                            /> */}
                                                            delte
                                                        </div>
                                                    </Tooltip>
                                                </ButtonGroup>
                                            </div>
                                        </ResourceItem>
                                    );
                                }}
                            />
                        </div>
                    </Scrollable>
                )
            )}

            <ResourcePicker
                resourceType="Product"
                showVariants={false}
                open={open}
                onCancel={ProductPicker}
                onSelection={
                    updatedProducts === true
                        ? handleUpdateProduct
                        : handleSelectProduct
                }
                selectMultiple={true}
                actionVerb="select"
                initialSelectionIds={selectedProducts}
            />
        </>
    );
};

export default React.memo(QualifyingProducts);
