const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const SongSchema = new Schema(
{
    url:String,
    title: String,
    artist: String,
    anime: String,
    season: String,
    type: {
        type: String,
        enum: ['Opening','Ending','Insert']
    }
},{
    versionKey: false
}
);

module.exports = Mongoose.model("Song", SongSchema);
