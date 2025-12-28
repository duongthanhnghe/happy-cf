import { Schema, model, Types } from 'mongoose'
import type {
  ImageBlockPage,
  ImageBlockPosition,
} from '../../shared/constants/image-block'

export interface ImageBlock {
  _id: Types.ObjectId

  image: string
  title?: string
  description?: string

  textButton?: string
  linkRedirect?: string

  page: ImageBlockPage
  position: ImageBlockPosition
  order: number
  isActive: boolean

  createdAt: Date
  updatedAt: Date
}

const ImageBlockSchema = new Schema<ImageBlock>(
  {
    image: { type: String, required: true },
    title: { type: String },
    description: { type: String },

    textButton: { type: String },
    linkRedirect: { type: String },

    page: {
      type: String,
      required: true,
      index: true,
    },

    position: {
      type: String,
      required: true,
      index: true,
    },

    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

ImageBlockSchema.index({ page: 1, position: 1, isActive: 1, order: 1 })

export const ImageBlockEntity = model<ImageBlock>(
  'ImageBlock',
  ImageBlockSchema,
  'image_blocks'
)
