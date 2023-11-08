const express = require('express');
const chatController = require('../controllers/chatController');
const createRoomValidator = require('../middlewares/createRoomValidator');
const authenticator = require('../middlewares/authenticator');

const router = express.Router();

router.get('/', authenticator.authenticate, chatController.showIndexPage);
router.get('/create', authenticator.authenticate, chatController.showCreatePage);
router.get('/chat', authenticator.authenticate, chatController.showChatPage);
router.get('/leave', authenticator.authenticate, chatController.leaveRoomHandle);

router.post('/create', createRoomValidator, chatController.createRoomHandle);

module.exports = router;