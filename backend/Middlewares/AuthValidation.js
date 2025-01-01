const joi = require('joi');

const registerValidation = (req, res, next) => {
    const schema = joi.object({
        name: joi.string().min(5).max(30).required(),
        email: joi.string().min(6).required().email(),
        password: joi.string().min(6).max(30).required()
    });
    const { error } = schema.validate(req.body)
    if (error) { 
        return res.status(400)
        .json({message: "Bad Request", error})
}
next();
}

const loginValidation = (req, res, next) => {
    const schema = joi.object({
        email: joi.string().min(6).required().email(),
        password: joi.string().min(6).max(30).required()
    });
    const { error } = schema.validate(req.body)
    if (error) { 
        return res.status(400)
        .json({message: "Bad Request", error})
}
next();
}

module.exports = {
    registerValidation, 
    loginValidation
};