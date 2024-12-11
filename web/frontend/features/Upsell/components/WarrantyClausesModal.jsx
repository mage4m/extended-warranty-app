import React, { useCallback, useState } from "react";
import {
    Modal,
    TextField,
    Button,
    Text,
    ResourceList,
    ResourceItem,
    List,
    Icon,
    InlineStack,
    BlockStack,
} from "@shopify/polaris";
import { items } from "../utils/warrantyclauses";
import { useApiMutation } from "../../../hooks";
import { useToast } from "../../../providers/ToastProvider";
import { WarrantyClausesUpdate } from "../../../utils/api/put";
import { useUpsell } from "../providers/UpsellProvider";
import { DeleteIcon } from "@shopify/polaris-icons";
const WarrantyClausesModal = ({
    warrantyClauses,
    setWarrantyClauses,
    WarrantyModal,
    open = false,
    updatedClauses = false,
    id,
}) => {
    const { refetch } = useUpsell();
    const [value, setValue] = useState("");
    const [error, setError] = useState("");
    // const [warrantyClauses, setWarrantyClauses] = useState([]);

    const handleAdd = useCallback(() => {
        if (value.trim() === "") {
            setError("Term cannot be empty");
            return;
        }
        //! If warrantyClauses already have that value
        if (warrantyClauses.includes(value.trim())) {
            setError("This clause already exists");
            return;
        }
        setWarrantyClauses([...warrantyClauses, value.trim()]);
        setValue("");
        setError("");
    }, [value, warrantyClauses, setWarrantyClauses]);

    const handleChange = useCallback((newValue) => {
        setValue(newValue);
        if (newValue.trim() !== "") {
            setError("");
        }
    }, []);

    const handleUse = useCallback((clause) => {
        setError("");
        setValue(clause);
    }, []);

    const handleDeleteClause = useCallback(
        (index) => {
            setWarrantyClauses(warrantyClauses.filter((_, i) => i !== index));
        },
        [warrantyClauses, setWarrantyClauses],
    );
    const [selectedItems, setSelectedItems] = useState([]);

    //! Save the Clauses in Edit
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const mutation = useApiMutation(WarrantyClausesUpdate, "PUT", {
        onSuccess: (data) => {
            if (data?.success === true) {
                showToast({
                    content: data?.message,
                    tone: "magic",
                    duration: 2000,
                });
                setLoading(false);
                refetch();
                WarrantyModal();
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

    const handleClauses = useCallback(
        async (e) => {
            e.preventDefault();
            setLoading(true);
            await mutation.mutateAsync({ id, clauses: warrantyClauses });
        },
        [id, warrantyClauses, mutation],
    );

    return (
        <>
            <Modal
                open={open}
                onClose={WarrantyModal}
                title="Add Warranty Clauses"
                iFrameName="Add Warranty Clauses"
                size="large"
                primaryAction={
                    updatedClauses === true
                        ? [
                              {
                                  content: "Save Clauses",
                                  primary: true,
                                  loading: loading,
                                  onAction: handleClauses,
                              },
                          ]
                        : null
                }
            >
                <Modal.Section>
                    <InlineStack gap="200" blockAlign="center">
                        <div style={{ flex: 1 }}>
                            <TextField
                                fullWidth
                                label="Warranty Clause"
                                value={value}
                                onChange={handleChange}
                                helpText={
                                    !error && `Enter your warranty clause`
                                }
                                error={error}
                            />
                        </div>
                        <Button
                            variant="primary"
                            size="large"
                            onClick={handleAdd}
                        >
                            Add Term
                        </Button>
                    </InlineStack>
                </Modal.Section>

                {warrantyClauses?.length > 0 && (
                    <Modal.Section>
                        <BlockStack gap="300">
                            <Text as="h3" variant="headingMd">
                                Your Clauses
                            </Text>
                            <List type="bullet">
                                {warrantyClauses &&
                                    warrantyClauses?.map((clause, index) => (
                                        <List.Item key={index}>
                                            <InlineStack
                                                align="space-between"
                                                gap="200"
                                            >
                                                <Text
                                                    style={{ flex: 1 }}
                                                    as="h3"
                                                    variant="headingSm"
                                                >
                                                    {clause}
                                                </Text>
                                                <Button
                                                    size="micro"
                                                    tone="critical"
                                                    onClick={() =>
                                                        handleDeleteClause(
                                                            index,
                                                        )
                                                    }
                                                >
                                                    <Icon
                                                        source={DeleteIcon}
                                                        tone="critical"
                                                    />
                                                </Button>
                                            </InlineStack>
                                        </List.Item>
                                    ))}
                            </List>
                        </BlockStack>
                    </Modal.Section>
                )}

                <Modal.Section>
                    <Text as="h2" variant="headingMd">
                        Example clauses
                    </Text>
                    <ResourceList
                        resourceName={{
                            singular: "clauses post",
                            plural: "clauses posts",
                        }}
                        items={items}
                        // selectedItems={selectedItems}
                        // onSelectionChange={setSelectedItems}
                        // selectable
                        renderItem={(item) => {
                            const { id, title } = item;

                            return (
                                <ResourceItem
                                    id={id}
                                    accessibilityLabel={`View details for ${title}`}
                                    name={title}
                                    verticalAlignment="center"
                                >
                                    <InlineStack
                                        align="space-between"
                                        gap="100"
                                    >
                                        <Text
                                            variant="headingSm"
                                            fontWeight="bold"
                                            as="h3"
                                        >
                                            {title}
                                        </Text>

                                        <Button
                                            variant="primary"
                                            size="slim"
                                            onClick={() => handleUse(title)}
                                        >
                                            use
                                        </Button>
                                    </InlineStack>
                                </ResourceItem>
                            );
                        }}
                    />
                </Modal.Section>
            </Modal>
        </>
    );
};

export default React.memo(WarrantyClausesModal);
