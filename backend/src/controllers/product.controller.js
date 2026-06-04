const productService = require("../services/product.service")

class ProductController{
    async createProduct(req, res) {
        try {
            const {stock, ...productData} = req.body

            const product = await productService.createProduct(productData, stock)

            return res.status(201).json({
                success: true,
                message: 'Tạo sản phẩm thành công',
                data: product
            })
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            })
        }
    }
}

module.exports = new ProductController()