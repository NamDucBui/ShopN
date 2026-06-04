const express = require('express');
const checkAdminMiddleware = require('../middlewares/checkAdmin.middleware');
const productController = require('../controllers/product.controller');
const route = express.Router()


route.post('/', productController.createProduct)
route.get('/', (req, res) => {
    console.log(req.query);
    res.json(req.query)
})

route.get('/:slug',checkAdminMiddleware, (req, res) => {
    console.log(req.params)
    res.json(req.params)
})

module.exports = route
