
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
},
{  id:"3",
    images:[] ,
    info:"NADA ARTIST" ,
    popularity:500,
    genre:[] ,
    type:"artist" ,
    Name:"Nada",
    userId: "3"  ,
    addAlbums:[{
      albumId: "2"
      //ref: 'Album'
    }],
    addTracks:[{
      trackId: "5"
      //ref: 'Track'
    },{
        trackId: "6"
    }]
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
        
    },
    {
        id:"2",
        artistId:"10" ,
        name:"KIDS" ,
        popularity:10 ,
        genre:"POP" ,
        releaseDate:"2-1-2000" ,
        availableMarkets: "EG,US" ,
        albumType:"Album",
        hasTracks:[{
          trackId: "5"
        },{
            trackId: "6"
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
const user2={
    id:"2",
    displayName:"nour"
}
test('Create Artist',()=>{
    expect(ArtistTest.createArtist(user,"this is me","NADA",["DANCE"])).toEqual(  
     {
        id:"4",
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
 test('Check if invalid Artist has Album ',()=>{
    expect(ArtistTest.checkArtisthasAlbum("10","4")).toEqual(  
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
    expect(ArtistTest.getArtist("5")).toEqual(  
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

 test('get Artists with ids =5,2',()=>{
    expect(ArtistTest.getArtists(["5","2"])).toEqual(  
        [{
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
 test('get Artist albums',()=>{
    expect(ArtistTest.getAlbums("3","Album",undefined,undefined,undefined,Albums)).toEqual(  
        [   {
            id:"2",
            artistId:"10" ,
            name:"KIDS" ,
            popularity:10 ,
            genre:"POP" ,
            releaseDate:"2-1-2000" ,
            availableMarkets: "EG,US" ,
            albumType:"Album",
            hasTracks:[{
              trackId: "5"
            },{
                trackId: "6"
            }]
            
        }]);
 })

 test('get Artist albums',()=>{
    expect(ArtistTest.getAlbums("3","Album","EG",undefined,undefined,Albums)).toEqual(  
        [   {
            id:"2",
            artistId:"10" ,
            name:"KIDS" ,
            popularity:10 ,
            genre:"POP" ,
            releaseDate:"2-1-2000" ,
            availableMarkets: "EG,US" ,
            albumType:"Album",
            hasTracks:[{
              trackId: "5"
            },{
                trackId: "6"
            }]
            
        }]);
 })
 test('get Artist albums',()=>{
    expect(ArtistTest.getAlbums("3",undefined,"EG",undefined,undefined,Albums)).toEqual(  
        [   {
            id:"2",
            artistId:"10" ,
            name:"KIDS" ,
            popularity:10 ,
            genre:"POP" ,
            releaseDate:"2-1-2000" ,
            availableMarkets: "EG,US" ,
            albumType:"Album",
            hasTracks:[{
              trackId: "5"
            },{
                trackId: "6"
            }]
            
        }]);
 })
 test('get Artist albums',()=>{
    expect(ArtistTest.getAlbums("3","Album","EG",20,0,Albums)).toEqual(  
        [   {
            id:"2",
            artistId:"10" ,
            name:"KIDS" ,
            popularity:10 ,
            genre:"POP" ,
            releaseDate:"2-1-2000" ,
            availableMarkets: "EG,US" ,
            albumType:"Album",
            hasTracks:[{
              trackId: "5"
            },{
                trackId: "6"
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

 test('get Related Artist',()=>{
    expect(ArtistTest.getRelatedArtists("10")).toEqual(  
        0);
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

 test('find me as Artist',()=>{
    expect(ArtistTest.findMeAsArtist("10")).toEqual(  
        0);
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

 test('get top tracks for invalid Artist in EG',()=>{
    expect(ArtistTest.getTopTracks("10","EG",Tracks)).toEqual(  
 0);
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

 test('get tracks for Artist ',()=>{
    expect(ArtistTest.getTracks("10",Tracks)).toEqual(  
 0);
 })
 
 test('add track for Artist ',()=>{
    expect(ArtistTest.addTrack("1","3")).toEqual(  
      1);
 })
 test('add track for invalid Artist ',()=>{
    expect(ArtistTest.addTrack("10","3")).toEqual(  
      0);
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
        {
            genre:[] ,
            type:"artist" ,
            name:"Nada",
            images:[] ,
            id:"3",
            info:"NADA ARTIST" ,
           },
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
            id:"4",
            info: "this is me",
           }
       ]
           
       
      });
 })
 test('Create Artist',()=>{
    expect(ArtistTest.createArtist(user2,"this is nour",0,["DANCE"])).toEqual(  
     {
        id:"5",
        info: "this is nour",
        popularity: 0,
        genre: ["DANCE"],
        type: "Artist",
        Name: "nour",
        userId: "2",
        popularity: 0,
        images: [],
        addAlbums: [],
        addTracks: []
      });
 })
