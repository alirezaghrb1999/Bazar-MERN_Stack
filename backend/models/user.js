const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Userschema = mongoose.Schema({
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    image: { type: String, required: true },
    items: [{ type: mongoose.Types.ObjectId ,ref: 'Item' ,required: true }],
});

Userschema.plugin(uniqueValidator);

module.exports = mongoose.model('User',Userschema);
