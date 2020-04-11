
MockArtist=require('../mock-classes/artist-mock');
const ArtistTest =  MockArtist;
ArtistTest.Artists = [
 {  id:"1",
    images:[] ,
    info:"NADA ARTIST" ,
    popularity:100,
    genre:["POP","JAZZ"] ,
    type:"artist" ,
    Name:"Nada",
    userId: "1"  ,
    addAlbums:[{
      albumId: "1"
      //ref: 'Album'
    }],
    addTracks:[{
      trackId: "1"
      //ref: 'Track'
    },{
        trackId: "2"
    }]
},{
    id:"2",
    images:[] ,
    info:"NOUR ARTIST" ,
    popularity:200,
    genre:["POP","JAZZ"] ,
    type:"artist" ,
    Name:"Nour",
}

]
const Albums=[
    {
        id:"1",
        artistId:"1" ,
        name:"KIDS" ,
        popularity:10 ,
        genre:"POP" ,
        releaseDate:"2-1-2000" ,
        availableMarkets: ["EG,US"] ,
        hasTracks:[{
          trackId: "1"
        },{
            trackId: "2"
        }]
        
    }
]
const Tracks=[
{
id:"1",
artistId:"1",
albumId:"1",
availableMarkets:["EG"] ,
popularity:20 ,
name:"HELLO" 
},
{
    id:"2",
    artistId:"1",
    albumId:"1",
    availableMarkets:["EG","US"] ,
    popularity:200 ,
    name:"OHAYO" 
    }
]

