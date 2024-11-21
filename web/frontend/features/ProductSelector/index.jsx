import React, { useCallback, useState } from "react";
import { useSettingsManagement } from "./hooks";
import {
    Button,
    ButtonGroup,
    Thumbnail,
    ResourceItem,
    ResourceList,
    Text,
    Scrollable,
    SkeletonBodyText,
    Tooltip,
    Stack,
    LegacyStack,
} from "@shopify/polaris";
import { ResourcePicker } from "@shopify/app-bridge-react";
// import { XIcon } from "@shopify/polaris-icons";

const ProductSelector = ({
    getUrl,
    postUrl,
    deleteUrl,
    title = "Select Products",
    subtitle = "Select",
    edtitle = "Edit",
    size = "medium",
    ISOpen = true,
    selectedProducts,
    setSelectedProducts

}) => {
    // const [selectedProducts, setSelectedProducts] = useState([]);
    const {
        isLoading,
        error,
        isSetLoading,
        setSettings,
        deleteSettings,
        clearError,
        settingsObj,
        setSettingsObj,
    } = useSettingsManagement(getUrl, postUrl, deleteUrl);

    const [openResourcePicker, setOpenResourcePicker] = useState(false);
    const hideResourcePicker = useCallback(() => {
        setOpenResourcePicker(false);
    }, []);

    const showResourcePicker = useCallback(() => {
        setOpenResourcePicker(true);
    }, []);

    const handleSelectProduct = async ({ selection }) => {
        const newSettings = selection?.map((product) => ({ id: product?.id }));
        setSelectedProducts(newSettings);
        await setSettings(selection);
        hideResourcePicker();
    };

    const handleDelete = async (valueID) => {
        const updatedSettings = settingsObj.filter(
            (item) => item.id !== valueID,
        );
        setSettingsObj(updatedSettings);
        await setSettings(updatedSettings);
    };

    if (error)
        return (
            <Text
                as="h2"
                variant="headingMd"
                color="critical"
                fontWeight="bold"
            >
                {error}
            </Text>
        );
    return (
        <>
            <LegacyStack spacing="loose" vertical>
                <Button
                    loading={isSetLoading}
                    fullWidth
                    size={size}
                    onClick={showResourcePicker}
                >
                    {`${settingsObj?.length ? edtitle : subtitle} ${title} ${settingsObj?.length > 0 && `(${settingsObj?.length})`}`}
                </Button>
                {!ISOpen ? null : isLoading ? (
                    <SkeletonBodyText />
                ) : (
                    settingsObj?.length > 0 && (
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
                                    items={settingsObj}
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
                                                            images[0]
                                                                ?.originalSrc
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
                                                                    handleDelete(
                                                                        id,
                                                                    )
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
            </LegacyStack>

            <ResourcePicker
                resourceType="Product"
                showVariants={false}
                open={openResourcePicker}
                onCancel={hideResourcePicker}
                onSelection={handleSelectProduct}
                selectMultiple={true}
                actionVerb="select"
                initialSelectionIds={selectedProducts}
            />
        </>
    );
};

export default React.memo(ProductSelector);
