const express = require('express');
const cors = require('cors');
// const axios = require('axios');
// const fileUpload = require('express-fileupload');
const multer = require('multer');
const PORT = process.env.port || 4000;
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Song = require('./models/Song');
const Playlist = require('./models/Playlist');
// const Anime = require('./models/Anime');
const DirectoryName = process.cwd().toString()+"/music/";
const auth = require('./auth');

// app.use(fileUpload({
//     createParentPath: true
// }));



app.use(cors());
app.use(bodyParser.json());

app.use('/music',express.static(DirectoryName));

app.use('/signin',auth);

mongoose.connect('mongodb://localhost:27017/data', {useNewUrlParser: true},()=>{console.log("Connected to DB...");});

app.get('/home',(req,res)=>{
    res.send("Hello from the backend!");
});

// Returns all songs
app.get('/all',async (req,res)=>{
    try{
        const songs = await Song.find();
        res.send(songs);
        console.log("All");
    }
    catch(err){
        res.json({message:err});
        console.log(err);
    }
});

// Returns searched songs
app.get('/search/:searchType/:query', async (req,res)=>{
    let songs;
    try{
        switch(req.params.searchType){
            case "anime":
                songs = await Song.find({"anime":{$regex: req.params.query, $options: 'i'}}); 
                res.send(songs);
                return;
            case "title":
                songs = await Song.find({"title":{$regex: req.params.query, $options: 'i'}});
                res.send(songs);
                return;
            case "playlist":
                songs = await Playlist.find({"name":{$regex:req.params.query, $options: 'i'},"private":"false"}).populate('createdBy', 'username');
                res.send(songs);
                return;
        }
        }
    catch(err){
        // res.send("Error")
        res.json({message:err});
        console.log(err);
        return;
    }
});

// app.get('/search/title/:query',async (req,res)=>{
//     try{
    // songs = await Song.find({"song":{$regex: req.params.query, $options: 'i'}});
    // res.send(songs);
//     }
// catch(err){
//     // res.send("Error")
//     res.json({message:err});
//     console.log(err);
// }
// });


// Searching in progress
// app.get('/searching/:query',async (req,res)=>{
//     try{
//         console.log(req.params.query);
//         const songs = await Song.find({"title":{$regex: req.params.query, $options: 'i'}}, '_id title anime'); //FIX FOR /req.params.query/i!!!
//         res.send(songs);
//     }
//     catch(err){
//         res.json({message:err});
//         console.log(err);
//     }
// });

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, 'music')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname );
  }
});

var upload = multer({ storage: storage }).single('file');

// Submission of new song (file)
app.post('/submitSong',async (req,res)=>{
    // console.log(req.files);
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }
        console.log(req.file.originalname, req.body.title);
   return res.status(200).send(req.file.originalname);
 });
});
// Submission of new song
app.post('/submit',async (req,res)=>{
    const song = new Song({
        url:"music/"+req.body.url,
        title: req.body.title,
        artist: req.body.artist,
        anime: req.body.anime,
        type: req.body.type,
        typeNumber: req.body.typeNumber,
        season: req.body.season
    });
    try{
        const songSaved = await song.save();
        res.status(200).send(songSaved);
        console.log(songSaved);
    }
    catch(err){
        res.status(500).json({message:err});
        console.log(err);
    }
});

// Delete song by id
app.delete('/delete/:_id', async(req,res)=>{
    try{
        await Song.findByIdAndDelete({_id:req.params._id});
        console.log(req.params._id+" deleted.");
        res.status(200).send(req.params._id+" deleted.");
    }
    catch(err){
        res.status(404).send("Couldn't delete song");
    }
});


// Find all playlists ---///
app.get('/findplaylists1', async (req,res)=>{
    const playlists = await Playlist.find({});
    res.send(playlists);
    console.log(playlists);
});

// Delete playlist by id
app.delete('/playlist/:_id', async (req,res)=>{
    await Playlist.deleteOne({_id:req.params._id}).then(res.sendStatus(200));
    console.log(req.params._id+" deleted.");
})

// Find playlists
app.get('/findplaylists', async (req,res)=>{
    const playlists = await Playlist.find({"private":"false"}).populate('createdBy','username');
    res.send(playlists);
    console.log(playlists);
});

// Find specific playlist to update
app.get('/playlisttoupdate/:_id', async (req,res) =>{
    const playlist = await Playlist.findOne({"_id":req.params._id}).populate('createdBy', 'username');
    res.send(playlist);
    console.log(playlist);
});


// Find and populate specific playlist
app.get('/playlist/:_id', async (req,res) =>{
    const playlist = await Playlist.findOne({"_id":req.params._id}).populate('songs').populate('createdBy', 'username');
    res.send(playlist);
    console.log(playlist);
});

// Update playlist songs
app.patch('/updateplaylist', async (req,res)=>{
    await Playlist.findOneAndUpdate({_id:req.body._id}, {$set:{songs:req.body.songs}}, options = {upsert:true}).then(res.sendStatus(200));
});

// Create playlist
app.post('/createplaylist', async (req,res)=>{
    const playlist = new Playlist({
        name:req.body.name,
        createdBy:req.body.uid,
        private:req.body.privacy,
        songs:req.body.songs
    })
    try{
        playlistSaved = await playlist.save();
        res.status(200).send(playlistSaved);
        console.log(playlistSaved);
    }
    catch(err){
        res.json({message:err});
        console.log(err);
    }
});

// Update song 
// app.patch('/updatesongs',async (req,res)=>{
//     await Song.updateMany({}, {$set:{typeNumber:1}}, options = {upsert:true});
// });

app.listen(PORT, () => console.log("App listening on port "+PORT));
