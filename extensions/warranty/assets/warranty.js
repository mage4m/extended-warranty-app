document.addEventListener("alpine:init", () => {
    Alpine.data("warranty", () => ({
        appUrl: null,
        productId: null,
        customerId: null,
        shopDomain: null,
        // productId: window.warrantyData.productId,
        // customerId: window.warrantyData.customerId,
        // shopDomain: window.warrantyData.shopDomain,

        open: false,

        init() {
            const warrantyContainer = document.querySelector(
                ".warranty-container",
            );
            this.appUrl = warrantyContainer.getAttribute("data-app-url");
            this.productId = warrantyContainer.getAttribute("data-product-id");
            this.customerId =
                warrantyContainer.getAttribute("data-customer-id");
            this.shopDomain =
                warrantyContainer.getAttribute("data-shop-domain");

            //! Fetch data from the API
            fetch(
                `${this.appUrl}/api/warranty?product_id=${this.productId}&shop=${this.shopDomain}`,
            )
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(
                            `HTTP error! status: ${response.status}`,
                        );
                    }
                    return response.json();
                })
                .then((data) => console.log(data))
                .catch((error) =>
                    console.error("Error fetching data:", error?.message),
                );
        },

        toggle() {
            alert("ataha");
            this.open = !this.open;
        },
    }));
});
