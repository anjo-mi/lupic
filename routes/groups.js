const express = require('express')
const router = express.Router()
const groupController = require('../controllers/groups') 
const { ensureAuth } = require('../middleware/auth')

router.get('/', ensureAuth, groupController.getGroups)

router.post('/createGroup', groupController.createGroup)

router.post('/joinGroup', groupController.joinGroup)

router.post('/removeMember', groupController.removeMember)

module.exports = router