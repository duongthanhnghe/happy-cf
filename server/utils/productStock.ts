import { ProductEntity } from "../models/v1/product.entity"

export const checkProductStockService = async ({
  productId,
  sku,
  quantity,
}: {
  productId: string
  sku?: string
  quantity: number
}) => {
  const product = await ProductEntity.findById(productId)
    .select("amount sku variantCombinations")

  if (!product) {
    throw new Error("Sản phẩm không tồn tại")
  }

  const hasVariants =
    Array.isArray(product.variantCombinations) &&
    product.variantCombinations.length > 0

  if (!hasVariants || !sku || sku === product.sku) {
    const stock = product.amount || 0
    return {
      ok: quantity <= stock,
      availableStock: stock,
    }
  }

  const combination = product.variantCombinations.find(
    c => c.sku === sku
  )

  if (!combination) {
    throw new Error(`Phân loại ${sku} không tồn tại`)
  }

  const stock = combination.stock || 0
  return {
    ok: quantity <= stock,
    availableStock: stock,
  }
}
// export const checkProductStockService = async ({
//   productId,
//   sku,
//   quantity,
// }: {
//   productId: string
//   sku?: string
//   quantity: number
// }) => {
//   const product = await ProductEntity.findById(productId)
//     .select("amount variantCombinations")

//   if (!product) {
//     throw new Error("Sản phẩm không tồn tại")
//   }

//   if (!sku) {
//     const stock = product.amount || 0
//     return { ok: quantity <= stock, availableStock: stock }
//   }

//   const combination = product.variantCombinations.find(
//     c => c.sku === sku
//   )

//   if (!combination) {
//     throw new Error(`Phân loại ${sku} không tồn tại`)
//   }

//   const stock = combination.stock || 0
//   return { ok: quantity <= stock, availableStock: stock }
// }

