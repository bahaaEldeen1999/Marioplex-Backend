const { user: userDocument, artist: artistDocument, album: albumDocument, track: trackDocument, playlist: playlistDocument, category: categoryDocument } = require('../models/db');
const Track = require('./track-api');
const Playlist = require('./playlist-api');
// initialize db 
const bcrypt = require('bcrypt');
const Artist = require('./artist-api');
const sendmail = require('../forget-password/sendmail');
const Player = require('./player-api');
/** @namespace */
const User = {

    /** 
    *  get user by id
    * @param  {string} userId - the user id 
    * @returns {object}
    */
    getUserById: async function(userId) {
        const user = await userDocument.findById(userId, (err, user) => {
            if (err) return 0;
            return user;
        }).catch((err) => 0);

        return user;
    },
    
    
     /** 
    *  update user profile information
    * @param  {string} userId - the user id 
    * @param  {string} Display_Name - the user name 
    * @param  {string} Password - the user password 
    * @param  {string} Email - the user email 
    * @param  {string} Country - the user country
    * @returns {Number}
    */
    update: async function(userID, Display_Name, Password, Email, Country) {

        const user = await this.getUserById(userID);
        if (user) {
            if (user.isFacebook) {
                //if from facebok change country only
                if (Country) 
                user.country = Country;

            } 
            else {
                // else update the
                if (Display_Name != undefined) {
                    user.displayName = Display_Name;
                }
                if (Password != undefined) {
                    bcrypt.hash(Password, 10, (err, hash) => {
                        if (!err) {
                            user.password = hash;
                        }
                    })
                }
                if (Email != undefined) {
                    // check email is not used in the website
                    const UserByEmail = await userDocument.findOne({ email: Email });
                    if (!UserByEmail) user.email = Email;
                    else return 0; //email is found before
                }
                if (Country != undefined) {
                    user.country = Country;
                }

            }
            await user.save();
            return 1;

        } 
        else return 0;

    },

    
   
    /** 
    * get user profile public
    * @param  {string} userId - the user id 
    * @returns {Object}
    */
    me: async function(userID) {
        
        const user = await this.getUserById(userID);
        if (!user) {
            return 0;
        }


        userPublic = {}
        userPublic["_id"] = user._id;
        userPublic["displayName"] = user.displayName;
        userPublic["images"] = user.images;
        userPublic["type"] = user.type;
        userPublic["followedBy"] = user.followedBy;
        return userPublic;



    },

    
    /** 
    * delete user account
    * @param  {string} userId - the user id 
    * @returns {Object}
    */
    deleteAccount: async function(userID) {
        const user = await this.getUserById(userID);
        if (!user) { return 0; }
        const User = await userDocument.find({ follow: { id: user._id } }, (err, User) => {
            if (err) return 0;
            return User;
        });
        // delete user himseld from db
        await userDocument.findByIdAndDelete(userID);
        return User;

    },

    
       
    /** 
    * user like a track
    * @param  {string} userId - the user id 
    * @param  {string} trackID - the track id 
    * @returns {Number}
    */
    likeTrack: async function(userID, trackID) {

        const user = await this.getUserById(userID);
        if (!user) { return 0; }
        const likeTrack = await Track.likeTrack(user, trackID).catch();
        return likeTrack;

    },
    
    
    /** 
    * user unlike a track
    * @param  {string} userId - the user id 
    * @param  {string} trackID - the track id 
    * @returns {Number}
    */
    unlikeTrack: async function(userID, trackID) {
        const user = await this.getUserById(userID);
        if (!user) { return 0; }
        const unlikeTrack = await Track.unlikeTrack(user, trackID);
        return unlikeTrack;
    },

    
    /** 
    * user add track to user's playlist
    * @param  {string} userId - the user id 
    * @param  {string} trackID - the track id 
    * @param  {string} playlistID - the playlist id
    * @returns {Number}
    */
    addTrack: async function(user, trackID, playlistID) {
        const Playlist = await playlist.findById(playlistID);
        const Track = await track.findById(trackID);
        if (!Playlist || !Track) { return 0; }
        if (Playlist.hasTracks) {
            user.hasTracks.push({
                trackId: trackID

            });
            await Playlist.save();
            return 1;

        }
        Playlist.hasTracks = [];
        Playlist.hasTracks.push({
            trackId: trackID

        });
        await Playlist.save();
        return 1;

    },

    
    /** 
    * user add track to playlist
    * @param  {string} userId - the user id 
    * @param  {string} trackID - the track id 
    * @param  {string} playlistID - the playlist id
    * @returns {Number}
    */
    AddTrackToPlaylist: async function(userID, trackID, playlistID) {
        const user = await this.getUserById(userID);
        const userplaylist = await user.createPlaylist.find({ playListId: playlistID });
        if (!user || userplaylist) { return 0; }
        const addTrack = await this.addTrack(user, trackID, playlistID);
        return addTrack;
    },

    
    /** 
    * get user's following artist
    * @param  {string} userId - the user id 
    * @returns {Array<Object>}
    */
    getUserFollowingArtist: async function(userID) {

        const user = await this.getUserById(userID);
        if (!user.follow.length) { return 0; }
        let Artist = []
        for (let i = 0; i < user.follow.length; i++) {
            let User = await this.getUserById(user.follow[i].id);
            if (User) {
                let artists = await artistDocument.find({ userId: User._id });
                if (artists) {
                    Artist.push(artists[0]);
                }
            }
        }
        return Artist;

    },



    
    /** 
    * check if user email in db
    * @param  {string} email - the user email 
    * @returns {Object}
    */
    checkmail: async function(email) {

        let user = await userDocument.findOne({ email: email });
        if (!user) return false;
        return user;
    
    },

    
    /** 
    * update user forgotten password
    * @param  {Object} user - the user 
    * @returns {string}
    */
    updateforgottenpassword: async function(user) {

        let password = user.displayName + "1234";
        const salt = await bcrypt.genSalt(10);
        let hashed = await bcrypt.hash(password, salt);
        user.password = hashed;
        await user.save();
        return password;

    },

    
    /** 
    * user follow playlist
    * @param  {string} userID - the user ID
    * @param  {string} playlistID - the playlist ID
    * @param  {Boolean} isprivate - the playlist status public or private
    * @returns {Number}
    */
    followPlaylist: async function(userID, playlistID, isprivate) {
        const user = await this.getUserById(userID);
        if (!user) { return 0; }
        return await Playlist.followPlaylits(user, playlistID, isprivate);

    },

    /** 
    * user unfollow playlist
    * @param  {string} userID - the user ID
    * @param  {string} playlistID - the playlist ID
    * @returns {Number}
    */
    unfollowPlaylist: async function(userID, playlistID) {
        const user = await this.getUserById(userID);
        if (!user) { return 0; }
        return await Playlist.unfollowPlaylist(user, playlistID);
    },

    /** 
    * user delete playlist
    * @param  {string} userID - the user ID
    * @param  {string} playlistID - the playlist ID
    * @returns {Number}
    */
    deletePlaylist: async function(userID, playlistID) {

        const user = await this.getUserById(userID);
        if (!user) return 0; 
        const isDelete = await Playlist.deletePlaylist(user, playlistID);
        return isDelete;

    },

    
    /** 
    * get user's playlist
    * @param  {string} playlistId - the playlist ID
    * @param  {string} snapshot - the snapshot ID if given
    * @param  {string} userId - the user ID
    * @returns {Array<Object>}
    */
    getPlaylist: async function(playlistId, snapshot, userId) {

        const user = await this.getUserById(userId);
        const playlist = await Playlist.getPlaylistWithTracks(playlistId, snapshot, user);
        const owner = await this.getUserById(playlist[0].ownerId);
        playlist.push({ ownerName: owner ? owner.displayName : undefined });
        return playlist;

    },


    
    /** 
    * user create playlist
    * @param  {string} userID - the user ID
    * @param  {string} playlistName - the name of the new playlist
    * @param  {string} Description - the Description of the new playlist if given
    * @returns {Object}
    */
    createdPlaylist: async function(userID, playlistName, Description) {

        const user = await this.getUserById(userID);
        // create new playlist
        const createdPlaylist = await Playlist.createPlaylist(userID, playlistName, Description);
        //add to user 
        if (user.createPlaylist) {
            user.createPlaylist.push({
                playListId: createdPlaylist._id,
                addedAt: Date.now(),
                isPrivate: false
            });

        } 
        else 
        {
            user.createPlaylist = [];
            user.createPlaylist.push({
                playListId: createdPlaylist._id,
                addedAt: Date.now(),
                isPrivate: false
            });
        }
        await user.save().catch();
        await Playlist.followPlaylits(user, createdPlaylist._id, false);
        return createdPlaylist;

    },
    

    
    /** 
    * check if user can access a playlist
    * @param  {string} userID - the user ID
    * @param  {string} playlistId - the playlist Id 
    * @returns {Boolean}
    */
    checkAuthorizedPlaylist: async function(userID, playlistId) {

        let users = await userDocument.find({});
        let createduser;
        let playlistindex;
        let found = false;
        for (let user in users) {
            for (var i = 0; i < users[user].createPlaylist.length; i++) {
                if (users[user].createPlaylist[i].playListId == playlistId) {
                    createduser = users[user];
                    playlistindex = i;
                    found = true;
                    break;
                }
            }
            if (found) break;
        }
        if (!createduser) { return false; }
        if (createduser._id == userID) { return true; } else {
            for (var i = 0; i < createduser.createPlaylist[playlistindex].collaboratorsId.length; i++) {
                if (createduser.createPlaylist[playlistindex].collaboratorsId[i] == userID) {
                    return true;
                }
            }
        }
        return false;
    },

    /** 
    * promote user to artist
    * @param  {string} userID - the user ID
    * @param  {string} info - the info of the new Artist 
    * @param  {string} name - the name of the new Artist 
    * @param  {Array<string>} genre - the genre(s) of the new Artist
    * @returns {Boolean}
    */
    promoteToArtist: async function(userID, info, name, genre) {

        user = await this.getUserById(userID);
        if (!user) return false;
        if (user.userType == "Artist") {
            return false;
        }
        let artist = await Artist.createArtist(user, info, name, genre);
        if (!artist) return false;
        user.userType = "Artist";
        await user.save();
        sendmail(user.email, "Congrats!! ^^) You're Now Promoted to Artist so You can Login with your Account as an Artist");
        return true;

    },
    
    /** 
    * create queue for a user
    * @param  {string} userID - the user ID
    * @param  {Boolean} isPlaylist - the status of the source of the track (playlist or not)
    * @param  {string} sourceId - the id of the source of the track 
    * @param  {string} trackId - the id of the track the user started playing
    * @returns {Number}
    */
    createQueue: async function(userID, isPlaylist, sourceId, trackId) {

        const user = await this.getUserById(userID);
        const isCreateQueue = await Player.createQueue(user, isPlaylist, sourceId, trackId);
        return isCreateQueue;

    },

    
    /** 
    * add track to user's queue
    * @param  {string} userID - the user ID
    * @param  {string} trackId - the id of the track the user wants to add
    * @param  {Boolean} isPlaylist - the status of the source of the track (playlist or not)
    * @param  {string} sourceId - the id of the source of the track 
    * @returns {Number}
    */
    addToQueue: async function(userID, trackId, isPlaylist, sourceId) {

        const user = await this.getUserById(userID);
        const isAddQueue = await Player.addToQueue(user, trackId, isPlaylist, sourceId);
        return isAddQueue;

    },

    /** 
    * update user's player
    * @param  {string} userID - the user ID
    * @param  {Boolean} isPlaylist - the status of the source of the track (playlist or not)
    * @param  {string} sourceId - the id of the source of the track 
    * @param  {string} trackID - the id of the track the user wants to add
    * @returns {Number}
    */
    updateUserPlayer: async function(userID, isPlaylist, sourceId, trackID) {

        const user = await this.getUserById(userID);
        const queu = await Player.createQueue(user, isPlaylist, sourceId, trackID);
        if (!queu) return 0;
        const player = await Player.setPlayerInstance(user, isPlaylist, sourceId, trackID);
        if (!player) return 0;
        return 1;
    },

    
    /** 
    * repeat playlist 
    * @param  {string} userID - the user ID
    * @param  {Boolean} state - the state of the repeat (on or off)
    * @returns {Number}
    */
    repreatPlaylist: async function(userID, state) {

        const user = await this.getUserById(userID);
        return await Player.repreatPlaylist(user, state);

    },

    /** 
    * get user's queue
    * @param  {string} userId - the user ID
    * @returns {Array<Object>}
    */
    getQueue: async function(userId) {

        const user = await this.getUserById(userId);
        if (!user) return 0;
        const tracks = await Player.getQueue(user);
        if (!tracks) return 0;
        return tracks;

    },
 
    /** 
    * resume the user player
    * @param  {string} userID - the user ID
    * @returns {Number}
    */
    resumePlaying: async function(userID) {

        const user = await this.getUserById(userID);
        const player = await Player.resumePlaying(user);
        if (!player) return 0;
        return 1;

    },

    
    /** 
    * pause the user player
    * @param  {string} userID - the user ID
    * @returns {Number}
    */
    pausePlaying: async function(userID) {
        const user = await this.getUserById(userID);
        const player = await Player.pausePlaying(user);
        if (!player) return 0;
    },

    
    /** 
    * shuffle playlist
    * @param  {Boolean} state - the state of the shuffle (on or off)
    * @param  {string} userId - the user ID
    * @returns {Number}
    */
    setShuffle: async function(state, userId) {
        const user = await this.getUserById(userId);
        if (!user) return 0;
        const isShuffle = await Player.setShuffle(state, user);
        if (!isShuffle) return 0;
        return 1;
    }

}

module.exports = User;