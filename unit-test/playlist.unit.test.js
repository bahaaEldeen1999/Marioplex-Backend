MockPlaylist=require('../mock-classes/playlist-mock');

const PlaylistTest =  MockPlaylist;
PlaylistTest.playlists = [
   {
      id:"1",
      Description:"Konniciwa minna san",
      popularity:4,
      type:"playlist",
      ownerId:"1",
      collaborative:false,
      name:"HELLO SLEEP WALKERS",
      isPublic:true,
      images:[],
      snapshot:[
          {
              id:"1",
              hasTracks:["1","2","3","4"]
          }
      ]
   },
   {
    id:"2",
    Description:"Konniciwa minna san",
    collaborative:false,
    popularity:10,
    type:"playlist",
    ownerId:"2",
    name:"BYE SLEEP WALKERS",
    isPublic:true,
    images:[],
    snapshot:[]
   },
   {
    id:"3",
    Description:"Konniciwa minna san",
    collaborative:false,
    popularity:20,
    type:"playlist",
    ownerId:"3",
    name:"TEST SLEEP WALKERS",
    isPublic:true,
    images:[],
    snapshot:[]
   },
   {
    id:"4",
    Description:"Konniciwa minna san",
    collaborative:false,
    popularity:0,
    type:"playlist",
    ownerId:"3",
    name:"TEST SLEEP WALKERS",
    isPublic:false,
    images:[],
    snapshot:[]
   }
]

const user = {
   id:"1",
   createPlaylist:[
       {
           playListId:"1",
           isPrivate:false
       }
   ],
   followPlaylist:[
    {
        playListId:"1",
        isPrivate:false
    },
    {
        playListId:"2",
        isPrivate:false
    }
]
}

const user2 = {
    id:"2",  
    createPlaylist:[
        {
            playListId:"4",
            isPrivate:true
        }
    ]
 }
 const user3 = {
    id:"3",  
    followPlaylist:[
        {
            playListId:"4",
            isPrivate:true
        }
    ]
 }



test('get playlist with id 1',()=>{
   expect(PlaylistTest.getPlaylist("1")).toEqual(  
    {
        id:"1",
        Description:"Konniciwa minna san",
        popularity:4,
        type:"playlist",
        ownerId:"1",
        collaborative:false,
        name:"HELLO SLEEP WALKERS",
        isPublic:true,
        images:[],
        snapshot:[
            {
                id:"1",
                hasTracks:["1","2","3","4"]
            }
        ]
     });
})

test('get playlist with id 10 which is not found',()=>{
   expect(PlaylistTest.getPlaylist("10")).toEqual(0);
})

