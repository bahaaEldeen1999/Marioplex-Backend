/**
 * check if logged in user is an artist or not (MIDDLEWARE)
 * @param {object} req 
 * @param {object} res 
 * @param {function} next
 * @returns {void} 
 */
function isArtist(req,res,next){
  
    if(req.user.userType!="Artist") return res.status(403).send('Access Denied');

    next();
    
    };
module.exports={isArtist};