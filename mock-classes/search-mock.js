const album_api = require('./album-mock')
var FuzzySearch = require('fuzzy-search');
const MockSearch = {
        Users: [],
        Artist: [],
        Tracks: [],
        Albums: [],
        Playlists: [],
        getUserByname: function(name) {

            if (this.Users.length == 0) return 0;
            return Fuzzysearch(name, 'displayName', this.Users);

        },

        //get top result by search name
        //params: Name
        getTop: function(Name) {

            const artist = this.getArtistProfile(Name);
            //console.log(artist)
            if (artist) {
                return artist[0]._id
            }
            return 0;

        },
        //search for an exact match of the name sent
        //params: array, name
        exactmatch: function(array, name) {

            let firstname;
            for (let i = 0; i < array.length; i++) {
                subname = array[i].Name.split(' ');
                firstname = subname[0];
                if (firstname == name) {
                    return array[i]._id;
                }
            }
            return 0;

        },

        //get all albums with the name albumName
        //params: albumName, groups, country, limit, offset
        getAlbums: function(artistID, groups, country, limit, offset) {
            let SpecificAlbums = [];
            let albums = {};
            let artist = this.getArtist(artistID);
            if (!artist) return 0;
            //GET ALL THE ALBUMS OF THIS ARTIST
            for (let i = 0; i < artist.addAlbums.length; i++) {
                albums[artist.addAlbums[i].albumId] = this.getAlbumById(artist.addAlbums[i].albumId);
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
        getTracksAlbum: function(albumID) {

            // connect to db and find album with the same id then return it as json file
            // if found return album else return 0
            const Tracks = [];
            const album = this.getAlbumById(albumID);
            if (!album) {
                return 0;
            } else {

                for (i = 0; i < album.hasTracks.length; i++) {
                    var Track = this.getTrack(album.hasTracks[i].trackId);
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
        getAlbumArtist: function(albumID, userID) {

            // connect to db and find album with the same id then return it as json file
            // if found return album else return 0

            let album = this.getAlbumById(albumID);
            let albumInfo = {}
            let user = this.Users.find(User => User._id == userID);
            if (user) {
                let isSaved = this.checkIfUserSaveAlbum(user, albumID);
                if (isSaved) {
                    albumInfo['isSaved'] = true;
                } else {
                    albumInfo['isSaved'] = false;
                }

            }
            if (album) {
                let Artist = this.getArtist(album.artistId);
                let track = this.getTracksAlbum(albumID);
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
        getAlbum: function(albumName, groups, country, limit, offset) {

            var allalbum;
            let allartists = this.Artist;
            let artist = this.exactmatch(allartists, albumName);
            if (artist) {

                allalbum = this.getAlbums(artist, groups, country, limit, offset);

            } else {
                allalbum = this.Albums;
                if (allalbum.length == 0) return allalbum;
                allalbum = Fuzzysearch(albumName, 'name', allalbum);

            }
            Album = []
            for (let i = 0; i < allalbum.length; i++) {
                let albums = this.getAlbumArtist(allalbum[i]._id);
                if (albums) {
                    album = {}
                    album["_id"] = albums._id
                    album["name"] = albums.name
                    album["images"] = albums.images
                    album["type"] = "Album";
                    if (albums) {
                        album["artistId"] = albums.artistId;
                        album["artistName"] = albums.artistName;
                        album["artistType"] = "Artist";

                    }
                    Album.push(album);
                }
            }
            return Album;

        },
        getTracks: function(artistID) {
            let SpecificTracks = [];
            let tracks = {};
            let artist = this.getArtist(artistID);
            if (!artist) return 0;
            for (let i = 0; i < artist.addTracks.length; i++) {
                let track = this.Tracks.find(a => a._id == artist.addTracks[i].trackId);
                if (track) { tracks[artist.addTracks[i].trackId] = track; }
            }
            for (let Track in tracks) {
                SpecificTracks.push(tracks[Track]);
            }
            return SpecificTracks;
        },
        //get all tracks with Name
        //params: Name
        getArtist: function(artistId) {
            return this.Artist.find(artist => artist._id == artistId);
        },
        getAlbumById: function(albumId) {
            return this.Albums.find(album => album._id == albumId);
        },
        getTrack: function(Name) {

            var Track;
            let allartists = this.Artist;
            let artist = this.exactmatch(allartists, Name);
            if (artist) {

                Track = this.getTracks(artist);

            } else {
                const track = this.Tracks;
                if (track == 0) return track;
                Track = Fuzzysearch(Name, 'name', track);
            }

            trackInfo = []
            for (let i = 0; i < Track.length; i++) {
                let artist = this.getArtist(Track[i].artistId)
                tracks = {}
                if (artist) {
                    tracks["artistId"] = artist._id
                    tracks["artistName"] = artist.Name
                    tracks["artistimages"] = artist.images
                    tracks["artistType"] = artist.type
                }
                let album = this.getAlbumById(Track[i].albumId)
                if (album) {
                    tracks["albumId"] = album._id
                    tracks["albumName"] = album.name
                    tracks["albumImages"] = album.images
                    tracks["albumType"] = album.type
                }
                tracks["_id"] = Track[i]._id
                tracks["name"] = Track[i].name
                tracks["type"] = Track[i].type
                tracks["images"] = Track[i].images
                trackInfo.push(tracks);
            }
            return trackInfo;

        },

        //get top results with Name
        //params: Name
        getTopResults: function(Name) {
            const artist = this.getTop(Name);
            if (artist) {
                let artist = this.getArtistProfile(Name)
                return artist[0]
            }
            let track = this.getTrack(Name);
            if (track.length != 0) {
                return track[0];
            }
            let album = this.getAlbum(Name);
            if (album.length != 0) {
                return album[0];
            }
            let playlist = this.getPlaylist(Name);
            if (playlist.length != 0) {
                return playlist[0];
            }
            let profile = this.getUserProfile(Name);
            if (profile.length != 0) {
                // console.log(profile)
                return profile[0];
            }
        },

        //get all artist profile with name
        //params: name
        getArtistProfile: function(name) {

            let ArtistInfo = [];
            let User = this.getUserByname(name);
            if (User.length == 0) return 0;
            else {
                for (let i = 0; i < User.length; i++) {
                    if (User[i].userType == "Artist") {

                        let artist = this.getArtist(User[i]._id);
                        if (artist != undefined) {
                            Artist = {}
                            Artist["_id"] = artist._id
                            Artist["name"] = artist.Name
                            Artist["images"] = artist.images
                            Artist["info"] = artist.info
                            Artist["type"] = artist.type
                            Artist["genre"] = artist.genre
                            ArtistInfo.push(Artist)

                        }

                    }
                }
                if (ArtistInfo.length == 0) return 0;

                return ArtistInfo;
            }

        },

        //get artist profile of id
        //params: artistID
        getArtist: function(artistID) {
            return this.Artist.find(artist => artist._id == artistID);
        },

        //get all user profiles with name
        //params: name
        getUserProfile: function(name) {

            UserInfo = []
            let User = this.getUserByname(name);
            if (User.length == 0) return User;
            else {
                for (let i = 0; i < User.length; i++) {
                    if (User[i].userType == "Artist") {
                        continue;
                    } else {

                        user = {}
                        user["_id"] = User[i]._id
                        user["displayName"] = User[i].displayName
                        user["images"] = User[i].images
                        user["type"] = User[i].type
                        UserInfo.push(user)
                    }
                }

                return UserInfo;
            }

        },

        //get all playlists with Name
        //params Name
        getPlaylist: function(Name) {

            let playlist = this.Playlists;
            if (playlist.length == 0) return playlist;
            playlist = Fuzzysearch(Name, 'name', playlist);
            playlistInfo = []
            for (let i = 0; i < playlist.length; i++) {
                let User = this.Users.find(User => User._id == playlist[i].ownerId)
                Playlist = {}
                if (User) {
                    Playlist["ownerId"] = User._id
                    Playlist["ownerName"] = User.displayName
                    Playlist["ownerImages"] = User.images
                    Playlist["ownerType"] = User.type
                }

                Playlist["_id"] = playlist[i]._id
                Playlist["name"] = playlist[i].name
                Playlist["type"] = playlist[i].type
                Playlist["images"] = playlist[i].images
                playlistInfo.push(Playlist)

            }
            return playlistInfo;
        }

    }
    //search for name in schema
    //params: field, name, schema  
function search(name, field, schema) {

    const searcher = new FuzzySearch(schema, [field], {
        caseSensitive: false,
        sort: true
    });
    const users = searcher.search(name);
    return users;

}

//use fuzzy search to search for field in schema with name
//params: name, field, schema
function Fuzzysearch(name, field, schema) {

    Results = []
    subName = name.split(' ');
    let results = search(name, field, schema);
    Results = Results.concat(results);
    for (let i = 0; i < subName.length; i++) {
        results = search(subName[i], field, schema);
        Results = Results.concat(results);
    }
    return removeDupliactes(Results);

}

//remove duplicates from array
//params: values
const removeDupliactes = (values) => {

    let newArray = [];
    let uniqueObject = {};
    for (let i in values) {
        objTitle = values[i]['_id'];
        uniqueObject[objTitle] = values[i];
    }

    for (i in uniqueObject) {
        newArray.push(uniqueObject[i]);
    }
    return newArray;
}
module.exports = MockSearch;