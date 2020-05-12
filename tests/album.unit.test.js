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

let albums = [];
let artists = [];
let tracks = [];
let users = [];


let albumsObjs = [{
    '_id':'1',
    'artistId':'2',
    'hasTracks':[],
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
    'hasTracks':[],
    'name':"ay haga1"

},
{
'_id':'4',
'artistId':'20',
'hasTracks':[],
'name':"ay haga"


},
{
  '_id':'5',
  'name':'haytham',
  'images':[],
  'hasTracks':[]
}]
let artistsObj=[{
    '_id':'2',
    'Name':'Amr Diab',
    "images":[],
    "info": "greattt",
    "type": "Artist",
    "genre": ["pop"]
},{
    '_id' : '1',
    "Name": "DINA",
    "images":[],
    "info": "greattt",
    "type": "Artist",
    "genre": ["pop"]
}]
let tracksObj=[{
    '_id':'1',
    'name':'alby etmnah',
    'images':[]
}]
let usersObj = [{
      
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
    
}]

beforeAll(async () => {
    await dbHandler.connect();
    for(let userObj of usersObj){
        let u = await mockUser.createUser(userObj.displayName,userObj.password,userObj.email,userObj.gender,userObj.country,userObj.birthDate);
        users.push(u);
    }
    let i=0;
    for(let user of users){
        await mockUser.promoteToArtist(user._id,"artist info","artist"+i,["pop"]);
        let artist =  await mockArtist.findMeAsArtist(user._id);
        artists.push(artist);
        i++;
        if(i==1){
            let j=0;
            for(let album of albumsObjs){
                let album1 = await mockArtist.addAlbum(artist._id,album.name,"label1",["eg"],"Single","1/1/2020",["pop"]);
                albums.push(album1);
                if(j==0){
                    let track =   await mockTrack.createTrack("","track1",12,["eg"],artist._id,album1._id,100,"12","13",["pop"]);
                    tracks.push(track);
                    await mockArtist.addTrack(artist._id, track._id);
                    await mockAlbum.addTrack(album1._id, track);
                } 
                j++;
            }
        }
    }

 
   
    
});

afterEach(async () => {
    users = [];
    tracks = [];
    albums = [];
    artists = [];
    await artistDocument.find({},(err,files)=>{
        for(let file of files) artists.push(file)
    })
    await trackDocument.find({},(err,files)=>{
        for(let file of files) tracks.push(file)
    })
    await userDocument.find({},(err,files)=>{
        for(let file of files) users.push(file)
    })
    await albumDocument.find({},(err,files)=>{
        for(let file of files) albums.push(file)
    })
 });

 afterAll(async () => {
    await dbHandler.clearDatabase();
     await dbHandler.closeDatabase();
 });
 


test('get album',async ()=>{
  
    expect((await mockAlbum.getAlbumById(albums[0]._id)).name).toEqual('album gamed');
})

test('get albums right',async ()=>{
    expect((await mockAlbum.getAlbums([albums[0]._id])).length).toEqual(1)
})

test('get albums album dont exist',async ()=>{
    expect((await mockAlbum.getAlbums(['1']))).toEqual(0)
})

test('get albums no parameter',async ()=>{
    expect(await mockAlbum.getAlbums()).toEqual(0)
})

test('get albums parameter with wrong id',async ()=>{
    expect(await mockAlbum.getAlbums(['5'])).toEqual(0)
})

test('get albums parameter but empty id',async ()=>{
    expect(await mockAlbum.getAlbums([])).toEqual(0)
})

test('get tracks album no parameter',async ()=>{
    expect(await mockAlbum.getTracksAlbum()).toEqual(0)
})

test('get tracks album right',async ()=>{
    //console.log("albums",albums)
    //console.log(albums[0],users[0])
    let h = await mockAlbum.getTracksAlbum(albums[0]._id,users[0]);
    //console.log(h)
    expect((h[0]).name).toEqual( "track1");
})

test('get tracks album wrong id',async ()=>{
    expect(await mockAlbum.getTracksAlbum("4")).toBeFalsy()
})
test('get album with artist right',async ()=>{
    //console.log("albums",albums)
    let h = await mockAlbum.getAlbumArtist(albums[0]._id,users[0]._id);
   // console.log("h",h)
    expect(h).toHaveProperty('name','album gamed')

})
test('get album with artist wrong id',async ()=>{
    expect(await mockAlbum.getAlbumArtist('1')).toEqual(0);

})



test('get album with wrong artist',async ()=>{
    expect(await mockAlbum.getAlbumArtist('10')).toEqual(0);

})
test('get album with artist with wrong artist woth user parameter',async ()=>{
    expect(await mockAlbum.getAlbumArtist('10',users[0])).toEqual(0);

})

test('get album with artist with false is saved',async ()=>{
    //console.log("is saved",await mockAlbum.getAlbumArtist(albums[0]._id,users[0]))
    expect(await mockAlbum.getAlbumArtist(albums[0]._id,users[0]._id)).toHaveProperty('isSaved',false);

})



test('get album with artist with wrong parameters',async ()=>{
    expect(await mockAlbum.getAlbumArtist('15',0)).toEqual(0);

})
test('get album with artist with wrong id',async ()=>{
    expect(await mockAlbum.getAlbumArtist('15',users[0])).toEqual(0);

})


test('add track to album',async ()=>{
    expect(await mockAlbum.addTrack(albums[0]._id,tracks[0]._id)).toEqual(1);
})


test('add track to invalid album',async ()=>{
    expect(await mockAlbum.addTrack('1',tracks[0]._id)).toEqual(0);
})





test('check if user does not saves album',async ()=>{
    expect(await mockAlbum.checkIfUserSaveAlbum(users[1],albums[0]._id)).toBeFalsy();
})


test('user saves album',async ()=>{
    expect(await mockAlbum.saveAlbum(users[0],[albums[0]._id])).toBeTruthy()
})


test('check if user saves album',async ()=>{
    expect(await mockAlbum.checkIfUserSaveAlbum(users[0],albums[0]._id)).toBeTruthy();
})


test('user saves album already saved',async ()=>{
    expect(await mockAlbum.saveAlbum(users[0],[albums[0]._id])).toBeFalsy()
})


test('user saves album with empty array',async ()=>{
    expect(await mockAlbum.saveAlbum(users[0],[])).toEqual(2)
})


test('user saves album with undefined parameter',async ()=>{
    expect(await mockAlbum.saveAlbum(users[0])).toEqual(2)
})


test('new user saves album',async ()=>{
    expect(await mockAlbum.saveAlbum(users[1],[albums[0]._id])).toBeTruthy()
})
test('user unsaves album',async ()=>{
    expect(await mockAlbum.unsaveAlbum(users[1],[albums[0]._id])).toBeTruthy()
})


test('user unsaves album is already unsaved',async ()=>{
    expect(await mockAlbum.unsaveAlbum(users[1],[albums[0]._id])).toBeFalsy()
})




test('user unsaves album with empty array',async ()=>{
    expect(await mockAlbum.unsaveAlbum(users[0],[])).toBeTruthy()
})
test('user unsaves album with invalid input',async ()=>{
    expect(await  mockAlbum.unsaveAlbum(users[1])).toBeFalsy()
})
test('get track index in album',async ()=>{
    expect(await mockAlbum.findIndexOfTrackInAlbum(tracks[0]._id,albums[0])).toBeDefined()
})

test('get track index in album',async ()=>{
    expect(await mockAlbum.findIndexOfTrackInAlbum('20',albums[0])).toEqual(-1)
})