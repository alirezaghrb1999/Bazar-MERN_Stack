const mongoose = require('mongoose');

const Itemschema = mongoose.Schema({
    name : { type : String , required : true },
    price : { type : Number , required : true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    creator: { type: mongoose.Types.ObjectId ,ref :'User' ,required: true },
    comments: [{ type: mongoose.Types.ObjectId ,ref: 'Comment' ,required: true }]
});

module.exports = mongoose.model('Item',Itemschema);
