//const bcrypt = require('bcrypt');

const UserTest = require('../mock-classes/user-mock');
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