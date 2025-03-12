import mongoose from 'mongoose';

const registerSchema = new mongoose.Schema ({
    firstName : {
        type: String,
        required: true
    },
    middleName : {
        type: String,
        required: false
    },
    lastName : {
        type: String,
        required: true
    },
    gender : {
        type: String,
        required: true
    },
    dob : {
        type: Date,
        required: true
    },
    email : {
        type: String,
        required: true
    },
    mobile : {
        type: Number,
        required: true
    },
    password : {
        type: String,
        required: true
    },
    confirmPassword : {
        type: String,
        required: false
    },
    isAdmin :{
        type : Boolean,
        default : false,
    },
    createdAt:String,
})

const Register = mongoose.models.registers || mongoose.model('registers', registerSchema);

export default Register;