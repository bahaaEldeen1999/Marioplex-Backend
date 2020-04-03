const router = require('express').Router();

const Artist =require('../public-api/Artist-api');
const Album =require('../public-api/album-api');
const Track =require('../public-api/track-api');
const User = require('../public-api/user-api');
const Playlist =require('../public-api/playlist-api');
const {auth:checkAuth} = require('../middlewares/isMe');
const {content:checkContent} = require('../middlewares/content');
const {isArtist:checkType} = require('../middlewares/check-type');
const {upload:uploadTrack} = require('../middlewares/upload');


router.get('/browse/new-releases',async (req,res)=>{
   const new_releases = await Album. getNewReleases();
    if(!new_releases) res.status(400).send('can not get albums');
    else res.send(new_releases);
 
 }) 

 
router.get('/browse/popular-albums',async (req,res)=>{
    const popularAlbums = await Album.getPopularAlbums();
     if(!popularAlbums) res.status(400).send('can not get albums');
     else res.send(popularAlbums);
  }) 
  
router.get('/browse/popular-artists',async (req,res)=>{
    const popularArtist = await Artist.getPopularArtists();
     if(!popularArtist) res.status(400).send('can not get albums');
     else res.send(popularArtist);
  }) 
  
router.get('/browse/popular-playlists',async (req,res)=>{
    const popularPlaylists = await Playlist.getPopularPlaylists();
     if(!popularPlaylists) res.status(400).send('can not get albums');
     else res.send(popularPlaylists);
  }) 
 
module.exports = router;