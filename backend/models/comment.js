const mongoose = require('mongoose');

const Commentschema = mongoose.Schema({
    content: { type: String, required: true },
    creator: { type: mongoose.Types.ObjectId ,ref :'User' ,required: true },
    relateditem: { type: mongoose.Types.ObjectId ,ref :'Item' ,required: true },
    createdat: {type: Date, required: true }
});

module.exports = mongoose.model('Comment',Commentschema);