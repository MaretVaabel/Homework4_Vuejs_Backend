const UserModel = require('../models/UserModel');
const jwt = require("../library/jwt");

module.exports = (request, response, next) => {

    // This is the place where you will need to implement authorization
    /*
        Pass access token in the Authorization header and verify
        it here using 'jsonwebtoken' dependency. Then set request.currentUser as
        decoded user from access token.
    */

    if (request.headers.authorization) {
        
        let auth = request.headers.authorization; // Get authorization from headers
        let accessToken = auth.slice(7);
        let token = accessToken ? jwt.verifyAccessToken(accessToken) : '' //Decode jwt to get user id 
        
        UserModel.getByEmailAndPassword(request.body.email, request.body.password, (user) => {
            request.currentUser = user; 

            UserModel.getById((accessToken ? token.id : user.id), (user) => {
                request.currentUser = user;
                next();
            });
        });     
    } else {
        // if there is no authorization header

        return response.status(403).json({
            message: 'Invalid token'
        });
    }
};