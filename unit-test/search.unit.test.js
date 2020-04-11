const searchTest = require('../mock-classes/search-mock');
searchTest.Users = [{
        '_id': '1',
        'displayName': 'dina',
        'userType': 'Artist',
        'type': 'User',
        'images': []
    }, {
        '_id': '2',
        'displayName': 'nawal',
        'userType': 'User',
        'type': 'User',
        'images': []
    }

]
searchTest.Artist = [{
    '_id': '1',
    "Name": "DINA",
    "images": [],
    "info": "greattt",
    "type": "Artist",
    "genre": "pop",
    'addTracks': [{
        'trackId': '1'
    }],
    'addAlbums': [{
        'albumId': '1'
    }]
}]
searchTest.Playlists = [{
    '_id': '1',
    'name': 'hello kids',
    'images': [],
    'type': 'Playlist',
    'ownerId': '1'
}]
searchTest.Tracks = [{
    '_id': '1',
    'name': 'alby etmnah',
    'type': 'Track',
    'images': [],
    'artistId': '1',
    'albumId': '1'
}]
searchTest.Albums = [{
    '_id': '1',
    'artistId': '1',
    'hasTracks': [{ 'trackId': '1' }],
    'name': 'album gamed',
    'images': [],
    'type': 'Album',
    availableMarkets:['EG'],
    albumType:['Single']

},{
  '_id':'2',
  'name':'swswswsw'
}]

test('get user by name', () => {
    expect(searchTest.getUserByname('dina')).toEqual([{
        '_id': '1',
        'displayName': 'dina',
        'userType': 'Artist',
        'type': 'User',
        'images': []
    }])
})

test('get user by name that does not exist', () => {
    expect(searchTest.getUserByname('samir')).toEqual([])
})
test('get user profile', () => {
    expect(searchTest.getUserProfile('nawal')).toEqual([{ '_id': '2', 'displayName': 'nawal', 'images': [], 'type': 'User' }])
})
test('get user profile of name does not exist', () => {
    expect(searchTest.getUserProfile('wewewe')).toEqual([])
})
test('get user profile of an artist', () => {
    expect(searchTest.getUserProfile('DINA')).toEqual([])
})
test('get playlist', () => {
    expect(searchTest.getPlaylist('hello')).toEqual([{
        "ownerId": '1',
        "ownerName": 'dina',
        "ownerImages": [],
        "ownerType": 'User',
        "_id": '1',
        "name": 'hello kids',
        "type": 'Playlist',
        "images": []
    }])
})
test('get playlist of name doesnot exists', () => {
    expect(searchTest.getPlaylist('WEWE')).toEqual([])
})

test('get artist', () => {
    expect(searchTest.getArtistProfile('dina')).toEqual([{
        '_id': '1',
        'name': 'DINA',
        'images': [],
        'info': 'greattt',
        'type': 'Artist',
        'genre': 'pop'
    }])
})
test('get artist with name doesnot exists', () => {
    expect(searchTest.getArtistProfile('lele')).toBeFalsy()
})
test('get track', () => {
    expect(searchTest.getTrack('alby')).toEqual([{
        artistId: '1',
        artistName: 'DINA',
        artistimages: [],
        artistType: 'Artist',
        albumId: '1',
        albumName: 'album gamed',
        albumImages: [],
        albumType: 'Album',
        _id: '1',
        name: 'alby etmnah',
        type: 'Track',
        images: []
    }])
})
test('get track that does not exist', () => {
    expect(searchTest.getTrack('lele')).toEqual([])
})

test('get top of profile', () => {
    expect(searchTest.getTopResults('nawal')).toEqual({ '_id': '2', 'displayName': 'nawal', 'images': [], 'type': 'User' })
})
test('get top of an artist', () => {
    expect(searchTest.getTopResults('DINA')).toEqual({"_id": "1", "genre": "pop", "images": [], "info": "greattt", "name": "DINA", "type": "Artist"})
})
test('get tracks of artist', () => {
    expect(searchTest.getTrack('DINA')).toEqual([{
        artistId: '1',
        artistName: 'DINA',
        artistimages: [],
        artistType: 'Artist',
        albumId: '1',
        albumName: 'album gamed',
        albumImages: [],
        albumType: 'Album',
        _id: '1',
        name: 'alby etmnah',
        type: 'Track',
        images: []
    }])
})

