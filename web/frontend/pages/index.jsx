import ErrorBoundary from "../ErrorBoundary";
import { Upsells } from "../features/Upsell";

export default function HomePage() {
    return (
        <ErrorBoundary>
            <Upsells />
        </ErrorBoundary>
    );
}
