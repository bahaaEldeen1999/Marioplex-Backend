//const bcrypt = require('bcrypt');
const MockUser = {
    user: [],
    getUserById: function(userId) {
        return this.user.find(User => User._id == userId);
    },

    //update user profile information
    //params: userID, Display_Name(optional), Password(optional),
    //        Email(optional), Country(optional) 
    update: function(userID, Display_Name, Password, Email, Country) {

        const user = this.getUserById(userID);
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
                    const UserByEmail = this.user.find(User => User.email == Email);
                    if (!UserByEmail) user.email = Email;
                    else return 0; //email is found before
                }
                if (Country != undefined) {
                    user.country = Country;
                }

            }
            return 1;

        } else return 0;

    },

    //get user profile public
    //params: userID
    me: function(userID) {

        const user = this.getUserById(userID);
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
    //params: userID
    deleteAccount: function(userID) {
        const userq = this.getUserById(userID);
        if (!userq) { return 0; }
        // delete user himseld from db
        this.user.splice(userq, 1)
        return 1;

    },
    //get user's following artist
    //params: userID
    getUserFollowingArtist: function(userID) {
        const user = this.getUserById(userID);
        if (!user.follow.length) { return 0; }
        let Artist = []
        for (let i = 0; i < user.follow.length; i++) {
            let User = this.getUserById(user.follow[i].id);
            if (User) {
                let artists = this.Artists.find(artist => artist.userId == user.follow[i].id);
                if (artists) { // has error in code artists-[0] which is not correct
                    Artist.push(artists);
                }
            }
        }
        return Artist;
    },



    //check if user email in db
    //params: email
    checkmail: function(email) {

        let user1 = this.user.find(User => User.email == email);
        if (!user1) return false;
        return user1;

    },

    //user forget password
    //params: user
    updateforgottenpassword: function(user) {
        let password = user.displayName + "1234";
        // const salt = bcrypt.genSalt(10);
        //let hashed =  bcrypt.hash(password, salt);
        user.password = password;
        return password;

    },

    //user create playlist
    //params: userID, playlistName, Description
    createdPlaylist: function(userID, playlistName, Description) {
        // not correct in code should replace 
        const user = this.getUserById(userID);

        //add to user 
        if (user.createPlaylist) {
            user.createPlaylist.push({
                playListId: playlistName,
                addedAt: '20-03-2020', //put it in const value becouse can not determine the secound which add in it
                isPrivate: false
            });

        } else {
            user.createPlaylist = [];
            user.createPlaylist.push({
                playListId: playlistName,
                addedAt: '20-03-2020',
                isPrivate: false
            });
        }
        return user.createPlaylist;

    },


    //check if user can access a playlist
    //params: userID, playlistId
    checkAuthorizedPlaylist: function(userID, playlistId) {
        const user = this.getUserById(userID);
        //console.log(user)

        if (user.createPlaylist)
            for (let i = 0; i < user.createPlaylist.length; i++) {
                if (user.createPlaylist[i].playListId == playlistId)
                    return true;
            }
        return false;
    },
    //promote user to artist
    //params: userID, info, name, genre
    promoteToArtist: function(userID, info, name, genre) {

        user = this.getUserById(userID);
        if (!user) return false;
        if (user.userType == "Artist") {
            return false;
        }
        //let artist = await Artist.createArtist(user, info, name, genre);
        // if (!artist) return false;
        user.userType = "Artist";
        //await user.save();
        //sendmail(user.email, "Congrats!! ^^) You're Now Promoted to Artist so You can Login with your Account as an Artist");
        return true;

    },
}
const UserTest = MockUser;
UserTest.user = [{
        '_id': '1',
        'displayName': 'dina alaa',
        'email': 'dinaalaaahmed@gmail.com',
        'password': '1223345677',
        'country': 'egypt',
        'isFacebook': false,
        'follow': [{ id: '2' }, { id: '3' }],
        'userType': 'user'
    }, {
        '_id': '2',
        'displayName': 'Arwa alaa',
        'email': 'Arwaalaaahmed@gmail.com',
        'password': '1223345678',
        'country': 'egypt',
        'isFacebook': true,
        'userType': 'user',
        'follow': [{ id: '3' }]
    },
    {
        '_id': '3',
        'displayName': 'Alaa Alaa',
        'email': 'Arwalaaalaaahmed@gmail.com',
        'password': '12345678',
        'country': 'egypt',
        'userType': 'user',
        'isFacebook': true,
        'follow': [{ id: '2' }]
    }
]
UserTest.Artists = [{
        'id': '12',
        'userId': '2',
        'name': 'Artist1'
    },
    {
        'id': '10',
        'userId': '3',
        'name': 'Artist2'
    }
]


test('get update', () => {
    expect(UserTest.update('1', 'dai alaa')).toBeTruthy()
})
test('get user', () => {
    expect(UserTest.getUserById('1')).toEqual({
        '_id': '1',
        'displayName': 'dai alaa',
        'email': 'dinaalaaahmed@gmail.com',
        'password': '1223345677',
        'userType': 'user',
        'country': 'egypt',
        'isFacebook': false,
        'follow': [{ id: '2' }, { id: '3' }]
    })
})

test('get user not fount', () => {
    expect(UserTest.getUserById('10')).toEqual(undefined)
})
test('test me ', () => {

    expect(UserTest.me('1')).toEqual({
        _id: '1',
        displayName: 'dai alaa',
        images: undefined,
        type: undefined,
        followedBy: undefined
    })
})
test('bad test me ', () => {

    expect(UserTest.me('7')).toEqual(0);
})

test('test GET user followed artist ', () => {
    expect(UserTest.getUserFollowingArtist('2')).toEqual([{ "id": "10", "name": "Artist2", "userId": "3" }]);
})

test('test check email', () => {
    expect(UserTest.checkmail('dinaalaaahmed@gmail.com')).toEqual({
        '_id': '1',
        "displayName": "dai alaa",
        'email': 'dinaalaaahmed@gmail.com',
        'password': '1223345677',
        'country': 'egypt',
        'isFacebook': false,
        'userType': 'user',
        'follow': [{ id: '2' }, { id: '3' }]
    });
})
test('update password by forget password', () => {
    expect(UserTest.updateforgottenpassword(UserTest.user[0])).toEqual('dai alaa1234')
})
test('create playlist', () => {

    expect(UserTest.createdPlaylist('2', 'playlist1', 'this is my playlist')).toEqual([
        { playListId: 'playlist1', addedAt: '20-03-2020', isPrivate: false }
    ])
})
test(('check Authorized Playlist'), () => {
    //console.log(UserTest.checkAuthorizedPlaylist('2', 'playlist1'))
    expect(UserTest.checkAuthorizedPlaylist('2', 'playlist1')).toEqual(true)
})
test(('promote user to artist'), () => {
    UserTest.promoteToArtist('3');
    expect(UserTest.user[2].userType).toEqual('Artist')
})
test(('promote user to artist'), () => {;
        expect(UserTest.promoteToArtist('3')).toEqual(false)
    })
    // delete account at end 
test('delete account ', () => {
    UserTest.deleteAccount('1');
    expect(UserTest.getUserById('1')).toEqual(undefined);
})