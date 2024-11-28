import React, { useCallback, useState } from "react";
import {
    Badge,
    Banner,
    Button,
    DataTable,
    Layout,
    LegacyCard,
    LegacyStack,
    Text,
} from "@shopify/polaris";
import { useModal } from "./providers/ModalProvider";
import { QualifyingProducts, WarrantyClausesModal } from "./components";
import { useUpsell } from "./providers/UpsellProvider";
import { useApiMutation } from "../../hooks";
import { useToast } from "../../providers/ToastProvider";
import { WarrantyRecreate } from "../../utils/api/post";

const CurrentUpsells = () => {
    const { Warranty, refetch } = useUpsell();
    const { modals, toggleModal } = useModal();
    const [selectedClauses, setSelectedClauses] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [warranty_id, setWarranty_id] = useState("");
    const [loading, setLoading] = useState(false);

    // const currentUpsells = Warranty?.filter(
    //     (item) => item?.status === "enabled" || item?.status === "disabled",
    // )?.map((item) => [
    //     item?.status === "enabled" ? (
    //         <Badge status="success">Yes</Badge>
    //     ) : (
    //         <Badge status="critical">No</Badge>
    //     ),
    //     item?.name,
    //     item?.type,
    //     `${item?.duration_number} ${item?.duration_unit}`,
    //     `${item?.price} (GBP)`,
    //     // Sales (Placeholder for now)
    //     "0",
    //     // Total Revenue (Placeholder for now)
    //     "0 (GBP)",

    //     // item?.clauses,
    //     <Button
    //         size="slim"
    //         onClick={() => {
    //             setSelectedClauses(item?.clauses);
    //             setWarranty_id(item?.warranty_id);
    //             toggleModal("edit_warrantyModal");
    //         }}
    //     >
    //         Edit {item?.clauses?.length > 0 ? `(${item?.clauses?.length})` : ""}
    //     </Button>,
    //     <Button
    //         fullWidth
    //         size="slim"
    //         onClick={() => {
    //             // const formattedProducts = item?.applicable_products?.map(
    //             //     (productId) => ({
    //             //         id: productId,
    //             //     }),
    //             // );
    //             setSelectedProducts(item?.applicable_products);
    //             setWarranty_id(item?.warranty_id);
    //             toggleModal("edit_productPickerModal");
    //         }}
    //     >
    //         Edit
    //         {item?.applicable_products?.length > 0
    //             ? `(${item?.applicable_products?.length})`
    //             : ""}
    //     </Button>,
    // ]);

    //  const deletedUpsells = Warranty?.filter(
    //      (item) => item?.status === "recreate",
    //  )?.map((item) => [
    //      <Button size="slim">Recreate</Button>,
    //      item?.name,
    //      item?.type,
    //      `${item?.duration_number} ${item?.duration_unit}`,
    //      `${item?.price} (GBP)`,
    //      // Sales (Placeholder for now)
    //      "0",
    //      // Total Revenue (Placeholder for now)
    //      "0 (GBP)",
    //      <Button
    //          size="slim"
    //          onClick={() => {
    //              setSelectedClauses(item?.clauses);
    //              setWarranty_id(item?.warranty_id);
    //              toggleModal("edit_warrantyModal");
    //          }}
    //      >
    //          Edit{" "}
    //          {item?.clauses?.length > 0 ? `(${item?.clauses?.length})` : ""}
    //      </Button>,
    //      <Button
    //          fullWidth
    //          size="slim"
    //          onClick={() => {
    //              setSelectedProducts(item?.applicable_products);
    //              setWarranty_id(item?.warranty_id);
    //              toggleModal("edit_productPickerModal");
    //          }}
    //      >
    //          Edit
    //          {item?.applicable_products?.length > 0
    //              ? `(${item?.applicable_products?.length})`
    //              : ""}
    //      </Button>,
    //  ]);

    const { showToast } = useToast();

    const mutation = useApiMutation(WarrantyRecreate, "POST", {
        onSuccess: (data) => {
            if (data?.success === true) {
                showToast({
                    content: data?.message,
                    tone: "magic",
                    duration: 4000,
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

    const RecreateProduct = useCallback(
        async (WarrantyID) => {
            setLoading(true);
            await mutation.mutateAsync({ id: WarrantyID });
        },
        [],
    );
    /***
     * !reduce accepts function: () =>{}, initial state : [] || {}
     * aggregate : intial state
     * item: return the update state
     * aggregate?.push the data in to the intial state
     * return aggregate -> state
     * then initialize the initial state : [] || {}
     **/

    const currentUpsells = Warranty?.reduce((aggregate, item) => {
        if (item?.status === "enabled" || item?.status === "disabled") {
            aggregate.push([
                item?.status === "enabled" ? (
                    <Badge status="success">Yes</Badge>
                ) : (
                    <Badge status="critical">No</Badge>
                ),
                item?.name,
                item?.type,
                `${item?.duration_number} ${item?.duration_unit}`,
                `${item?.price} (GBP)`,
                // Sales (Placeholder for now)
                "0",
                // Total Revenue (Placeholder for now)
                "0 (GBP)",
                <Button
                    size="slim"
                    onClick={() => {
                        setSelectedClauses(item?.clauses);
                        setWarranty_id(item?.warranty_id);
                        toggleModal("edit_warrantyModal");
                    }}
                >
                    Edit{" "}
                    {item?.clauses?.length > 0
                        ? `(${item?.clauses?.length})`
                        : ""}
                </Button>,
                <Button
                    fullWidth
                    size="slim"
                    onClick={() => {
                        setSelectedProducts(item?.applicable_products);
                        setWarranty_id(item?.warranty_id);
                        toggleModal("edit_productPickerModal");
                    }}
                >
                    Edit
                    {item?.applicable_products?.length > 0
                        ? `(${item?.applicable_products?.length})`
                        : ""}
                </Button>,
            ]);
        }
        return aggregate;
    }, []);

    const deletedUpsells = Warranty?.reduce((aggregate, item) => {
        console.log(item?.warranty_id);

        if (item?.status === "recreate") {
            aggregate?.push([
                <Button
                    size="slim"
                    loading={loading}
                    onClick={() => {
                        RecreateProduct(item?.warranty_id);
                    }}
                >
                    Recreate
                </Button>,
                item?.name,
                item?.type,
                `${item?.duration_number} ${item?.duration_unit}`,
                `${item?.price} (GBP)`,
                // Sales (Placeholder for now)
                "0",
                // Total Revenue (Placeholder for now)
                "0 (GBP)",
                <Button
                    size="slim"
                    onClick={() => {
                        setSelectedClauses(item?.clauses);
                        setWarranty_id(item?.warranty_id);
                        toggleModal("edit_warrantyModal");
                    }}
                >
                    Edit{" "}
                    {item?.clauses?.length > 0
                        ? `(${item?.clauses?.length})`
                        : ""}
                </Button>,
                "Refresh to edit",
            ]);
        }
        return aggregate;
    }, []);

    const setWarrantyClauses = (updatedClauses) => {
        setSelectedClauses(updatedClauses);
    };

    const setProducts = (updatedProducts) => {
        setSelectedProducts(updatedProducts);
    };

    return (
        <>
            <Layout.Section>
                <LegacyCard sectioned title="Current Upsells">
                    {Warranty?.length > 0 ? (
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
                            truncate={false}
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

                    {modals?.edit_productPickerModal && (
                        <QualifyingProducts
                            ISOpen={false}
                            updatedProducts={true}
                            selectedProducts={selectedProducts}
                            setSelectedProducts={setProducts}
                            ProductPicker={() =>
                                toggleModal("edit_productPickerModal")
                            }
                            open={modals?.edit_productPickerModal}
                            id={warranty_id}
                        />
                    )}
                    {modals?.edit_warrantyModal && (
                        <WarrantyClausesModal
                            updatedClauses={true}
                            warrantyClauses={selectedClauses}
                            setWarrantyClauses={setWarrantyClauses}
                            WarrantyModal={() =>
                                toggleModal("edit_warrantyModal")
                            }
                            open={modals?.edit_warrantyModal}
                            id={warranty_id}
                        />
                    )}
                </LegacyCard>
                {/* Warranty?.filter((item) => item?.status === "recreate").length > 0 */}
                {deletedUpsells?.length > 0 && (
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
                            truncate={false}
                            fixedFirstColumns={1}
                            hideScrollIndicator={true}
                        />
                    </LegacyCard>
                )}
            </Layout.Section>
        </>
    );
};

export default CurrentUpsells;
