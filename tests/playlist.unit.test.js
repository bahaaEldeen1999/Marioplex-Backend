const MockPlaylist =  {
    
    playlists : [],
    getPlaylist : function(playlistId){
        for(let i=0;i<this.playlists.length;i++){
            if(this.playlists[i].id==playlistId){
                return this.playlists[i];
            }
        }
        return 0;
    },
    
    getPopularPlaylists: function(){
        let replaylists = [];
        let limit=(this.playlists.length>20)?20:this.playlists.length;
        for(let i=0;i<limit;i++){
            replaylists.push(this.playlists[i]);
        }
        replaylists.sort((a, b) => (a.popularity > b.popularity) ? -1 : 1);
        return replaylists;
    },

    checkIfUserHasPlaylist: function(user, playlistID) {

        const userPlaylists = user.createPlaylist;

        if (userPlaylists) {
            for(let i=0;i<userPlaylists.length;i++){
                if(userPlaylists[i].playListId==playlistID){
                    return userPlaylists[i]; 
                }
            }
        }
        return 0;
    },

    checkFollowPlaylistByUser: function(user, playlistID) {

        const followedplaylists = user.followPlaylist;

        if (followedplaylists) {
            for(let i=0;i<followedplaylists.length;i++){
                if(followedplaylists[i].playListId==playlistID){
                    return followedplaylists[i]; 
                }
            }
        }
        return 0;
    },
    getPlaylistWithTracks: function(playlistId, snapshotID, user) {
        const playlist =  this.getPlaylist(playlistId);
        if(!playlist) return 0;
        if (playlist.isPublic || this.checkIfUserHasPlaylist(user, playlistId) || this.checkFollowPlaylistByUser(user, playlistId)) {
            var playlistJson = [];
            var tracks = [];
            let snapshot;
            let found = false;
            for (let i = 0; i < playlist.snapshot.length; i++) {
                if (playlist.snapshot[i].id == snapshotID) {
                    snapshot = i;
                    found = true;
                }
            }
            if (!found) { snapshot = playlist.snapshot.length - 1; }
            if (playlist.snapshot[snapshot] != undefined) {
                for (let i = 0; i < playlist.snapshot[snapshot].hasTracks.length; i++) {
                    tracks.push(playlist.snapshot[snapshot].hasTracks[i]);
                }
            }
            playlistJson.push({ id: playlist.id, type: playlist.type, name: playlist.name, ownerId: playlist.ownerId, collaborative: playlist.collaborative, isPublic: playlist.isPublic, images: playlist.images, tracks: tracks });
            return playlistJson;
        }
        return 0;
    },
    createPlaylist: function(user, Name, description) {
        let desc = (description == undefined) ? "" : description;
        let length=this.playlists.length;
        length+=1;
        const Playlist = {
            id: length.toString(),
            type: "playlist",
            Description: desc,
            collaborative: false,
            name: Name,
            isPublic: true,
            ownerId: user.id,
            images: [],
            snapshot: []
        };
        this.playlists.push(Playlist);
        return Playlist;
    },
    deletePlaylist: function(user, playlistId) {
        const playlist =  this.getPlaylist(playlistId);
        if (playlist) {
            const userHasPlaylist =  this.checkIfUserHasPlaylist(user, playlistId);
            if (userHasPlaylist) {
                // connect to db and find play with the same id then return it as json file
                for (let i = 0; i < user.createPlaylist.length; i++) {

                    if (user.createPlaylist[i].playListId == playlistId) {
                        user.createPlaylist.splice(i, 1);
                    }
                }
                return this.unfollowPlaylist(user, playlistId);

            }
        } else return 0;
    },
    followPlaylits: function(user, playlistID, isPrivate) {
        let check = this.getPlaylist(playlistID);
        if (!check) { return 0; }
        const followedBefore = this.checkFollowPlaylistByUser(user, playlistID)
        if (followedBefore) {
            return 0;
        }

        if (!isPrivate || isPrivate == 'false') {
            isPrivate = false;
        } else
            isPrivate = true;
        if (user.followPlaylist) {
            user.followPlaylist.push({
                playListId: playlistID,
                isPrivate: isPrivate

            });
            return 1;
        }
        user.followPlaylist = [];
        user.followPlaylist.push({

            playListId: playlistID,
            isPrivate: isPrivate
        });
        return 1;
    },

    unfollowPlaylist: function(user, playlistID) {
        let check =  this.getPlaylist(playlistID);
        if (!check) { return 0; }
        const followedBefore = this.checkFollowPlaylistByUser(user, playlistID)

        if (!followedBefore) {

            return 0;
        }
        if (user.followPlaylist) {

            for (let i = 0; i < user.followPlaylist.length; i++) {

                if (user.followPlaylist[i].playListId == playlistID) {

                    user.followPlaylist.splice(i, 1);
                    return 1;
                }
            }
        }
        return 0;
    },
    addTrackToPlaylist: function(playlistID, tracksIds) {

        if (!tracksIds || tracksIds.length == 0) return 0;
        let playlist = this.getPlaylist(playlistID);
        if (!playlist) return 0;
        let len = playlist.snapshot.length;
        let tracks = [];
        if (len) {
            for (let i = 0; i < playlist.snapshot[len - 1].hasTracks.length; i++) {
                tracks.push(playlist.snapshot[len - 1].hasTracks[i]);
            }
        }
        for (let i = 0; i < tracksIds.length; i++) {
            tracks.push(tracksIds[i]);
        }
        let uniquetracks = this.removeDups(tracks);
        playlist.snapshot.push({
            id:(playlist.snapshot.length+1).toString(),
            hasTracks: uniquetracks,
            action: 'Add Tracks'
        });
        return playlist;
    },
    removeDups:  function(tracks) {
        let unique = {};
        tracks.forEach(function(i) {
            if (!unique[i]) {
                unique[i] = true;
            }
        });
        return Object.keys(unique);
    },
    updatePlaylistDetails:  function(playlistId, details) {
        
        let playlist =  this.getPlaylist(playlistId);
        if (!playlist) return 0;
        if(details.name){
            playlist.name=details.name;
        }
        if(details.description){
            playlist.Description=details.description;
        }
        return playlist;
    },
    getUserPlaylists:  function(user, limit, offset, isuser) {
        if (!user) return 0;
        let playlistsIds = [];
        let playlists = [];
        for (var i = 0; i < user.followPlaylist.length; i++) {
            if (isuser) {
                playlistsIds.push(user.followPlaylist[i].playListId);
            } else {
                if (!user.followPlaylist[i].isPrivate) {
                    playlistsIds.push(user.followPlaylist[i].playListId);
                }
            }
        }
        for (var i = 0; i < playlistsIds.length; i++) {
            let playlist = this.getPlaylist(playlistsIds[i]);
            playlists.push(playlist);
        }
        let start = 0;
        let end = playlists.length;
        if (offset != undefined) {
            if (offset >= 0 && offset <= playlists.length) {
                start = offset;
            }
        }
        if (limit != undefined) {
            if ((start + limit) > 0 && (start + limit) <= playlists.length) {
                end = start + limit;
            }
        }
        playlists.slice(start, end);
        return playlists;
    },
    changeCollaboration:  function(user, playlistID) {
        let playlist = this.getPlaylist(playlistID);
        if (!playlist) return false;
        playlist.collaborative = !playlist.collaborative;
        if (playlist.collaborative) {
            playlist.isPublic = false;
            for (var i = 0; i < user.createPlaylist.length; i++) {
                if (user.createPlaylist[i].playListId == playlistID) {
                    user.createPlaylist[i].isPrivate = true;
                    return true;
                }
            }
        }
        return true;

    },
    changePublic:  function(user, playlistID) {
        let playlist = this.getPlaylist(playlistID);
        if (!playlist) return false;
        if (playlist.collaborative) { return false; }
        playlist.isPublic = !playlist.isPublic;

        for (var i = 0; i < user.createPlaylist.length; i++) {
            if (user.createPlaylist[i].playListId == playlistID) {
                user.createPlaylist[i].isPrivate = !user.createPlaylist[i].isPrivate;
                return true;
            }
        }

        for (var i = 0; i < user.followPlaylist.length; i++) {
            if (user.followPlaylist[i].playListId == playlistID) {
                user.followPlaylist[i].isPrivate = !user.followPlaylist[i].isPrivate;
                return true;
            }
        }
        return false;

    },

    removePlaylistTracks: function(playlistID, tracksids, snapshotid) {
        let playlist = this.getPlaylist(playlistID);
        if (!playlist) return 0;
        let tracks = [];
        let len = playlist.snapshot.length;
        if (len == 0) { return 0; }
        let found = false;
        if (snapshotid != undefined) {
            for (var i = 0; i < playlist.snapshot.length; i++) {
                if (playlist.snapshot[i].id == snapshotid) {
                    len = i + 1;
                    found = true;
                    break;
                }
            }
            if (!found) { return 0; }
        }
        for (var i = 0; i < playlist.snapshot[len - 1].hasTracks.length; i++) {
            let track = playlist.snapshot[len - 1].hasTracks[i];
                tracks.push(track);
        }
        for (var i = 0; i < tracksids.length; i++) {
            for (var j = 0; j < tracks.length; j++) {
                if (tracksids[i] == tracks[j]) {
                    tracks.splice(j, 1);
                }
            }
        }
        playlist.snapshot.push({
            id:(playlist.snapshot.length+1).toString(),
            hasTracks: tracks,
            action: 'remove Tracks'
        });
        return playlist;

    },
    reorderPlaylistTracks: function(playlistID, snapshotid, start, length, before) {
        let playlist = this.getPlaylist(playlistID);
        if (!playlist) return 0;
        let tracks = [];
        let len = playlist.snapshot.length;
        if (len == 0) { return 0; }
        let found = false;
        if (snapshotid != undefined) {
            for (var i = 0; i < playlist.snapshot.length; i++) {
                if (playlist.snapshot[i].id == snapshotid) {
                    len = i + 1;
                    found = true;
                    break;
                }
            }
            if (!found) { return 0; }
        }
        for (var i = 0; i < playlist.snapshot[len - 1].hasTracks.length; i++) {
                tracks.push(playlist.snapshot[len - 1].hasTracks[i]);
        }
        let orderedtracks = [];
        start--;
        let stindex = Number(start) < 1 ? 0 : Number(start) > tracks.length ? tracks.length - 1 : Number(start);
       //endindex fix (!length)?Number(stindex+1) to (!length)?Number(stindex)
        let endindex = (!length) ? Number(stindex ) : (stindex + length - 1);
        endindex = endindex > tracks.length - 1 ? tracks.length - 1 : endindex;
        before--;
        before = before < 0 ? 0 : before > tracks.length - 1 ? tracks.length - 1 : before;
        for (let i = stindex; i <= endindex; i++) {
            orderedtracks.push(tracks[i]);
        }
        tracks.splice(stindex, endindex - stindex + 1);
        if (before != 0) tracks.splice(before, 0, ...orderedtracks);
        else tracks.unshift(...orderedtracks);
        playlist.snapshot.push({
            id:(playlist.snapshot.length+1).toString(),
            hasTracks: tracks,
            action: 'reorder Tracks'
        });
        console.log(tracks);
        return playlist;

    },
   
}

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

 test('get playlist with tracks for an invalid playlist id ',()=>{
    expect(PlaylistTest.getPlaylistWithTracks("10",undefined,user)).toEqual( 
      0)
 })

 test('create a playlist',()=>{
    expect(PlaylistTest.createPlaylist(user,"RELAX","FUN KIDS")).toEqual( 
        {
            id: "4",
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

 test('toggle collaboration of a palylist the user has',()=>{
    expect(PlaylistTest.changeCollaboration(user,"1")).toEqual( 
      true)
 })
 test('set playlist status that its collaborative to public ',()=>{
    expect(PlaylistTest.changePublic(user,"1")).toEqual( 
      false)
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

 test('delete a playlist that the user has created',()=>{
    expect(PlaylistTest.deletePlaylist(user,"1")).toEqual( 
      1)
 })