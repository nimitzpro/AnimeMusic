const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const Playlist = require('./Playlist');

const AccountSchema = new Schema(
{
    email: String,
    username: String,
    admin: {
        type:Boolean,
        default:false
    },
    playlists: [{type:Schema.Types.ObjectId, ref:'Playlist'}],
    password: String
},{
    versionKey: false
}
);

module.exports = Mongoose.model("Account", AccountSchema);
