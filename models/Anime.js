const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const AnimeSchema = new Schema(
{
    nameENG: String,
    nameJP: String
    // image: String
},{
    versionKey: false
}
);

module.exports = Mongoose.model("Anime", AnimeSchema);
