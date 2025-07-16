const express = require('express')
const router = express.Router()
const placementController = require('../controllers/placeOrders') 
const { ensureAuth } = require('../middleware/auth')

router.get('/', ensureAuth, placementController.getGroupOrders)

router.post('/placeOrders', placementController.placeOrders)

module.exports = router