test('get albums of artist', () => {
    expect(searchTest.getAlbum('DINA')).toEqual([{
        _id: '1',
        name: 'album gamed',
        images: [],
        type: 'Album',
        artistId: '1',
        artistName: 'DINA',
        artistType: 'Artist'
    }])
})
test('get album', () => {
    expect(searchTest.getAlbum('DINA','Single','EG',0,1)).toEqual([{
        _id: '1',
        name: 'album gamed',
        images: [],
        type: 'Album',
        artistId: '1',
        artistName: 'DINA',
        artistType: 'Artist'
    }])
})
test('get album of name doesnot exist', () => {
    expect(searchTest.getAlbum('DINA',undefined,'EG',0,1)).toEqual([{
        _id: '1',
        name: 'album gamed',
        images: [],
        type: 'Album',
        artistId: '1',
        artistName: 'DINA',
        artistType: 'Artist'
    }])
})
test('get album', () => {
    expect(searchTest.getAlbum('DINA','Single',undefined,0,1)).toEqual([{
        _id: '1',
        name: 'album gamed',
        images: [],
        type: 'Album',
        artistId: '1',
        artistName: 'DINA',
        artistType: 'Artist'
    }])
})

test('get album of name doesnot exist', () => {
    expect(searchTest.getAlbum('lele')).toEqual([])
})
test('get albums', () => {
    expect(searchTest.getAlbum('gamed')).toEqual([{
        _id: '1',
        name: 'album gamed',
        images: [],
        type: 'Album',
        artistId: '1',
        artistName: 'DINA',
        artistType: 'Artist'
    }])
})
test('get top results of artist', () => {
    expect(searchTest.getTopResults('DINA')).toEqual({
        '_id': '1',
        'name': 'DINA',
        'images': [],
        'info': 'greattt',
        'type': 'Artist',
        'genre': 'pop'
    })
})

test('get top results of album', () => {
    expect(searchTest.getTopResults('gamed')).toEqual({
        _id: '1',
        name: 'album gamed',
        images: [],
        type: 'Album',
        artistId: '1',
        artistName: 'DINA',
        artistType: 'Artist'
    })
})
test('get top results of playlist', () => {
    expect(searchTest.getTopResults('hello')).toEqual({
        "ownerId": '1',
        "ownerName": 'dina',
        "ownerImages": [],
        "ownerType": 'User',
        "_id": '1',
        "name": 'hello kids',
        "type": 'Playlist',
        "images": []
    })
})
test('get top results of name does not exist', () => {
    expect(searchTest.getTopResults('blablabla')).toBeFalsy()
})
test('get top', () => {
    expect(searchTest.getTop('alby')).toBeFalsy()
})
test('get top of artist', () => {
    expect(searchTest.getTop('DINA')).toEqual('1')
})

test('get top results of track', () => {
    expect(searchTest.getTopResults('alby')).toEqual({
        artistId: '1',
        artistName: 'DINA',
        artistimages: [],
        artistType: 'Artist',
        albumId: '1',
        albumName: 'album gamed',
        albumImages: [],
        albumType: 'Album',
        _id: '1',
        name: 'alby etmnah',
        type: 'Track',
        images: []
    })
})

test('get user by name with empty array', () => {
    searchTest.Users=[]
    expect(searchTest.getUserByname('salwa')).toBeFalsy()
})
test('get artist by name with empty array', () => {
    searchTest.Artist=[]
    expect(searchTest.getArtistProfile('salwa')).toBeFalsy()
})
test('get track by name with empty array', () => {
    searchTest.Tracks=[]
    expect(searchTest.getTrack('salwa')).toEqual([])
})
test('get album by name with empty array', () => {
    searchTest.Albums=[]
    expect(searchTest.getAlbum('salwa')).toEqual([])
})
test('get playlist by name with empty array', () => {
    searchTest.Playlists=[]
    expect(searchTest.getPlaylist('salwa')).toEqual([])
})