test('get popular playlist',()=>{
    expect(PlaylistTest.getPopularPlaylists()).toEqual(  
        [   {
            id:"3",
            Description:"Konniciwa minna san",
            collaborative:false,
            popularity:20,
            type:"playlist",
            ownerId:"3",
            name:"TEST SLEEP WALKERS",
            isPublic:true,
            images:[],
            snapshot:[]
           },
           {
            id:"2",
            Description:"Konniciwa minna san",
            collaborative:false,
            popularity:10,
            type:"playlist",
            ownerId:"2",
            name:"BYE SLEEP WALKERS",
            isPublic:true,
            images:[],
            snapshot:[]
           },
            {
               id:"1",
               Description:"Konniciwa minna san",
               popularity:4,
               type:"playlist",
               ownerId:"1",
               collaborative:false,
               name:"HELLO SLEEP WALKERS",
               isPublic:true,
               images:[],
               snapshot:[
                   {
                       id:"1",
                       hasTracks:["1","2","3","4"]
                   }
               ]
            },{
                id:"4",
                Description:"Konniciwa minna san",
                collaborative:false,
                popularity:0,
                type:"playlist",
                ownerId:"3",
                name:"TEST SLEEP WALKERS",
                isPublic:false,
                images:[],
                snapshot:[]
            }
         
         ]
         );
 })

 test('check if user has a playlist which he has ',()=>{
    expect(PlaylistTest.checkIfUserHasPlaylist(user,"1")).toEqual( 
        {
            playListId:"1",
            isPrivate:false
        })
     
 })

 test('check if user has a playlist which he has not ',()=>{
    expect(PlaylistTest.checkIfUserHasPlaylist(user,"4")).toEqual( 
       0)
     
 })
 test('check if user follow a playlist which he does ',()=>{
    expect(PlaylistTest.checkFollowPlaylistByUser(user,"2")).toEqual( 
        {
            playListId:"2",
            isPrivate:false
        })
     
 })

 test('check if user follow a playlist which he has does not ',()=>{
    expect(PlaylistTest.checkFollowPlaylistByUser(user,"10")).toEqual( 
       0)
     
 })
 test('check if a new user follow a playlist ',()=>{
    expect(PlaylistTest.checkFollowPlaylistByUser(user2,"2")).toEqual( 
       0)
     
 })
 test('get playlist with tracks for a valid playlist id ',()=>{
    expect(PlaylistTest.getPlaylistWithTracks("1",undefined,user)).toEqual( 
      [  {
            id:"1",
            type:"playlist",
            name:"HELLO SLEEP WALKERS",            
            ownerId:"1",
            collaborative:false,
            isPublic:true,
            images:[],
            tracks:["1","2","3","4"]
         }])
    
     
 })
 test('get playlist with tracks for an private playlist id ',()=>{
    expect(PlaylistTest.getPlaylistWithTracks("4",undefined,user2)).toEqual( 
        [  {
            id:"4",
            type:"playlist",
            name:"TEST SLEEP WALKERS",
            ownerId:"3",
            collaborative:false,
            isPublic:false,
            images:[],
            tracks:[]
         }])
 })
 test('get playlist with tracks for an private playlist id ',()=>{
    expect(PlaylistTest.getPlaylistWithTracks("4",undefined,user3)).toEqual( 
        [  {
            id:"4",
            type:"playlist",
            name:"TEST SLEEP WALKERS",
            ownerId:"3",
            collaborative:false,
            isPublic:false,
            images:[],
            tracks:[]
         }])
 })
 test('get playlist with tracks for an invalid playlist id ',()=>{
    expect(PlaylistTest.getPlaylistWithTracks("10",undefined,user)).toEqual( 
      0)
 })

 test('create a playlist',()=>{
    expect(PlaylistTest.createPlaylist(user,"RELAX","FUN KIDS")).toEqual( 
        {
            id: "5",
            type: "playlist",
            Description: "FUN KIDS",
            collaborative: false,
            name: "RELAX",
            isPublic: true,
            ownerId: "1",
            images: [],
            snapshot: []
        })
 })

 test('Follow a playlist that the user doesnt follow',()=>{
    expect(PlaylistTest.followPlaylits(user,"3",false)).toEqual( 
      1)
 })
 test('Follow a playlist that the user doesnt follow',()=>{
    expect(PlaylistTest.followPlaylits(user2,"3",false)).toEqual( 
      1)
 })
 test('Follow a playlist that the user doesnt follow',()=>{
    expect(PlaylistTest.followPlaylits(user,"10",false)).toEqual( 
      0)
 })
 test('Follow a playlist that the user already follows',()=>{
    expect(PlaylistTest.followPlaylits(user,"2",false)).toEqual( 
      0)
 })

 test('Unfollow a playlist that the user follows',()=>{
    expect(PlaylistTest.unfollowPlaylist(user,"3")).toEqual( 
      1)
 })

 test('Unfollow a playlist that the user doesnt follow',()=>{
    expect(PlaylistTest.unfollowPlaylist(user,"3")).toEqual( 
      0)
 })

 test('Unfollow a playlist that the user doesnt follow',()=>{
    expect(PlaylistTest.unfollowPlaylist(user,"10")).toEqual( 
      0)
 })

 
 test('add tracks to a playlist that the user has created',()=>{
    expect(PlaylistTest.addTrackToPlaylist("10",["4","5","6"])).toEqual( 
        0)
 })

 test('add tracks to a playlist that the user has created',()=>{
    expect(PlaylistTest.addTrackToPlaylist("1",["4","5","6"])).toEqual( 
        {
            id:"1",
            Description:"Konniciwa minna san",
            popularity:4,
            type:"playlist",
            ownerId:"1",
            collaborative:false,
            name:"HELLO SLEEP WALKERS",
            isPublic:true,
            images:[],
            snapshot:[
                {
                    id:"1",
                    hasTracks:["1","2","3","4"]
                },
                {
                    id:"2",
                    hasTracks:["1","2","3","4","5","6"],
                    action:"Add Tracks"
                },
            ]
         })
 })
 test('get playlist with tracks for a valid playlist id ',()=>{
    expect(PlaylistTest.getPlaylistWithTracks("1","2",user)).toEqual( 
      [  {
            id:"1",
            type:"playlist",
            name:"HELLO SLEEP WALKERS",            
            ownerId:"1",
            collaborative:false,
            isPublic:true,
            images:[],
            tracks:["1","2","3","4","5","6"]
         }])
    
     
 })
 test('update a playlist that the user has created',()=>{
    expect(PlaylistTest.updatePlaylistDetails("1",{name:"kill"})).toEqual( 
       { 
        id:"1",
        Description:"Konniciwa minna san",
        popularity:4,
        type:"playlist",
        ownerId:"1",
        collaborative:false,
        name:"kill",
        isPublic:true,
        images:[],
        snapshot:[
            {
                id:"1",
                hasTracks:["1","2","3","4"]
            },  
            {
                id:"2",
                hasTracks:["1","2","3","4","5","6"],
                action:"Add Tracks"
            }
        ]
     }
      )
 })

 test('update a playlist that the user has followed',()=>{
    expect(PlaylistTest.updatePlaylistDetails("4",{name:"kill",description:"OHAYO"})).toEqual(   
        {
            id:"4",
            Description:"OHAYO",
            collaborative:false,
            popularity:0,
            type:"playlist",
            ownerId:"3",
            name:"kill",
            isPublic:false,
            images:[],
            snapshot:[]
        }
      )
 })

 test('update a playlist that the user has followed',()=>{
    expect(PlaylistTest.updatePlaylistDetails("4",{description:"OHAYO"})).toEqual(   
        {
            id:"4",
            Description:"OHAYO",
            collaborative:false,
            popularity:0,
            type:"playlist",
            ownerId:"3",
            name:"kill",
            isPublic:false,
            images:[],
            snapshot:[]
        }
      )
 })
 test('update a playlist that is not found',()=>{
    expect(PlaylistTest.updatePlaylistDetails("10",{name:"kill",description:"OHAYO"})).toEqual(   
      0
      )
 })
 test('get current user playlists',()=>{
    expect(PlaylistTest.getUserPlaylists(user,undefined,undefined,true)).toEqual( 
      [ {
        id:"1",
        Description:"Konniciwa minna san",
        popularity:4,
        type:"playlist",
        ownerId:"1",
        collaborative:false,
        name:"kill",
        isPublic:true,
        images:[],
        snapshot:[
            {
                id:"1",
                hasTracks:["1","2","3","4"]
            },  
            {
                id:"2",
                hasTracks:["1","2","3","4","5","6"],
                action:"Add Tracks"
            }]
     },
     {
      id:"2",
      Description:"Konniciwa minna san",
      collaborative:false,
      popularity:10,
      type:"playlist",
      ownerId:"2",
      name:"BYE SLEEP WALKERS",
      isPublic:true,
      images:[],
      snapshot:[]
     }
  ])
 })

 test('get a user empty playlists',()=>{
    expect(PlaylistTest.getUserPlaylists(user3,undefined,undefined,false)).toEqual( 
      [  
  ])
 })
 test('get a user public playlists',()=>{
    expect(PlaylistTest.getUserPlaylists(user2,undefined,undefined,false)).toEqual( 
      [  {
        id:"3",
        Description:"Konniciwa minna san",
        collaborative:false,
        popularity:20,
        type:"playlist",
        ownerId:"3",
        name:"TEST SLEEP WALKERS",
        isPublic:true,
        images:[],
        snapshot:[]
       }
  ])
 })

 test('get a user public playlists',()=>{
    expect(PlaylistTest.getUserPlaylists(user2,20,0,false)).toEqual( 
      [  {
        id:"3",
        Description:"Konniciwa minna san",
        collaborative:false,
        popularity:20,
        type:"playlist",
        ownerId:"3",
        name:"TEST SLEEP WALKERS",
        isPublic:true,
        images:[],
        snapshot:[]
       }
  ])
 })

 test('get invalid user playlists',()=>{
    expect(PlaylistTest.getUserPlaylists(0,20,0,false)).toEqual( 
      0)
 })
 test('set playlist status that its collaborative to public ',()=>{
    expect(PlaylistTest.changePublic(user2,"4")).toEqual( 
      true)
 })
 test('set playlist status that its collaborative to public ',()=>{
    expect(PlaylistTest.changePublic(user2,"3")).toEqual( 
      true)
 })
 test('toggle collaboration of a palylist the user has',()=>{
    expect(PlaylistTest.changeCollaboration(user,"1")).toEqual( 
      true)
 })
 test('toggle collaboration of an invalid palylist ',()=>{
    expect(PlaylistTest.changeCollaboration(user,"10")).toEqual( 
      false)
 })
 test('set playlist status that its collaborative to public ',()=>{
    expect(PlaylistTest.changePublic(user,"1")).toEqual( 
      false)
 })

 test('set invalid playlist status in collaborative  ',()=>{
    expect(PlaylistTest.changePublic(user,"10")).toEqual( 
      false)
 })

 test('add invalid tracks to a playlist ',()=>{
    expect(PlaylistTest.addTrackToPlaylist("1",[])).toEqual( 
      0)
 })

 test('delete tracks to a playlist that the user has ',()=>{
    expect(PlaylistTest.removePlaylistTracks("1",["5","6"])).toEqual( 
        {
            id:"1",
            Description:"Konniciwa minna san",
            popularity:4,
            type:"playlist",
            ownerId:"1",
            collaborative:true,
            name:"kill",
            isPublic:false,
            images:[],
            snapshot:[
                {
                    id:"1",
                    hasTracks:["1","2","3","4"]
                },
                {
                    id:"2",
                    hasTracks:["1","2","3","4","5","6"],
                    action:"Add Tracks"
                },
                {
                    id:"3",
                    hasTracks:["1","2","3","4"],
                    action:"remove Tracks"
                }
            ]
         })
 })

 
 test('reorder tracks in a playlist that the user has ',()=>{
    expect(PlaylistTest.reorderPlaylistTracks("1",undefined,2,2,1)).toEqual( 
        {
            id:"1",
            Description:"Konniciwa minna san",
            popularity:4,
            type:"playlist",
            ownerId:"1",
            collaborative:true,
            name:"kill",
            isPublic:false,
            images:[],
            snapshot:[
                {
                    id:"1",
                    hasTracks:["1","2","3","4"]
                },
                {
                    id:"2",
                    hasTracks:["1","2","3","4","5","6"],
                    action:"Add Tracks"
                },
                {
                    id:"3",
                    hasTracks:["1","2","3","4"],
                    action:"remove Tracks"
                },
                {
                    id:"4",
                    hasTracks:["2","3","1","4"],
                    action:"reorder Tracks"
                }
            ]
         })
 })
 test('delete tracks to a playlist that the user has ',()=>{
    expect(PlaylistTest.removePlaylistTracks("1",["1","4"],"4")).toEqual( 
        {
            id:"1",
            Description:"Konniciwa minna san",
            popularity:4,
            type:"playlist",
            ownerId:"1",
            collaborative:true,
            name:"kill",
            isPublic:false,
            images:[],
            snapshot:[
                {
                    id:"1",
                    hasTracks:["1","2","3","4"]
                },
                {
                    id:"2",
                    hasTracks:["1","2","3","4","5","6"],
                    action:"Add Tracks"
                },
                {
                    id:"3",
                    hasTracks:["1","2","3","4"],
                    action:"remove Tracks"
                },
                {
                    id:"4",
                    hasTracks:["2","3","1","4"],
                    action:"reorder Tracks"
                },
                {
                    id:"5",
                    hasTracks:["2","3"],
                    action:"remove Tracks"
                }
            ]
         })
 })

  
 test('reorder tracks in a playlist that the user has ',()=>{
    expect(PlaylistTest.reorderPlaylistTracks("1","5",2,1,1)).toEqual( 
        {
            id:"1",
            Description:"Konniciwa minna san",
            popularity:4,
            type:"playlist",
            ownerId:"1",
            collaborative:true,
            name:"kill",
            isPublic:false,
            images:[],
            snapshot:[
                {
                    id:"1",
                    hasTracks:["1","2","3","4"]
                },
                {
                    id:"2",
                    hasTracks:["1","2","3","4","5","6"],
                    action:"Add Tracks"
                },
                {
                    id:"3",
                    hasTracks:["1","2","3","4"],
                    action:"remove Tracks"
                },
                {
                    id:"4",
                    hasTracks:["2","3","1","4"],
                    action:"reorder Tracks"
                },
                {
                    id:"5",
                    hasTracks:["2","3"],
                    action:"remove Tracks"
                },
                {
                    id:"6",
                    hasTracks:["3","2"],
                    action:"reorder Tracks"
                }
            ]
         })
 })
 test('delete a playlist that the user has created',()=>{
    expect(PlaylistTest.deletePlaylist(user,"1")).toEqual( 
      1)
 })

 test('delete a playlist that the user has not',()=>{
    expect(PlaylistTest.deletePlaylist(user,"10")).toEqual( 
      0)
 })

 let PlaylistTest2 = {};
 PlaylistTest2 = Object.assign(PlaylistTest2,MockPlaylist);
