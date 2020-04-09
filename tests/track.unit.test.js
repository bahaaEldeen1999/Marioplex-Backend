const MockTrack =  {
    
     tracks : [],
     getTrack : function(trackId){
         return this.tracks.find(track => track.trackId==trackId);
     },
     
     getTracks: function(ids){
         let tracks = [];
         for(let trackId of ids){
             let track = this.getTrack(trackId);
             if(!track)return 0;
             tracks.push(track);
         }
         return tracks;
     },

    checkIfUserLikeTrack: function(user,trackId){
        const tracksUserLiked = user.like;
        
        if(tracksUserLiked){
           return  tracksUserLiked.find(track => track.trackId == trackId);
        }
        return 0;
    }, 

    userLikeTrack: function(user,trackId){
        if(this.checkIfUserLikeTrack(user,trackId)){
            return 0;
        }
        if(user.like){
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
    userUnlikeTrack: function(user,trackId){
        if(!this.checkIfUserLikeTrack(user,trackId)){
            return 0;
        }
        for(let i=0;i <user.like.length;i++ ){
            if(user.like[i].trackId == trackId){
                user.like.splice(i,1);
            }
        }
        return 1;

    },
    getAudioFeaturesTrack :  function(trackID){
        const track =  this.getTrack(trackID);
        if(!track)return 0;
        const audioFeatures = {
        
            durationMs:track.durationMs ,
            explicit:track.explicit ,
            acousticness:track.acousticness ,
            danceability:track.danceability ,
            energy:track.danceability ,
            instrumentalness:track.instrumentalness ,
            key:track.key ,
            liveness:track.liveness ,
            loudness:track.loudness ,
            mode:track.mode ,
            speechiness:track.speechiness ,
            tempo:track.tempo ,
            valence:track.valence
        }
        return audioFeatures;
    },
    createTrack: function(url, Name, TrackNumber, AvailableMarkets, artistID, albumID, duration){
        let newTrack = {
            
                url: url,
                images: [],
                duration:duration,
                availableMarkets: AvailableMarkets,
                trackNumber: TrackNumber,
                name: Name,
                artistId: artistID,
                albumId: albumID,
                discNumber: 1,
                explicit: false,
                type: "Track",
                acousticness: Math.floor(Math.random()*100),
                danceability:  Math.floor(Math.random()*100),
                energy:  Math.floor(Math.random()*100),
                instrumentalness:  Math.floor(Math.random()*100),
                key:  Math.floor(Math.random()*100),
                liveness:  Math.floor(Math.random()*100),
                loudness:  Math.floor(Math.random()*100),
                mode:  Math.floor(Math.random()*100),
                speechiness:  Math.floor(Math.random()*100),
                tempo:  Math.floor(Math.random()*100),
                timeSignature: Date.now(),
                valence:  Math.floor(Math.random()*100),
                like: 0
    
            
        }
        this.tracks.push(newTrack);
        return newTrack;
    }
    
}

const TrackTest =  MockTrack;
TrackTest.tracks = [
    {
        trackId:"1",
        durationMs:2000,
        danceability:0.2,
        key:12,
        mode:"fun"
    },
    {
        trackId:"2"
    },
    {
        trackId:"3"
    },
    {
        trackId:"4"
    },
    {
        trackId:"5"
    }
]

const user = {
    id:"1",
    like:[
        {
            trackId:"1"
        },
        {
            trackId:"2"
        }
    ]
}

test('get track with id 2',()=>{
    expect(TrackTest.getTrack("2")).toEqual({trackId:"2"});
})

test('get track with id 10 which is not found',()=>{
    expect(TrackTest.getTrack("10")).toEqual(undefined);
})


test('check if user like track 1 which is true',()=>{
    expect(TrackTest.checkIfUserLikeTrack(user,"1")).toBeTruthy();
})

test('check if user like track 5 which is false',()=>{
    expect(TrackTest.checkIfUserLikeTrack(user,"5")).toBeFalsy();
})


test('user like new track with id 3',()=>{
    expect(TrackTest.userLikeTrack(user,"3")).toBeTruthy();
})

test('user like already liked  track with id 3',()=>{
    expect(TrackTest.userLikeTrack(user,"3")).toBeFalsy();
})

test('user unlike  track  3 which he liked before',()=>{
    expect(TrackTest.userUnlikeTrack(user,"3")).toBeTruthy();
})

test('user unlike    track with id 3 which he already unliked',()=>{
    expect(TrackTest.userUnlikeTrack(user,"3")).toBeFalsy();
})


test('get audio features for track with id 1',()=>{
    expect(TrackTest.getAudioFeaturesTrack("1")).toEqual( {
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

test('create track',()=>{
   TrackTest.createTrack("url", "Name", 1, ["eg"], "1", "1", 1000);
   expect(TrackTest.tracks.length).toEqual(6);
})

