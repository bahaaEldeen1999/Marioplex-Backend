const router = require('express').Router();
//var progress = require('progress-stream');
const crypto = require('crypto');
const path = require('path');
const Artist = require('../source/artist-api');
const Notifications = require('../source/notification-api');
const Track = require('../source/track-api');
const User = require('../source/user-api');
const Album = require('../source/album-api')
const { auth: checkAuth } = require('../middlewares/is-me');
const { auth: checkIfAuth } = require('../middlewares/check-if-auth');
const { content: checkContent } = require('../middlewares/content');
const { isArtist: checkType } = require('../middlewares/check-type');
const { upload: uploadTrack } = require('../middlewares/upload-tracks');
const checkID = require('../validation/mongoose-objectid');
const rateLimit = require("express-rate-limit");
// add rate limiting
const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 30

});
// get Artist - Path Params : artist_id
router.get('/Artists/:artist_id', limiter, async(req, res) => {
  async function getArtist(){  
    if (req.params.artist_id == undefined) { return res.status(403).send('Artist ID is undefined'); }
    const artistID = req.params.artist_id;
    //GET THE ARTIST WITH THE GIVEN ID
    const artist = await Artist.getArtist(artistID);
    //IF NO SUCH ARTIST RETURN 404 NOT FOUND ELSE RETURN STATUS 200 WITH THE ARTIST
    if (!artist) return res.status(404).send("");
    else return res.status(200).send(artist);
  }
  try{
    await getArtist();
}
catch(e){
    return res.status(500).send("some error occurred");
}
});

router.get('/Artists/numberOfFollowers/:id', limiter, async(req, res) => {
  async function getNumberOfFollowers()
  {
    if (req.params.id == undefined) { return res.status(403).send('Artist ID is undefined'); }
    const artistID = req.params.id;
    //GET THE ARTIST WITH THE GIVEN ID
    const followersPerday = await Artist.getArtistNumberOfFollowersInDay(artistID);
    const followersPerMonth = await Artist.getArtistNumberOfFollowersInMonth(artistID);
    const followersPerYear = await Artist.getArtistNumberOfFollowersInYear(artistID);
    //IF NO SUCH ARTIST RETURN 404 NOT FOUND ELSE RETURN STATUS 200 WITH THE ARTIST
    if (followersPerday==-1||followersPerMonth==-1||followersPerYear==-1) return res.status(404).send("");
    else return res.status(200).send({'numOfFollowers': [followersPerday,followersPerMonth,followersPerYear] });
  }
  try{
    await getNumberOfFollowers();
}
catch(e){
    return res.status(500).send("some error occurred");
}
});
// get Artists - Query Params : artists_ids
router.get('/Artists', limiter, async(req, res) => {
  async function getArtists(){  
    if (req.query.artists_ids == undefined) { return res.status(403).send('Artist IDs is undefined'); }
    //SPLIT THE GIVEN COMMA SEPERATED LIST OF ARTISTS IDS
    const artistsIDs = req.query.artists_ids.split(',');
    //GET AN ARRAY OF ARTISTS WITH THE GIVEN IDS
    const artists = await Artist.getArtists(artistsIDs);
    //IF THE ARRAY IS EMPTY RETURN 404 NOT FOUND ELSE RETURN THE ARTISTS OBJECTS ARRAY
    if (artists.length == 0) return res.status(404).send({ error: "artists with those id's are not found" });
    else return res.status(200).json(artists);
  }
  try{
    await getArtists();
}
catch(e){
    return res.status(500).send("some error occurred");
}
});

