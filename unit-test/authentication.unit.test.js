MockUsers=require('../mock-classes/authentication-mock');

test('sign up new user with new email',()=>{
    expect(MockUsers.signup("b@b.com","123","Male","eg","1/1/1999","bahaaEldeen")).toBeTruthy();
})
test('sign up with already existing email',()=>{
    expect(MockUsers.signup("b@b.com","123","Male","eg","1/1/1999","bahaaEldeen")).toBeFalsy();
})

test('sign up with new  email',()=>{
    expect(MockUsers.signup("bbbb@b.com","123","Male","eg","1/1/1999","bahaaEldeen")).toBeTruthy();
})
test('sign up no email ',()=>{
    expect(MockUsers.signup("","123","Male","eg","1/1/1999","bahaaEldeen")).toBeFalsy();
})
test('sign up no password ',()=>{
    expect(MockUsers.signup("b@b.com","","Male","eg","1/1/1999","bahaaEldeen")).toBeFalsy();
})
test('login with correct email and password',()=>{
    expect(MockUsers.login("b@b.com","123")).toBeTruthy();
})
test('login with uncorrect email and password',()=>{
    expect(MockUsers.login("bb@b.com","123")).toBeFalsy();
})
test('login with correct email and uncorrect password',()=>{
    expect(MockUsers.login("bb@b.com","1293")).toBeFalsy();
})