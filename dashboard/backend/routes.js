const express = require('express')
const routes = express.Router();
const fs = require('fs')
module.exports = function (passport, checkAuth, client, renderTemplate, GuildData, error) {

    routes.use('/', require('./dashboard/index')(passport, checkAuth, client, renderTemplate, error));
    routes.use(require('./dashboard/dashboard')(passport, checkAuth, client, renderTemplate, error));
    routes.use(require('./dashboard/settings')(passport, checkAuth, client, renderTemplate, GuildData, error));

    routes.use('/login', require('./auth/login')(passport));
    routes.use('/callback', require('./auth/callback')(passport, client, error));
    routes.use('/logout', require('./auth/logout')(passport));



    return routes;

}