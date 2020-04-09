const jwt=require('jsonwebtoken');
const jwtSecret = require('../config/jwt-key').secret;
/**
 * check if the user is authenticated ot not from jwt header  (MIDDLEWARE)
 * @param {object} req 
 * @param {object} res 
 * @param {function} next
 * @returns {void} 
 */
function auth(req,res,next){

  // check the jwt token user sends in the header
    

const token=req.header('x-auth-token');

if(!token){return res.status(401).send('No Available token');}

try{
const decoded=jwt.verify(token,jwtSecret);
req.user=decoded;
next();
}
catch(ex){
 
  return res.status(400).send('Invalid Token');
}

};
module.exports={auth};