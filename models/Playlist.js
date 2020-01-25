const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const Song = require('./Song');
const Account = require('./Account');

const PlaylistSchema = new Schema(
{
    name: String,
    createdBy: {
        type:Schema.Types.ObjectId, ref:'Account'
    },
    private: Boolean,
    songs: [{type:Schema.Types.ObjectId, ref:'Song'}]
},{
    versionKey: false
}
);

module.exports = Mongoose.model("Playlist", PlaylistSchema);
