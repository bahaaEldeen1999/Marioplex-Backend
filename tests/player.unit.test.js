const MockPlayer = {
    getNextAndPrev: function(hasTracks, trackID, user) {
        if (user.queue.queuIndex == -1) {
            for (let i = 0; i < hasTracks.length; i++) {
                if (trackID == hasTracks[i].trackId) {
                    return {
                        "next_track": i + 1 < hasTracks.length ? hasTracks[i + 1] : 0, //wrap around
                        "prev_track": i - 1 >= 0 ? hasTracks[i - 1] : hasTracks[hasTracks.length - 1], // wrap around
                        "last_playlist_track_index": i,
                    }
                }
            }
        } else {
            for (let i = user.queue.queuIndex + 1; i < hasTracks.length; i++) {
                if (trackID == hasTracks[i].trackId) {

                    return {
                        "next_track": i + 1 < hasTracks.length ? user.queue.tracksInQueue[user.queue.queuIndex] : 0, //wrap around
                        "prev_track": i - 1 >= user.queue.queuIndex + 1 ? hasTracks[i - 1] : hasTracks[hasTracks.length - 1], // wrap around
                        "last_playlist_track_index": i,
                    }
                }
            }
        }
        return {
            "next_track": undefined,
            "prev_track": undefined,
        }
    },
    skipNext: function(user) {
        if (!user.player) user.player = {};
        if (!user.player.next_track) user.player.next_track = {};
        if (!user.player.prev_track) user.player.prev_track = {};
        user.player.current_track = user.player.next_track;
        if (user.queue.queuIndex == -1) { // no element add by add to queue
            user.player.prev_track['trackId'] = user.queue.tracksInQueue[user.player["last_playlist_track_index"]].trackId;
            //if last index for track from  playlist  == last element in queue wrap around 
            if (user.player["last_playlist_track_index"] == user.queue.tracksInQueue.length - 1) {
                user.player["last_playlist_track_index"] = 0;
                user.player.next_track = user.queue.tracksInQueue[user.player["last_playlist_track_index"] + 1].trackId;
                return 2; // to determine it is the frist track in playlist
            } else user.player["last_playlist_track_index"] = user.player["last_playlist_track_index"] + 1;

            if (user.player["last_playlist_track_index"] >= user.queue.tracksInQueue.length - 1) { //if length -1 set next by  frist element in queue
                user.player.next_track = user.queue.tracksInQueue[0].trackId;

            } else {
                user.player.next_track = user.queue.tracksInQueue[user.player["last_playlist_track_index"] + 1].trackId;

            }

        } else {
            if (user.queue.queuIndex == 0) { // if there is one element add by add to queue
                user.queue.tracksInQueue.splice(0, 1); // when play any track which is add by add to queue it should be deleted
                user.player["last_playlist_track_index"]--; // becouse when next this track not be change becouse the current which add by add to queue not add by playlist or album
                if (user.player["last_playlist_track_index"] >= user.queue.tracksInQueue.length - 1) {
                    user.player.next_track = user.queue.tracksInQueue[0].trackId;
                } else {
                    user.player.next_track = user.queue.tracksInQueue[user.player["last_playlist_track_index"] + 1].trackId;
                }
                user.queue.queuIndex = -1; // becouse when delete this track there is not track add by add to queue
                user.player["prev_track"] = user.queue.tracksInQueue[user.player["last_playlist_track_index"]].trackId;

            } else {
                user.queue.tracksInQueue.splice(user.queue.queuIndex, 1);
                user.player["last_playlist_track_index"]--;
                user.queue.queuIndex = user.queue.queuIndex - 1;
                const index = user.queue.queuIndex;

                user.player.next_track = user.queue.tracksInQueue[index].trackId;

                user.player.prev_track = user.queue.tracksInQueue[user.player["last_playlist_track_index"]].trackId;

            }
        }
        return 1;
    },

    //skip to previous
    skipPrevious: function(user) {
        if (!user.player) user.player = {};
        if (!user.player.next_track) user.player.next_track = {};
        if (!user.player.prev_track) user.player.prev_track = {};
        const current = user.player.current_track;
        const lastplaylist = user.queue.tracksInQueue[user.player["last_playlist_track_index"]].trackId;
        if (lastplaylist + 1 == current + 1) {
            // if current track == last track from playlist which is in queue
            //which mean that (the current not add to queue by add to queue)
            user.player.current_track = user.player.prev_track;
            // no track added by add to queue
            if (user.queue.queuIndex == -1) {
                user.player.next_track = user.queue.tracksInQueue[user.player["last_playlist_track_index"]].trackId;


                if (user.player["last_playlist_track_index"] == 1) {
                    //the last current is the secound element in the queue and
                    user.player.prev_track = user.queue.tracksInQueue[user.queue.tracksInQueue.length - 1].trackId;
                    user.player["last_playlist_track_index"] = 0;

                } else {
                    // if frist track wap around
                    if (user.player["last_playlist_track_index"] == 0) {
                        user.player["last_playlist_track_index"] = user.queue.tracksInQueue.length - 1;
                        user.player.prev_track = user.queue.tracksInQueue[user.queue.tracksInQueue.length - 2].trackId;


                    } else {
                        user.player.prev_track = user.queue.tracksInQueue[user.player["last_playlist_track_index"] - 2].trackId;

                        user.player["last_playlist_track_index"]--;
                    }
                }
                return 0;
            } else {
                user.player.next_track = user.queue.tracksInQueue[user.queue.queuIndex].trackId;

                if (user.player["last_playlist_track_index"] == user.queue.queuIndex + 2) {
                    user.player.prev_track = user.queue.tracksInQueue[user.queue.tracksInQueue.length - 1].trackId;

                    user.player["last_playlist_track_index"]--;

                } else {
                    if (user.player["last_playlist_track_index"] == user.queue.queuIndex + 1) {
                        user.player["last_playlist_track_index"] = user.queue.tracksInQueue.length - 1;
                        user.player.prev_track = user.queue.tracksInQueue[user.queue.tracksInQueue.length - 2].trackId;

                    } else {
                        user.player.prev_track = user.queue.tracksInQueue[user.player["last_playlist_track_index"] - 2].trackId;
                        user.player["last_playlist_track_index"]--;
                    }
                }

                return 0;
            }
        } else {
            user.player.current_track = user.queue.tracksInQueue[user.player["last_playlist_track_index"]].trackId;
            if (user.player["last_playlist_track_index"] == user.queue.queuIndex + 1) {
                user.player.prev_track = user.queue.tracksInQueue[user.queue.tracksInQueue.length - 1].trackId;

            } else {
                user.player.prev_track = user.queue.tracksInQueue[user.player["last_playlist_track_index"] - 1].trackId;
            }

            return 0;
        }
    },

    setPlayerInstance: function(user, trackID) {

        // get next from the queue directly
        // get next track and prev Track in playlist by checking for id greater than track id
        const { "next_track": nextTrack, "prev_track": prevTrack, "last_playlist_track_index": current_index } = this.getNextAndPrev(user.queue.tracksInQueue, trackID, user);
        user.player["next_track"] = nextTrack ? nextTrack.trackId : undefined;
        user.player["prev_track"] = prevTrack ? prevTrack.trackId : undefined;
        user.player["current_track"] = trackID;
        user.player["last_playlist_track_index"] = current_index;
        user.player["is_playing"] = true;
        user.player["is_repeat"] = false;
        user.player["is_shuffled"] = false;
        return 1;

    },
    addRecentTrack: async function(user, trackID) {
        if (user.playHistory) {
            if (user.playHistory.length > 50) user.playHistory.pop();
            user.playHistory.unshift({
                trackId: trackID

            });

            return 1;
        } else {
            user.playHistory = [];
            user.playHistory.push({
                trackId: trackID
            });

            return 1;
        }

    },
    // clear user recent played track history
    clearRecentTracks: function(user) {
        user.playHistory = [];
        return 1;
    },
    // get recent tracks played by user
    getRecentTracks: function(user, limit) {
        limit = limit || 50;
        let tracks = [];
        if (!user.playHistory) return tracks;
        for (let i = 0; i < Math.min(user.playHistory.length, limit); i++) tracks.push(user.playHistory[i]);
        return tracks;
    },

    // to fill queue
    createQueue: function(user, isPlaylist, source, trackID, id) {
        if (!user.player) user.player = {};
        user.player.isPlaylist = isPlaylist;
        user.player.current_source = id;
        if (isPlaylist) {
            const playlist = source;
            user.player.playlistId = source;
            if (!playlist) return 0;
            sourceName = playlist.name;
            user.queue = {};
            user.queue.queuIndex = -1;
            user.queue.tracksInQueue = [];
            if (!playlist.snapshot || playlist.snapshot.length == 0) playlist.snapshot = [{ hasTracks: [] }];
            //console.log(playlist.snapshot, playlist);
            if (playlist.snapshot[playlist.snapshot.length - 1].hasTracks.length == 0) {

                return 1;
            }
            let i = 0;
            for (let j = 0; j < playlist.snapshot[playlist.snapshot.length - 1].hasTracks.length; j++) {
                if (trackID == playlist.snapshot[playlist.snapshot.length - 1].hasTracks[j]) {
                    user.queue.index = i;
                }
                user.queue.tracksInQueue.push({
                    trackId: playlist.snapshot[playlist.snapshot.length - 1].hasTracks[j],
                    isQueue: false
                });
                i++;
            }
            user.queue.fristQueueIndex = -1;
            return 1;
        } else {
            const album = source;
            if (!album) return 0;
            sourceName = album.name;
            user.queue = {};
            user.queue.queuIndex = -1;
            user.queue.tracksInQueue = [];
            if (!album.hasTracks) {

                return 1;
            }
            let i = 0;
            for (let track of album.hasTracks) {
                user.queue.tracksInQueue.push({
                    trackId: track.trackId,
                    isQueue: false
                });
                i++;
            }

            //console.log(user.queue);
            return 1;
        }
    },

    //random function
    rondom: function(low, high) {
        const randomValue = Math.floor(Math.random() * (high - low + 1) + low);
        return randomValue;
    },
    // to random tracks which add by playlist
    shuffleQueue: async function(user) {
        const track_last_playlist = user.queue.tracksInQueue[user.player["last_playlist_track_index"]].trackId;
        for (let i = user.queue.queuIndex + 1; i < user.queue.tracksInQueue.length; i++) {
            const randomIndex = this.rondom(user.queue.queuIndex + 1, user.queue.tracksInQueue.length - 1);
            const temp = user.queue.tracksInQueue[i].trackId;
            user.queue.tracksInQueue[i].trackId = user.queue.tracksInQueue[randomIndex].trackId;
            user.queue.tracksInQueue[randomIndex].trackId = temp;

        }
        return this.setNextPrevCurrent(user, track_last_playlist);
    },
    // to make queue same playlist order
    fillByplaylist: function(user) {
        const track_last_playlist = user.queue.tracksInQueue[user.player["last_playlist_track_index"]].trackId;
        if (user.player.isPlaylist) {
            const playlist = user.player.playlistId;
            if (!playlist.snapshot || playlist.snapshot.length == 0) playlist.snapshot = [{ hasTracks: [] }];
            if (playlist.snapshot[playlist.snapshot.length - 1].hasTracks.length == 0) {
                return this.setNextPrevCurrent(user, track_last_playlist);
            }
            let i = user.queue.queuIndex + 1;
            for (let j = 0; j < playlist.snapshot[playlist.snapshot.length - 1].hasTracks.length; j++) {
                user.queue.tracksInQueue[i].trackId = playlist.snapshot[playlist.snapshot.length - 1].hasTracks[j];
                i++;
            }

            return this.setNextPrevCurrent(user, track_last_playlist);
        } else {
            const album = user.player.playlistId;
            if (!album) return 0;
            if (!album.hasTracks) {
                return this.setNextPrevCurrent(user, track_last_playlist);
            }
            let i = 0;
            for (let track of album.hasTracks) {
                user.queue.tracksInQueue[i].trackId = track.trackId;
                i++;
            }

            return this.setNextPrevCurrent(user, track_last_playlist);
        }
    },
    //shuffle
    setShuffle: function(state, user) {
        if (user.queue.tracksInQueue) {
            if (state == 'true') {
                user.player['is_shuffled'] = true;
                return this.shuffleQueue(user);
            } else {
                user.player['is_shuffled'] = false;
                const ret = this.fillByplaylist(user);
                return ret;
            }
        }
        return 0
    },
    setNextPrevCurrent: function(user, lastTrack) {
        if (!user.player) user.player = {};
        if (!user.player.next_track) user.player.next_track = {};
        if (!user.player.prev_track) user.player.prev_track = {};
        for (let i = user.queue.queuIndex + 1; i < user.queue.tracksInQueue.length; i++) {
            if (user.queue.tracksInQueue[i].trackId + 1 == lastTrack + 1) {
                user.player["last_playlist_track_index"] = i;

                user.player.prev_track = i - 1 > user.queue.queuIndex ? user.queue.tracksInQueue[i - 1].trackId : user.queue.tracksInQueue[user.queue.tracksInQueue.length - 1].trackId;
                if (user.queue.queuIndex > -1) {
                    user.player.next_track = user.queue.tracksInQueue[user.queue.queuIndex].trackId;
                } else {
                    user.player.next_track = i + 1 > user.queue.tracksInQueue.length - 1 ? user.queue.tracksInQueue[0].trackId : user.queue.tracksInQueue[i + 1].trackId;
                }
                return 1;
            }
        }
    },
    getQueue: function(user) {
        const queue = user.queue;
        let tracks = [];
        if (!queue) return 0;
        if (!queue.tracksInQueue) return 0;
        const queueIndex = queue.queuIndex;
        // get tracks that was added to queue
        for (let i = 0; i < queueIndex + 1; i++) {
            tracks.push(user.queue.tracksInQueue[i]);
        }
        const lastplaylistIndex = user.player.last_playlist_track_index < 0 ? 0 : user.player.last_playlist_track_index;

        // get tracks that was next in playlist
        for (let i = lastplaylistIndex + 1; i < queue.tracksInQueue.length; i++) {

            if (i == queueIndex + 1)
                tracks.push(user.queue.tracksInQueue[i]);
            else
                tracks.push(user.queue.tracksInQueue[i]);
        }
        //if repeat should display all the queue
        if (user.player.is_repeat || user.player.is_shuffled) {
            for (let i = queueIndex + 1; i < lastplaylistIndex; i++) {
                if (i == queueIndex + 1)
                    tracks.push(user.queue.tracksInQueue[i]);
                else
                    tracks.push(user.queue.tracksInQueue[i]);
            }
        }
        return tracks;
    },

    addToQueue: function(user, trackID) {

        if (!user.queue) {
            user.queue = {};
            user.queue.tracksInQueue = [{
                trackId: trackID,
                isQueue: true,
            }];
            user.queue.queuIndex = 0; // now when add to queue become 1
            user.player.next_trac = user.queue.tracksInQueue[0].trackId; //set next by frist element add by add to queue
            return 1;
        } else {

            if (!user.queue.tracksInQueue) {
                user.queue.tracksInQueue = [{
                    trackId: trackID,
                    isQueue: true,
                }];
                user.queue.queuIndex = 0;
                user.player.next_track = user.queue.tracksInQueue[0].trackId;
                user.player["last_playlist_track_index"]++;
                return 1;
            } else {
                if (!user.queue.tracksInQueue[0].isQueue) {
                    user.queue.tracksInQueue.splice(0, 0, {
                        trackId: trackID,
                        isQueue: true,
                    });
                    user.queue.queuIndex = 0;
                    user.player.next_track = user.queue.tracksInQueue[0].trackId;
                    user.player["last_playlist_track_index"]++;

                    return 1;
                } else {
                    // if there is another track added by add to queue will shift the queue down and will increment  user.queue.queuIndex 
                    // to refer to the frist element add to queue by add to queue which is shifted down

                    let index = user.queue.queuIndex;
                    user.queue.tracksInQueue.splice(index, 0, {
                        trackId: trackID,
                        isQueue: true,
                    });
                    user.queue.queuIndex = index + 1;
                    user.player["last_playlist_track_index"]++;
                    return 1;
                }

            }
        }
    },

    resumePlaying: function(user) {
        const player = user.player;
        if (!player) return 0;
        user.player["is_playing"] = true;

        return 1;
    },
    repreatPlaylist: function(user, state) {
        if (!user.player) user.player = {};
        if (state == 'true' || state == true)
            user.player["is_repeat"] = true;
        else if (state == 'false' || state == false)
            user.player["is_repeat"] = false;
        else
            return 0;
        return 1;

    },
    pausePlaying: function(user) {
        const player = user.player;
        if (!player) return 0;
        user.player["is_playing"] = false;

        return 1;
    },

}
const playlist = {
    _id: "playlist1",
    ownerId: "user1",
    type: "Playlist",
    collaborative: false,
    Description: "simple playlist test",
    name: "playlist 1",
    isPublic: true,
    images: [],
    snapshot: [{
        hasTracks: ["track1", "track2", "track3", "track4", "track5"],
        action: "add tracks"
    }]
}
const album = {
    _id: "album1",
    images: [],
    artistId: "artist1",
    name: "album 1",
    type: "Album",
    albumType: "any",
    popularity: 1,
    genre: "amy",
    releaseDate: Date.now(),
    availableMarkets: ["eg"],
    releaseDatePercision: "month",
    label: "any label",
    hasTracks: [{
            trackId: "track6",
            //ref: 'Track'
        },
        {
            trackId: "track7",
            //ref: 'Track'
        },
        {
            trackId: "track8",
            //ref: 'Track'
        },
        {
            trackId: "track9",
            //ref: 'Track'
        },
        {
            trackId: "track10",
            //ref: 'Track'
        },
    ]
}
const user = {
        _id: "user1",
        playHistory: [],
        queue: {},
        player: {}
    }
    // MockPlayer.createQueue(user,true,playlist,"track2","playlist1");
    // MockPlayer.setPlayerInstance(user,"track2")
    // MockPlayer.addRecentTrack(user,"track2");
    // MockPlayer.addRecentTrack(user,"track3");
    // console.log(MockPlayer.getRecentTracks(user,50))
    // console.log(MockPlayer.getRecentTracks(user,1))
    // MockPlayer.clearRecentTracks(user);
    // console.log(user.playHistory);
    // MockPlayer.pausePlaying(user);
    // console.log(user.player.is_playing);
    // MockPlayer.resumePlaying(user)
    // console.log(user.player.is_playing)
    //console.log(user,user.player)
    //  console.log(user.queue);
