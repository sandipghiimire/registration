const {register, login} = require('../controllers/AuthController');
const {signupValidation, loginValidation} = require('../Middlewares/AuthValidation');

const router = require('express').Router();

// router.post('/login', loginValidation, login);
router.post('/register', signupValidation, register);

module.exports = router;
