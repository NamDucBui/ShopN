const { prisma } = require("../config/prisma");
const Product = require("../models/Product");

class ProductService {
    async createProduct(productData, initStock = 0) {
        const existingInventory = await prisma.inventory.count({
            where: { productSku: productData.sku }
        })
        console.log(existingInventory);
        if (existingInventory) {

            throw new Error(`${productData.sku} is exist`)
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
            await Product.findByIdAndDelete(newProduct._id)
            throw new Error(`Error create inventory Postgres`)
        }
    }

    async getAllProducts(queryParams) {
        const page = Number(queryParams.page) || 1
        const limit = Number(queryParams.limit) || 10
        const { category, brand, isHot, priceMin, priceMax } = queryParams
        let filter = {}
        if (category) { filter.category = category }
        if (priceMin || priceMax) {
            filter.price = {}
            if (priceMin) filter.price.$gte = Number(priceMin)
            if (priceMax) filter.price.$lte = Number(priceMax)
        }
        if (brand) filter["attributes.brand"] = brand
        if (isHot) filter["attributes.isHot"] = isHot === 'true'

        const skip = (page - 1) * limit

        const productsList = await Product.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }).lean()
        const countProducts = await Product.countDocuments(filter)

        const skuList = productsList.map(p => p.sku)

        const inventories = await prisma.inventory.findMany({ where: { productSku: { in: skuList } } })

        for (let product of productsList) {
            const item = inventories.find(i => i.productSku === product.sku)
            if (item) {
                product.stock = item.stock
            } else {
                product.stock = 0
            }
        }

        const totalPages = Math.ceil(countProducts / limit)

        return {
            products: productsList,
            totalProducts: countProducts,
            totalPages,
            currentPage: page
        }
    }

    async getProductDetail(id) {
        const product = await Product.findById(id).lean()

        if (!product) {
            throw new Error('Product not found')
        }
        if (!product.sku) {
            throw new Error("Dữ liệu sản phẩm bị lỗi (Thiếu mã SKU)")
        }
        const inventory = await prisma.inventory.findUnique({
            where: { productSku: product.sku }
        })
        product.stock = inventory ? inventory.stock : 0
        return product
    }

    async updateProduct(id, productDataUpdate) {
        const product = await Product.findById(id)
        if (!product) {
            throw new Error('Product not found')
        }

        const { stock, ...productDataUpdateMongo } = productDataUpdate

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { $set: productDataUpdateMongo },
            { new: true }
        ).lean()
        if (stock !== undefined) {
            await prisma.inventory.update({
                where: {
                    productSku: product.sku
                },
                data: {
                    stock: stock
                }
            })
            updatedProduct.stock = stock
        } 
        else {
            const inventory = await prisma.inventory.findUnique({
                where: {
                    productSku: product.sku
                }
            })
            updatedProduct.stock = inventory ? inventory.stock : 0
        }
        return updatedProduct
    }

    async deleteProduct(id){
        const product = await Product.findById(id)
        if(!product){
            throw new Error('Product not found')
        }
        await prisma.inventory.deleteMany({
            where: {productSku: product.sku}
        })
        await Product.findByIdAndDelete(id)
        return product
    }
}

module.exports = new ProductService()