const MockAlbum =  {
    
    albums : [],
    artists: [],
    user:[],
    tracks:[],
    getAlbumById  : function(albumId){
        return this.albums.find(album => album._id==albumId);
    },
    getArtist  : function(artistId){
        return this.artists.find(artist => artist._id==artistId);
    },
    getTrack : function(trackId){
        return this.tracks.find(track => track._id==trackId);
    },
    findUserById:function(userID){
        return this.user.find(User => User._id==userID);

    },
    getAlbumArtist: function(albumID, userID) {

        // connect to db and find album with the same id then return it as json file
        // if found return album else return 0

        let album =  this.getAlbumById(albumID);
        let albumInfo = {}
        let user =  this.findUserById(userID);
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
    findIndexOfTrackInAlbum: async function(trackId, album) {
        for (let i = 0; i < album.hasTracks.length; i++) {
            if (album.hasTracks[i].trackId == trackId) return i;
        }
        return undefined;
    },
    // get several albums by ids
    getAlbums: function(albumIds) {

        // connect to db and find album with the same id then return it as json file
        // if found return album else return 0

        var Album = []
        if (albumIds == undefined) return 0;
        for (var i = 0; i < albumIds.length; i++) {
            var album = this.getAlbumById(albumIds[i]);
            if (album) {
                Album.push(album)
            }
        }
        if (Album.length > 0) {
            AlbumWithArtist = []
            for (let i = 0; i < Album.length; i++) {
                let Artist =  this.getArtist(Album[i].artistId);
                if (Artist) {
                    AlbumWithArtist.push({ Album: Album[i], Artist: Artist });
                }
            }
            return AlbumWithArtist;
        } else {
            return 0;
        }
    },
    //  get tracks of an album
    getTracksAlbum: async function(albumID) {

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
    addTrack: function(AlbumId, Track) {
        const album = this.getAlbumById(AlbumId);
        if (album) {
            album.hasTracks.push({
                trackId: Track._id
            });
            return 1;
            
        }
        return 0;

    },
    checkIfUserSaveAlbum: function(user, albumID) {
        const albumsUserSaved = user.saveAlbum;
        if (albumsUserSaved) {
            return albumsUserSaved.find(album => album.albumId == albumID);
        }
        return 0;
    },
    //user save track by album-id
    //params : user , album-id
    saveAlbum: function(user, albumID) {
        // check if user already saved the album
        // if not found then add album.album_id to user likes and return the updated user
        // else return 0 as he already saved the album
        if (albumID == undefined) return 2;
        let albums = [];
        for (let j = 0; j < albumID.length; j++) {
            let album = this.getAlbumById(albumID[j]);
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
                } 
                else {
                    user.saveAlbum = [];
                    user.saveAlbum.push({
                        albumId: albums[i],
                        savedAt: Date.now()
                    });
                }
            } else { count++; }
        }
        if (count == albums.length) {
            return 0;
        }
        return 1;
    },
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
            } 
            else {
                if ((!found && (j == (albumID.length - 1))) || (albumID.length == 1)) {
                    return false;
                }
            }
        }
        return 1;
    }
        
        


}
module.exports=MockAlbum;
const AlbumTest =  MockAlbum;
AlbumTest.albums = [{
    '_id':'1',
    'artistId':'2',
    'hasTracks':[{'trackId':'1'}],
    'name':'album gamed',
    'images':[]
   
},
{
    '_id':'2',
    'artistId':'2',
    'hasTracks':[]
   
},
{
    '_id':'3',
    'artistId':'2',
    'hasTracks':[]
   
}]
AlbumTest.artists=[{
    '_id':'2',
    'Name':'Amr Diab',
    "images":[],
    "info": "greattt",
    "type": "Artist",
    "genre": "pop"
},{
    '_id' : '1',
    "Name": "DINA",
    "images":[],
    "info": "greattt",
    "type": "Artist",
    "genre": "pop"
}]
AlbumTest.tracks=[{
    '_id':'1',
    'name':'alby etmnah',
    'images':[]
}]
user={
    '_id':'1',
    'saveAlbum':[{'albumId':'1'}]
}
Track={
    '_id':'2',
}



test('get album',()=>{
    expect(AlbumTest.getAlbumById('1')).toEqual({
        '_id':'1',
        'artistId':'2',
        'hasTracks':[{'trackId':'1'}],
        'name':'album gamed',
        'images':[]
       
    })
})
test('get albums',()=>{
    expect(AlbumTest.getAlbums(['1'])).toMatchObject([{"Album": {"_id": "1", "artistId": "2", "hasTracks": [{"trackId": "1"}],
   "images": [], "name": "album gamed"}, "Artist": {"Name": "Amr Diab", "_id": "2","images":[],"info": "greattt","type": "Artist","genre": "pop"}}])
})

test('get album with artist',()=>{
    expect(AlbumTest.getAlbumArtist('1','1')).toHaveProperty('_id','1')
        
})

test('add track to album',()=>{
    expect(AlbumTest.addTrack('1',Track)).toEqual(1);
})
test('check if user saves album',()=>{
    expect(AlbumTest.checkIfUserSaveAlbum(user,'1')).toEqual({'albumId':'1'})
})
test('check if user does not saves album',()=>{
    expect(AlbumTest.checkIfUserSaveAlbum(user,'2')).toEqual(undefined)
})

test('user saves album',()=>{
    expect(AlbumTest.saveAlbum(user,['2'])).toEqual(1)
})
test('user saves album is already saved',()=>{
    expect(AlbumTest.saveAlbum(user,['1'])).toEqual(0)
})
test('user saves album with empty array',()=>{
    expect(AlbumTest.saveAlbum(user,[])).toEqual(2)
})
test('user unsaves album',()=>{
    expect(AlbumTest.unsaveAlbum(user,['2'])).toBeTruthy()
})
test('user unsaves album is already unsaved',()=>{
    expect(AlbumTest.unsaveAlbum(user,['3'])).toBeTruthy()
})
test('user unsaves album with empty array',()=>{
    expect(AlbumTest.unsaveAlbum(user,[])).toBeTruthy()
})

test('get track index in album',()=>{
    expect(AlbumTest.findIndexOfTrackInAlbum('1',AlbumTest.albums[0])).toBeDefined()
})
