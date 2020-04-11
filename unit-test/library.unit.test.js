mockLibrary = require('../mock-classes/library-mock');
const user = {
    id: "uiewqeuie2",
    name: "user1",
    saveAlbum: [{ albumId: "album1" }, { albumId: "album2" }, { albumId: "album3" }, { albumId: "album4" }, { albumId: "album5" }, { albumId: "album6" }, { albumId: "album7" }],
    like: [{ trackId: "track1" }, { trackId: "track2" }, { trackId: "track3" }, { trackId: "track4" }, { trackId: "track5" }, { trackId: "track6" }, { trackId: "track7" }, { trackId: "track8" }]
}
const user2 = {
    id:"2",
    saveAlbum:[],
    like:[]
}
const user3 = {
    id:"3",
    saveAlbum:[
        { albumId: "1" },
        { albumId: "11" },
        { albumId: "111" },
        { albumId: "12" },
        { albumId: "13" },
        { albumId: "14" },
        { albumId: "15" },
        { albumId: "16" },
        { albumId: "176" },
        { albumId: "17" },
        { albumId: "18" },
        { albumId: "19" },
        { albumId: "10" },
        { albumId: "1111" },
        { albumId: "21" },
        { albumId: "31" },
        { albumId: "41" },
        { albumId: "51" },
        { albumId: "61" },
        { albumId: "81" },
        { albumId: "71" },
        { albumId: "91" },
    ],
    like:[
        { trackId: "1" },
        { trackId: "11" },
        { trackId: "111" },
        { trackId: "12" },
        { trackId: "13" },
        { trackId: "14" },
        { trackId: "15" },
        { trackId: "16" },
        { trackId: "176" },
        { trackId: "17" },
        { trackId: "18" },
        { trackId: "19" },
        { trackId: "10" },
        { trackId: "1111" },
        { trackId: "21" },
        { trackId: "31" },
        { trackId: "41" },
        { trackId: "51" },
        { trackId: "61" },
        { trackId: "81" },
        { trackId: "71" },
        { trackId: "91" },
    ]
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

test("get saved album of non user",()=>{
    expect(mockLibrary.getSavedAlbums(undefined)).toBeFalsy();
})

test("get saved album of user with no saved albums",()=>{
    expect(mockLibrary.getSavedAlbums(user2)).toBeFalsy();
})

test("get saved album of user with more than 20 alums",()=>{
    expect(mockLibrary.getSavedAlbums(user3)).toBeTruthy();
})

test("get saved album of user with more than 20 alums with offset",()=>{
    expect(mockLibrary.getSavedAlbums(user3,20,10)).toBeTruthy();
})

test("get saved album of user with more than 20 alums with wromg offset",()=>{
    expect(mockLibrary.getSavedAlbums(user3,20,10000)).toBeTruthy();
})

test("get saved album of user with more than 20 alums with limit",()=>{
    expect(mockLibrary.getSavedAlbums(user3,5,10000)).toBeTruthy();
})

test("get saved album of user with more than 20 alums with wrong  limit",()=>{
    expect(mockLibrary.getSavedAlbums(user3,5,10000)).toBeTruthy();
})


test("get saved track of non user",()=>{
    expect(mockLibrary.getSavedTracks(undefined)).toBeFalsy();
})

test("get saved track of user with no saved track",()=>{
    expect(mockLibrary.getSavedTracks(user2)).toBeFalsy();
})

test("get saved track of user with more than 20 track",()=>{
    expect(mockLibrary.getSavedTracks(user3)).toBeTruthy();
})

test("get saved track of user with more than 20 track with offset",()=>{
    expect(mockLibrary.getSavedTracks(user3,20,10)).toBeTruthy();
})

test("get saved track of user with more than 20 track with wrong offset",()=>{
    expect(mockLibrary.getSavedTracks(user3,20,10000)).toBeTruthy();
})

test("get saved track of user with more than 20 track with limit",()=>{
    expect(mockLibrary.getSavedTracks(user3,5,10000)).toBeTruthy();
})

test("get saved track of user with more than 20 track with wrong  limit",()=>{
    expect(mockLibrary.getSavedTracks(user3,5,10000)).toBeTruthy();
})
