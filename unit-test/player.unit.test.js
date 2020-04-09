const MockPlayer = require('../mock-classes/player-mock')
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