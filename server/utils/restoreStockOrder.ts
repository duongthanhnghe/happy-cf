import { ProductEntity } from "../models/v1/product.entity"

export const restoreStockOrder = async (order: any) => {
  const allItems = [
    ...order.cartItems,
    ...(order.giftItems || [])
  ]

  for (const item of allItems) {
    const productId =
      typeof item.idProduct === "string"
        ? item.idProduct
        : item.idProduct._id

    const product = await ProductEntity.findById(productId)
      .select("variantCombinations")
      .lean()

    if (!product) continue

    const hasVariants =
      Array.isArray(product.variantCombinations) &&
      product.variantCombinations.length > 0

    if (!hasVariants) {
      await ProductEntity.updateOne(
        { _id: productId },
        { $inc: { amount: item.quantity } }
      )
      continue
    }

    if (!item.sku) {
      console.error("Missing SKU when restoring stock", {
        productId,
        item,
      })
      continue
    }

    const result = await ProductEntity.updateOne(
      {
        _id: productId,
        variantCombinations: {
          $elemMatch: { sku: item.sku }
        }
      },
      {
        $inc: { "variantCombinations.$.stock": item.quantity }
      }
    )

    if (result.modifiedCount === 0) {
      console.error("Restore stock failed - variant not found", {
        productId,
        sku: item.sku,
      })
    }
  }
}
