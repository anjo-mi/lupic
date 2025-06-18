const express = require('express')
const router = express.Router()
const placementController = require('../controllers/placeOrders') 
const { ensureAuth } = require('../middleware/auth')

router.get('/', ensureAuth, placementController.getGroupOrders)

router.post('/placeOrders', placementController.placeOrders)

// router.post('/addExistingRestaurant', groupHomeController.addExistingRestaurant)

// router.post('/submitChoice', groupHomeController.submitChoice)

// router.post('/deleteRest', groupHomeController.deleteRestaurant)

// router.delete('/deleteTodo', todosController.deleteTodo)

module.exports = router