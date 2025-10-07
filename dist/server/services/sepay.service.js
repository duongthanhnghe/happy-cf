const SEPAY_API_URL = process.env.SEPAY_API_URL || "https://sandbox.sepay.vn";
const SEPAY_API_KEY = process.env.SEPAY_API_KEY || "";
export const createSepayPayment = async ({ amount, description, orderCode, returnUrl, cancelUrl, callbackUrl, }) => {
    var _a;
    try {
        const response = await fetch(`${SEPAY_API_URL}/transaction/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": SEPAY_API_KEY,
            },
            body: JSON.stringify({
                amount,
                description,
                order_code: orderCode,
                return_url: returnUrl,
                cancel_url: cancelUrl,
                callback_url: callbackUrl,
            }),
        });
        const data = await response.json();
        if (!response.ok) {
            return {
                code: 1,
                message: (data === null || data === void 0 ? void 0 : data.message) || "Failed to create payment link with Sepay",
                data: { paymentUrl: "" },
            };
        }
        return {
            code: 0,
            message: "Create Sepay payment link successfully",
            data: { paymentUrl: ((_a = data === null || data === void 0 ? void 0 : data.data) === null || _a === void 0 ? void 0 : _a.checkout_url) || "" },
        };
    }
    catch (error) {
        console.error("Error creating Sepay payment:", error);
        return {
            code: 1,
            message: (error === null || error === void 0 ? void 0 : error.message) || "Unexpected error while creating Sepay payment",
            data: { paymentUrl: "" },
        };
    }
};
//# sourceMappingURL=sepay.service.js.map