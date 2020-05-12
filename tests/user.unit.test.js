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
let users = [{
      
        'displayName': 'dina alaa',
        'email': 'dinaalaaahmed@gmail.com',
        'password': '1223345677',
        'country': 'egypt',
        'isFacebook': false,
       
        'userType': 'user'
    }, {
        '_id': '2',
        'displayName': 'Arwa alaa',
        'email': 'Arwaalaaahmed@gmail.com',
        'password': '1223345678',
        'country': 'egypt',
        'isFacebook': true,
        'userType': 'user',
        
    },
    {
        '_id': '3',
        'displayName': 'Alaa Alaa',
        'email': 'Arwalaaalaaahmed@gmail.com',
        'password': '12345678',
        'country': 'egypt',
        'userType': 'user',
        'isFacebook': true,
        
    }
]
let playlists = [];
let usersInDB = [];
beforeAll(async () => {
    await dbHandler.connect();
    for(let user of users){
    let u = await mockUser.createUser(user.displayName,user.password,user.email,user.gender,user.country,user.birthDate);
    usersInDB.push(u);
    }
   
   
   
   
    
});
afterEach(async () => {
    ;
    await userDocument.find({},(err,files)=>{
        usersInDB = [];
        for(let user of files) usersInDB.push(user);
    })
    
 });
afterAll(async () => {
    await dbHandler.clearDatabase();
     await dbHandler.closeDatabase();
 });
 

test('get update', async () => {
    expect(await mockUser.update(usersInDB[0]._id, undefined, undefined, "dai alaa", "1223345677",undefined, undefined,undefined, undefined, undefined, undefined)).toBeTruthy()
})
test('get user', async () => {
    let user = await mockUser.getUserById(usersInDB[0]._id);
    expect(user.displayName).toEqual( 'dai alaa');
})

test('get user not fount', async () => {
    expect(await mockUser.getUserById('10')).toBeFalsy();
})
test('test me ', async () => {

    expect((await mockUser.me(usersInDB[0]._id)).displayName).toEqual( 'dai alaa');
})
test('bad test me ', async () => {

    expect(await mockUser.me('7')).toBeFalsy();
})

test('test GET user followed artist ', async () => {
    expect(await mockUser.getUserFollowingArtist(usersInDB[0]._id)).toBeFalsy();
})

test('test check email', async () => {
    expect((await mockUser.checkmail('dinaalaaahmed@gmail.com')).displayName).toEqual( "dai alaa");
})
test('update password by forget password', async () => {
    expect(await mockUser.updateforgottenpassword(usersInDB[1],"123")).toEqual('123')
})
test('create playlist', async () => {
    let p = await mockUser.createdPlaylist(usersInDB[0]._id, 'playlist1', 'this is my playlist');
    playlists.push(p);
    expect((p).Description).toEqual('this is my playlist')
})


test(('check Authorized Playlist'), async () => {
    
    expect(await mockUser.checkAuthorizedPlaylist(usersInDB[0]._id, playlists[0]._id)).toBeTruthy()
})


test(('promote user to artist'), async () => {
   
    expect( await mockUser.promoteToArtist(usersInDB[0]._id)).toBeTruthy()
})

test(('promote user to artist'), async () => {;
        expect(await mockUser.promoteToArtist(usersInDB[0]._id)).toBeFalsy()
})


test('updaet facebook user with country',async ()=>{
    expect(await mockUser.update(usersInDB[1]._id, undefined, undefined, "dai alaa", "123",undefined, "eg",undefined, undefined, undefined, undefined)).toBeTruthy();
})


test('update facebook user without country',async ()=>{
    expect(await mockUser.update(usersInDB[1]._id, undefined, undefined, undefined, "123",undefined, undefined,undefined, undefined, undefined, undefined)).toBeTruthy();
})

test('update non existing user',async ()=>{
    expect(await mockUser.update(ObjectId(), undefined, undefined, "dai alaa", "123",undefined, undefined,undefined, undefined, undefined, undefined)).toBeFalsy();
})










test('updaet facebook user with country',async ()=>{
    expect(await mockUser.update(usersInDB[1]._id, undefined, undefined, "dai alaa", "123","b@b", "eg",undefined, undefined, undefined, undefined)).toBeTruthy();
})

test('updaet facebook user with country',async ()=>{
    expect(await mockUser.update(usersInDB[1]._id, undefined, undefined, "dai alaa", "123","b@b", "eg",undefined, undefined, undefined, undefined)).toBeTruthy();
})

test('update user country',async ()=>{
    expect(await mockUser.update(usersInDB[0]._id, undefined, undefined, undefined, "1223345677",undefined, "eg",undefined, undefined, undefined, undefined)).toBeTruthy();
})

test('get followers of user with no follow',async ()=>{
    expect(await mockUser.getUserFollowingArtist(usersInDB[1]._id)).toBeFalsy();
})



test('check email of not exisiting user',async ()=>{
    expect(await mockUser.checkmail('84')).toBeFalsy();
})






test('user doesnt own playlist check for auth',async ()=>{
    expect(await mockUser.checkAuthorizedPlaylist(usersInDB[1]._id,playlists[0]._id)).toBeFalsy();
})


test('promote non user to artist',async ()=>{
    expect(await mockUser.promoteToArtist('84')).toBeFalsy();
})



// delete account at end 
test('delete account ', async () => {
    await mockUser.deleteAccount(usersInDB[1]._id);
    expect(await mockUser.getUserById(usersInDB[1]._id)).toBeFalsy();
})

test('delete non existing account ', async () => {
    
    expect(await mockUser.deleteAccount("1")).toBeFalsy();
})
