const Discord = require('discord.js');
const zbab = require('../../models/guild')
exports.run = async (client, message, args, guildData) => {
    // if (!args[0]) return message.channel.send('Bir Prefix Giriniz')


    // let newCodeData = new guildData({
    //     guildId: message.guild.id,
    //     settings: {
    //         prefix: args[0]
    //     },
    // }).save();
    const data = await guildData.findOne({guildId: message.guild.id });

    let options = ["ayarla", "sıfırla"]

    if(!options.includes(args[0]) || !args[0]) return message.channel.send('Geçerli Argüman Giriniz')

    switch (args[0]) {
        case options[0]:
            if(!args[1]) return message.channel.send('Lütfen Ayarlamak İstediğin Geçerli Prefix Argümanını Giriniz')
            
            if(data) {
                await guildData.findOneAndUpdate({guildId: message.guild.id}, {$set: { 'settings.prefix': args[1]}});
            } else {
                await guildData.create({guildId: message.guild.id, 'settings.prefix': args[1]});
            }

            break;
        case options[1]:

            break;
        default:
            break;
    }

}
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 10,
    kategori: "Developer"
};

exports.help = {
    name: 'prefix',
    description: 'Eval',
    usage: 'codeviewer,'
};