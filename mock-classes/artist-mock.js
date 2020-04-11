const MockArtist = {
    Artists:[],
   
    //CREATE AN ARTIST - PARAMS: user-info-name-Genre
    createArtist:  function(user, Info, name, Genre) {
        var userName;
        //CHECK THE GIVEN NAME IF NULL THEN = USERNAME
        if (!name) userName = user.displayName;
        else userName = name;
        let artist = {
            id:(this.Artists.length+1).toString(),
            info: Info,
            popularity: 0,
            genre: Genre,
            type: "Artist",
            Name: userName,
            userId: user.id,
            popularity: 0,
            images: [],
            addAlbums: [],
            addTracks: []

        };
        this.Artists.push(artist);
        return artist;
    },
    //GET THE POPULAR ARTIST BASED ON THE POPULARITY
    getPopularArtists:  function() {
        // with - is from big to small and without is from small to big
        var reArtists = []
        let artists=this.Artists;
        artists.sort((a, b) => (a.popularity > b.popularity) ? -1 : 1);
        if (artists.length > 0) {
            var limit; // to limit the num of artists by frist 20 only but should check if num of albums less than 10  
            if (artists.length < 20) limit = artists.length;
            else limit = 20;
            for (let i = 0; i < limit; i++) {

                reArtists.push({ genre: artists[i].genre, type: 'artist', name: artists[i].Name, images: artists[i].images, id: artists[i].id, info: artists[i].info });
            }
        }
        const reArtistsJson = { artists: reArtists };
        return reArtistsJson;
    },
    //CHECK IF THE ARTIST HAS A SPECIFIC ALBUM - PARAMS: artistId,albumId
    checkArtisthasAlbum: function(artistId,albumId){
            const artist= this.getArtist(artistId);
            if(!artist) return 0;
            if(artist.addAlbums){
                for(let i=0;i<artist.addAlbums.length;i++){
                    if(artist.addAlbums[i].albumId==albumId){
                        return 1;
                    }
                }    
            }  
        return 0;
    },
    //GET ARTIST - PARAMS : ArtistID
    getArtist: function(ArtistID) {

        for(let i=0;i<this.Artists.length;i++){
            if(this.Artists[i].id==ArtistID){
                return this.Artists[i];
            }
        }
        return 0;
    },

    // CREATE ALBUM FOR AN ARTIST - PARAMS : ArtistID-Name,Label,Avmarkets,Albumtype,ReleaseDate,Genre
    addAlbum:function(ArtistID, Name, Label, Avmarkets, Albumtype, ReleaseDate, Genre,albumId) {
        if (!this.getArtist(ArtistID)) return 0;
        let album = {
            id:albumId,
            name: Name,
            albumType: Albumtype,
            popularity: 0,
            genre: Genre,
            releaseDate: ReleaseDate,
            availableMarkets: Avmarkets,
            label: Label,
            images: [],
            artistId: ArtistID,
            type: "Album",
            hasTracks: []

        };

        const artist = this.getArtist(ArtistID);
        artist.addAlbums.push({
            albumId: album.id
        });
        return album;
    },
    // CREATE TRACK FOR AN ARTIST -PARAMS : ArtistID,trackid
    addTrack: function(ArtistID, trackid) {
        const artist = this.getArtist(ArtistID);
        if(!artist)return 0;
        artist.addTracks.push({
            trackId: trackid
        });
        return 1;

    },
    // GET SEVERAL ARTISTS - params : artistsIDs  -ARRAY-
    getArtists: function(artistsIDs) {
        let artists = [];
        for(let i=0;i<artistsIDs.length;i++) {
            let artist = this.getArtist(artistsIDs[i]);
            if (!artist) continue
            artists.push(artist);
        }
        return artists;
    },
    // GET SPECIFIC ALBUMS - Params :artistID,groups,country,limit,offset
    getAlbums: function(artistID, groups, country, limit, offset,Albums) {
        let SpecificAlbums = [];
        let albums = [];
        let artist = this.getArtist(artistID);
        if (!artist) return 0;
        //GET ALL THE ALBUMS OF THIS ARTIST
        for (let i = 0; i < artist.addAlbums.length; i++) {
            for(let j=0;j<Albums.length;j++){
                if(artist.addAlbums[i].albumId==Albums[j].id){
                    albums.push(Albums[j]);
                }
            }
        }
        //FILTER THE ALBUMS BASED ON THE INPUT
        if (groups != undefined && country != undefined) {
            for (let Album in albums) {
                if (groups.includes(albums[Album].albumType) && albums[Album].availableMarkets.includes(country)) {
                    SpecificAlbums.push(albums[Album]);
                }
            }
        } else if (groups == undefined && country != undefined) {
            for (let Album in albums) {
                if (albums[Album].availableMarkets.includes(country)) {
                    SpecificAlbums.push(albums[Album]);
                }
            }
        } else if (groups != undefined && country == undefined) {
            for (let Album in albums) {
                if (groups.includes(albums[Album].albumType)) {
                    SpecificAlbums.push(albums[Album]);
                }
            }
        } else {
            for (let Album in albums) {
                SpecificAlbums.push(albums[Album]);
            }
        }
        //HANDLE THE LIMIT - OFFSET FOR THE ARRAY
        let start = 0;
        let end = SpecificAlbums.length;
        if (offset != undefined) {
            if (offset >= 0 && offset <= SpecificAlbums.length) {
                start = offset;
            }
        }
        if (limit != undefined) {
            if ((start + limit) > 0 && (start + limit) <= SpecificAlbums.length) {
                end = start + limit;
            }
        }
        SpecificAlbums.slice(start, end);
        return SpecificAlbums;
    },
    //GET RELATED ARTISTS TO A GIVEN ARTIST - Params: artistID
    getRelatedArtists:  function(artistID) {
        let Artists=this.Artists;
    
        let artist =  this.getArtist(artistID);
        if (Artists.length == 0) return 0;
        if (!artist) return 0;
        let RelatedArtists = [];
        //FILTER THE ARTISTS BASED ON THEIR GENRE
        for (let Artist in Artists) {
            for (var i = 0; i < Artists[Artist].genre.length; i++) {
                for (var j = 0; j < artist.genre.length; j++) {
                    if (Artists[Artist].genre[i] == artist.genre[j]) {
                        if (!RelatedArtists.find(artist1 => artist1.id == Artists[Artist].id))
                            RelatedArtists.push(Artists[Artist]);
                        continue;
                    }
                }
            }
        }
        //HANDLE MAX NUMBER TO RETURN
        if (RelatedArtists.length > 20) RelatedArtists.slice(0, 20);
        return RelatedArtists;
    },
    //FIND THE CURRENT ARTIST USER - Params:userId
    findMeAsArtist:  function(userId) {

        for(let i=0;i<this.Artists.length;i++){
            if(this.Artists[i].userId==userId){
                return this.Artists[i];
            }
        }
        return 0;
    },

    // GET TOP TRACKS IN A COUNTRY FOR AN ARTIST
    getTopTracks:  function(artistID, country,Tracks) {
        let TopTracks = [];
        let tracks = {};
        let artist =  this.getArtist(artistID);
        if (!artist) return 0;
        for (let i = 0; i < artist.addTracks.length; i++) {
            for(let j=0;j<Tracks.length;j++){
                if(Tracks[j].id==artist.addTracks[i].trackId){
                    tracks[artist.addTracks[i].trackId] = Tracks[j]; 
                }
            }
            
        }
        //FILTER TRACKS BASED ON THE COUNTRY
        for (let track in tracks) {
            if (tracks[track].availableMarkets.includes(country)) {
                TopTracks.push(tracks[track]);
            }
        }
        //SORT TRACKS BY popularity
        TopTracks.sort((a, b) => (a.popularity > b.popularity) ? -1 : 1);
        TopTracks.slice(0, 10);
        return TopTracks;
    },
    //GET TRACKS FOR AN ARTIST - Params:artistID
    getTracks:  function(artistID,Tracks) {
        let SpecificTracks = [];
        let tracks = {};
        let artist =  this.getArtist(artistID);
        if (!artist) return 0;
        for (let i = 0; i < artist.addTracks.length; i++) {
            for(let j=0;j<Tracks.length;j++){
                if(Tracks[j].id==artist.addTracks[i].trackId){
                    tracks[artist.addTracks[i].trackId] = Tracks[j]; 
                }
            }
        }
        for (let Track in tracks) {
            SpecificTracks.push(tracks[Track]);
        }


        return SpecificTracks;
    }
}
module.exports=MockArtist;