const productService = require("../services/product.service")

class ProductController {
    async createProduct(req, res) {
        try {
            const { stock, ...productData } = req.body

            const product = await productService.createProduct(productData, stock)

            return res.status(201).json({
                success: true,
                message: "Create success",
                data: product
            })
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            })
        }
    }

    async getAllProducts(req, res) {
        try {
            const result = await productService.getAllProducts(req.query)

            return res.status(200).json({
                success: true,
                data: result
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }

    async getProductDetail(req, res) {
        try {
            const { id } = req.params
            const product = await productService.getProductDetail(id)
            return res.status(200).json({
                success: true,
                data: product
            })
        } catch (error) {
            const statusCode = error.message === "Product not found" ? 404 : 500

            return res.status(statusCode).json({
                success: false,
                message: error.message
            })
        }
    }

    async updateProduct(req, res) {
        try {
            const { id } = req.params
            const productDataUpdate = req.body
            const result = await productService.updateProduct(id, productDataUpdate)

            return res.status(200).json({
                success: true,
                message: "Update success",
                data: result
            })
        } catch (error) {
            const statusCode = error.message === "Product not found" ? 404 : 500

            return res.status(statusCode).json({
                success: false,
                message: error.message
            })
        }
    }

    async deleteProduct(req, res) {
        try {
            const { id } = req.params
          
            const deletedProduct = await productService.deleteProduct(id)

            return res.status(200).json({
                success: true,
                message: "Delete success",
                data: deletedProduct
            })
        } catch (error) {
            const statusCode = error.message === "Product not found" ? 404 : 500

            return res.status(statusCode).json({
                success: false,
                message: error.message
            })
        }
    }
}

module.exports = new ProductController()