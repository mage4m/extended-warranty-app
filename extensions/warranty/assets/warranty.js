document.addEventListener("alpine:init", () => {
    Alpine.data("warranty", () => ({
        // productId: window.warrantyData.productId,
        // customerId: window.warrantyData.customerId,
        // shopDomain: window.warrantyData.shopDomain,
        appUrl: null,
        productId: null,
        customerId: null,
        shopDomain: null,
        product: null,
        open: false,
        warrantyOptions: [],
        warrantyType: "",
        clausesModal: false,
        selectedClauses: [],
        selectedWarrantyName: null,

        // cart
        cartLoader: false,
        cart: [],

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
            this.product = warrantyContainer.getAttribute("data-product");
            console.log("FETCh", this.product);

            fetch(window.Shopify.routes.root + this.product)
                .then((response) => response.json())
                .then((product) =>
                    alert("The title of this product is " + product.title),
                );

            //! Fetch data from the API
            fetch(
                `${this.appUrl}/api/product/warranty/get?product_id=${this.productId}&shop=${this.shopDomain}`,
            )
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(
                            `HTTP error! status: ${response.status}`,
                        );
                    }
                    return response.json();
                })
                .then((data) => {
                    const warranties = data?.data ?? [];
                    const enabledWarranties = warranties.filter(
                        (item) => item?.status === "enabled",
                    );
                    this.open = enabledWarranties?.length > 0;
                    console.log("TAHHAA", this.open);

                    if (this.open) {
                        // Populate warrantyOptions array with data
                        this.warrantyOptions = enabledWarranties?.map(
                            (item) => ({
                                warrantyType: `${item?.duration_number} ${item?.duration_unit} ${item?.type} Available`,
                                name: item?.name,
                                duration: `${item?.duration_number} ${item?.duration_unit}`,
                                price: `$${item?.price}`,
                                clauses: item?.clauses,
                            }),
                        );

                        // Set default values for the first warranty option
                        const firstWarranty = this.warrantyOptions[0];
                        this.selectedWarrantyName = firstWarranty.name;
                        this.warrantyType = firstWarranty.warrantyType;
                        this.selectedClauses = firstWarranty.clauses;
                    }
                })
                .catch((error) =>
                    console.error("Error fetching data:", error?.message),
                );
        },

        selectWarranty(option) {
            this.selectedWarrantyName = option.name;
            this.warrantyType = option.warrantyType;
            this.selectedClauses = option.clauses;
        },

        openModal() {
            if (this.selectedClauses.length > 0) {
                this.clausesModal = true;
            }
        },

        closeModal() {
            this.clausesModal = false;
        },

        async AddToCart() {
            this.cartLoader = true;
            try {
                const { cart } = this;
                const cartItems = cart?.items || [];
                let updates = {};

                // Handling the product ID if it's provided as an array
                if (
                    Array.isArray(this.productId) &&
                    this.productId.length > 0
                ) {
                    const currentItem = cartItems.find(
                        (item) => item?.variant_id === this.productId[0],
                    );
                    updates[this.productId] = currentItem
                        ? currentItem.quantity
                        : 1;
                }

                const response = await fetch(
                    // `${this.appUrl}/cart/update.js`,
                    window.Shopify.routes.root + "cart/update.js",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ updates }),
                    },
                );

                // Check if the response is okay (status 200-299)
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                // Parse the response as JSON
                const data = await response.json();

                // Update the cart with the response data
                cart = data || [];
            } catch (error) {
                if (error?.response?.data?.status === 422) {
                    console.log(error?.response?.data?.description);
                } else {
                    console.error(`${error?.message}`, "error");
                }
            } finally {
                this.cartLoader = false;
            }
        },
    }));
});
