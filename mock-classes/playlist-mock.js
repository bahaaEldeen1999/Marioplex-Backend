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
        return playlist;

    },
   
}
module.exports=MockPlaylist;