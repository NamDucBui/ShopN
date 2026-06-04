const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Tên sản phẩm không được để trống'],
            trim: true
        },
        description: {
            type: String,
            required: [true, 'Mô tả sản phẩm không được để trống'],
        },
        price: {
            type: Number,
            required: [true, 'Giá sản phẩm không được để trống'],
            min: [0, 'Giá sản phẩm không được nhỏ hơn 0']
        },
        sku: {
            type: String,
            required: [true, 'Mã SKU không được để trống'],
            unique: true,
            trim: true
        },
        images: {
            type: [String],
            default: []
        },
        category: {
            type: String,
            required: [true, 'Danh mục sản phẩm không được để trống']
        },
        attributes: {
            type: Map,
            of: mongoose.Schema.Types.Mixed
        },
        isActive: { type: Boolean, default: true }
    },
    { timestamps: true }
)

const Product = mongoose.model('Product', ProductSchema)
module.exports = Product