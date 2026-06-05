const { default: z } = require("zod");

const createProductSchema = z.object({
    body: z.object({
        name: z
            .string({
                required_error: "Product name is required"
            })
            .trim()
            .min(1, "Name cannot be empty"),

        description: z
            .string({
                required_error: "Desciption is required"
            })
            .min(1, "Description cannot be empty"),

        price: z
            .number({
                required_error: "Price is required"
            })
            .min(0, "Price cannot be less than 0"),

        sku: z
            .string({
                required_error: "SKU is required"
            })
            .trim()
            .min(1, "SKU cannot be empty"),

        category: z
            .string({
                required_error: "Category is required"
            })
            .min(1, "Category cannot be empty"),

        images: z.array(z.string()).optional(),

        attributes: z.record(z.any()).optional(),

        isActive: z.boolean().optional(),

        stock: z.number().min(0, "Stock cannot be less than 0").optional()
    })
})

const updateProductSchema = z.object({
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Product ID must be a valid MongoDB ObjectId")
    }),
    body: createProductSchema.shape.body.partial()
})

module.exports = {
    createProductSchema,
    updateProductSchema
}