const mongoose = require('mongoose');
const Joi = require('joi');

const clientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    verified:{
        type:Boolean,
        default:false,
    },
    rest_token:{
        type:String,
    }
}, { timestamps: true });

const Client = mongoose.model('Client', clientSchema);

function validateClient(Client) {
    const schema = {
        name: Joi.string().required().label(' الاسم الكامل '),
        email: Joi.string().email().required().label(' الايميل الالكتروني '),
        password: Joi.string().required().label(' كلمة المرور'),
        // ClientPassword2: Joi.string().required().label(' تاكيد كلمة السر '),


    }

    return Joi.validate(Client, schema);
}


exports.Client = Client;
exports.validateClient = validateClient;
