const { default: z } = require("zod");

const registerSchema = z.object({
    body: z.object({
        email: z
            .string({ required_error: "Email is required" })
            .trim()
            .email("Invalid email address format")
            .lowercase(),

        password: z
            .string({ required_error: "Password is required" })
            .min(6, "Password must be at least 6 characters long"),

        fullname: z
            .string({ required_error: "Full name is required" })
            .trim()
            .min(1, "Fullname cannot be empty"),

        phone: z
            .string()
            .trim()
            .regex(/^[0-9]+$/, "Phone number must contain only digits")
            .min(10, "Phone number must be at least 10 digits")
            .optional(),

        role: z
            .enum(['USER', 'ADMIN'], { invalid_type_error: "Role must be either USER or ADMIN" })
            .optional()
    })
})

const loginSchema = z.object({
    body: z.object({
        email: z
            .string({ required_error: "Email is required" })
            .trim()
            .email("Invalid email address format")
            .lowercase(),

        password: z
            .string({ required_error: "Password is required" })
            .min(1, "Password cannot be empty")
    })
})

module.exports = {
    registerSchema,
    loginSchema
}