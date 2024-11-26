import React, { useCallback, useState } from "react";
import {
    Badge,
    Button,
    DataTable,
    Layout,
    LegacyCard,
    LegacyStack,
    Text,
} from "@shopify/polaris";
// import { useApiRequest } from "../../hooks";
// import { WarrantyGet } from "../../utils/api/get";
import { useModal } from "./providers/ModalProvider";
import { QualifyingProducts, WarrantyClausesModal } from "./components";
import { useUpsell } from "./providers/UpsellProvider";

const CurrentUpsells = () => {
    // const { data: Warranty, refetch } = useApiRequest(
    //     "warranty-get",
    //     WarrantyGet,
    // );
    const { Warranty } = useUpsell();
    const { modals, toggleModal } = useModal();
    const [selectedClauses, setSelectedClauses] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [warranty_id, setWarranty_id] = useState("");

    const currentUpsells = Warranty?.map((item) => [
        item?.status === 1 ? (
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

        // item?.clauses,
        <Button
            size="slim"
            onClick={() => {
                setSelectedClauses(item?.clauses);
                setWarranty_id(item?.warranty_id);
                toggleModal("edit_warrantyModal");
            }}
        >
            Edit {item?.clauses?.length > 0 ? `(${item?.clauses?.length})` : ""}
        </Button>,
        <Button
            fullWidth
            size="slim"
            onClick={() => {
                // const formattedProducts = item?.applicable_products?.map(
                //     (productId) => ({
                //         id: productId,
                //     }),
                // );
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

    const setWarrantyClauses = (updatedClauses) => {
        setSelectedClauses(updatedClauses);
    };

    const setProducts = (updatedProducts) => {
        setSelectedProducts(updatedProducts);
    };

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
            </Layout.Section>

            {/* <Layout.Section>
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
            </Layout.Section> */}
        </>
    );
};

export default CurrentUpsells;
