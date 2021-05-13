const express = require('express')
const callback = express.Router();
const config = require('config');
const { session } = require('passport');

module.exports = function (passport, client, error) {

    callback.route('/').get(passport.authenticate("discord", { failureRedirect: '/error?statuscode=500&message=Error' }), async (req, res, next) => {

        const guild = client.guilds.cache.get(config.get('serverConfig.guildId'));
        const user = req.isAuthenticated() ? req.user : null 
        const member = guild.members.cache.get(req.user.id);

      
        // if (guild.members.cache.has(user.id) && guild.members.cache.get(user.id).roles.cache.has(config.get('serverConfig.roleSettings.blacklistId'))) {

        //     req.session.destroy(() => {
        //         req.logout();
        //         res.redirect("/");
        //     });
        //     return

        // }

        if (user.id === client.appInfo.owner.ownerID || guild.members.cache.has(user.id) && member.hasPermission(8) || guild.members.cache.has(user.id) && guild.members.cache.get(user.id).roles.cache.has(config.get('serverConfig.roleSettings.dashboardStaffId'))) {
            req.session.isAdmin = true;
        } else {
            req.session.isAdmin = false;
        }
        if (req.session.backURL) {
            const url = req.session.backURL;
            req.session.backURL = null;
            res.redirect(url);
        } else {
            res.redirect("/");
        }

    });

    return callback;

}