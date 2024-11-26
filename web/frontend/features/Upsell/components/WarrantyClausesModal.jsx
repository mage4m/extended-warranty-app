import React, { useCallback, useState } from "react";
import {
    Modal,
    TextField,
    Button,
    Grid,
    Text,
    ResourceList,
    ResourceItem,
    LegacyStack,
    List,
} from "@shopify/polaris";
import { items } from "../utils/warrantyclauses";
import { useApiMutation } from "../../../hooks";
import { useToast } from "../../../providers/ToastProvider";
import { WarrantyClausesUpdate } from "../../../utils/api/put";
import { useUpsell } from "../providers/UpsellProvider";
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
                large
            >
                <Modal.Section>
                    <Grid>
                        <Grid.Cell
                            columnSpan={{
                                lg: 10,
                                xl: 10,
                                md: 6,
                                sm: 6,
                                xs: 6,
                            }}
                        >
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
                        </Grid.Cell>
                        <Grid.Cell
                            columnSpan={{
                                lg: 2,
                                xl: 2,
                                md: 6,
                                sm: 6,
                                xs: 6,
                            }}
                        >
                            <LegacyStack
                                wrap
                                alignment="trailing"
                                distribution="trailing"
                                spacing="loose"
                            >
                                <Button
                                    primary
                                    size="medium"
                                    fullWidth
                                    onClick={handleAdd}
                                >
                                    Add Term
                                </Button>
                            </LegacyStack>
                        </Grid.Cell>
                    </Grid>
                </Modal.Section>
                {warrantyClauses?.length > 0 && (
                    <Modal.Section>
                        <Text as="h3" variant="headingSm">
                            Your clauses
                        </Text>
                        <List type="bullet">
                            {warrantyClauses &&
                                warrantyClauses?.map((clause, index) => (
                                    <List.Item key={index}>
                                        <LegacyStack
                                            alignment="trailing"
                                            distribution="equalSpacing"
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
                                                destructive
                                                onClick={() =>
                                                    handleDeleteClause(index)
                                                }
                                            >
                                                Delete
                                            </Button>
                                        </LegacyStack>
                                    </List.Item>
                                ))}
                        </List>
                    </Modal.Section>
                )}

                {updatedClauses === true && (
                    <Modal.Section>
                        <LegacyStack
                            alignment="trailing"
                            distribution="trailing"
                        >
                            <Button
                                primary
                                loading={loading}
                                onClick={handleClauses}
                            >
                                Save Clauses
                            </Button>
                        </LegacyStack>
                    </Modal.Section>
                )}

                <Modal.Section>
                    <Text as="h4" variant="headingSm">
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
                                    <Text
                                        variant="headingSm"
                                        fontWeight="bold"
                                        as="h3"
                                    >
                                        {title}
                                    </Text>
                                    <LegacyStack
                                        alignment="trailing"
                                        distribution="trailing"
                                        spacing="tight"
                                    >
                                        <Button
                                            onClick={() => handleUse(title)}
                                        >
                                            use
                                        </Button>
                                    </LegacyStack>
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
