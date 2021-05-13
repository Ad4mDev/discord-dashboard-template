const express = require('express')
const index = express.Router();
const config = require('config')

module.exports = function (passport, checkAuth, client, renderTemplate, userData, codeData, error) {
    index.route('/').get(async (req, res) => {

        renderTemplate(res, req, "index.ejs");

    })
    return index;

}