import { PaymentTransactionStatusText, PaymentTransactionStatusColor, } from "../../shared/constants/payment-transaction-status.js";
export function toPaymentTransactionDTO(entity) {
    var _a, _b, _c, _d;
    return {
        id: ((_a = entity._id) === null || _a === void 0 ? void 0 : _a.toString()) || "",
        orderId: ((_b = entity.orderId) === null || _b === void 0 ? void 0 : _b.toString()) || "",
        amount: entity.amount,
        method: entity.method,
        status: entity.status,
        statusText: PaymentTransactionStatusText[entity.status],
        statusColor: PaymentTransactionStatusColor[entity.status],
        createdAt: ((_c = entity.createdAt) === null || _c === void 0 ? void 0 : _c.toISOString()) || "",
        updatedAt: ((_d = entity.updatedAt) === null || _d === void 0 ? void 0 : _d.toISOString()) || "",
    };
}
export const toPaymentTransactionListDTO = (list) => list.map(toPaymentTransactionDTO);
//# sourceMappingURL=payment-transaction.mapper.js.map