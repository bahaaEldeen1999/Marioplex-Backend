const  FacebookStrategy = require('passport-facebook').Strategy;
const jwtSeret = require('../config/jwt-key');
const jwt =require('jsonwebtoken');
const FACEBOOK_APP_ID = require('./keys').facebook.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = require('./keys').facebook.FACEBOOK_APP_SECRET;
const  {user:userDocument,artist:artistDocument,album:albumDocument,track:trackDocument,playlist:playlistDocument,category:categoryDocument} = require('../models/db');


// initialize db 
const connection=require('../DBconnection/connection');
// get jwt middleware
const JWT = require('../config/passport-jwt');

module.exports = (passport) => {
        passport.use(new FacebookStrategy({
            clientID: FACEBOOK_APP_ID,
            clientSecret: FACEBOOK_APP_SECRET,
            callbackURL: "/auth/facebook/callback",
            profileFields: ['id', 'emails', 'name'] 
        },
        async function(accessToken, refreshToken, profile, done) {
              // TO DO 
              // CHECK IF USER IN DB IF TRUE THEN LOG HIM IN ELSE CREATE A NEW ACCOUNT FOR USER
               if(profile){
                   //console.log(profile);
                    const user = await userDocument.findOne({ email:profile.emails[0].value },(err,user)=>{
                        if(err) return 0;
                        return user;
                    });
                    if(user){
                        // user in db
                       
                        return done(null,user);
                    }else{
                        // create user
                        const newUser = await new userDocument({
                            email:profile.emails[0].value,
                            displayName:profile.username,
                            gender:profile.gender,



                        }).save();
                       
                        return done(null,newUser);
                    }
                   
               }
               return done(true,null);
        }
    ));
}