// get Albums - Path Params : artist_id -Query Params : Album Specifications
router.get('/Artists/:artist_id/Albums', limiter, async(req, res) => {
   async function getAlbums(){ 
    if (req.params.artist_id == undefined) { return res.status(403).send('Artist ID is undefined'); }
    //GET ARRAY OF ALBUMS FOR AN ARTIST WITH THE SPECIFICATIONS GIVEN
    const albums = await Artist.getAlbums(req.params.artist_id, req.query.groups, req.query.country, req.query.limit, req.query.offset);
    //IF THE ARRAY IS EMPTY RETURN 404 ELSE RETURN 200 WITH THE ALBUMS ARRAY
    if (albums.length == 0 || albums == 0) return res.status(404).send({ error: "albums with those specifications are not found" });
    else return res.status(200).json(albums);
   }
   try{
    await getAlbums();
}
catch(e){
    return res.status(500).send("some error occurred");
}
});
//get Tracks - Path Params : artist_id
router.get('/Artists/:artist_id/Tracks', checkIfAuth, limiter, async(req, res) => {
   async function getTracks(){ 
    if (req.params.artist_id == undefined) { return res.status(403).send('Artist ID is undefined'); }
    let user = undefined;
    if (req.isAuth) user = await User.getUserById(req.user._id);
    //GET THE GIVEN ARTIST TRACKS
    const tracks = await Artist.getTracks(req.params.artist_id, user);
    if (tracks.length == 0 || tracks == 0) return res.status(404).send({ error: "tracks are not found" });
    else return res.status(200).json(tracks);
   }
   try{
    await getTracks();
}
catch(e){
    return res.status(500).send("some error occurred");
}
});
// get RelatedArtists - Path Params : artist_id
router.get('/Artists/:artist_id/related_artists', limiter, async(req, res) => {
    async function getRelatedArtists(){
    if (req.params.artist_id == undefined) { return res.status(403).send('Artist ID is undefined'); }
    //GET THE RELATED ARTISTS BY GENRE TO THE GIVEN ARTIST
    const artists = await Artist.getRelatedArtists(req.params.artist_id);
    //RETURN 404 IF EMPTY ELSE RETURN THE ARTISTS
    if (artists.length == 0 || artists == 0) return res.status(404).send({ error: "no artists are found" });
    else return res.status(200).json(artists);
    }
    try{
        await getRelatedArtists();
    }
    catch(e){
        return res.status(500).send("some error occurred");
    }
});

// get Top Tracks - Path Params : artist_id
router.get('/Artists/:artist_id/top-tracks', checkIfAuth, limiter, async(req, res) => {
    async function getTopTracks(){
    if (req.params.artist_id == undefined) { return res.status(403).send('Artist ID is undefined'); }
    if (req.query.country == undefined) { return res.status(403).send('country code is Required'); }
    let user = undefined
    if (req.isAuth) user = await User.getUserById(req.user._id);
    //GET THE TOP TRACKS OF AN ARTIST IN A SPECIFIC COUNTRY
    const tracks = await Artist.getTopTracks(req.params.artist_id, req.query.country, user);
    if (tracks.length == 0 || tracks == 0) return res.status(404).send({ error: "no top tracks in this country are not found" });
    else return res.status(200).json(tracks);
    }
    try{
        await getTopTracks();
    }
    catch(e){
        return res.status(500).send("some error occurred");
    }
});
// create album 
router.put('/Artists/me/Albums', [checkAuth, limiter, checkType, checkContent], async(req, res) => {
async function createAlbum(){
    if (req.body.name == undefined || req.body.label == undefined || req.body.availablemarkets == undefined || req.body.albumtype == undefined || req.body.releaseDate == undefined || req.body.genre == undefined) { return res.status(403).send('Missing Data in the Album Data'); }
    if (req.body.name == "" || req.body.label == "" || req.body.availablemarkets == "" || req.body.albumtype == "" || req.body.releaseDate == "" || req.body.genre == "") { return res.status(403).send('Missing Data in the Album Data'); }
    let avMarkets = req.body.availablemarkets.split(',');
    //GET THE CURRENT ARTIST USER
    const artist = await Artist.findMeAsArtist(req.user._id);
    //ADD AN ALBUM TO THIS USER
    const artistAlbum = await Artist.addAlbum(artist._id, req.body.name, req.body.label, avMarkets, req.body.albumtype, req.body.releaseDate, req.body.genre);
    if (!artistAlbum) return res.status(404).send(" ");
    else {
        Notifications.sendArtistAlbumNotification(artist, artistAlbum);
        return res.status(200).send(artistAlbum);
    }
}
try{
    await createAlbum();
}
catch(e){
    return res.status(500).send("some error occurred");
}
});
router.delete('/artist/:album_id', [checkAuth, limiter, checkType, checkContent], async(req, res) => {
    async function deleteAlbum(){
    if (!checkID([req.params.album_id])) return res.status(403).send({ error: 'id not correct ! ' })
    const deleteAlbums = await Album.deleteAlbum(req.user._id, req.params.album_id);
    if (deleteAlbums) return res.status(200).send({ success: 'deleted album ' })
    else return res.status(400).send({ error: 'can not delete ' })
    }
    try{
        await deleteAlbum();
    }
    catch(e){
        return res.status(500).send("some error occurred");
    }

})

