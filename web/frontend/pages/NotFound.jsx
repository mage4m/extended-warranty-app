import { Button, Card, EmptyState, InlineStack, Page } from "@shopify/polaris";
import { useTranslation } from "react-i18next";
import { notFoundImage } from "../assets/images";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
    const { t } = useTranslation();
    const navaigator = useNavigate();
    return (
        <Page>
            <Card>
                <EmptyState
                    heading={t("NotFound.heading")}
                    image={notFoundImage}
                >
                    <p>{t("NotFound.description")}</p>
                </EmptyState>
                <InlineStack align="center">
                    <Button variant="primary" onClick={() => navaigator("/")}>
                        Back
                    </Button>
                </InlineStack>
            </Card>
        </Page>
    );
}
