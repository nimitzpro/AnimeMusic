const jwt = require('jsonwebtoken');
const Key = require('./models/Key');

module.exports = async function(req,res,next){
    let token = req.header('ltoken');
    // let atoken = req.header('atoken');
    if(token){
    // if(!token) return res.status(401).send("Access denied");
    try{
        token = token.slice(1,token.length-1);
        console.log("receiving token", token)
            const inDB = await Key.findOne({ltoken:token});
            if(inDB.length < 1){
            }
            else{
                if(inDB.ltoken === token){
                    req.user = inDB;
                }
                else{
                    req.user = false;
                }
            }
        // }
        console.log("test",req.user)
        next();
    }
    catch(err){
        // res.status(400).send("Invalid token");
        console.log(err);
        next();
        // next();
    }
}
else{
    next();
}
}