test('create queue for user for first time from playlist', () => {
    MockPlayer.createQueue(user, true, playlist, "track2", "playlist1");

    // expect that user has his queue and player   sets 
    expect(user.queue).toEqual({
        queuIndex: -1,
        tracksInQueue: [
            { trackId: 'track1', isQueue: false },
            { trackId: 'track2', isQueue: false },
            { trackId: 'track3', isQueue: false },
            { trackId: 'track4', isQueue: false },
            { trackId: 'track5', isQueue: false }
        ],
        index: 1,
        fristQueueIndex: -1
    });

})

test('set player for user for first time after creating queue', () => {
    MockPlayer.setPlayerInstance(user, "track2");

    // expect that user has his queue and player   sets 
    expect(user.player).toEqual({
        isPlaylist: true,
        current_source: 'playlist1',
        next_track: 'track3',
        prev_track: 'track1',
        current_track: 'track2',
        last_playlist_track_index: 1,
        playlistId: {
            "Description": "simple playlist test",
            "_id": "playlist1",
            "collaborative": false,
            "images": [],
            "isPublic": true,
            "name": "playlist 1",
            "ownerId": "user1",
            "snapshot": [{
                "action": "add tracks",
                "hasTracks": [
                    "track1",
                    "track2",
                    "track3",
                    "track4",
                    "track5"
                ],
            }],
            "type": "Playlist",
        },
        is_playing: true,
        is_repeat: false,
        is_shuffled: false
    });
})

