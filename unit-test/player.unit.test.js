const MockPlayer = require('../mock-classes/player-mock')
const playlist = {
    _id: "playlist1",
    ownerId: "user11",
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
    releaseDate: "20-02-2000",
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
const user1 = {
    _id: "user1",
    playHistory: [],
    queue: {},
    player: {}
};
const user4 = {
    _id: "ghgjhjh"
}
const user2 = {
    _id: "user2",
    playHistory: [],
    queue: {},
};
const user3 = {
    _id: "user3"

};
// MockPlayer.createQueue(user1,true,playlist,"track2","playlist1");
// MockPlayer.setPlayerInstance(user1,"track2")
// MockPlayer.addRecentTrack(user1,"track2");
// MockPlayer.addRecentTrack(user1,"track3");
// console.log(MockPlayer.getRecentTracks(user1,50))
// console.log(MockPlayer.getRecentTracks(user1,1))
// MockPlayer.clearRecentTracks(user1);
// console.log(user1.playHistory);
// MockPlayer.pausePlaying(user1);
// console.log(user1.player.is_playing);
// MockPlayer.resumePlaying(user1)
// console.log(user1.player.is_playing)
//console.log(user1,user1.player)
//  console.log(user1.queue);
test('unshuffle playlist user4 playback', () => {


    // expect that user1 has his queue and player   sets 
    expect(MockPlayer.setShuffle(true, user4)).toBeFalsy();

})
test('set next', () => {;

    expect(MockPlayer.setNextPrevCurrent(user4)).toEqual(0);
})
test('get queue', () => {
    expect(MockPlayer.getQueue(user4)).toEqual(0);
})
test('get queue', () => {
    expect(MockPlayer.getQueue(user1)).toEqual(0);
})
test('pause user4 playback', () => {
    // expect that user1 has his queue and player   sets 
    expect(MockPlayer.pausePlaying(user4)).toEqual(0);
})

test('resume user4 playback', () => {
    // expect that user1 has his queue and player   sets 
    expect(MockPlayer.resumePlaying(user4)).toEqual(0);
})

test('create queue for user1 for first time from playlist', () => {
    MockPlayer.createQueue(user1, true, playlist, "track2", "playlist1");

    // expect that user1 has his queue and player   sets 
    expect(user1.queue).toEqual({
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
test('skip to next 5 track', () => {

    MockPlayer.skipNext(user2);
    // expect that user1 has his queue and player   sets 
    expect(user1.player.current_track).toEqual(undefined);

})
test('add  track to queue', () => {
    MockPlayer.addToQueue(user2, 'trackByAddQueue1');

    expect(user1.queue.tracksInQueue[0]).toEqual({
        "isQueue": false,
        "trackId": "track1",
    });
})
test('create queue for user1 for first time from playlist', () => {
    MockPlayer.createQueue(user2, true, playlist, "track2", "playlist1");

    // expect that user1 has his queue and player   sets 
    expect(user1.queue).toEqual({
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

test('set player for user1 for first time after creating queue', () => {
    MockPlayer.setPlayerInstance(user1, "track2");

    // expect that user1 has his queue and player   sets 
    expect(user1.player).toEqual({
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
            "ownerId": "user11",
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

test('get recent tracks of user1', () => {


    // expect that user1 has his queue and player   sets 
    expect(MockPlayer.getRecentTracks(user3)).toEqual([

    ]);

})
test('add to recent tracks track 2 and track 3', () => {
    MockPlayer.addRecentTrack(user1, "track2");
    MockPlayer.addRecentTrack(user1, "track3");

    // expect that user1 has his queue and player   sets 
    expect(user1.playHistory).toEqual([{ trackId: 'track3' }, { trackId: 'track2' }]);

})

test('add to recent tracks track 2 and track 3', () => {
    MockPlayer.addRecentTrack(user1, "track4");
    MockPlayer.addRecentTrack(user1, "track9");
    MockPlayer.addRecentTrack(user1, "track4");
    MockPlayer.addRecentTrack(user1, "track9");
    MockPlayer.addRecentTrack(user1, "track4");
    MockPlayer.addRecentTrack(user1, "track9");
    MockPlayer.addRecentTrack(user1, "track4");
    MockPlayer.addRecentTrack(user1, "track9");
    MockPlayer.addRecentTrack(user1, "track4");
    MockPlayer.addRecentTrack(user1, "track9");


    // expect that user1 has his queue and player   sets 
    expect(user1.playHistory).toEqual(
        [
            { trackId: 'track9' },
            { trackId: 'track4' },
            { trackId: 'track9' },
            { trackId: 'track4' },
            { trackId: 'track9' },
            { trackId: 'track4' },
            { trackId: 'track9' },
            { trackId: 'track4' },
            { trackId: 'track9' },
            { trackId: 'track4' },
            { trackId: 'track3' }

        ]);

})
test('add to recent tracks track 2 and track 3', () => {
    MockPlayer.addRecentTrack(user3, "track4");
    MockPlayer.addRecentTrack(user3, "track9");
    MockPlayer.addRecentTrack(user3, "track4");

    // expect that user1 has his queue and player   sets 
    expect(user3.playHistory).toEqual([
        { trackId: 'track4' },
        { trackId: 'track9' },
        { trackId: 'track4' }
    ]);

})


test('get recent tracks of user1', () => {


    // expect that user1 has his queue and player   sets 
    expect(MockPlayer.getRecentTracks(user1)).toEqual([
        { trackId: 'track9' },
        { trackId: 'track4' },
        { trackId: 'track9' },
        { trackId: 'track4' },
        { trackId: 'track9' },
        { trackId: 'track4' },
        { trackId: 'track9' },
        { trackId: 'track4' },
        { trackId: 'track9' },
        { trackId: 'track4' },
        { trackId: 'track3' }
    ]);

})

test('skip to previous 1 track', () => {
    const prevTrack = user1.player.prev_track;
    MockPlayer.skipPrevious(user1);
    // expect that user1 has his queue and player   sets 
    expect(user1.player.current_track).toEqual(prevTrack);
})
test('skip to previous 2 track', () => {
    const prevTrack = user1.player.prev_track;
    MockPlayer.skipPrevious(user1);
    // expect that user1 has his queue and player   sets 
    expect(user1.player.current_track).toEqual(prevTrack);
})
test('skip to previous 3 track', () => {
    const prevTrack = user1.player.prev_track;
    MockPlayer.skipPrevious(user1);
    // expect that user1 has his queue and player   sets 
    expect(user1.player.current_track).toEqual(prevTrack);
})
test('skip to previous 4 track', () => {
    const prevTrack = user1.player.prev_track;
    MockPlayer.skipPrevious(user1);
    // expect that user1 has his queue and player   sets 
    expect(user1.player.current_track).toEqual(prevTrack);
})
test('clear recent tracks of user1', () => {
    MockPlayer.clearRecentTracks(user1);

    // expect that user1 has his queue and player   sets 
    expect(MockPlayer.getRecentTracks(user1)).toEqual([]);

})
test('add  track to queue', () => {
    MockPlayer.addToQueue(user1, 'trackByAddQueue');

    expect(user1.queue.tracksInQueue[0]).toEqual({ trackId: "trackByAddQueue", isQueue: true });
})
test(' get queue', () => {
    //console.log(user1.queue)
    expect(MockPlayer.getQueue(user1)).toEqual([{ "isQueue": true, "trackId": "trackByAddQueue", }, { "isQueue": false, "trackId": "track4", }, { "isQueue": false, "trackId": "track5" }]);
})

test('pause user1 playback', () => {
    MockPlayer.pausePlaying(user1);

    // expect that user1 has his queue and player   sets 
    expect(user1.player.is_playing).toBeFalsy();

})

test('resume user1 playback', () => {
    MockPlayer.resumePlaying(user1);

    // expect that user1 has his queue and player   sets 
    expect(user1.player.is_playing).toBeTruthy();

})

test('repeat playlist user1 playback', () => {
    MockPlayer.repreatPlaylist(user1, true);
    expect(user1.player.is_repeat).toBeTruthy();

})
test(' get queue', () => {
    //console.log(user1.queue)
    expect(MockPlayer.getQueue(user1)).toEqual([{ "isQueue": true, "trackId": "trackByAddQueue", }, { "isQueue": false, "trackId": "track4" }, { "isQueue": false, "trackId": "track5" }, { "isQueue": false, "trackId": "track1" }, { "isQueue": false, "trackId": "track2" }]);
})
test('unrepeat playlist user1 playback', () => {
    MockPlayer.repreatPlaylist(user1, false);

    // expect that user1 has his queue and player   sets 
    expect(user1.player.is_repeat).toBeFalsy();

})

test('unshuffle playlist user1 playback', () => {
    MockPlayer.setShuffle(true, user1);

    // expect that user1 has his queue and player   sets 
    expect(user1.player.is_shuffled).toBeTruthy();

})
test(' get queue', () => {
    //console.log(user1.queue)
    expect(MockPlayer.getQueue(user1)).toEqual([{ "isQueue": true, "trackId": "trackByAddQueue", }, { "isQueue": false, "trackId": "track4" }, { "isQueue": false, "trackId": "track5" }, { "isQueue": false, "trackId": "track1" }, { "isQueue": false, "trackId": "track2" }]);
})

test('shuffle playlist user1 playback', () => {
    MockPlayer.setShuffle(false, user1);

    // expect that user1 has his queue and player   sets 
    expect(user1.player.is_shuffled).toBeFalsy();

})

test('skip to next track', () => {
    const nexTrack = user1.player.next_track;
    MockPlayer.skipNext(user1);
    // expect that user1 has his queue and player   sets 
    expect(user1.player.current_track).toEqual(nexTrack);

})
test('skip to next 1 track', () => {
    const nexTrack = user1.player.next_track;
    MockPlayer.skipNext(user1);
    // expect that user1 has his queue and player   sets 
    expect(user1.player.current_track).toEqual(nexTrack);

})
test('skip to next 2 track', () => {
    const nexTrack = user1.player.next_track;
    MockPlayer.skipNext(user1);
    // expect that user1 has his queue and player   sets 
    expect(user1.player.current_track).toEqual(nexTrack);

})
test('skip to next 3 track', () => {
    const nexTrack = user1.player.next_track;
    MockPlayer.skipNext(user1);
    // expect that user1 has his queue and player   sets 
    expect(user1.player.current_track).toEqual(nexTrack);

})

test('fill by playlist playlist user1 playback', () => {
    MockPlayer.fillByplaylist(user1);
    // expect that user1 has his queue and player   sets 
    expect(user1.queue.tracksInQueue).toEqual([
        { trackId: 'track1', isQueue: false },
        { trackId: 'track2', isQueue: false },
        { trackId: 'track3', isQueue: false },
        { trackId: 'track4', isQueue: false },
        { trackId: 'track5', isQueue: false }
    ]);

})
test('skip to next track', () => {
    const nexTrack = user1.player.next_track;
    MockPlayer.skipNext(user1);
    // expect that user1 has his queue and player   sets 
    expect(user1.player.current_track).toEqual(nexTrack);

})
test('skip to next 5 track', () => {
    const nexTrack = user1.player.next_track;
    MockPlayer.skipNext(user1);
    // expect that user1 has his queue and player   sets 
    expect(user1.player.current_track).toEqual(nexTrack);

})


test('skip to previous track', () => {
    const prevTrack = user1.player.prev_track;
    MockPlayer.skipPrevious(user1);
    // expect that user1 has his queue and player   sets 
    expect(user1.player.current_track).toEqual(prevTrack);
})
test('add  track to queue', () => {
    MockPlayer.addToQueue(user1, 'trackByAddQueue1');

    expect(user1.queue.tracksInQueue[0]).toEqual({ trackId: "trackByAddQueue1", isQueue: true });
})
test('add  track to queue', () => {
    MockPlayer.addToQueue(user1, 'trackByAddQueue2');

    expect(user1.queue.tracksInQueue[0]).toEqual({ trackId: "trackByAddQueue2", isQueue: true });
})
test('set next and previous', () => {

    expect(MockPlayer.getNextAndPrev(user1.queue.tracksInQueue, user1.player["current_track"], user1)).toEqual({ "next_track": undefined, "prev_track": undefined })
})
test('next wrap around ', () => {
    const nextTrack = user1.player.next_track;
    MockPlayer.skipNext(user1);
    // expect that user1 has his queue and player   sets 
    expect(user1.player.current_track).toEqual(nextTrack);
})
test('next wrap around ', () => {
    const nextTrack = user1.player.next_track;
    MockPlayer.skipNext(user1);
    // expect that user1 has his queue and player   sets 
    expect(user1.player.current_track).toEqual(nextTrack);
})
test('next wrap around ', () => {
    const nextTrack = user1.player.next_track;
    MockPlayer.skipNext(user1);
    // expect that user1 has his queue and player   sets 
    expect(user1.player.current_track).toEqual(nextTrack);
})
test('next wrap around ', () => {
    const nextTrack = user1.player.next_track;
    MockPlayer.skipNext(user1);
    // expect that user1 has his queue and player   sets 
    expect(user1.player.current_track).toEqual(nextTrack);
})
test('next wrap around ', () => {
    const nextTrack = user1.player.next_track;
    MockPlayer.skipNext(user1);
    // expect that user1 has his queue and player   sets 
    expect(user1.player.current_track).toEqual(nextTrack);
})

test('skip to previous track', () => {
    const prevTrack = user1.player.prev_track;
    MockPlayer.skipPrevious(user1);
    // expect that user1 has his queue and player   sets 
    expect(user1.player.current_track).toEqual(prevTrack);
})

test('skip to previous track', () => {
    const prevTrack = user1.player.prev_track;
    MockPlayer.skipPrevious(user1);
    //console.log(user1)
    // expect that user1 has his queue and player   sets 
    expect(user1.player.current_track).toEqual("track4");
})

test('skip to previous track', () => {
    const prevTrack = user1.player.prev_track;
    MockPlayer.skipPrevious(user1);
    // expect that user1 has his queue and player   sets 
    expect(user1.player.current_track).toEqual(prevTrack);
})

test('skip to previous track', () => {
    const prevTrack = user1.player.prev_track;
    MockPlayer.skipPrevious(user1);
    // expect that user1 has his queue and player   sets 
    expect(user1.player.current_track).toEqual(prevTrack);
})

test('skip next', () => {

    // expect that user1 has his queue and player   sets 
    expect(MockPlayer.skipPrevious(user3)).toEqual(0);
})
test('skip next', () => {

    // expect that user1 has his queue and player   sets 
    expect(MockPlayer.skipNext(user3)).toEqual(0);
})
test('skip prev', () => {
    expect(MockPlayer.repreatPlaylist(user3)).toEqual(0);

})
test('create queue for user1 for first time from playlist', () => {
    MockPlayer.createQueue(user3, false, album, "track7", "album1");


    // expect that user1 has his queue and player   sets 
    expect(user3.queue).toEqual({
        queuIndex: -1,
        tracksInQueue: [
            { "trackId": "track6", isQueue: false },
            { "trackId": "track7", isQueue: false },
            { "trackId": "track8", isQueue: false },
            { trackId: 'track9', isQueue: false },
            { trackId: 'track10', isQueue: false }
        ],
    });

})

test('create queue for user1 for first time from playlist', () => {


    // expect that user1 has his queue and player   sets 
    expect(MockPlayer.createQueue(user4)).toEqual(0);

})
test('create queue for user1 for first time from playlist', () => {



    // expect that user1 has his queue and player   sets 
    expect(MockPlayer.createQueue(user4, true)).toEqual(0);

})
test('set player for user1 for first time after creating queue', () => {
    MockPlayer.setPlayerInstance(user3, "track7");

    // expect that user1 has his queue and player   sets 
    expect(user3.player).toEqual({
        isPlaylist: false,
        current_source: 'album1',
        playlistId: {
            _id: 'album1',
            images: [],
            artistId: 'artist1',
            name: 'album 1',
            type: 'Album',
            albumType: 'any',
            popularity: 1,
            genre: 'amy',
            releaseDate: "20-02-2000",
            availableMarkets: ['eg'],
            releaseDatePercision: 'month',
            label: 'any label',
            hasTracks: [{ "trackId": "track6" }, { "trackId": "track7" }, { "trackId": "track8" }, { "trackId": "track9" }, { "trackId": "track10" }]
        },
        next_track: 'track8',
        prev_track: 'track6',
        current_track: 'track7',
        last_playlist_track_index: 1,
        is_playing: true,
        is_repeat: false,
        is_shuffled: false
    });
})
test('fill album', () => {
    MockPlayer.fillByplaylist(user3);
    expect(user3.queue).toEqual({
        queuIndex: -1,
        tracksInQueue: [
            { "trackId": "track6", isQueue: false },
            { "trackId": "track7", isQueue: false },
            { "trackId": "track8", isQueue: false },
            { trackId: 'track9', isQueue: false },
            { trackId: 'track10', isQueue: false }
        ],
    })

})

test('add  track to queue', () => {
    MockPlayer.addToQueue(user3, 'trackByAddQueue1');

    expect(user3.queue.tracksInQueue[0]).toEqual({ trackId: "trackByAddQueue1", isQueue: true });
})
test('prev wrap around ', () => {
    const prevTrack = user3.player.prev_track;
    MockPlayer.skipPrevious(user3);
    // expect that user1 has his queue and player   sets 
    expect(user3.player.current_track).toEqual(prevTrack);
})
test('prev wrap around ', () => {
    const prevTrack = user3.player.prev_track;
    MockPlayer.skipPrevious(user3);
    // expect that user1 has his queue and player   sets 
    expect(user3.player.current_track).toEqual(prevTrack);
})
test('add  track to queue', () => {
    MockPlayer.addToQueue(user3, 'trackByAddQueue2');

    expect(user3.queue.tracksInQueue[0]).toEqual({ trackId: "trackByAddQueue2", isQueue: true });
})
test('next wrap around ', () => {
    const nextTrack = user3.player.next_track;
    MockPlayer.skipNext(user3);
    // expect that user1 has his queue and player   sets 
    expect(user3.player.current_track).toEqual(nextTrack);
})
test('prev wrap around ', () => {
    const prevTrack = user3.player.prev_track;
    MockPlayer.skipPrevious(user3);
    // expect that user1 has his queue and player   sets 
    expect(user3.player.current_track).toEqual(prevTrack);
})
test('add  track to queue', () => {
    MockPlayer.addToQueue(user4, 'trackByAddQueue2');

    expect(user4.queue.tracksInQueue[0]).toEqual({ trackId: "trackByAddQueue2", isQueue: true });
})


test('fill album', () => {
    user3.player.playlistId = [];
    expect(MockPlayer.fillByplaylist(user3)).toEqual(0);
})