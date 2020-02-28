const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const KeySchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    ltoken: String,
    rtoken: String
},{
    versionKey: false
})

module.exports = Mongoose.model("Key", KeySchema);