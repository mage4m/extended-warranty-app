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
    LegacyTabs,
} from "@shopify/polaris";
import { items } from "../utils/warrantyclauses";
const WarrantyClausesModal = () => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");
    const [error, setError] = useState("");

    const handleOpen = useCallback(() => setOpen(true));
    const handleClose = useCallback(() => setOpen(false));

    const handleAdd = () => {
        if (value.trim() === "") {
            setError("Term cannot be empty");
        } else {
            setError("");
            // Add the warranty clause to your data
            // handleClose();
        }
    };

    const handleChange = (value) => {
        if (value) {
            setError(false);
        }
        setValue(value);
    };


    const [selectedItems, setSelectedItems] = useState([]);

    return (
        <>
            <Button fullWidth size="large" onClick={handleOpen}>
                Add Warranty Clauses
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
                                md: 8,
                                sm: 6,
                                xs: 6,
                            }}
                        >
                            <TextField
                                fullWidth
                                label="Warranty Clause"
                                value={value}
                                onChange={(value) => handleChange(value)}
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
                                md: 4,
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
                <Modal.Section>
                    <LegacyStack spacing="loose" vertical>
                        <Text as="h4" variant="headingSm">
                            Example clauses
                        </Text>

                        <ResourceList
                            resourceName={{
                                singular: "clauses post",
                                plural: "clauses posts",
                            }}
                            items={items}
                            selectedItems={selectedItems}
                            onSelectionChange={setSelectedItems}
                            // selectable
                            renderItem={(item) => {
                                const { id, title } = item;

                                return (
                                    <ResourceItem
                                        id={id}
                                        accessibilityLabel={`View details for ${title}`}
                                        name={title}
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
                                            <Button>use</Button>
                                        </LegacyStack>
                                    </ResourceItem>
                                );
                            }}
                        />
                    </LegacyStack>
                </Modal.Section>
            </Modal>
        </>
    );
};

export default WarrantyClausesModal;
