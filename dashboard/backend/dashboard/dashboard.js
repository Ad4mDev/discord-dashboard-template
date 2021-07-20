const express = require('express')
const index = express.Router();
const config = require('config')
const Discord = require('discord.js')

module.exports = function (passport, checkAuth, client, renderTemplate, error) {
    index.route('/dashboard').get(checkAuth, async (req, res) => {

        renderTemplate(res, req, "dashboard.ejs", { perms: Discord.Permissions});

    })
    return index;

}