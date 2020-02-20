const express = require('express');
const auth = express.Router();

const Account = require('./models/Account');
const Playlist = require('./models/Playlist');

auth.get('/', async (req,res)=>{
    console.log("Reached auth.js");
    res.send(await Account.find({}));
});

// Check login
auth.post('/login', async (req,res)=>{
    try{
        let result = await Account.find({"email":req.body.email,"password":req.body.pass}).populate({path:"playlists", populate:{path:"songs"}});
        // await console.log(result)
        if(result == null || result.length < 1){
            console.log("Failed to log in",req.body.email,req.body.pass);
            res.sendStatus(404);
        }
        else{
            console.log(result);
            if(result[0].admin == true){
                console.log("yes.")
                // result.push({'react_admin':"<UploadSong /><DeleteSong />"});
                console.log(result)
            }
            res.status(200).send(result);
        }
    }   
    catch(err){
        console.log(err);
        res.send("Error");
    }
});

// Add admin
auth.patch('/adminify/:_id',async (req,res)=>{
    await Account.findOneAndUpdate({_id:req.params._id}, {$set:{admin:true}});
    res.send(200);
    console.log(req.params._id,"is an admin now.");
});

// Create account
auth.post('/register', async (req,res)=>{
    const account = new Account({
        username:req.body.name,
        email:req.body.email,
        admin:req.body.admin,
        password:req.body.pass
    });
    try{
        const accountSaved = await account.save();
        res.sendStatus(200);
        console.log(accountSaved);
    }
    catch(err){
        res.sendStatus(500);
        console.log(err);
    }
});

// Delete account by id
auth.delete('/delete/:_id', async (req,res) =>{
    await Account.deleteOne({_id:req.params._id});
    console.log(req.params._id+" deleted.");
});

// Add playlist to account
auth.patch('/addplaylist', async (req,res)=>{
    await Account.findOneAndUpdate({_id:req.body._id}, {$push:{playlists:req.body.playlist}}, options = {upsert:true});
    res.sendStatus(200);
    console.log("Added playlist :",req.body.playlist);
});

// Remove playlist from account
auth.patch('/removeplaylistfromaccount', async (req,res)=>{
    await Account.findOneAndUpdate({_id:req.body._id},{$pull:{'playlists':req.body.playlistID}});
    res.sendStatus(200);
    console.log("Removed playlist", req.body.playlistID, "from", req.body._id);
});

module.exports = auth;