const { register, login } = require('../Controllers/AuthController');
const { registerValidation, loginValidation } = require('../Middlewares/AuthValidation');

const router = require('express').Router();



router.post('/login', loginValidation, login);
router.post('/register', registerValidation, register);

module.exports = router;