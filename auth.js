const express = require('express');
const auth = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verify = require('./verifyToken');
const Account = require('./models/Account');
const Playlist = require('./models/Playlist');
const Key = require('./models/Key');

require('dotenv').config();


auth.get('/keys', async (req,res)=>{
    res.send(await Key.find({}));
});

auth.get('/', async (req,res)=>{
    console.log("Reached auth.js");
    res.send(await Account.find({}));
});

auth.delete('/removetoken', async (req,res)=>{
    let token = req.header('ltoken');
    token = token.slice(1,token.length-1);
    console.log("TOKEN TO REMOVE :", token);
    let user = jwt.verify(token, process.env.TOKEN)
    await Key.findOneAndUpdate({_id:user._id},{$set:{ltoken:""}});
    res.send(200);
});

// Check login
auth.post('/login', verify, async (req,res)=>{
    if(req.user){
        console.log("got to here", req.user)
        const user = await Account.findById(req.user._id).select("-password").populate({path:"playlists", populate:{path:"songs"}});
        // const atoken = await jwt.sign({_id: user._id}, accountOfKeys.rtoken, {expiresIn: "15"});
        console.log(user)
        return res.send(user);
    }

    try{
        let result = await Account.find({"email":req.body.email}).populate({path:"playlists", populate:{path:"songs"}});
        if(result.length < 1) return res.sendStatus(404);
        console.log(result)
        const validPass = await bcrypt.compare(req.body.pass, result[0].password);
        console.log(validPass)
        if(!validPass) return res.status(400).send('Password is wrong');
        
        // await console.log(result)
        if(result == null || result.length < 1){
            console.log("Failed to log in",req.body.email,req.body.pass);
            return res.sendStatus(404);
        }
        else{
            console.log(result);
            // if(result[0].admin == true){
            //     console.log("yes.")
            //     // result.push({'react_admin':"<UploadSong /><DeleteSong />"});
            //     console.log(result)
            // }
            // res.status(200).send(result);
            
            const ltoken = await jwt.sign({_id: result[0]._id}, "h7za01NXT37WQvlXF7j22L7egV96M5eWLtObmK0HYvW1LMKgI21iiV2wuap2D7k", {expiresIn: "31557600"});
            // const rtoken = await jwt.sign({_id: result[0]._id}, "h7za01NXT37WQvlXF7j22L7egV96M5eWLtObmK0HYvW1LMKgI21iiV2wuap2D7k");
            const keyExists = await Key.findById(result[0]._id);

            let accountOfKeys;

            if(!keyExists){
                const key = new Key({_id:result[0]._id, ltoken: ltoken});
                 const keySaved = await key.save(); 
                 accountOfKeys = keySaved;
            }
            else {
                // await Key.findOneAndUpdate({_id:result[0]._id},{$push:{keys:ltoken,rtoken}});
                await Key.findOneAndUpdate({_id:result[0]._id},{$set:{ltoken: ltoken}});
                accountOfKeys = await Key.findOne({_id:result[0]._id});
            }

            console.log(ltoken)
            
            // const atoken = await jwt.sign({_id: accountOfKeys._id}, accountOfKeys.rtoken, {expiresIn: "15"});

            if(req.body.stayLoggedIn) res.header('ltoken',ltoken).json([{_id:result[0]._id,email:result[0].email, playlists:result[0].playlists, admin:result[0].admin, username:result[0].username}]);
            else res.json([{_id:result[0]._id,email:result[0].email, playlists:result[0].playlists, admin:result[0].admin, username:result[0].username}]);
            // if(req.body.stayLoggedIn) res.header('atoken',atoken).cookie('ltoken',ltoken, {expires: new Date(Date.now() + 31557600), httpOnly: true}).json([{_id:result[0]._id,email:result[0].email, playlists:result[0].playlists, admin:result[0].admin, username:result[0].username}]);
            // else res.header('atoken',atoken).cookie('ltoken',ltoken, {httpOnly: true}).json([{_id:result[0]._id,email:result[0].email, playlists:result[0].playlists, admin:result[0].admin, username:result[0].username}]);
            // res.send("Hello world")
            // .header({'auth-token':token})
            
            // .json([{_id:result[0]._id, email:result[0].email, playlists:result[0].playlists, admin:result[0].admin, username:result[0].username}]);
        }
    }   
    catch(err){
        console.log(err);
        // res.send("Error");
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

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.pass,salt);

    const emailExists = await Account.find({email:req.body.email});
    if(emailExists.length > 0) return res.sendStatus(400);

    const account = new Account({
        username:req.body.name,
        email:req.body.email,
        admin:req.body.admin,
        password:hashedPassword
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
    await Playlist.deleteMany({createdBy:req.params._id});
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