const user={
    id:"1"
}
test('Create Artist',()=>{
    expect(ArtistTest.createArtist(user,"this is me","NADA",["DANCE"])).toEqual(  
     {
        id:"3",
        info: "this is me",
        popularity: 0,
        genre: ["DANCE"],
        type: "Artist",
        Name: "NADA",
        userId: "1",
        popularity: 0,
        images: [],
        addAlbums: [],
        addTracks: []
      });
 })

 
 test('Check if Artist has Album which he hasnot',()=>{
    expect(ArtistTest.checkArtisthasAlbum("1","4")).toEqual(  
     0);
 })

 test('Check if Artist has Album which he has',()=>{
    expect(ArtistTest.checkArtisthasAlbum("1","1")).toEqual(  
     1);
 })

 test('get Artist with id =2 which exists',()=>{
    expect(ArtistTest.getArtist("2")).toEqual(  
        {
            id:"2",
            images:[] ,
            info:"NOUR ARTIST" ,
            popularity:200,
            genre:["POP","JAZZ"] ,
            type:"artist" ,
            Name:"Nour",
        });
 })
 
 test('get Artist with id =4 which doesnt exist',()=>{
    expect(ArtistTest.getArtist("4")).toEqual(  
       0);
 })

 test('get Artists with ids =1,2',()=>{
    expect(ArtistTest.getArtists(["1","2"])).toEqual(  
        [
            {  id:"1",
               images:[] ,
               info:"NADA ARTIST" ,
               popularity:100,
               genre:["POP","JAZZ"] ,
               type:"artist" ,
               Name:"Nada",
               userId: "1"  ,
               addAlbums:[{
                 albumId: "1"
                 //ref: 'Album'
               }],
               addTracks:[{
                 trackId: "1"
                 //ref: 'Track'
               },{
                trackId: "2"
            }]
           },{
               id:"2",
               images:[] ,
               info:"NOUR ARTIST" ,
               popularity:200,
               genre:["POP","JAZZ"] ,
               type:"artist" ,
               Name:"Nour",
           }
           
           ]);
 })

 test('get Artist albums',()=>{
    expect(ArtistTest.getAlbums("1",undefined,undefined,undefined,undefined,Albums)).toEqual(  
        [{
            id:"1",
            artistId:"1" ,
            name:"KIDS" ,
            popularity:10 ,
            genre:"POP" ,
            releaseDate:"2-1-2000" ,
            availableMarkets: ["EG,US"] ,
            hasTracks:[{
              trackId: "1"
            },{
                trackId: "2"
            }]
            
        }]);
 })
 
 test('get Related Artist',()=>{
    expect(ArtistTest.getRelatedArtists("1")).toEqual(  
        [{id:"1",
        images:[] ,
        info:"NADA ARTIST" ,
        popularity:100,
        genre:["POP","JAZZ"] ,
        type:"artist" ,
        Name:"Nada",
        userId: "1"  ,
        addAlbums:[{
          albumId: "1"
          //ref: 'Album'
        }],
        addTracks:[{
          trackId: "1"
          //ref: 'Track'
        },{
            trackId: "2"
        }]
    },{
        id:"2",
        images:[] ,
        info:"NOUR ARTIST" ,
        popularity:200,
        genre:["POP","JAZZ"] ,
        type:"artist" ,
        Name:"Nour",
    }]);
 })

 
 test('find me as Artist',()=>{
    expect(ArtistTest.findMeAsArtist("1")).toEqual(  
        {id:"1",
        images:[] ,
        info:"NADA ARTIST" ,
        popularity:100,
        genre:["POP","JAZZ"] ,
        type:"artist" ,
        Name:"Nada",
        userId: "1"  ,
        addAlbums:[{
          albumId: "1"
          //ref: 'Album'
        }],
        addTracks:[{
          trackId: "1"
          //ref: 'Track'
        },{
            trackId: "2"
        }]
    });
 })

 test('get top tracks for Artist in EG',()=>{
    expect(ArtistTest.getTopTracks("1","EG",Tracks)).toEqual(  
 [
    {
        id:"2",
        artistId:"1",
        albumId:"1",
        availableMarkets:["EG","US"] ,
        popularity:200 ,
        name:"OHAYO" 
     }
    ,{
    id:"1",
    artistId:"1",
    albumId:"1",
    availableMarkets:["EG"] ,
    popularity:20 ,
    name:"HELLO" 
    }
    
    ]);
 })

 test('get tracks for Artist ',()=>{
    expect(ArtistTest.getTracks("1",Tracks)).toEqual(  
 [ {
    id:"1",
    artistId:"1",
    albumId:"1",
    availableMarkets:["EG"] ,
    popularity:20 ,
    name:"HELLO" 
    },
    {
        id:"2",
        artistId:"1",
        albumId:"1",
        availableMarkets:["EG","US"] ,
        popularity:200 ,
        name:"OHAYO" 
     }
    
    ]);
 })

 
 test('add track for Artist ',()=>{
    expect(ArtistTest.addTrack("1","3")).toEqual(  
      1);
 })

 test('add Album for Artist ',()=>{
    expect(ArtistTest.addAlbum("1","OHAYO","KIDS",["EG"],"Album","2-1-2000","POP","3")).toEqual(  
        {
            id:"3",
            name: "OHAYO",
            albumType: "Album",
            popularity: 0,
            genre: "POP",
            releaseDate: "2-1-2000",
            availableMarkets: ["EG"],
            label: "KIDS",
            images: [],
            artistId: "1",
            type: "Album",
            hasTracks: []
        
        });
 })

 


 test('Popular Artists',()=>{
    expect(ArtistTest.getPopularArtists()).toEqual(  
     {
       artists:[
        {   genre:["POP","JAZZ"] ,
            type:"artist" ,
            name:"Nour",
            images:[] ,
            id:"2",
            info:"NOUR ARTIST" ,           
        }
           ,
           {
            genre:["POP","JAZZ"] ,
            type:"artist" ,
            name:"Nada",
            images:[] ,
            id:"1",
            info:"NADA ARTIST" ,
           }
           ,
           {
            genre: ["DANCE"],
            type: "artist",
            name: "NADA",
            images: [],
            id:"3",
            info: "this is me",
           }
       ]
           
       
      });
 })