PlaylistTest2.playlists = [
   {
      id:"1",
      Description:"Konniciwa minna san",
      popularity:4,
      type:"playlist",
      ownerId:"1",
      collaborative:false,
      name:"HELLO SLEEP WALKERS",
      isPublic:true,
      images:[],
      snapshot:[
          {
              id:"1",
              hasTracks:["1","2","3","4"]
          }
      ]
   },
   {
    id:"2",
    Description:"Konniciwa minna san",
    collaborative:false,
    popularity:10,
    type:"playlist",
    ownerId:"2",
    name:"BYE SLEEP WALKERS",
    isPublic:true,
    images:[],
    snapshot:[]
   },
   {
    id:"3",
    Description:"Konniciwa minna san",
    collaborative:false,
    popularity:20,
    type:"playlist",
    ownerId:"3",
    name:"TEST SLEEP WALKERS",
    isPublic:true,
    images:[],
    snapshot:[]
   },
   {
    id:"4",
    Description:"Konniciwa minna san",
    collaborative:true,
    popularity:0,
    type:"playlist",
    ownerId:"3",
    name:"TEST SLEEP WALKERS",
    isPublic:false,
    images:[],
    snapshot:[]
   },
   {
       id:"5",
       Description:"Konniciwa minna san",
    collaborative:false,
    popularity:0,
    type:"playlist",
    ownerId:"3",
    name:"TEST SLEEP WALKERS",
    isPublic:false,
    images:[],
    snapshot:[]
   },
   {
    id:"66",
    Description:"Konniciwa minna san",
    collaborative:false,
    popularity:0,
    type:"playlist",
    ownerId:"3",
    name:"TEST SLEEP WALKERS",
    isPublic:false,
    images:[],
    snapshot:[]
},
{
    id:"6",
    Description:"Konniciwa minna san",
    collaborative:false,
    popularity:0,
    type:"playlist",
    ownerId:"3",
    name:"TEST SLEEP WALKERS",
    isPublic:false,
    images:[],
    snapshot:[]
},
{
    id:"7",
    Description:"Konniciwa minna san",
    collaborative:false,
    popularity:0,
    type:"playlist",
    ownerId:"3",
    name:"TEST SLEEP WALKERS",
    isPublic:false,
    images:[],
    snapshot:[]
},
{
    id:"8",
    Description:"Konniciwa minna san",
    collaborative:false,
    popularity:0,
    type:"playlist",
    ownerId:"3",
    name:"TEST SLEEP WALKERS",
    isPublic:false,
    images:[],
    snapshot:[]
},
{
    id:"9",
    Description:"Konniciwa minna san",
    collaborative:false,
    popularity:0,
    type:"playlist",
    ownerId:"3",
    name:"TEST SLEEP WALKERS",
    isPublic:false,
    images:[],
    snapshot:[]
},
{
    id:"10",
    Description:"Konniciwa minna san",
    collaborative:false,
    popularity:0,
    type:"playlist",
    ownerId:"3",
    name:"TEST SLEEP WALKERS",
    isPublic:false,
    images:[],
    snapshot:[]
},
{
    id:"11",
    Description:"Konniciwa minna san",
    collaborative:false,
    popularity:0,
    type:"playlist",
    ownerId:"3",
    name:"TEST SLEEP WALKERS",
    isPublic:false,
    images:[],
    snapshot:[]
},
{
    id:"12",
    Description:"Konniciwa minna san",
    collaborative:false,
    popularity:0,
    type:"playlist",
    ownerId:"3",
    name:"TEST SLEEP WALKERS",
    isPublic:false,
    images:[],
    snapshot:[]
},
{
    id:"13",
    Description:"Konniciwa minna san",
    collaborative:false,
    popularity:0,
    type:"playlist",
    ownerId:"3",
    name:"TEST SLEEP WALKERS",
    isPublic:false,
    images:[],
    snapshot:[]
},
{
    id:"14",
    Description:"Konniciwa minna san",
    collaborative:false,
    popularity:0,
    type:"playlist",
    ownerId:"3",
    name:"TEST SLEEP WALKERS",
    isPublic:false,
    images:[],
    snapshot:[]
},
{
    id:"15",
    Description:"Konniciwa minna san",
    collaborative:false,
    popularity:0,
    type:"playlist",
    ownerId:"3",
    name:"TEST SLEEP WALKERS",
    isPublic:false,
    images:[],
    snapshot:[]
},
{
    id:"16",
    Description:"Konniciwa minna san",
    collaborative:false,
    popularity:0,
    type:"playlist",
    ownerId:"3",
    name:"TEST SLEEP WALKERS",
    isPublic:false,
    images:[],
    snapshot:[]
},
{
    id:"17",
    Description:"Konniciwa minna san",
    collaborative:false,
    popularity:0,
    type:"playlist",
    ownerId:"3",
    name:"TEST SLEEP WALKERS",
    isPublic:false,
    images:[],
    snapshot:[]
},
{
    id:"18",
    Description:"Konniciwa minna san",
    collaborative:false,
    popularity:0,
    type:"playlist",
    ownerId:"3",
    name:"TEST SLEEP WALKERS",
    isPublic:false,
    images:[],
    snapshot:[]
},
{
    id:"19",
    Description:"Konniciwa minna san",
    collaborative:false,
    popularity:0,
    type:"playlist",
    ownerId:"3",
    name:"TEST SLEEP WALKERS",
    isPublic:false,
    images:[],
    snapshot:[]
},
{
    id:"20",
    Description:"Konniciwa minna san",
    collaborative:false,
    popularity:0,
    type:"playlist",
    ownerId:"3",
    name:"TEST SLEEP WALKERS",
    isPublic:false,
    images:[],
    snapshot:[
        {
            id:'1',
            hasTracks:['1','2']
        }
    ]
},
{
    id:"21",
    Description:"Konniciwa minna san",
    collaborative:false,
    popularity:0,
    type:"playlist",
    ownerId:"3",
    name:"TEST SLEEP WALKERS",
    isPublic:false,
    images:[],
    snapshot:[]
},
]

