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
const WarrantyClausesModal = ({
    warrantyClauses,
    setWarrantyClauses,
}) => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");
    const [error, setError] = useState("");
    // const [warrantyClauses, setWarrantyClauses] = useState([]);

    const handleOpen = useCallback(() => setOpen(true));
    const handleClose = useCallback(() => setOpen(false));

    const handleAdd = useCallback(() => {
        if (value.trim() === "") {
            setError("Term cannot be empty");
            return;
        }
        setWarrantyClauses([...warrantyClauses, value]);
        setValue("");
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

    return (
        <>
            <Button fullWidth size="large" onClick={handleOpen}>
                {`Add Warranty Clauses${warrantyClauses?.length > 0 ? ` (${warrantyClauses.length})` : ""}`}
            </Button>


            <Modal
                open={open}
                onClose={handleClose}
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
