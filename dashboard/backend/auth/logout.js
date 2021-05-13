const express = require('express')
const logout = express.Router();

module.exports = function (passport) {

    logout.route('/').get(async (req, res) => {
        req.session.destroy(() => {
            req.logout();
            res.redirect("/");
        });
        
    })

    return logout;

}