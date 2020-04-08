const { user: userDocument, artist: artistDocument, album: albumDocument, track: trackDocument, playlist: playlistDocument, category: categoryDocument } = require('../models/db');
const spotify = require('../models/db');

const Track = require('./track-api');

/** @namespace */
const Artist = {
    /** 
     *  create an artist
     * @param  {object} user - the user who promote to artist 
     * @param  {string}  Info - information about new artist
     * @param {string} name  - the name of new artist if it is undefined his name will be user name
     * @param {Array<string>}  Genre - the artist's genres
     * @returns {object}  - artist object
     */
    //CREATE AN ARTIST - PARAMS: user-info-name-Genre
    createArtist: async function(user, Info, name, Genre) {
        var userName;
        //CHECK THE GIVEN NAME IF NULL THEN = USERNAME
        if (!name) userName = user.displayName;
        else userName = name;
        let artist = new artistDocument({
            info: Info,
            popularity: 0,
            genre: Genre,
            type: "Artist",
            Name: userName,
            userId: user._id,
            popularity: 0,
            images: [],
            addAlbums: [],
            addTracks: []

        });
        await artist.save();
        return artist;
    },
    /**
     * get popular artist 
     * @returns {JSON} json contain  Array of artists which is popular 
     */
    //GET THE POPULAR ARTIST BASED ON THE POPULARITY
    getPopularArtists: async function() {
        // with - is from big to small and without is from small to big
        var reArtists = []
        const artists = await artistDocument.find({}).sort('-popularity')
        if (artists) {
            var limit; // to limit the num of artists by frist 20 only but should check if num of albums less than 10  
            if (artists.length < 20) limit = artists.length;
            else limit = 20;
            for (let i = 0; i < limit; i++) {

                reArtists.push({ genre: artists[i].genre, type: 'artist', name: artists[i].Name, images: artists[i].images, id: artists[i]._id, info: artists[i].info });
            }
        }
        const reArtistsJson = { artists: reArtists };
        return reArtistsJson;
    },
    /**
     * check if artist has this album or not 
     * @param {string} artistId - the id of artist
     * @param {string} albumId  - the id of album
     * @returns {object} -if this artist not have any album return 0 else if this artist not has this album return undefined else return the object of  artist.addAlbums
     */
    //CHECK IF THE ARTIST HAS A SPECIFIC ALBUM - PARAMS: artistId,albumId
    checkArtisthasAlbum: async function(artistId, albumId) {
        if (await albumDocument.findById(albumId)) {
            const artist = await this.getArtist(artistId);
            if (!artist) return 0;
            if (artist.addAlbums) {
                return await artist.addAlbums.find(album => album.albumId == albumId);
            }
        }
        return 0;
    },
    /**
     * get artist by his id
     * @param {string} ArtistID -id of artist
     * @returns {object}  -of artist if not found return 0
     */
    //GET ARTIST - PARAMS : ArtistID
    getArtist: async function(ArtistID) {

        const artist = await artistDocument.findById(ArtistID, (err, artist) => {
            if (err) return 0;
            return artist;
        }).catch((err) => 0);
        return artist;
    },
    /**
     * add album to certain artist
     * @param {string} ArtistID -the id of artist
     * @param {string} Name - the name of album
     * @param {string} Label -label of album
     * @param {Array<string>} Avmarkets -the available markets of this album
     * @param {string} Albumtype - album type
     * @param {date} ReleaseDate  -the date this album release
     * @param {string} Genre  -the genre of this album
     * 
     * @returns {object} -of album
     */
    // CREATE ALBUM FOR AN ARTIST - PARAMS : ArtistID-Name,Label,Avmarkets,Albumtype,ReleaseDate,Genre
    addAlbum: async function(ArtistID, Name, Label, Avmarkets, Albumtype, ReleaseDate, Genre) {
        if (!await this.getArtist(ArtistID)) return 0;
        let spotifyAlbums = spotify.album;
        let album = await new spotifyAlbums({
            name: Name,
            albumType: Albumtype,
            popularity: 0,
            genre: Genre,
            releaseDate: ReleaseDate,
            availableMarkets: Avmarkets,
            label: Label,
            images: [],
            artistId: ArtistID,
            type: "Album",
            popularity: 0,
            hasTracks: []

        });
        await album.save(function(err, albumobj) {
            album = albumobj;
        });
        const artist = await artistDocument.findById(ArtistID);
        artist.addAlbums.push({
            albumId: album._id
        });
        await artist.save();
        return album;
    },
    /**
     * add track to certain album of certain artist
     * @param {string} ArtistID -the id of artist 
     * @param {string} trackid -the id of the new track
     * 
     */
    // CREATE TRACK FOR AN ARTIST -PARAMS : ArtistID,trackid
    addTrack: async function(ArtistID, trackid) {
        const artist = await artistDocument.findById(ArtistID);
        artist.addTracks.push({
            trackId: trackid
        });
        await artist.save();

    },
    /**
     * get artists
     * @param {Array<string>} artistsIDs - artists ids
     * @returns {Array<object>} - array of artists object  
     */
    // GET SEVERAL ARTISTS - params : artistsIDs  -ARRAY-
    getArtists: async function(artistsIDs) {
        let artists = [];
        for (let artistID of artistsIDs) {
            let artist = await this.getArtist(artistID);
            if (!artist) continue
            artists.push(artist);
        }
        return artists;
    },
    /**
     * get albums for certain artist
     * @param {string} artistID  - artist id 
     * @param {Array<string>} groups - the groups of album
     * @param {string} country -the country 
     * @param {Number} limit -the max number of albums
     * @param {Number} offset - the start number 
     * @returns {JSON} -contain array of albums 
     */
    // GET SPECIFIC ALBUMS - Params :artistID,groups,country,limit,offset
    getAlbums: async function(artistID, groups, country, limit, offset) {
        let SpecificAlbums = [];
        let albums = {};
        let artist = await this.getArtist(artistID);
        if (!artist) return 0;
        //GET ALL THE ALBUMS OF THIS ARTIST
        for (let i = 0; i < artist.addAlbums.length; i++) {
            albums[artist.addAlbums[i].albumId] = await albumDocument.findById(artist.addAlbums[i].albumId, (err, album) => {
                if (err) return 0;
                return album;
            }).catch((err) => 0);
        }
        //FILTER THE ALBUMS BASED ON THE INPUT
        if (groups != undefined && country != undefined) {
            for (let Album in albums) {
                if (groups.includes(albums[Album].albumType) && albums[Album].availableMarkets.includes(country)) {
                    SpecificAlbums.push(albums[Album]);
                }
            }
        } else if (groups == undefined && country != undefined) {
            for (let Album in albums) {
                if (albums[Album].availableMarkets.includes(country)) {
                    SpecificAlbums.push(albums[Album]);
                }
            }
        } else if (groups != undefined && country == undefined) {
            for (let Album in albums) {
                if (groups.includes(albums[Album].albumType)) {
                    SpecificAlbums.push(albums[Album]);
                }
            }
        } else {
            for (let Album in albums) {
                SpecificAlbums.push(albums[Album]);
            }
        }
        //HANDLE THE LIMIT - OFFSET FOR THE ARRAY
        let start = 0;
        let end = SpecificAlbums.length;
        if (offset != undefined) {
            if (offset >= 0 && offset <= SpecificAlbums.length) {
                start = offset;
            }
        }
        if (limit != undefined) {
            if ((start + limit) > 0 && (start + limit) <= SpecificAlbums.length) {
                end = start + limit;
            }
        }
        SpecificAlbums.slice(start, end);
        return SpecificAlbums;
    },
    /**
     * get related artists of an artist
     * @param {string} artistID  - id of artist
     * @returns {Array<object>} -array of artists
     */
    //GET RELATED ARTISTS TO A GIVEN ARTIST - Params: artistID
    getRelatedArtists: async function(artistID) {
        let Artists;
        artistDocument.find({}, function(err, artists) {
            Artists = artists;
        });
        let artist = await this.getArtist(artistID);
        if (!Artists) return 0;
        if (!artist) return 0;
        let RelatedArtists = [];
        //FILTER THE ARTISTS BASED ON THEIR GENRE
        for (let Artist in Artists) {
            for (var i = 0; i < Artists[Artist].genre.length; i++) {
                for (var j = 0; j < artist.genre.length; j++) {
                    if (Artists[Artist].genre[i] == artist.genre[j]) {
                        if (!RelatedArtists.find(artist1 => artist1._id == Artists[Artist]._id))
                            RelatedArtists.push(Artists[Artist]);
                        continue;
                    }
                }
            }
        }
        //HANDLE MAX NUMBER TO RETURN
        if (RelatedArtists.length > 20) RelatedArtists.slice(0, 20);
        return RelatedArtists;
    },
    /**
     * find the artist by user id
     * @param {string} userId -the id of user
     * @returns {object} -artist
     */
    //FIND THE CURRENT ARTIST USER - Params:userId
    findMeAsArtist: async function(userId) {

        const artist = await artistDocument.findOne({ userId: userId }, (err, artist) => {
            if (err) return 0;
            return artist;
        }).catch((err) => 0);
        return artist;
    },
    /**
     * get top tracks of artist
     * @param {string} artistID -the id of artist 
     * @param {string} country 
     * 
     * @returns {Array<objects>} 
     */
    // GET TOP TRACKS IN A COUNTRY FOR AN ARTIST
    getTopTracks: async function(artistID, country) {
        let TopTracks = [];
        let tracks = {};
        let artist = await this.getArtist(artistID);
        if (!artist) return 0;
        for (let i = 0; i < artist.addTracks.length; i++) {
            let track = await Track.getTrack(artist.addTracks[i].trackId);
            if (track) {
                tracks[artist.addTracks[i].trackId] = track;
                console.log(track);
            }
        }
        //FILTER TRACKS BASED ON THE COUNTRY
        for (let track in tracks) {
            if (tracks[track].availableMarkets.includes(country)) {
                TopTracks.push(tracks[track]);
            }
        }
        //SORT TRACKS BY popularity
        TopTracks.sort((a, b) => (a.popularity > b.popularity) ? -1 : 1);
        TopTracks.slice(0, 10);
        return TopTracks;
    },
    /**
     * get tracks 
     * @param {string} artistID -the id of artist
     * @returns {Array} -array has set of tracks   
     */
    //GET TRACKS FOR AN ARTIST - Params:artistID
    getTracks: async function(artistID) {
        let SpecificTracks = [];
        let tracks = {};
        let artist = await this.getArtist(artistID);
        if (!artist) return 0;
        for (let i = 0; i < artist.addTracks.length; i++) {
            let track = await Track.getTrack(artist.addTracks[i].trackId);
            if (track) { tracks[artist.addTracks[i].trackId] = track; }
        }
        for (let Track in tracks) {
            SpecificTracks.push(tracks[Track]);
        }
        return SpecificTracks;
    },
}

module.exports = Artist;