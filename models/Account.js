const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const Playlist = require('./Playlist');

const AccountSchema = new Schema(
{
    email: {
        type: String,
        required: true,
        min: 6
    },
    username: {
        type: String,
        required: true,
        min: 6
    },
    admin: {
        type:Boolean,
        default:false
    },
    playlists: [{type:Schema.Types.ObjectId, ref:'Playlist'}],
    password: {
        type: String,
        required: true
    }
},{
    versionKey: false
}
);

module.exports = Mongoose.model("Account", AccountSchema);
