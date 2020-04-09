const MockTrack = {

    tracks: [],
    getTrack: function(trackId) {
        return this.tracks.find(track => track.trackId == trackId);
    },

    getTracks: function(ids) {
        let tracks = [];
        for (let trackId of ids) {
            let track = this.getTrack(trackId);
            if (!track) return 0;
            tracks.push(track);
        }
        return tracks;
    },

    checkIfUserLikeTrack: function(user, trackId) {
        const tracksUserLiked = user.like;

        if (tracksUserLiked) {
            return tracksUserLiked.find(track => track.trackId == trackId);
        }
        return 0;
    },

    userLikeTrack: function(user, trackId) {
        if (this.checkIfUserLikeTrack(user, trackId)) {
            return 0;
        }
        if (user.like) {
            user.like.push({
                trackId: trackId
            });
            return 1;

        }
        user.like = [];
        user.like.push({
            trackId: trackId
        });
        return 1;

    },
    userUnlikeTrack: function(user, trackId) {
        if (!this.checkIfUserLikeTrack(user, trackId)) {
            return 0;
        }
        for (let i = 0; i < user.like.length; i++) {
            if (user.like[i].trackId == trackId) {
                user.like.splice(i, 1);
            }
        }
        return 1;

    },
    getAudioFeaturesTrack: function(trackID) {
        const track = this.getTrack(trackID);
        if (!track) return 0;
        const audioFeatures = {

            durationMs: track.durationMs,
            explicit: track.explicit,
            acousticness: track.acousticness,
            danceability: track.danceability,
            energy: track.danceability,
            instrumentalness: track.instrumentalness,
            key: track.key,
            liveness: track.liveness,
            loudness: track.loudness,
            mode: track.mode,
            speechiness: track.speechiness,
            tempo: track.tempo,
            valence: track.valence
        }
        return audioFeatures;
    },
    createTrack: function(url, Name, TrackNumber, AvailableMarkets, artistID, albumID, duration) {
        let newTrack = {

            url: url,
            images: [],
            duration: duration,
            availableMarkets: AvailableMarkets,
            trackNumber: TrackNumber,
            name: Name,
            artistId: artistID,
            albumId: albumID,
            discNumber: 1,
            explicit: false,
            type: "Track",
            acousticness: Math.floor(Math.random() * 100),
            danceability: Math.floor(Math.random() * 100),
            energy: Math.floor(Math.random() * 100),
            instrumentalness: Math.floor(Math.random() * 100),
            key: Math.floor(Math.random() * 100),
            liveness: Math.floor(Math.random() * 100),
            loudness: Math.floor(Math.random() * 100),
            mode: Math.floor(Math.random() * 100),
            speechiness: Math.floor(Math.random() * 100),
            tempo: Math.floor(Math.random() * 100),
            timeSignature: Date.now(),
            valence: Math.floor(Math.random() * 100),
            like: 0


        }
        this.tracks.push(newTrack);
        return newTrack;
    }

}

module.exports = MockTrack;