const express = require('express');
const messageController = require('../controller/messageController');

const router = express.Router();   


router.post('/queue', messageController.queueMessage);

module.exports = router;
