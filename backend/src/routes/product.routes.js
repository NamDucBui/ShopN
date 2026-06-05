const express = require('express');
const productController = require('../controllers/product.controller');
const route = express.Router()


route.post('/', productController.createProduct)
route.get('/', productController.getAllProducts)
route.get('/:id', productController.getProductDetail)
route.put('/:id', productController.updateProduct)
route.delete('/:id', productController.deleteProduct)

module.exports = route