// upload tracks - Path Params : album_id
router.post('/artists/me/albums/:album_id/tracks', checkAuth, limiter, checkType, async(req, res) => {
    req.socket.setTimeout(10000 * 60 * 1000); // to not cause server time out
    if (req.params.album_id == undefined) { return res.status(403).send('Album ID is undefined'); }
    if (req.query.name == undefined || req.query.trackNumber == undefined || req.query.availableMarkets == undefined || req.query.duration == undefined) { return res.status(403).send('Missing Data in the Track Data'); }
    if (req.query.name == "" || req.query.trackNumber == "" || req.query.availableMarkets == "" || req.query.duration == "") { return res.status(403).send('Missing Data in the Track Data'); }
    // only artist upload songs
    const artist = await Artist.findMeAsArtist(req.user._id);
    if (!artist) { res.status(403).json({ "error": "not an artist" }); return 0; };
    if (await Artist.checkArtisthasAlbum(artist._id, req.params.album_id)) {
        // encrypt file name and send it to request to multer
        let filename = crypto.randomBytes(16, async(err, buf) => {
            if (err) {
                return 0;
            }


            return filename = buf.toString('hex') + path.extname(req.query.name);
        });
        let availableMarkets = req.query.availableMarkets ? req.query.availableMarkets.split(",") : [];
        // set up key and keyId to be base64 string
        let key = Buffer.from(req.query.key, 'hex').toString('base64').replace(/\+/g, "-").replace(/\//g, "_").replace(/=*$/, "");
        let keyId = Buffer.from(req.query.keyId, 'hex').toString('base64').replace(/\+/g, "-").replace(/\//g, "_").replace(/=*$/, "");
        const genres = req.query.genres ? req.query.genres.split(",") : [];
        const track = await Track.createTrack(String(filename), req.query.name, Number(req.query.trackNumber), availableMarkets, artist._id, req.params.album_id, Number(req.query.duration), key, keyId, genres);
        if (!track) { res.status(404).send("cannot create track in tracks"); return 0; }
        const addTrack = await Artist.addTrack(artist._id, track._id);
        if (!addTrack) { res.status(404).send("cannot create track in artist"); return 0; }
        const addTrackAlbum = await Album.addTrack(req.params.album_id, track);
        if (!addTrackAlbum) { res.status(404).send("cannot create track in album"); return 0; }
        req.trackID = track._id;
        req.filename = filename;
        let isUploaded = 0;
        // upload track
        uploadTrack.fields([{ name: "high" }, { name: "medium" }, { name: "low" }, { name: "review" }, { name: "high_enc" }, { name: "medium_enc" }, { name: "low_enc" }])(req, res, async(err) => {
            if (err) {
                await Track.deleteTrack(req.user._id, track._id);
                res.status(403).send({ "error": err.error });
                isUploaded = -1;
                return 0;
            } else {
                Notifications.sendArtistNotification(artist, track);
                res.status(200).json({ "success": "uploaded succesfully" });
                isUploaded = 1;

            }
        });

        let uploadInterval = setInterval(function() {
            if (isUploaded != 1) {
                console.log('still uploading.....')

            } else {
                console.log('end update')

                clearInterval(uploadInterval);
            }
        }, 1000)

    } else {
        res.status(403).send({ "error": "artist doesnt own the album" })
    }
})

// update artist details 
router.put('/Artist/update', [checkAuth, limiter, checkType, checkContent], async(req, res) => {
   async function updateArtist(){
    let genre;
    if (req.body.genre) genre = req.body.genre.split(',');
    const artist = await Artist.updateArtist(req.user._id, req.body.name, genre, req.body.info);
    if (artist) res.status(200).send(artist);
    else res.status(400).send({ error: "can not update " });
   }
   try{
    await updateArtist();
}
catch(e){
    return res.status(500).send("some error occurred");
}
});

//CLAIM USER TO ARTIST
router.post('/me/ToArtist', checkAuth, limiter, async(req, res) => {
    async function claimUser(){
    if (req.body.genre && req.body.genre != "") {
        let genre = req.body.genre.split(',');
        //SEND THE REQUEST IF THE USER IS ALREADY AN ARTIST THEN RETURN 403 ELSE RETURN 200
        let isartist = await User.promoteToArtist(req.user._id, req.body.info, req.body.name, genre);
        if (!isartist) { return res.status(403).send("sorry you can't be an Artist"); }
        return res.status(200).send("Artist Succeded");
    } else return res.status(403).send("should give me genre");
    }
    try{
        await claimUser();
    }
    catch(e){
        return res.status(500).send("some error occurred");
    }
});

//GET USER AS ARTIST
router.get('/me/artist', [checkAuth, checkType], limiter, async(req, res) => {
async function getUserArtist(){
    let artist = await Artist.findMeAsArtist(req.user._id);
    if (!artist) { return res.status(404).send("NO SUCH ARTIST"); }
    return res.status(200).send(artist);
}
try{
    await getUserArtist();
}
catch(e){
    return res.status(500).send("some error occurred");
}
});
module.exports = router;