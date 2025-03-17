// import mongoose from 'mongoose';

// const registerSchema = new mongoose.Schema({
//     firstName: {
//         type: String,
//         required: true
//     },
//     middleName: {
//         type: String,
//         required: false
//     },
//     lastName: {
//         type: String,
//         required: true
//     },
//     gender: {
//         type: String,
//         required: true
//     },
//     dob: {
//         type: Date,
//         required: true
//     },
//     email: {
//         type: String,
//         required: true
//     },
//     mobile: {
//         type: Number,
//         required: true
//     },
//     password: {
//         type: String,
//         required: true
//     },
//     confirmPassword: {
//         type: String,
//         required: false
//     },
//     isAdmin: {
//         type: Boolean,
//         default: false,
//     },
//     classes: [
//         {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "Class", // ✅ Reference to Class model
//         },
//     ],
//     createdAt: String,
// })

// const Register = mongoose.models.registers || mongoose.model('registers', registerSchema);

// export default Register;

import mongoose from "mongoose";

const registerSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    middleName: {
        type: String,
        required: false
    },
    lastName: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobile: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    classes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class", // ✅ Correct reference to Class model
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
});

const Register = mongoose.models.registers || mongoose.model('registers', registerSchema);

export default Register;