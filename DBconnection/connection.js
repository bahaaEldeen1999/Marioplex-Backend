const mongoose=require('mongoose');
mongoose.Promise=global.Promise;
const spotify=require('../models/db');

mongoose.Promise=global.Promise;

module.exports= function(app){
    const atlas = "mongodb+srv://Spotify:spotifyapp@spotifycluster-i2m7n.mongodb.net/Spotify?retryWrites=true&w=majority";
    mongoose.connect('mongodb://localhost:27017/test' ,{ useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });
    mongoose.connection.once('open',()=>{
    console.log("connection is made");
    }).on('error',function(error){
    console.log("connection got error : ",error);
    });

};