test('add to recent tracks track 2 and track 3', () => {
    MockPlayer.addRecentTrack(user, "track2");
    MockPlayer.addRecentTrack(user, "track3");

    // expect that user has his queue and player   sets 
    expect(user.playHistory).toEqual([{ trackId: 'track3' }, { trackId: 'track2' }]);

})

test('get recent tracks of user', () => {


    // expect that user has his queue and player   sets 
    expect(MockPlayer.getRecentTracks(user)).toEqual([{ trackId: 'track3' }, { trackId: 'track2' }]);

})


test('clear recent tracks of user', () => {
    MockPlayer.clearRecentTracks(user);

    // expect that user has his queue and player   sets 
    expect(MockPlayer.getRecentTracks(user)).toEqual([]);

})
test('add  track to queue', () => {
    MockPlayer.addToQueue(user, 'trackByAddQueue');

    expect(user.queue.tracksInQueue[0]).toEqual({ trackId: "trackByAddQueue", isQueue: true });
})
test(' get queue', () => {
    //console.log(user.queue)
    expect(MockPlayer.getQueue(user)).toEqual([{ "isQueue": true, "trackId": "trackByAddQueue", }, { "isQueue": false, "trackId": "track3" }, { "isQueue": false, "trackId": "track4" }, { "isQueue": false, "trackId": "track5" }]);
})

