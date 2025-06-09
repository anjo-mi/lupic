const express = require('express')
const router = express.Router()
const orderController = require('../controllers/orders') 
const { ensureAuth } = require('../middleware/auth')

router.get('/', ensureAuth, orderController.getOrders)

router.post('/submitOrder', orderController.submitOrder)

router.post('/changeOrder', orderController.changeOrder)

router.post('/changeRestaurant', orderController.changeRestaurant)

// router.post('/addNewRestaurant', groupHomeController.addNewRestaurant)

// router.post('/addExistingRestaurant', groupHomeController.addExistingRestaurant)

// router.post('/submitChoice', groupHomeController.submitChoice)

// router.put('/markIncomplete', todosController.markIncomplete)

// router.delete('/deleteTodo', todosController.deleteTodo)

module.exports = router