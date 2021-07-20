const config = require('config')
const chalk = require('chalk')
const fs = require('fs')
const mongoose = require('mongoose')
module.exports = async client => {

    client.user.setStatus("online");
    console.log(`Discord API'ye Bağlanıldı: ` + client.user.username)
    await mongoose.connect(config.get('mongodb.mongoURI'), { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(() => console.log(chalk.blue(`[${client.user.username}]`) + " " + chalk.yellow('MongoDB Connected')))
    .catch(err => console.log(err));
    var oyun = [
        ``,
    ];

    setInterval(function () {

        var random = Math.floor(Math.random() * (oyun.length - 0 + 1) + 0);

        client.user.setActivity(oyun[random], {
            type: "STREAMING",
            url: "https://twitch.tv/taktikbeytv"
        })
    }, 2 * 2500);


    client.appInfo = await client.fetchApplication();
    setInterval(async () => {
        client.appInfo = await client.fetchApplication();
    }, 60000);
    require("../../util/dashboard.js")(client);
    client.config = config;


}