const { prisma } = require("../config/prisma")
const Product = require("../models/Product")

class ProductService {
    async createProduct(productData, initStock = 0) {
        const existingInventory = await prisma.inventory.findUnique({
            where: { productSku: productData.sku }
        })
        if (existingInventory) {
            throw new Error(`Mã SKU ${productData.productSku} đã tồn tại trong hệ thống kho`)
        }

        const newProduct = await Product.create(productData)

        try {
            await prisma.inventory.create({
                data: {
                    productSku: newProduct.sku,
                    stock: initStock
                }
            })
            return newProduct
        } catch (error) {
            await Product.findByIdAndDelete(newProduct.id)
            throw new Error(`Lỗi khởi tạo kho, đã hủy sản phẩm. Chi tiết: ${error.message}`)
        }
    }
}

module.exports = new ProductService()