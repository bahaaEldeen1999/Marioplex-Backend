const TrackTest = require('../mock-classes/track-mock');
TrackTest.tracks = [{
        trackId: "1",
        durationMs: 2000,
        danceability: 0.2,
        key: 12,
        mode: "fun"
    },
    {
        trackId: "2"
    },
    {
        trackId: "3"
    },
    {
        trackId: "4"
    },
    {
        trackId: "5"
    }
]

const user = {
    id: "1",
    like: [{
            trackId: "1"
        },
        {
            trackId: "2"
        }
    ]
}

test('get track with id 2', () => {
    expect(TrackTest.getTrack("2")).toEqual({ trackId: "2" });
})

test('get track with id 10 which is not found', () => {
    expect(TrackTest.getTrack("10")).toEqual(undefined);
})


test('check if user like track 1 which is true', () => {
    expect(TrackTest.checkIfUserLikeTrack(user, "1")).toBeTruthy();
})

test('check if user like track 5 which is false', () => {
    expect(TrackTest.checkIfUserLikeTrack(user, "5")).toBeFalsy();
})


test('user like new track with id 3', () => {
    expect(TrackTest.userLikeTrack(user, "3")).toBeTruthy();
})

test('user like already liked  track with id 3', () => {
    expect(TrackTest.userLikeTrack(user, "3")).toBeFalsy();
})

test('user unlike  track  3 which he liked before', () => {
    expect(TrackTest.userUnlikeTrack(user, "3")).toBeTruthy();
})

test('user unlike    track with id 3 which he already unliked', () => {
    expect(TrackTest.userUnlikeTrack(user, "3")).toBeFalsy();
})


test('get audio features for track with id 1', () => {
    expect(TrackTest.getAudioFeaturesTrack("1")).toEqual({
        "acousticness": undefined,
        "danceability": 0.2,
        "durationMs": 2000,
        "energy": 0.2,
        "explicit": undefined,
        "instrumentalness": undefined,
        "key": 12,
        "liveness": undefined,
        "loudness": undefined,
        "mode": "fun",
        "speechiness": undefined,
        "tempo": undefined,
        "valence": undefined,
    });
})

test('create track', () => {
    TrackTest.createTrack("url", "Name", 1, ["eg"], "1", "1", 1000);
    expect(TrackTest.tracks.length).toEqual(6);
})