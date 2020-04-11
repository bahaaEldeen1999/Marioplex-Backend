const MockUser =  {
    
    users : [],
    checkmail : function(email){
        return this.users.find(user => user.email==email);
    },
    
    updateforgottenpassword: function(email){
        let user=this.users.find(user => user.email==email);
        if(!user) return 0;
        user.password=user.displayName+"1234";
        return user;
    }

}
module.exports=MockUser;