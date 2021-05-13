  
const express = require("express");
const app = express();
const passport = require("passport");
const session = require("express-session");
const MemoryStore = require("memorystore")(session);
const Strategy = require("passport-discord").Strategy;
const config = require("config");
const path = require('path')
const url = require('url')
require('dotenv').config()

module.exports = async client => {

    app.set("view engine", "ejs");

    app.use(express.urlencoded({ extended: true, limit: "50mb" }));
    app.use(express.json());


    //app.locals.domain = client.config.dashboard.domain;

    app.use(session({ store: new MemoryStore({ checkPeriod: 86400000 }), secret: config.get("dashboard.sessionSecret"), resave: false, saveUninitialized: false, }));

   
    app.use(passport.initialize());
    app.use(passport.session());
    
    passport.serializeUser((user, done) => { done(null, user); });
    passport.deserializeUser((obj, done) => { done(null, obj); });

    passport.use(new Strategy({
        clientID: client.appInfo.id,
        clientSecret: config.get('dashboard.oauthSecret'),
        callbackURL: process.env.DOMAIN + "/callback",
        scope: ["identify", "guilds"], 
        },
        (accessToken, refreshToken, profile, done) => {
            process.nextTick(() => done(null, profile));
        }));

    // RENDER AREA //
    const dataDir = path.resolve(`${process.cwd()}/dashboard/${path.sep}frontend`);
    const viewsDir = path.resolve(`${dataDir}${path.sep}views`);

    app.use("/static", express.static(path.resolve(`${dataDir}${path.sep}public`)));

    const renderTemplate = (res, req, template, data = {}) => {
        const baseData = {
            bot: client,
            path: req.path,
            config: client.config,
            guild: client.guilds.cache.get(config.get('serverConfig.guildId')),
            icon: client.guilds.cache.get(config.get('serverConfig.guildId')).iconURL({ dynamic: true, size: 128 }),
            user: req.isAuthenticated() ? req.user : null,
            reqMember: req.user ? client.guilds.cache.get(config.get('serverConfig.guildId')).members.cache.get(req.user.id) : null,
            isAdmin: req.session.isAdmin,
            req: req,
            res: res
        };
        res.render(path.resolve(`${viewsDir}${path.sep}${template}`), Object.assign(baseData, data));
    };

    // RENDER AREA //  

    function checkAuth(req, res, next) {
        if (req.isAuthenticated()) return next();
        req.session.backURL = req.url;
        res.redirect("/login")
    }

    const error = (res, statuscode, message) => {
        return res.redirect(url.format({ pathname: "/error", query: { statuscode, message } }));
    };

    app.use(require('../dashboard/backend/routes')(passport, checkAuth, client, renderTemplate, error))

    //  app.get('/', (req, res) => {
    //    res.end('sa')
    // })

    const chalk = require('chalk')

    client.site = app.listen(process.env.PORT || 3000, () => {
        console.log(chalk.blue(`[${client.user.username}]`) + " " + chalk.yellow(process.env.DOMAIN + " Başarıyla Çalıştırılıyor"))
    });

};