/**
 * check if content is json or not  (MIDDLEWARE)
 * @param {object} req 
 * @param {object} res 
 * @param {function} next
 * @returns {void} 
 */
function content(req,res,next){
    if  (!req.accepts('application/json')) return res.status(406).send('Not Accepted');
    next();
    };
module.exports={content};