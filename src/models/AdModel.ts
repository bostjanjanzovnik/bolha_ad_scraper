import { Document, model, Schema, SchemaDefinitionProperty } from "mongoose"
import { Ad } from "../interfaces"

interface AdDocument extends Ad, Document {
    id: string
}

const schemaFields: Record<keyof Ad, SchemaDefinitionProperty> = {
    id: {
        type: String,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    publishedDate: {
        type: Date,
        default: null,
        required: false,
    },
    price: {
        type: String,
        required: false,
    },
    currency: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
}

const AdSchema = new Schema(schemaFields, { timestamps: true })

const AdModel = model<AdDocument>("Ad", AdSchema)

export { AdModel, AdDocument }
