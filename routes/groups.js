const express = require('express')
const router = express.Router()
const groupController = require('../controllers/groups') 
const { ensureAuth } = require('../middleware/auth')

router.get('/', ensureAuth, groupController.getGroups)

router.post('/createGroup', groupController.createGroup)

router.post('/joinGroup', groupController.joinGroup)

// router.put('/markIncomplete', todosController.markIncomplete)

// router.delete('/deleteTodo', todosController.deleteTodo)

module.exports = router