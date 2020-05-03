const router = require('express').Router();

const Artist = require('../public-api/artist-api');
const Album = require('../public-api/album-api');
const Player = require('../public-api/player-api');
const User = require('../public-api/user-api');
const Playlist = require('../public-api/playlist-api');
const Recommendation = require('../public-api/recommendation-api');
const { auth: checkAuth } = require('../middlewares/is-me');
const rateLimit = require("express-rate-limit");
// add rate limiting
const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 30

});
// to get new-releases albums
router.get('/browse/new-releases', limiter, async(req, res) => {
    const new_releases = await Album.getNewReleases();
    if (!new_releases) res.status(400).send('can not get albums');
    else res.send(new_releases);

});
// to get genre
router.get('/browse/genre', limiter, async(req, res) => {
    const genre = await Browse.getGenreList();
    if (!genre) res.status(400).send('can not get albums');
    else res.send(genre);

});

// to get popular albums
router.get('/browse/popular-albums', limiter, async(req, res) => {
        const popularAlbums = await Album.getPopularAlbums();
        if (!popularAlbums) res.status(400).send('can not get albums');
        else res.send(popularAlbums);
    })
    // to get popular artists
router.get('/browse/popular-artists', limiter, async(req, res) => {
        const popularArtist = await Artist.getPopularArtists();
        if (!popularArtist) res.status(400).send('can not get albums');
        else res.send(popularArtist);
    })
    // to get popular playlists
router.get('/browse/popular-playlists', limiter, async(req, res) => {
        const popularPlaylists = await Playlist.getPopularPlaylists();
        if (!popularPlaylists) res.status(400).send('can not get albums');
        else res.send(popularPlaylists);
    })
    // to get recently-playing
router.get('/browse/recently-playing', checkAuth, limiter, async(req, res) => {
    const user = await User.getUserById(req.user._id);
    if (user) {
        const recentlyPlaying = await Player.getRecentlyHomePage(user);
        if (!recentlyPlaying) res.status(400).send('do not have a recently playing');
        else res.send(recentlyPlaying);
    } else res.status(400).send('not user');
})

    // to get similar-tracks
    router.get('/browse/madeforyou', checkAuth, limiter, async(req, res) => {
        const user = await User.getUserById(req.user._id);
        if (user) {
            const tracks = await Recommendation.getSimilarTracks(user);
            if (!tracks||tracks.length==0) res.status(404).send('No similar tracks found');
            else res.status(200).send(tracks);
        } else res.status(400).send('not user');
    })

module.exports = router;