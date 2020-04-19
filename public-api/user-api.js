const { user: userDocument, artist: artistDocument, album: albumDocument, track: trackDocument, playlist: playlistDocument, category: categoryDocument } = require('../models/db');
const Track = require('./track-api');
const Playlist = require('./playlist-api');
// initialize db 
const bcrypt = require('bcrypt');
const Artist = require('./artist-api');
const sendmail = require('../forget-password/sendmail');
const Player = require('./player-api');
const checkMonooseObjectId = require('../validation/mongoose-objectid')

const User = {

    //get user by id
    //params: userId
    getUserById: async function(userId) {
        if (!checkMonooseObjectId([userId])) return 0;
        const user = await userDocument.findById(userId, (err, user) => {
            if (err) return 0;
            return user;
        }).catch((err) => 0);

        return user;
    },

    //update user profile information
    //params: userId, Display_Name(optional), Password(optional),
    //        Email(optional), Country(optional) 
    update: async function(userId, Display_Name, Password, Email, Country) {
        if (!checkMonooseObjectId([userId])) return 0;
        const user = await this.getUserById(userId);
        if (user) {
            if (user.isFacebook) {
                //if from facebok change country only
                if (Country)
                    user.country = Country;

            } else {
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

        } else return 0;

    },

    //get user profile public
    //params: userId
    me: async function(userId) {
        if (!checkMonooseObjectId([userId])) return 0;
        const user = await this.getUserById(userId);
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

    //delete user account
    //params: userId
    deleteAccount: async function(userId) {
        if (!checkMonooseObjectId([userId])) return 0;
        const user = await this.getUserById(userId);
        if (!user) { return 0; }
        const User = await userDocument.find({ follow: { id: user._id } }, (err, User) => {
            if (err) return 0;
            return User;
        });
        // delete user himseld from db
        await userDocument.findByIdAndDelete(userId);
        return User;

    },

    //user like a track
    //params: userId, trackId
    likeTrack: async function(userId, trackId) {
        if (!checkMonooseObjectId([userId, trackId])) return 0;
        const user = await this.getUserById(userId);
        if (!user) { return 0; }
        const likeTrack = await Track.likeTrack(user, trackId).catch();
        return likeTrack;

    },

    //user unlike a track
    //params: userId, trackId
    unlikeTrack: async function(userId, trackId) {
        if (!checkMonooseObjectId([userId, trackId])) return 0;
        const user = await this.getUserById(userId);
        if (!user) { return 0; }
        const unlikeTrack = await Track.unlikeTrack(user, trackId);
        return unlikeTrack;
    },

    //user add track to playlist
    //params: userId, trackId, playlistId
    AddTrackToPlaylist: async function(userId, trackId, playlistId) {
        if (!checkMonooseObjectId([userId, trackId, playlistId])) return 0;
        const user = await this.getUserById(userId);
        const userplaylist = await user.createPlaylist.find({ playListId: playlistId });
        if (!user || !userplaylist) { return 0; }
        const addTrack = await this.addTrack(user, trackId, playlistId);
        return addTrack;
    },

    //get user's following artist
    //params: userId
    getUserFollowingArtist: async function(userId) {
        if (!checkMonooseObjectId([userId])) return 0;
        const user = await this.getUserById(userId);
        if (!user.follow) user.follow = [];
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
    //check if user email in db
    //params: email
    checkmail: async function(email) {
        let user = await userDocument.findOne({ email: email });
        if (!user) return false;
        return user;
    },

    //user forget password
    //params: user
    updateforgottenpassword: async function(user) {

        let password = user.displayName + "1234";
        const salt = await bcrypt.genSalt(10);
        let hashed = await bcrypt.hash(password, salt);
        user.password = hashed;
        await user.save();
        return password;

    },

    //user follow playlist
    //params: userId, playlistId, isprivate
    followPlaylist: async function(userId, playlistId, isprivate) {
        if (!checkMonooseObjectId([userId, playlistId])) return 0;
        const user = await this.getUserById(userId);
        if (!user) return 0;
        return await Playlist.followPlaylits(user, playlistId, isprivate);

    },

    //user unfollow playlist
    //params: userId, playlistId
    unfollowPlaylist: async function(userId, playlistId) {
        if (!checkMonooseObjectId([userId, playlistId])) return 0;
        const user = await this.getUserById(userId);
        if (!user) return 0;
        return await Playlist.unfollowPlaylist(user, playlistId);
    },

    //user delete playlist
    //params: userId, playlistId
    deletePlaylist: async function(userId, playlistId) {
        if (!checkMonooseObjectId([userId, playlistId])) return 0;
        const user = await this.getUserById(userId);
        if (!user) return 0;
        const isDelete = await Playlist.deletePlaylist(user, playlistId);
        if (!isDelete) return 0;
        spotifyUser = await this.checkmail('appspotify646@gmail.com');
        if (!spotifyUser)
            spotifyUser = await this.createUser('Spotify', 'HelloSpotify', 'appspotify646@gmail.com', 'Spotify', 'All', Date.now());
        if (!spotifyUser) return 0;
        return await this.addPlaylistToCreatedToUser(spotifyUser, playlistId);
    },

    createUser: async function(username, password, email, gender, country, birthday) {
        console.log('asadfsdfdf');
        const salt = await bcrypt.genSalt(10);
        let hash = await bcrypt.hash(password, salt);
        const user = new userDocument({
            email: email,
            password: hash,
            displayName: username,
            gender: gender,
            country: country,
            birthDate: birthday,
            product: "free",
            userType: "user",
            type: "user",
            isFacebook: false,
            images: [],
            follow: [],
            followedBy: [],
            like: [],
            createPlaylist: [],
            saveAlbum: [],
            playHistory: [],
            player: {}
        });
        user.player["is_shuffled"] = false;
        user.player["volume"] = 4;
        user.player["is_repeat"] = false;
        await user.save();
        return user;
    },
    //get user's playlist
    //params: playlistId, snapshot, userId
    getPlaylist: async function(playlistId, snapshot, userId) {
        if (!checkMonooseObjectId([userId, playlistId])) return 0;
        const user = await this.getUserById(userId);
        if (!user) return 0;
        const playlist = await Playlist.getPlaylistWithTracks(playlistId, snapshot, user);
        if (!playlist[0]) return 0;
        const owner = await this.getUserById(playlist[0].ownerId);
        playlist.push({ ownerName: owner ? owner.displayName : undefined });
        return playlist;
    },


    //user create playlist
    //params: userId, playlistName, Description
    createdPlaylist: async function(userId, playlistName, Description) {
        if (!checkMonooseObjectId([userId])) return 0;
        const user = await this.getUserById(userId);
        // create new playlist
        if (!user) return 0;
        const createdPlaylist = await Playlist.createPlaylist(userId, playlistName, Description);
        //add to user 
        if (!createdPlaylist) return 0;
        const addToUser = this.addPlaylistToCreatedToUser(user, createdPlaylist._id);
        if (!addToUser) return 0;
        return createdPlaylist;
    },

    addPlaylistToCreatedToUser: async function(user, playlistId) {
        if (!user) return 0;
        if (!user.createPlaylist)
            user.createPlaylist = [];
        user.createPlaylist.push({
            playListId: playlistId,
            addedAt: Date.now(),
            isPrivate: false
        });
        await user.save().catch();
        await Playlist.followPlaylits(user, playlistId, false);
        return 1;
    },
    //check if user can access a playlist
    //params: userId, playlistId
    checkAuthorizedPlaylist: async function(userId, playlistId) {
        if (!checkMonooseObjectId([userId])) return 0;
        let users = await userDocument.find({});
        if (!users) return 0;
        let createduser;
        let playlistindex;
        let found = false;
        for (let user in users) {
            if (!users[user].createPlaylist) return 0;
            for (var i = 0; i < users[user].createPlaylist.length; i++) {
                if (users[user].createPlaylist[i].playListId + 1 == playlistId + 1) {
                    createduser = users[user];
                    playlistindex = i;
                    found = true;
                    break;
                }
            }
            if (found) break;
        }
        if (!createduser) { return false; }
        if (createduser._id + 1 == userId + 1) return true;
        else {
            for (var i = 0; i < createduser.createPlaylist[playlistindex].collaboratorsId.length; i++) {
                if (createduser.createPlaylist[playlistindex].collaboratorsId[i] + 1 == userId + 1) {
                    return true;
                }
            }
        }
        return false;
    },


    //promote user to artist
    //params: userId, info, name, genre
    promoteToArtist: async function(userId, info, name, genre) {
        if (!checkMonooseObjectId([userId])) return 0;
        user = await this.getUserById(userId);
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
     * promote user To Premium
     * @param {string} userId  -the id of user
     * @returns {boolean} - if can or not  
     */
    promoteToPremium: async function(userId, credit) {
        if (!checkMonooseObjectId([userId])) return 0;
        user = await this.getUserById(userId);
        if (!user) return false;
        if (user.product == 'premium') {
            return false;
        }
        user.product = 'premium';
        user.creditCard = credit;
        await user.save();
        sendmail(user.email, 'Congrats!! ^^) You are Now Promoted to premium so You can Login with your Account as an premium please login again :\n enjoy with premium');
        return true;
    },
    //create queue for a user
    //params: userId, isPlaylist, sourceId, trackId
    createQueue: async function(userId, isPlaylist, sourceId, trackId) {
        if (!checkMonooseObjectId([userId, sourceId, trackId])) return 0;
        const user = await this.getUserById(userId);
        const isCreateQueue = await Player.createQueue(user, isPlaylist, sourceId, trackId);
        return isCreateQueue;

    },

    //add track to user's queue
    //params: userId, isPlaylist, sourceId, trackId
    addToQueue: async function(userId, trackId, isPlaylist, sourceId) {
        if (!checkMonooseObjectId([userId, sourceId, trackId])) return 0;
        const user = await this.getUserById(userId);
        if (!user) return 0;
        const isAddQueue = await Player.addToQueue(user, trackId, isPlaylist, sourceId);
        return isAddQueue;
    },

    //update user's player
    //params: userId, isPlaylist, sourceId, trackId
    updateUserPlayer: async function(userId, isPlaylist, sourceId, trackId) {
        if (!checkMonooseObjectId([userId, sourceId, trackId])) return 0;
        const user = await this.getUserById(userId);
        if (!user) return 0;
        const queu = await Player.createQueue(user, isPlaylist, sourceId, trackId);
        if (!queu) return 0;
        const player = await Player.setPlayerInstance(user, isPlaylist, sourceId, trackId);
        if (!player) return 0;
        return 1;
    },

    //repeat playlist 
    //params: userId, state
    repreatPlaylist: async function(userId, state) {
        if (!checkMonooseObjectId([userId])) return 0;
        const user = await this.getUserById(userId);
        if (user)
            return await Player.repreatPlaylist(user, state);
        return 0;
    },

    //get user's queue
    //params: userId
    getQueue: async function(userId) {
        if (!checkMonooseObjectId([userId])) return 0;
        const user = await this.getUserById(userId);
        if (!user) return 0;
        const tracks = await Player.getQueue(user);
        if (!tracks) return 0;
        return tracks;

    },

    //resume playing
    //params: userId
    resumePlaying: async function(userId) {
        if (!checkMonooseObjectId([userId])) return 0;
        const user = await this.getUserById(userId);
        if (!user) return 0;
        const player = await Player.resumePlaying(user);
        if (!player) return 0;
        return 1;

    },

    //pause playing
    //params: userId
    pausePlaying: async function(userId) {
        if (!checkMonooseObjectId([userId])) return 0;
        const user = await this.getUserById(userId);
        if (!user) return 0;
        const player = await Player.pausePlaying(user);
        if (!player) return 0;
    },

    //shuffle playlist
    //params: userId, state
    setShuffle: async function(state, userId) {
        if (!checkMonooseObjectId([userId])) return 0;
        const user = await this.getUserById(userId);
        if (!user) return 0;
        const isShuffle = await Player.setShuffle(state, user);
        if (!isShuffle) return 0;
        return 1;
    }

}

module.exports = User;