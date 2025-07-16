const express = require('express')
const router = express.Router()
const groupHomeController = require('../controllers/groupHome') 
const { ensureAuth } = require('../middleware/auth')

router.get('/', ensureAuth, groupHomeController.getRestaurants)

router.post('/addNewRestaurant', groupHomeController.addNewRestaurant)

router.post('/addExistingRestaurant', groupHomeController.addExistingRestaurant)

router.post('/submitChoice', groupHomeController.submitChoice)

router.post('/deleteRest', groupHomeController.deleteRestaurant)

module.exports = router