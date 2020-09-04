const jwt = require('jsonwebtoken');
const secret = 'ldfasakdmclakmclksmcakmks'

module.exports = function(req, res, next) {
   const authToken = req.headers['authorization'];

   if (authToken != undefined) {
       var bearer = authToken.split(' ');
       var token = bearer[1];

       try {
           var decoded = jwt.verify(token, secret);
           
            if (decoded.role == 1) {
               next()
            } else {
                res.status(403);
                res.send('Você não tem permissão admin');
                return;
            }
       } catch (err) {
            res.status(403);
            res.send('Você não está autenticado');
            return;
       }

   } else {
       res.status(403);
       res.send('Você não está autenticado');
       return;
   }
}