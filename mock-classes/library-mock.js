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
module.exports = mockLibrary;