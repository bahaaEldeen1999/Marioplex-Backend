const  {user:userDocument,artist:artistDocument,album:albumDocument,track:trackDocument,playlist:playlistDocument,category:categoryDocument} = require('../models/db');

const Track =  require('./track-api');

const Playlist =  require('./Playlist-api');

// initialize db 
const connection=require('../DBconnection/connection');
const bcrypt=require('bcrypt');

const User =  {
    

    getUserById : async function(userId){
        const user = await userDocument.findById(userId,(err,user)=>{
            if(err) return 0;
            return user;
        });
        
        return user;
    },

    update : async function(userID,Display_Name,Password,Email,Country){
        const user = await this.getUserById(userID);
        if(user){
            spotifySchema.user.findOne({email:req.body.email}).exec().then(User=>{
                
                    if(Display_Name!=undefined){
                        user.displayName=Display_Name;
        
                    }
                    if(Password!=undefined){
                        bcrypt.hash(Password,10,(err,hash)=>{
                            if(!err) {
                                user.password=hash;
                            }
                        })
                    }
                    if(Email!=undefined && !User){
                        user.email=Email;
                    }
                    if(Country!=undefined){
                        user.country=Country;
                    }
                    return 1;
                
            })
        }
        else return 0;
            
    
        
        
    },
    deleteAccount:async function(userID){
        const user = await this.getUserById(userID);
        if(!user){ return 0; }
        const User = await userDocument.find({follow:{id:user._id}},(err,User)=>{
            if(err) return 0;
            return User;
        });
        return User;
            
            
        
        
    },

    likeTrack: async function(userID,trackID){
            const user = await this.getUserById(userID);
            if(!user){ return 0; }
            const likeTrack = await Track.likeTrack(user,trackID).catch();
            return likeTrack;
    },

    unlikeTrack: async function (userID,trackID){

        const user = await this.getUserById(userID);
        if(!user){ return 0; }
        const unlikeTrack = await Track.unlikeTrack(user,trackID);
        return unlikeTrack;
    },
    addTrack: async function (user,trackID,playlistID){
        const Playlist = await playlist.findById(playlistID);
        const Track = await track.findById(trackID);
        if(!Playlist||!Track){ return 0; }
        if(Playlist.hasTracks){
            user.hasTracks.push({
                trackId: trackID
               
            });
            await Playlist.save();
            return 1;
            
        }
        Playlist.hasTracks = [];
        Playlist.hasTracks.push({
            trackId: trackID

        });
        await Playlist.save();
        return 1;



        
    },
    AddTrackToPlaylist: async function (userID,trackID,playlistID){
        const user = await this.getUserById(userID);
        const userplaylist= await user.createPlaylist.find({playListId:playlistID});
        if(!user||userplaylist){ return 0; }
        const addTrack = await this.addTrack(user,trackID,playlistID);
        return addTrack;
    },
    



    followPlaylist: async function(userID,playlistID){
        const user = await this.getUserById(userID);
        if(!user){ return 0; }
        return  Playlist.followPlaylist(user,playlistID);
     
    },

    unfollowPlaylist: async function(userID,playlistID){
        const user = await this.getUserById(userID);
        if(!user){ return 0; }
        return  Playlist.unfollowPlaylist(user,playlistID);
    },

    deletePlaylist:async  function (userID,playlistID){
            const user = await this.getUserById(userID);
            if(!user){ return 0; }
          
            const isDelete = await Playlist.deletePlaylist(user,playlistID);
            return isDelete;
          
    },
    createdPlaylist:async  function (userID,playlistName){
            const user = await this.getUserById(userID);
            // create new playlist
            const createdPlaylist = await Playlist.createPlaylist(playlistName)
            //add to user 
            if(user.createPlaylist){
                user.createPlaylist.push({
                    playListId: createdPlaylist._id,
                    addedAt:  Date.now() ,
                    isLocal : 'false' 
                });
                await user.save();
                return createdPlaylist;
                
            }
            user.createPlaylist = [];
            user.createPlaylist.push({
                playListId: createdPlaylist._id,
                addedAt: Date.now(),
                isLocal : 'false' 
            });
            await user.save().catch();
            return createdPlaylist;
    
        },
           
          

    checkmail: async function (email){
    
        let user=await userDocument.findOne({email:email});
        
        if(!user)
        {
            return false;
        }
        return user;
    },

    updateforgottenpassword: async function (user){
      
        let password=user.displayName+"1234";
        const salt=await bcrypt.genSalt(10);
        let hashed=await bcrypt.hash(password,salt);
            user.password=hashed;
        await user.save();
            return password;
    }

}

module.exports = User;


