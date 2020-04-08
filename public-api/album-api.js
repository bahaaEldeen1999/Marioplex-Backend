const { user: userDocument, artist: artistDocument, album: albumDocument, track: trackDocument, playlist: playlistDocument, category: categoryDocument } = require('../models/db');


// initialize db 
const connection = require('../db-connection/connection');
const User = require('./user-api');
const track = require('./track-api');
const artist = require('./artist-api');
/** @namespace */
const Album = {
    /**
     * add track to album
     * @param {string} AlbumId - album id
     * @param {object} Track
     *   
     */
    // add tack to album 
    addTrack: async function(AlbumId, Track) {
        const album = await albumDocument.findById(AlbumId);
        if (album) {
            album.hasTracks.push({
                trackId: Track._id
            });
            await album.save();
        }
    },
    /**
     * get album by id
     * @param {string} albumID  -the id of album
     * 
     * @returns {object} -album object  
     */
    // get album by id
    getAlbumById: async function(albumID) {

        // connect to db and find album with the same id then return it as json file
        // if found return album else return 0
        let album = await albumDocument.findById(albumID, (err, album) => {
            if (err) return 0;
            return album;
        }).catch((err) => 0);
        return album;


    },
    /**
     * get new releases
     * @returns {JSON} -contain array of albums object
     */
    // new releases for home page 
    getNewReleases: async function() {
        // with - is from big to small and without is from small to big
        var reAlbums = []
        const albums = await albumDocument.find({}).sort('-releaseDate')
        if (albums) {
            var limit; // to limit the num of albums by frist 10 only but should check if num of albums less than 10  
            if (albums.length < 20) limit = albums.length;
            else limit = 20;

            for (let i = 0; i < limit; i++) {
                const artist1 = await artist.getArtist(albums[i].artistId);
                reAlbums.push({ album_type: albums[i].albumType, artist: { type: 'artist', id: albums[i].artistId, name: artist1.Name }, available_markets: albums[i].availableMarkets, images: albums[i].images, id: albums[i]._id, name: albums[i].name, type: 'album' });
            }
        }
        const reAlbumsJson = { albums: reAlbums };
        return reAlbumsJson;
    },
    /**
     * get popular albums
     * @returns {JSON} -contain array of albums object
     */
    getPopularAlbums: async function() {
        // with - is from big to small and without is from small to big
        var reAlbums = []
        const albums = await albumDocument.find({}).sort('-popularity')
        if (albums) {
            var limit; // to limit the num of albums by frist 20 only but should check if num of albums less than 10  
            if (albums.length < 20) limit = albums.length;
            else limit = 20;
            for (let i = 0; i < limit; i++) {
                const artist1 = await artist.getArtist(albums[i].artistId);
                reAlbums.push({ album_type: albums[i].albumType, artist: { type: 'artist', id: albums[i].artistId, name: artist1.Name }, available_markets: albums[i].availableMarkets, images: albums[i].images, id: albums[i]._id, name: albums[i].name, type: 'album' });
            }
        }
        const reAlbumsJson = { albums: reAlbums };
        return reAlbumsJson;
    },
    /**
     * get album with artist info &if user saved this album or not 
     * @param {string} albumID - the id of album
     * @param {string} userID  -the id of user
     * @returns {object} -album object contain its artist info 
     */
    // get album artist
    getAlbumArtist: async function(albumID, userID) {

        // connect to db and find album with the same id then return it as json file
        // if found return album else return 0

        let album = await this.getAlbumById(albumID);
        let albumInfo = {}
        let user = await userDocument.findById(userID);
        if (user) {
            let isSaved = await this.checkIfUserSaveAlbum(user, albumID);
            if (isSaved) {
                albumInfo['isSaved'] = true;
            } else {
                albumInfo['isSaved'] = false;
            }

        }
        if (album) {
            let Artist = await artist.getArtist(album.artistId);
            let track = await this.getTracksAlbum(albumID);
            albumInfo['_id'] = album._id;
            albumInfo['name'] = album.name;
            albumInfo['images'] = album.images;
            if (Artist) {
                albumInfo['artistId'] = Artist._id;
                albumInfo['artistName'] = Artist.Name;
            }
            if (track) {
                albumInfo['track'] = track;
            } else {
                albumInfo['track'] = []
            }
            return albumInfo;
        } else {
            return 0;
        }
    },
    /**
     * find the order of track in album
     * @param {string} trackId -the id of track
     * @param {object} album -album object
     * @returns {Number} -the index of track in album
     *  
     */
    // the order of track in album 's tracks
    findIndexOfTrackInAlbum: async function(trackId, album) {
        for (let i = 0; i < album.hasTracks.length; i++) {
            if (album.hasTracks[i].trackId == trackId) return i;
        }
        return -1
    },
    /**
     * get several albums
     * @param {Array<string>} albumIds -array of albums ids 
     * @returns {Array} -contain set has albums object 
     */
    // get several albums by ids
    getAlbums: async function(albumIds) {

        // connect to db and find album with the same id then return it as json file
        // if found return album else return 0

        var Album = []
        if (albumIds == undefined) return 0;
        for (var i = 0; i < albumIds.length; i++) {
            var album = await this.getAlbumById(albumIds[i]);
            if (album) {
                Album.push(album)
            }
        }
        if (Album.length > 0) {
            AlbumWithArtist = []
            for (let i = 0; i < Album.length; i++) {
                let Artist = await artist.getArtist(Album[i].artistId);
                if (Artist) {
                    AlbumWithArtist.push({ Album: Album[i], Artist: Artist });
                }
            }
            return AlbumWithArtist;
        } else {
            return 0;
        }
    },
    /**
     * get album's tracks 
     * @param {string} albumID  - the id of album
     * @param {object} user -user object 
     * @returns {Array} -contain set has tracks
     */
    //  get tracks of an album
    getTracksAlbum: async function(albumID, user) {

        // connect to db and find album with the same id then return it as json file
        // if found return album else return 0
        const Tracks = [];
        const album = await this.getAlbumById(albumID);
        if (!album) {
            return 0;
        } else {

            for (i = 0; i < album.hasTracks.length; i++) {
                var Track = await track.getTrack(album.hasTracks[i].trackId);
                if (Track) {
                    let track = {}
                    track['_id'] = Track._id;
                    track['name'] = Track.name;
                    track['images'] = Track.images;
                    Tracks.push(track);
                }
            }
        }
        if (Tracks.length == 0) {
            return 0;
        }
        return Tracks;



    },
    /**
     * check if user followed this album 
     * @param {object} user 
     * @param {string} albumID 
     * @returns {object}
     */
    //user like track by track-id
    //params : user , track-id
    checkIfUserSaveAlbum: function(user, albumID) {
        const albumsUserSaved = user.saveAlbum;
        // if user.like.contains({track_id:track.track_id})
        if (albumsUserSaved) {
            return albumsUserSaved.find(album => album.albumId == albumID);
        }
        return 0;
    },
    //user save track by album-id
    //params : user , album-id
    /**
     * save album (make user follow an album)
     * @param {object} user 
     * @param {string} albumID 
     */
    saveAlbum: async function(user, albumID) {
        // check if user already saved the album
        // if not found then add album.album_id to user likes and return the updated user
        // else return 0 as he already saved the album
        if (albumID == undefined) return 2;
        let albums = [];
        for (let j = 0; j < albumID.length; j++) {
            let album = await this.getAlbumById(albumID[j]);
            if (album) {
                albums.push(albumID[j]);
            }
        }
        if (albums.length == 0) { return 2; }
        let count = 0;
        for (let i = 0; i < albums.length; i++) {
            if (this.checkIfUserSaveAlbum(user, albums[i]) == undefined) {
                if (user.saveAlbum) {
                    user.saveAlbum.push({
                        albumId: albums[i],
                        savedAt: Date.now()
                    });
                    await user.save();
                } else {
                    user.saveAlbum = [];
                    user.saveAlbum.push({
                        albumId: albums[i],
                        savedAt: Date.now()
                    });
                    await user.save();
                }
            } else { count++; }
        }
        if (count == albums.length) {
            return 0;
        }
        return 1;
    },
    /**
     * unsave album (make user unfollow an album)
     * @param {object} user 
     * @param {string} albumID 
     */

    unsaveAlbum: async function(user, albumID) {
        // check if user already saved the album
        // if not found then add album.album_id to user likes and return the updated user
        // else return 0 as he already saved the album
        let found = false;
        if (albumID == undefined) return 0;
        for (let j = 0; j < albumID.length; j++) {
            if (this.checkIfUserSaveAlbum(user, albumID[j])) {
                found = true;
                for (let i = 0; i < user.saveAlbum.length; i++) {
                    if (user.saveAlbum[i].albumId == albumID[j]) {
                        user.saveAlbum.splice(i, 1);
                    }
                }
                await user.save().catch();
            } else {
                if ((!found && (j == (albumID.length - 1))) || (albumID.length == 1)) {
                    return 0;
                }
            }
        }
        return 1;
    }
}
module.exports = Album;