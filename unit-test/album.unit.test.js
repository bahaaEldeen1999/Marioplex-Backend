MockAlbum=require('../mock-classes/album-mock')
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
user2={
    '_id':'2'
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
test('get albums',()=>{
    expect(AlbumTest.getAlbums()).toEqual(0)
})
test('get albums',()=>{
    expect(AlbumTest.getAlbums([])).toEqual(0)
})
test('get tracks album',()=>{
    expect(AlbumTest.getTracksAlbum()).toEqual(0)
})

test('get tracks album',()=>{
    expect(AlbumTest.getTracksAlbum("1")).toEqual(  [{'_id':'1',
    'name':'alby etmnah',
    'images':[]}])
})
test('get album with artist',()=>{
    expect(AlbumTest.getAlbumArtist('1',user)).toHaveProperty('_id','1')
        
})
test('get album with artist',()=>{
    expect(AlbumTest.getAlbumArtist('10',user)).toEqual(0);
        
})
test('get album with artist',()=>{
    expect(AlbumTest.getAlbumArtist('2',user)).toHaveProperty('isSaved',false);
        
})
test('get album with artist',()=>{
    expect(AlbumTest.getAlbumArtist('2',user)).toHaveProperty('isSaved',false);
        
})
test('get album with artist',()=>{
    expect(AlbumTest.getAlbumArtist('15',0)).toEqual(0);
        
})
test('get album with artist',()=>{
    expect(AlbumTest.getAlbumArtist('15',user)).toEqual(0);
        
})
test('add track to album',()=>{
    expect(AlbumTest.addTrack('1',Track)).toEqual(1);
})
test('add track to invalid album',()=>{
    expect(AlbumTest.addTrack('10',Track)).toEqual(0);
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
    expect(AlbumTest.unsaveAlbum(user,['3'])).toEqual(false)
})
test('user unsaves album with empty array',()=>{
    expect(AlbumTest.unsaveAlbum(user,[])).toBeTruthy()
})
test('user unsaves album with invalid input',()=>{
    expect(AlbumTest.unsaveAlbum(user)).toEqual(0)
})
test('get track index in album',()=>{
    expect(AlbumTest.findIndexOfTrackInAlbum('1',AlbumTest.albums[0])).toBeDefined()
})

test('get track index in album',()=>{
    expect(AlbumTest.findIndexOfTrackInAlbum('20',AlbumTest.albums[0])).toEqual(0)
})