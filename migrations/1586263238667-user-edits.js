const  {user:userDocument,artist:artistDocument,album:albumDocument,track:trackDocument,playlist:playlistDocument,category:categoryDocument} = require('../models/DB');
const mongoose=require('mongoose');
mongoose.Promise=global.Promise;
// connect to db
const atlas ='mongodb+srv://nada:nada@spotifycluster-i2m7n.mongodb.net/Spotify?retryWrites=true&w=majority';
const localhost = 'mongodb://localhost:27017/test' ;
const bahaa ="mongodb+srv://bahaaEldeen:123@spotifycluster-i2m7n.mongodb.net/test?retryWrites=true&w=majority"
mongoose.connect(localhost,{  useNewUrlParser: true, useCreateIndex: true ,useUnifiedTopology:true});
mongoose.connection.once('open',()=>{
console.log("connection is made");
}).on('error',function(error){
console.log("connection got error : ",error);
});
let defaultUser = mongoose.Types.ObjectId();
let defaultTrack = mongoose.Types.ObjectId();
module.exports.up = async function (next) {
  await userDocument.find({},async (err,files)=>{
    console.log(files);
    if(err) throw err;
    for(let file of files){
        file.isFacebook = file.passeord ? false:true;
        if(!file.createPlaylist)file.createPlaylist = [];
        let newCreatePlaylist = [];
        for(let playlist of file.createPlaylist){
            newCreatePlaylist.push({
              playListId : playlist.playListId,
              isPrivate : true,
              collaboratorsId : playlist.collaboratorsId.map(x => x.id)

            })
        }
        file.createPlaylist = newCreatePlaylist
        if(!file.followPlaylist) file.followPlaylist = [];
        let newFollowPlaylist = [];
        for(let playlist of file.followPlaylist){
          newFollowPlaylist.push({
            isPrivate:false,
            playListId:playlist.playListId
          })
        }
        file.followPlaylist = newFollowPlaylist;
        if(file.playHistory)file.playHistory= [];
        for(let i=0;i<file.playHistory.length;i++){
          file.playHistory[i].addedAt = undefined;
          file.playHistory[i].type = undefined;
          file.playHistory[i].link = undefined;
          file.playHistory[i].sourceType = "playlist";
          file.playHistory[i].sourceId = defaultUser;

        }

        if(!file.queue) file.queue = {tracksInQueue:[]};
        for(let i=0;i<file.queue.tracksInQueue.length;i++){
          file.queue.tracksInQueue[i].isPlaylist = true;
          file.queue.tracksInQueue[i].playlistId = defaultUser;

        }
        if(!file.player) file.player = {};
        else{
          let currentTrackId = file.player.current_track
          let nextTrackId = file.player.next_track
          let prevTrackId = file.player.prev_track
          if(!(!currentTrackId || !nextTrackId || !prevTrackId)){

        file.player.current_track = {
          trackId: defaultTrack,
          isPlaylist:true,
          playListId:defaultUser
        }
        file.player.prev_track = {
          trackId: defaultTrack,
          isPlaylist:true,
          playListId:defaultUser
        }
        file.player.next_track = {
          trackId: defaultTrack,
          isPlaylist:true,
          playListId:defaultUser
        }
      }
      }
        await file.save();
    }
  })
  next()
}

module.exports.down = function (next) {
  next()
}
