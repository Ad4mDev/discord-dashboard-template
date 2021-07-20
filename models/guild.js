const mongoose = require('mongoose');

let GuildSchema = new mongoose.Schema({
    guildId: {type: String, required: true},
    settings: {
        prefix: {
            type: String,
        },
    },
    date: {type: Date, default: Date.now}
});

const guild = mongoose.model('guild', GuildSchema);

module.exports = guild;