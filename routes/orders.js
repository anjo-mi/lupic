const express = require('express')
const router = express.Router()
const orderController = require('../controllers/orders') 
const { ensureAuth } = require('../middleware/auth')

router.get('/', ensureAuth, orderController.getOrders)

router.post('/submitOrder', orderController.submitOrder)

router.post('/resubmitOrder', orderController.resubmitOrder)

router.post('/changeOrder', orderController.changeOrder)

router.post('/changeRestaurant', orderController.changeRestaurant)

module.exports = router