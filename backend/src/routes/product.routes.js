const express = require('express');
const productController = require('../controllers/product.controller');
const validate = require('../middlewares/validate.middleware');
const { createProductSchema, updateProductSchema } = require('../validations/product.validation');
const route = express.Router()


route.post('/',validate(createProductSchema), productController.createProduct)
route.get('/', productController.getAllProducts)
route.get('/:id', productController.getProductDetail)
route.put('/:id',validate(updateProductSchema), productController.updateProduct)
route.delete('/:id', productController.deleteProduct)

module.exports = route
