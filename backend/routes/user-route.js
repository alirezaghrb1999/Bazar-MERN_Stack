const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const usercontroller = require('../controller/user-controller');
const fileUpload = require('../middlewares/fileupload');


router.get('/', usercontroller.getUsers);
router.post('/register',fileUpload.single('image'),[check('name').not().isEmpty(),check('lastname').not().isEmpty(),check('email').normalizeEmail().isEmail(),check('password').isLength({ min: 6 })],usercontroller.register);
router.post('/login', usercontroller.login);

module.exports = router;