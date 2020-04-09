const mockLibrary = {
    checkSavedAlbums: function(Albums, user) {
        let Checks = [];
        let found = false;
        for (var i = 0; i < Albums.length; i++) {
            found = false;
            for (let Album in user.saveAlbum) {
                if (user.saveAlbum[Album].albumId == Albums[i]) {
                    Checks.push(true);
                    found = true;
                }
            }
            if (!found) {
                Checks.push(false);
            }
        }
        return Checks;
    },
    checkSavedTracks: function(Tracks, user) {

        let Checks = [];
        let found = false;
        for (var i = 0; i < Tracks.length; i++) {
            found = false;
            for (let Track in user.like) {
                if (user.like[Track].trackId == Tracks[i]) {
                    Checks.push(true);
                    found = true;
                }
            }
            if (!found) {
                Checks.push(false);
            }
        }
        return Checks;
    },
    getSavedAlbums: function(user, limit, offset) {

        let Albums = [];
        if (!user) return 0;
        if (!user.saveAlbum.length) return 0;
        for (let i = 0; i < user.saveAlbum.length; i++) {
            Albums.push(user.saveAlbum[i].albumId);
        }

        let start = 0;
        let end = (Albums.length > 20) ? 20 : Albums.length;
        if (offset != undefined) {
            if (offset >= 0 && offset <= Albums.length) {
                start = offset;
            }
        }
        if (limit != undefined) {
            if ((start + limit) > 0 && (start + limit) <= Albums.length) {
                end = start + limit;
            }
        }

        return Albums.slice(start, end);
    },
    getSavedTracks: function(user, limit, offset) {

        let Tracks = [];
        if (!user) return 0;
        if (!user.like.length) { return 0; }
        for (let i = 0; i < user.like.length; i++) {
            // let track = Track.getTrack(user.like[i].trackId);
            Tracks.push(user.like[i].trackId);
        }
        let start = 0;
        let end = (Tracks.length > 20) ? 20 : Tracks.length;
        if (offset != undefined) {
            if (offset >= 0 && offset <= Tracks.length) {
                start = offset;
            }
        }
        if (limit != undefined) {
            if ((start + limit) > 0 && (start + limit) <= Tracks.length) {
                end = start + limit;
            }

        }
        return Tracks.slice(start, end);
    }

}
const user = {
    id: "uiewqeuie2",
    name: "user1",
    saveAlbum: [{ albumId: "album1" }, { albumId: "album2" }, { albumId: "album3" }, { albumId: "album4" }, { albumId: "album5" }, { albumId: "album6" }, { albumId: "album7" }],
    like: [{ trackId: "track1" }, { trackId: "track2" }, { trackId: "track3" }, { trackId: "track4" }, { trackId: "track5" }, { trackId: "track6" }, { trackId: "track7" }, { trackId: "track8" }]
}

test('check saved albums', () => {


    // expect that user has saved albums 
    expect(mockLibrary.checkSavedAlbums(["album1", "album20", "album30", "album4"], user)).toEqual([true, false, false, true]);
})

test('check saved tracks', () => {


    // expect that user has saved tracks 
    expect(mockLibrary.checkSavedTracks(["track1", "track07", "album30", "track4", "track5"], user)).toEqual([true, false, false, true, true]);
})
test('get saved albums', () => {


    // expect that user has saved albums 
    expect(mockLibrary.getSavedAlbums(user, 3287487)).toEqual(["album1", "album2", "album3", "album4", "album5", "album6", "album7"]);
})

test('get saved tracks', () => {


    // expect that user has saved tracks 
    expect(mockLibrary.getSavedTracks(user, 2)).toEqual(["track1", "track2"]);
})