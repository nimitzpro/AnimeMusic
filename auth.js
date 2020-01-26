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
        if(result == null || result == []){
            res.sendStatus(404).send("Email or password incorrect.");
        }
        else{
            res.send(result);
        }
    }   
    catch(err){
        console.log(err);
        res.send("Error");
    }
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
        res.send(accountSaved);
        console.log(accountSaved);
    }
    catch(err){
        res.json({message:err});
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

module.exports = auth;