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
    },
    {
        '_id':'4',
        'follow': [],
        'createPlaylist':[]
    },
    {
        '_id':'5',
        'follow': [{id:'4'},{id:'1'},{id:'44'},{id:'5'},{id:'12'}],
        
    },
    {
        '_id':'6',
        'follow': [],
        'createPlaylist':['1','2','3']
    },
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


test('updaet facebook user with country',()=>{
    expect(UserTest.update("2",undefined,undefined,undefined,"eg")).toBeTruthy();
})


test('update facebook user without country',()=>{
    expect(UserTest.update("2",undefined,undefined,undefined,undefined)).toBeTruthy();
})

test('update non existing user',()=>{
    expect(UserTest.update("99",undefined,undefined,undefined,undefined)).toBeFalsy();
})




test('update user password',()=>{
    expect(UserTest.update("1",undefined,"11",undefined,undefined)).toBeTruthy();
})





test('update user email',()=>{
    expect(UserTest.update("1",undefined,undefined,"b@b.com",undefined)).toBeTruthy();
})

test('update user email with same email as other user',()=>{
    expect(UserTest.update("1",undefined,undefined,"b@b.com",undefined)).toBeFalsy();
})

test('update user country',()=>{
    expect(UserTest.update("1",undefined,undefined,undefined,"eg")).toBeTruthy();
})

test('get followers of user with no follow',()=>{
    expect(UserTest.getUserFollowingArtist('4')).toBeFalsy();
})

test('get followings of user with folowings which aome of are not users',()=>{
    expect(UserTest.getUserFollowingArtist('5')).toBeTruthy();
})


test('check email of not exisiting user',()=>{
    expect(UserTest.checkmail('84')).toBeFalsy();
})

test('check if user has access to playlist private actions in playlist he doesnt own and with zero playlist of his own',()=>{
    expect(UserTest.checkAuthorizedPlaylist('4','5')).toBeFalsy();
})

test('user has zero playlist creates a playlist',()=>{
    expect(UserTest.createdPlaylist('4','any playlist name','info')).toEqual([{
        playListId: 'any playlist name',
        addedAt: '20-03-2020', 
        isPrivate: false
    }]);
})

test('user has zero playlist check auth for edit on playlists',()=>{
    expect(UserTest.checkAuthorizedPlaylist('5','1')).toBeFalsy();
})

test('user doesnt own playlist check for auth',()=>{
    expect(UserTest.checkAuthorizedPlaylist('6','6')).toBeFalsy();
})


test('promote non user to artist',()=>{
    expect(UserTest.promoteToArtist('84')).toBeFalsy();
})



// delete account at end 
test('delete account ', () => {
    UserTest.deleteAccount('1');
    expect(UserTest.getUserById('1')).toEqual(undefined);
})

    test('delete non existing account ', () => {
    
    expect(UserTest.deleteAccount('99')).toBeFalsy();
})