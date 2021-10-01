const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const commentcontroller = require('../controller/comment-controller');
const checkAuth = require('../middlewares/auth');


router.get('/:itemid',commentcontroller.getCommentsByItemId);
router.use(checkAuth);
router.post('/create', [check('content').not().isEmpty()], commentcontroller.createComment);
router.delete('/:commentid', commentcontroller.deleteComment);


module.exports = router;