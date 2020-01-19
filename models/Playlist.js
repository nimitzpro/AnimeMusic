const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const Song = require('./Song');

const PlaylistSchema = new Schema(
{
    name: String,
    private: Boolean,
    songs: [{type:Schema.Types.ObjectId, ref:'Song'}]
},{
    versionKey: false
}
);

module.exports = Mongoose.model("Playlist", PlaylistSchema);
