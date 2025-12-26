import { ProductEntity } from "../models/v1/product.entity"

export const deductStockOrder = async (cartItems: any[]) => {
  for (const item of cartItems) {

    const productId =
      typeof item.idProduct === "string"
        ? item.idProduct
        : item.idProduct._id

    const product = await ProductEntity.findById(productId)
      .select("amount sku variantCombinations")

    if (!product) {
      throw new Error("Sản phẩm không tồn tại")
    }

    const hasVariants =
      Array.isArray(product.variantCombinations) &&
      product.variantCombinations.length > 0

    /**
     * 👉 SẢN PHẨM THƯỜNG
     */
    if (!hasVariants || !item.sku || item.sku === product.sku) {
      const result = await ProductEntity.updateOne(
        {
          _id: productId,
          amount: { $gte: item.quantity }
        },
        {
          $inc: { amount: -item.quantity }
        }
      )

      if (result.modifiedCount === 0) {
        throw new Error("Sản phẩm không đủ tồn kho")
      }

      continue
    }

    /**
     * 👉 SẢN PHẨM CÓ PHÂN LOẠI
     */
    const result = await ProductEntity.updateOne(
      {
        _id: productId,
        variantCombinations: {
          $elemMatch: {
            sku: item.sku,
            stock: { $gte: item.quantity }
          }
        }
      },
      {
        $inc: {
          "variantCombinations.$.stock": -item.quantity
        }
      }
    )

    if (result.modifiedCount === 0) {
      throw new Error(`Phân loại ${item.sku} không đủ tồn kho`)
    }
  }
}

// export const deductStockOrder = async (cartItems: any[]) => {
//   for (const item of cartItems) {

//     const productId =
//       typeof item.idProduct === "string"
//         ? item.idProduct
//         : item.idProduct._id

//     if (!item.sku) {
//       const result = await ProductEntity.updateOne(
//         {
//           _id: productId,
//           amount: { $gte: item.quantity }
//         },
//         {
//           $inc: { amount: -item.quantity }
//         }
//       )

//       if (result.modifiedCount === 0) {
//         throw new Error("Sản phẩm không đủ tồn kho")
//       }

//       continue
//     }

//     const result = await ProductEntity.updateOne(
//       {
//         _id: productId,
//         variantCombinations: {
//           $elemMatch: {
//             sku: item.sku,
//             stock: { $gte: item.quantity }
//           }
//         }
//       },
//       {
//         $inc: {
//           "variantCombinations.$.stock": -item.quantity
//         }
//       }
//     )

//     if (result.modifiedCount === 0) {
//       throw new Error(`Phân loại ${item.sku} không đủ tồn kho`)
//     }
//   }
// }