const user5 = {
    id:"5",  
    createPlaylist:[
        {
            playListId:"44",
            isPrivate:true
        },
        {
            playListId:"4",
            isPrivate:true
        },
        {
            playListId:"66",
            isPrivate:true
        },
        {
            playListId:"54",
            isPrivate:true
        },
        {
            playListId:"34",
            isPrivate:true
        },
    ],
    followPlaylist:[
        {
            playListId:"44",
            isPrivate:true
        },
        {
            playListId:"4",
            isPrivate:false
        },
        {
            playListId:"17",
            isPrivate:false
        },

    ]
 }

 const user6 = {
    id:"6" 
   
 }

 test('get playlist with tracks that is private and user dont own or follow',()=>{
    expect(PlaylistTest2.getPopularPlaylists()).toBeTruthy();
})

test('get playlist with tracks that is private and user dont own or follow',()=>{
    expect(PlaylistTest2.getPlaylistWithTracks('5',undefined,user5)).toBeFalsy();
})

test('create playlist with no description',()=>{
    expect(PlaylistTest2.createPlaylist(user5,"any name",undefined)).toBeTruthy();
})




test('unfollow playlist for user with no follwing plalists',()=>{
    expect(PlaylistTest2.unfollowPlaylist(user6,'3')).toBeFalsy();
})


