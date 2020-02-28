const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const Anime = require('./Anime');

const SongSchema = new Schema(
{
    url:String,
    title: String,
    artist: String,
    anime: {type:Schema.Types.ObjectId, ref:'Anime'},
    type: {
        type: String,
        enum: ['Opening','Ending','Insert']
    },
    typeNumber:Number,
    imageURL:String,
    xPos:Number,
    yPos:Number,
    verified: Boolean
},{
    versionKey: false
}
);

module.exports = Mongoose.model("Song", SongSchema);
