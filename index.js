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
const Anime = require('./models/Anime');
// const Anime = require('./models/Anime');
const DirectoryName = process.cwd().toString()+"/music/";
const auth = require('./auth');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
// const config = require('./config');

// app.use(fileUpload({
//     createParentPath: true
// }));



app.use(cors());
app.use(bodyParser.json());

app.use('/music',express.static(DirectoryName));

app.use('/signin',auth);

mongoose.connect('mongodb://localhost:27017/data', {useNewUrlParser: true},()=>{mongoose.connection.readyState ? console.log("Connected to DB...") : (console.log("Failed to connect to DB.."),()=> process.exit())});

app.get('/home',(req,res)=>{
    res.send("Hello from the backend!");
});

// Returns all songs
app.get('/all/:index',async (req,res)=>{
    let sendingSongs;
    try{
        const songs = await Song.find().sort({title:1}).populate('anime');
        sendingSongs = songs.slice(20*Number(req.params.index),(20*Number(req.params.index))+20);
        console.log(sendingSongs);
        res.send(sendingSongs);
        console.log("All");
    }
    catch(err){
        res.json({message:err});
        console.log(err);
    }
});

// Search specific song
app.get('/searchforpreview/:_id', async (req,res)=>{
    let song = await Song.findById({_id:req.params._id}).populate('anime');
    res.send(song);
})

// Returns searched songs
app.get('/search/:searchType/:query/:index', async (req,res)=>{
    let sendingSongs;
    let songs;
    let anime = [];
    try{
        switch(req.params.searchType){
            case "anime":
                // anime = await Anime.find({"nameENG":{$regex: req.params.query, $options: 'i'}},"_id"); // Add nameJP and merge

                let [animeNameENG, animeNameJP] = await Promise.all([Anime.find({"nameENG":{$regex: req.params.query, $options: 'i'}}, "_id"), Anime.find({"nameJP":{$regex: req.params.query, $options: 'i'}}, "_id")]);

                if(animeNameENG.length > 0 && animeNameJP.length > 0){
                    animeNameENG.concat(animeNameJP);
                    anime = animeNameENG;                    
                }
                else if(animeNameENG.length === 0 && animeNameJP.length > 0){
                    anime = animeNameJP;
                }
                else if(animeNameJP.length === 0 && animeNameENG.length > 0){
                    anime = animeNameENG;
                }

                let listOfIds = [];
                for(let i = 0; i < anime.length; i++){
                    await listOfIds.push(anime[i]._id);
                    console.log(anime[i]._id)
                }
                console.log(listOfIds);
                // console.log(anime);
                // anime = anime.toString;
                // anime = "Classroom of the Elite";
                // listOfIds = new RegExp(listOfIds);
                songs = await Song.find({"anime":listOfIds}).populate('anime'); 
                console.log(songs)
                // console.log(songs);
                // songs = await Song.lookup({
                //     path: 'anime',
                //     query: { 'nameENG' :  RegExp(req.params.query, 'i')}
                //   
                console.log("in anime")
                sendingSongs = songs.slice(20*req.params.index,(20*req.params.index)+20);

                res.send(sendingSongs);
                return;
            case "title":
                songs = await Song.find({"title":{$regex: req.params.query, $options: 'i'}}).populate('anime');
                
                sendingSongs = songs.slice(20*req.params.index,(20*req.params.index)+20);

                res.send(sendingSongs);
                return;
            case "artist":
                songs = await Song.find({"artist":{$regex: req.params.query, $options: 'i'}}).populate('anime');
                
                sendingSongs = songs.slice(20*req.params.index,(20*req.params.index)+20);

                res.send(sendingSongs);
                return;
            case "playlist":
                songs = await Playlist.find({"name":{$regex:req.params.query, $options: 'i'},"private":"false"}).populate('createdBy', 'username');
                
                sendingSongs = songs.slice(20*req.params.index,(20*req.params.index)+20);

                res.send(sendingSongs);
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
        season: req.body.season,
        imageURL:req.body.imageURL,
        xPos:req.body.xPos,
        yPos:req.body.yPos
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

// TESTING - Remove all playlists
// app.delete('/deleteallplaylists', async (req,res)=>{
//     const playlists = await Playlist.deleteMany({});
//     console.log("Deleted", playlists);
// });

// Find playlists
app.get('/findplaylists', async (req,res)=>{
    const playlists = await Playlist.find({"private":"false"}).populate('createdBy','username');
    res.send(playlists);
    console.log(playlists);
});

// Find specific playlist to update
app.get('/playlisttoupdate/:_id', async (req,res) =>{
    const playlist = await Playlist.findOne({"_id":req.params._id});
    res.send(playlist);
    console.log(playlist);
});


// Find and populate specific playlist
app.get('/playlist/:_id', async (req,res) =>{
    const playlist = await Playlist.findOne({"_id":req.params._id}).populate({path:"songs", populate:{path:"anime"}}).populate('createdBy', 'username');
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
app.patch('/updatesong',async (req,res)=>{
    const updateSong = await Song.findByIdAndUpdate({_id:req.body._id},{$set:req.body}, options = {upsert:true});
    res.sendStatus(200);
    console.log(updateSong);
});

// List all Anime
app.get('/searchanime', async (req,res)=>{
    const anime = await Anime.find({});
    res.send(anime);
    console.log(anime);
});

// Search for anime id/anime name for songs
app.get('/searchanime/:searchType/:query', async (req,res)=>{
    try{
        switch(req.params.searchType){
            case "_id":
                let anime = await Anime.findById({_id:req.params.query});
                res.status(200).send(anime);
                console.log(anime);
                break;
            case "name":
                let [animeNameENG, animeNameJP] = await Promise.all([Anime.find({"nameENG":{$regex: req.params.query, $options: 'i'}}), Anime.find({"nameJP":{$regex: req.params.query, $options: 'i'}})]);

                if(animeNameENG.length > 0 && animeNameJP.length > 0){
                    animeNameENG.concat(animeNameJP);
                    res.status(200).send(animeNameENG);                    
                }
                else if(animeNameENG.length === 0 && animeNameJP.length > 0){
                    res.send(animeNameJP);
                }
                else if(animeNameJP.length === 0 && animeNameENG.length > 0){
                    res.send(animeNameENG);
                }
                else{
                    res.sendStatus(404);
                }

                console.log(animeNameENG);
                console.log(animeNameJP);

                break;
       }
    }
    catch(err){
        res.sendStatus(404);
    }
});

// Update/add Anime
app.post('/updateanime', async (req,res)=>{
    if(req.body._id){
        try{
            if(req.body.nameENG || req.body.nameJP){
                const animeUpdated = await Anime.findByIdAndUpdate({_id:req.body._id},{$set:{nameENG:req.body.nameENG,nameJP:req.body.nameJP}}, options = {upsert:true});
                console.log(animeUpdated);
                res.sendStatus(200);
            }
        }
        catch(err){
            res.sendStatus(404);
        }
    }
    else{
        const anime = new Anime({
            nameENG:req.body.nameENG,
            nameJP:req.body.nameJP
        });
        try{
            animeSaved = await anime.save();
            res.status(200).send(animeSaved);
            console.log(animeSaved);
        }
        catch(err){
            res.json({message:err});
            console.log(err);
        }
    }
});

// Delete Anime
app.delete('/deleteanime/:_id', async(req,res)=>{
    let animeDeleted = await Anime.findByIdAndDelete({_id:req.params._id});
    console.log(animeDeleted);
});

app.listen(PORT, () => console.log("App listening on port "+PORT));
