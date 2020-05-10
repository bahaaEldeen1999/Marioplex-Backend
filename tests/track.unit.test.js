const mockTrack = require('../public-api/track-api');
const mockUser = require('../public-api/user-api');
const mockArtist = require('../public-api/artist-api');
const mockAlbum = require('../public-api/album-api');
const mongoose = require('mongoose');
const { user: userDocument, artist: artistDocument, album: albumDocument, track: trackDocument, playlist: playlistDocument, category: categoryDocument } = require('../models/db');
const { MongoMemoryServer } = require('mongodb-memory-server');
const dbHandler = require('./db-handler');
const mongod = new MongoMemoryServer();
const ObjectId = mongoose.Types.ObjectId;


let artist;
let album;
let track ;
let user;

/**
 * Connect to a new in-memory database before running any tests.
 */
beforeAll(async () => {
    await dbHandler.connect();

    user = await mockUser.createUser("user1","123","b@b.com","male","eg","1/1/2020");

   
   await mockUser.promoteToArtist(user._id,"artist info","artist1",["pop"]);
   artist =  await mockArtist.findMeAsArtist(user._id);
   user = await mockUser.getUserById(user._id);
   album = await mockArtist.addAlbum(artist._id,"album1","label1",["eg"],"Single","1/1/2020",["pop"]);

   track =  await mockTrack.createTrack("","track1",12,["eg"],artist._id,album._id,100,"12","13",["pop"]);
  
   await mockArtist.addTrack(artist._id, track._id);
   await mockAlbum.addTrack(album._id, track);
   
   
    
});



afterEach(async () => {
   // console.log(user);
    user = await mockUser.getUserById(user._id);
    album = await mockAlbum.getAlbumById(album._id);
    artist = await mockArtist.getArtist(artist._id);
    track = await mockTrack.getTrack(track._id,user);
    //await dbHandler.clearDatabase();
});

/**
 * Remove and close the db and server.
 */
afterAll(async () => {
   await dbHandler.clearDatabase();
    await dbHandler.closeDatabase();
});



test('get track with id 2',async () => {
  //  console.log(await albumDocument.find({}))
    const getTrack = await mockTrack.getTrack(track._id);
    expect(getTrack.albumId).toEqual(album._id);

 
})

test('get tracks all correct ids',async ()=>{
    const getTrack = await mockTrack.getTracks([track._id]);
    expect(getTrack.length).toEqual(1);
})

test('get tracks all correct ids excpet two ',async ()=>{
    const getTrack = await mockTrack.getTracks([track._id,String(ObjectId()),String(ObjectId())]);
    expect(getTrack.length).toEqual(1);
})

test('get track with id 10 which is not found',async () => {
    expect(await mockTrack.getTrack("10")).toEqual(0);
})


test('user like track',async () => {
    const likedTrack = await mockUser.likeTrack(user._id,track._id);
    expect(likedTrack).toBeTruthy();
    console.log(user);
   
})

test('check if user like track 1 which is false',async () => {
    expect(await mockTrack.checkIfUserLikeTrack(user, "1")).toBeFalsy();
})

test('check if user like track ',async () => {
  //  console.log(user)
    expect(await mockTrack.checkIfUserLikeTrack(user,track._id)).toBeTruthy();
})




test('user like already liked  track ',async () => {
    expect(await mockUser.likeTrack(user._id,track._id)).toBeFalsy();
})

test('user unlike  track  which he liked before',async () => {
    expect(await mockUser.unlikeTrack(user._id,track._id)).toBeTruthy();
})

test('user unlike   track with  which he already unliked',async () => {
    expect(await mockUser.unlikeTrack(user._id,track._id)).toBeFalsy();
})



test('get audio features for track with id 1',async () => {
    expect(await mockTrack.getAudioFeaturesTrack(track._id)).toBeTruthy();
})

test('get audio features for track with id 0 which doesnt exist',async () => {
    expect(await mockTrack.getAudioFeaturesTrack("0")).toBeFalsy();
})

test('create track',async () => {
    const track = await mockTrack.createTrack("","track1",12,["eg"],artist._id,album._id,100,"12","13",["pop"]);
    expect(track).toBeTruthy();
})
