mockLibrary = require('../mock-classes/library-mock');
const user = {
    id: "uiewqeuie2",
    name: "user1",
    saveAlbum: [{ albumId: "album1" }, { albumId: "album2" }, { albumId: "album3" }, { albumId: "album4" }, { albumId: "album5" }, { albumId: "album6" }, { albumId: "album7" }],
    like: [{ trackId: "track1" }, { trackId: "track2" }, { trackId: "track3" }, { trackId: "track4" }, { trackId: "track5" }, { trackId: "track6" }, { trackId: "track7" }, { trackId: "track8" }]
}

test('check saved albums', () => {


    // expect that user has saved albums 
    expect(mockLibrary.checkSavedAlbums(["album1", "album20", "album30", "album4"], user)).toEqual([true, false, false, true]);
})

test('check saved tracks', () => {


    // expect that user has saved tracks 
    expect(mockLibrary.checkSavedTracks(["track1", "track07", "album30", "track4", "track5"], user)).toEqual([true, false, false, true, true]);
})
test('get saved albums', () => {


    // expect that user has saved albums 
    expect(mockLibrary.getSavedAlbums(user, 3287487)).toEqual(["album1", "album2", "album3", "album4", "album5", "album6", "album7"]);
})

test('get saved tracks', () => {


    // expect that user has saved tracks 
    expect(mockLibrary.getSavedTracks(user, 2)).toEqual(["track1", "track2"]);
})