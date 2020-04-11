const bcrypt = require("bcrypt");
// const MockUser = {
//     birthDate,
//     email,
//     type,
//     password,
//     gender,
//     country,
//     isLogged,
//     userType ,
//     displayName ,
//     product ,
//     isFacebook
// }
const MockUsers  = {
    users:[],
    login: function(email,password){
        for(let i=0;i<this.users.length;i++){
            if(this.users[i].email == email && bcrypt.compare(password, this.users[i].password) ) return 1;
        }
        return 0;
    },
    signup: function(email,password,gender,country,birthday,username){
        if(!email || !password || !gender || !country || !birthday || !username)return 0;
        for(let user of this.users){
            if(email == user.email) return 0;
        }
        let user = {
            birthDate:birthday,
            email:email,
            type:"user",
            password:bcrypt.hash(password, 10),
            gender:gender,
            country:country,
            isLogged:false,
            userType:"user" ,
            displayName:username ,
            product:"free" ,
            isFacebook:false
        }
        this.users.push(user)
        return 1;
    }
}
module.exports=MockUsers;