const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../Models/User");

const register = async (req, res) => {
    try{
        const {name, email, password} = req.body;
        const user = await UserModel.findOne({email});
        if(user){
            return res.status(409)
            .json({message: "User already exists", success: false});
        }
        const userModel = new UserModel({
            name,
            email,
            password
        });

        userModel.password = await bcrypt.hash(password, 10);
        await userModel.save();
        res.status(201)
        .json({message: "User created successfully", 
            success: true
        });

    } catch (error) {
        res.status(500)
        .json({message: "Internal Server Error", 
            success: false
        });
    }
    
};

const login = async (req, res) => {
    try{
        const {email, password} = req.body;
        const user = await UserModel.findOne({email});
        const errorMessage = "Enter the correct email or Password";
        if(!user){
            return res.status(403)
            .json({message: errorMessage, success: false});
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(403)
            .json({message: errorMessage, success: false});
        }

        const jwtToken = jwt.sign(
            {email: user.email}, 
            process.env.JWT_SECRET, 
            {expiresIn: "1h"}
        );

        res.status(200)
        .json({message: "Login successfully", jwtToken, email, name: user.name, success: true });

    } catch (error) {
        res.status(500)
        .json({message: "Internal Server Error", 
            success: false
        });
    }
    
};

module.exports = {
    register,
    login
};