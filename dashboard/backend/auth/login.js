const express = require('express')
const login = express.Router();
const url = require("url");
const app = express();

module.exports = function (passport) {

  login.route('/').get(async (req, res, next) => {

    // We determine the returning url.
    if (req.session.backURL) {
      req.session.backURL = req.session.backURL; // eslint-disable-line no-self-assign
    } else if (req.headers.referer) {
      const parsed = url.parse(req.headers.referer);
      if (parsed.hostname === app.locals.domain) {
        req.session.backURL = parsed.path;
      }
    } else {
      req.session.backURL = "/dashboard";
    }
    // Forward the request to the passport middleware.
    next();
  },
    passport.authenticate("discord"));


  return login;

}