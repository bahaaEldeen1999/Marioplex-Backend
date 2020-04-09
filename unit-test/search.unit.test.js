const searchTest = require('../mock-classes/search-mock');
searchTest.Users = [{
        '_id': '1',
        'displayName': 'dina',
        'userType': 'Artist',
        'type': 'User',
        'images': []
    }, {
        '_id': '2',
        'displayName': 'aya',
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
    'type': 'Album'

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
    expect(searchTest.getUserProfile('aya')).toEqual([{ '_id': '2', 'displayName': 'aya', 'images': [], 'type': 'User' }])
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