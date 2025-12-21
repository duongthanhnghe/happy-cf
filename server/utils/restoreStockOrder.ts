import { ProductEntity } from "../models/v1/product.entity"

export const restoreStockOrder = async (order: any) => {
  for (const item of order.cartItems) {

    const productId =
      typeof item.idProduct === "string"
        ? item.idProduct
        : item.idProduct._id

    if (!item.sku) {
      await ProductEntity.updateOne(
        { _id: productId },
        { $inc: { amount: item.quantity } }
      )
      continue
    }

    await ProductEntity.updateOne(
      {
        _id: productId,
        variantCombinations: {
          $elemMatch: {
            sku: item.sku
          }
        }
      },
      {
        $inc: {
          "variantCombinations.$.stock": item.quantity
        }
      }
    )
  }
}
