const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const AnimeSchema = new Schema(
{
    anime: String,
    image: String
},{
    versionKey: false
}
);

module.exports = Mongoose.model("Anime", AnimeSchema);
