const Discord = require('discord.js');
const config = require('config')
const guildData = require('../../models/guild')

module.exports = async message => {

	let client = message.client;

	const data = await guildData.findOne({ guildId: message.guild.id });

	let prefix;

	if(data.settings.prefix) prefix = data.settings.prefix
	else config.get('client.prefix')

	let args = message.content.split(' ').slice(1);

	if (message.author.bot) return;
	if (!message.content.startsWith(prefix)) return;
	let command = message.content.split(' ')[0].slice(prefix.length);



	let cmd;
	if (client.commands.has(command)) {
		cmd = client.commands.get(command);
	} else if (client.aliases.has(command)) {
		cmd = client.commands.get(client.aliases.get(command));
	}
	if (cmd) {


		// if (cmd.conf.enabled === false) {
		// 	if (!owners) {
		// 		const embed = new Discord.MessageEmbed()
		// 			.setDescription(`Bu komut şuanda sunucularda kullanıma kapalıdır! (Yapım aşamasındadır)`)
		// 			.setColor("RANDOM")
		// 		message.channel.send({ embed })
		// 		return
		// 	}
		// }


		if (cmd.conf.permLevel === 10) {
			if (message.author.id !== "312962543591096322") {
				const embed = new Discord.MessageEmbed()
					.setDescription(process.env.basarisiz + " **|** Bu Komutu Kullanabilmek İçin `Mesajları Yönet` İznine Sahip Olmalısın!")
					.setColor("RANDOM")
				await message.channel.send({embed})
				return

			}
		}


		cmd.run(client, message, args, guildData);

	}
};