test('add tracks to playlists for playlist with length 0 snapshot',()=>{
    expect(PlaylistTest2.addTrackToPlaylist('16','1')).toBeTruthy();
})

test('get user followed playlist with wrong offset',()=>{
    expect(PlaylistTest2.getUserPlaylists(user5,undefined,10000)).toBeTruthy();
})

test('get user followed playlist with right limit',()=>{
    expect(PlaylistTest2.getUserPlaylists(user5,1,0)).toBeTruthy();
})



test('change collaboration of playlist to be false',()=>{
    expect(PlaylistTest2.changeCollaboration(user5,'4')).toBeTruthy();
})

test('change collaboration of playlist to be true',()=>{
    expect(PlaylistTest2.changeCollaboration(user5,'4')).toBeTruthy();
})



test('delete playlist that user dont own',()=>{
    expect(PlaylistTest2.deletePlaylist(user5,'20')).toBeFalsy();
})

test('delete playlist that user  own',()=>{
    expect(PlaylistTest2.deletePlaylist(user5,'4')).toBeTruthy();
})

test('change public of playlist not owned or followed by user',()=>{
    expect(PlaylistTest2.changePublic(user5,'16')).toBeFalsy();
})

test('change public of playlist not owned but followed by user',()=>{
    expect(PlaylistTest2.changePublic(user5,'17')).toBeTruthy();
})