test('pause user playback', () => {
    MockPlayer.pausePlaying(user);

    // expect that user has his queue and player   sets 
    expect(user.player.is_playing).toBeFalsy();

})

test('resume user playback', () => {
    MockPlayer.resumePlaying(user);

    // expect that user has his queue and player   sets 
    expect(user.player.is_playing).toBeTruthy();

})

test('repeat playlist user playback', () => {
    MockPlayer.repreatPlaylist(user, true);
    expect(user.player.is_repeat).toBeTruthy();

})

test('unrepeat playlist user playback', () => {
    MockPlayer.repreatPlaylist(user, false);

    // expect that user has his queue and player   sets 
    expect(user.player.is_repeat).toBeFalsy();

})

test('unshuffle playlist user playback', () => {
    MockPlayer.repreatPlaylist(true, user);

    // expect that user has his queue and player   sets 
    expect(user.player.is_shuffled).toBeFalsy();

})

test('shuffle playlist user playback', () => {
    MockPlayer.setShuffle(false, user);

    // expect that user has his queue and player   sets 
    expect(user.player.is_shuffled).toBeFalsy();

})

test('fill by playlist playlist user playback', () => {
    MockPlayer.fillByplaylist(user);
    // expect that user has his queue and player   sets 
    expect(user.queue.tracksInQueue).toEqual([
        { trackId: 'trackByAddQueue', isQueue: true },
        { trackId: 'track1', isQueue: false },
        { trackId: 'track2', isQueue: false },
        { trackId: 'track3', isQueue: false },
        { trackId: 'track4', isQueue: false },
        { trackId: 'track5', isQueue: false }
    ]);

})
test('skip to next track', () => {
    const nexTrack = user.player.next_track;
    MockPlayer.skipNext(user);
    // expect that user has his queue and player   sets 
    expect(user.player.current_track).toEqual(nexTrack);

})
test('skip to previous track', () => {
    const prevTrack = user.player.prev_track;
    MockPlayer.skipPrevious(user);
    // expect that user has his queue and player   sets 
    expect(user.player.current_track).toEqual(prevTrack);
})