const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("config");
const fs  = require('fs')
require("dotenv").config()

require("./util/eventHandler")(client);

const { promisify } = require("util");
const { send } = require("process");
client.config = config;
client.logger = console;
client.wait = promisify(setTimeout);
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();


fs.readdirSync('./commands').forEach(dir => {
  const commandFiles = fs.readdirSync(`./commands/${dir}/`).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const commands = require(`./commands/${dir}/${file}`);
    if (commands.help.name) {
      client.commands.set(commands.help.name, commands);
      console.log(commands.help.name, "✔️")
    } else {
      console.log(commands.help.name, "✔️")
      continue;
    }
    commands.conf.aliases.forEach(alias => {
      client.aliases.set(alias, commands.help.name);
    });
  }
})

String.prototype.toProperCase = function () {
  return this.replace(/([^\W_]+[^\s-]*) */g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

Array.prototype.random = function () {
  return this[Math.floor(Math.random() * this.length)];
};

process.on("uncaughtException", err => {
  const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
  console.error("Uncaught Exception: ", errorMsg);
  process.exit(1);
});

process.on("unhandledRejection", err => {
  console.error("Uncaught Promise Error: ", err);
});

client.login(config.client.token);