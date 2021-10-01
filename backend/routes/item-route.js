const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const itemcontroller = require('../controller/item-controller');
const fileUpload = require('../middlewares/fileupload');
const checkAuth = require('../middlewares/auth');


router.get('/:itemid',itemcontroller.getItemById);
router.get('/user/:userid',itemcontroller.getItemByUserId);
router.use(checkAuth);

router.post('/',fileUpload.single('image'),[check('name').not().isEmpty(),check('description').isLength({ min: 5 })],itemcontroller.createItem);
router.patch('/:itemid',[check('name').not().isEmpty(),check('description').isLength({ min: 5 })],itemcontroller.UpdateItem);
router.delete('/:itemid',itemcontroller.DeleteItem);


module.exports = router;