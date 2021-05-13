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

// Burda Biter //
// client.on('ready', () => {
//   fs.readdirSync('./commands/').forEach(dir => {
//     const commandFiles = fs.readdirSync(`./commands/${dir}/`).filter(file => file.endsWith('.js'));
//     for (const file of commandFiles) {
//       let fileProp = require(`./commands/${dir}/${file}`);
//       if (fileProp.help.name) {
//         client.api.applications(client.user.id).guilds('833606561905508382').commands.post({
//           data: {
//             name: fileProp.help.name,
//             description: fileProp.help.description,
//             options: fileProp.help.options
//           }
//         })
//         client.ws.on('INTERACTION_CREATE', async interaction => {
//           const command = interaction.data.name.toLowerCase();
//           const args = interaction.data.options;
//           if (command === fileProp.help.name.toLowerCase())
//             fileProp.run(client, interaction, args)
//         })
//         console.log(fileProp.help.name, "✔️")
//       }
//     }
//   })
// })

// fs.readdirSync('./commands').forEach(dir => {
//   const commandFiles = fs.readdirSync(`./commands/${dir}/`).filter(file => file.endsWith('.js'));
//   for (const file of commandFiles) {
//     const komutcuklar = require(`./commands/${dir}/${file}`);
//     if (komutcuklar.help.name) {
//       client.commands.set(komutcuklar.help.name, komutcuklar);
//       console.log(komutcuklar.help.name, "✔️")
//     } else {
//       console.log(komutcuklar.help.name, "✔️")
//       continue;
//     }
//     komutcuklar.conf.aliases.forEach(alias => {
//       client.aliases.set(alias, komutcuklar.help.name);
//     });
//   }
// })

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