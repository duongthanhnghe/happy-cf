import { ProductEntity } from "../models/v1/product.entity";

export async function resolveGiftItems(giftItems: {
  promotionGiftId: string
  productId: string
  quantity: number
  combinationId?: string
}[]) {
  const resolved = [];

  for (const gift of giftItems) {
   
    if (!gift.combinationId) {
      const product = await ProductEntity.findById(gift.productId).lean();

      if (!product) {
        throw new Error("Sản phẩm quà tặng không tồn tại");
      }

      if ((product.amount ?? 0) < gift.quantity) {
        throw new Error(`Quà "${product.productName}" đã hết hàng`);
      }

      resolved.push({
        promotionGiftId: gift.promotionGiftId,
        idProduct: product._id,
        productName: product.productName,
        image: product.image,
        sku: product.sku,
        price: 0,
        quantity: gift.quantity ?? 1,
        combinationId: null,
        variantCombination: null,
      });

      continue;
    }

    // VARIANT
    const product = await ProductEntity.findOne(
      {
        _id: gift.productId,
        "variantCombinations._id": gift.combinationId,
      },
      {
        productName: 1,
        image: 1,
        "variantCombinations.$": 1,
      }
    ).lean();

    if (!product) {
      throw new Error("Sản phẩm quà tặng không tồn tại");
    }

    const variant = product.variantCombinations[0];

    if ((variant.stock ?? 0) < gift.quantity) {
      throw new Error(`Quà "${product.productName}" đã hết hàng`);
    }

    resolved.push({
      promotionGiftId: gift.promotionGiftId,
      idProduct: product._id,
      productName: product.productName,
      image: variant.image || product.image,
      sku: variant.sku,
      price: 0,
      quantity: gift.quantity ?? 1,
      combinationId: gift.combinationId,
      variantCombination: variant,
    });
  }

  return resolved;
}