test('remove track from non existing playlist',()=>{
    expect(PlaylistTest2.removePlaylistTracks('1000')).toBeFalsy();
})


test('remove track from playlist with empty snapshot',()=>{
    expect(PlaylistTest2.removePlaylistTracks('21')).toBeFalsy();
})

test('remove track from playlist with  snapshot that dont exist',()=>{
    expect(PlaylistTest2.removePlaylistTracks('20',['3','4'],'22')).toBeFalsy();
})



test('reorder track for non existing playlist',()=>{
    expect(PlaylistTest2.reorderPlaylistTracks('1000')).toBeFalsy();
})


test('reorder track for playlist with empty snapshot',()=>{
    expect(PlaylistTest2.reorderPlaylistTracks('21')).toBeFalsy();
})

test('reorder track for playlist with  snapshot that dont exist',()=>{
    expect(PlaylistTest2.reorderPlaylistTracks('20',['3','4'],'22')).toBeFalsy();
})

test('reorder track for playlist with  invalid start less than 1 and no length and invalid before',()=>{
    expect(PlaylistTest2.reorderPlaylistTracks('20',undefined,-1,undefined,-1)).toBeTruthy();
})


test('reorder track for playlist with  invalid more than length of snapshot tracks and length more than number of tracks and invalid before larer than tracks length ',()=>{
    expect(PlaylistTest2.reorderPlaylistTracks('20',undefined,100,100,100)).toBeTruthy();
})

test('reorder tracks when before = 0 ',()=>{
    expect(PlaylistTest2.reorderPlaylistTracks('20',undefined,1,1,0)).toBeTruthy();
})
