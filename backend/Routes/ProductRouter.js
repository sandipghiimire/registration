const ensureAuth = require('../Middlewares/Auth');

const router = require('express').Router();



router.get('/',ensureAuth, (req, res) => {
    console.log('----Logged in User Details----', req.user);
    res.status(200).json([
        {id: 1, name: 'John', age: 25},
        {id: 2, name: 'Jane', age: 24},
        {id: 3, name: 'Doe', age: 26}
    ]);
});


module.exports = router;