const express = require('express');
const router = express.Router();

// Controller
const ChatController = require('../app/Controllers/chat.controller');

// validators
const chatValidator = require('../app/Validators/chat.validator')
const commonValidators = require('../app/Validators/commonValidators');

//***************** Constants *****************//
const errorMsgs = commonValidators.responseValidationResults;

router.get('/', [chatValidator.getMessages, errorMsgs], ChatController.getMessages);
router.post('/', [chatValidator.sendMessage, errorMsgs], ChatController.sendMessage);
router.get('/conversations', [chatValidator.getMyConversations, errorMsgs], ChatController.getMyConversations);
router.get('/getNotifications', ChatController.getNotifications);
router.put('/readAllConversations', [chatValidator.readMessages, errorMsgs], ChatController.readMessages);
router.put('/read', [chatValidator.readMessage, errorMsgs], ChatController.readMessage);
// router.delete('/chat/delete/:convId', ChatController.deleteConversation);

module.exports = router;
