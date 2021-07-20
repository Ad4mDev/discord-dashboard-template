const express = require('express')
const index = express.Router();
const config = require('config')

module.exports = function (passport, checkAuth, client, renderTemplate, GuildData, error) {
    index.route('/dashboard/:guildID').get(checkAuth, async (req, res) => {

        // We validate the request, check if guild exists, member is in guild and if member has minimum permissions, if not, we redirect it back.
        const guild = client.guilds.cache.get(req.params.guildID);
        if (!guild) return res.redirect("/dashboard");
        const member = guild.members.cache.get(req.user.id);
        if (!member) {
            try {
                await guild.members.fetch();
                member = guild.members.cache.get(req.user.id);
            } catch (err) { console.error(`Couldn't fetch the members of ${guild.id}: ${err}`); }
        }
        if (!member) return res.redirect("/dashboard");
        if (!member.permissions.has("MANAGE_GUILD")) return res.redirect("/dashboard");

        // We retrive the settings stored for this guild.
        var storedSettings = await GuildData.findOne({ guildId: guild.id });
        if (!storedSettings) {
            // If there are no settings stored for this guild, we create them and try to retrive them again.
            const newSettings = new GuildData({
                guildId: guild.id,
            });
            await newSettings.save().catch(() => { });
            storedSettings = await GuildData.findOne({ guildId: guild.id });
        }

        renderTemplate(res, req, "settings.ejs", { guild, settings: storedSettings, alert: null });

    })
    index.route('/dashboard/general/:guildID').get(checkAuth, async (req, res) => {
        // We validate the request, check if guild exists, member is in guild and if member has minimum permissions, if not, we redirect it back.
        const guild = client.guilds.cache.get(req.params.guildID);
        if (!guild) return res.redirect("/dashboard");
        const member = guild.members.cache.get(req.user.id);
        if (!member) {
            try {
                await guild.members.fetch();
                member = guild.members.cache.get(req.user.id);
            } catch (err) { console.error(`Couldn't fetch the members of ${guild.id}: ${err}`); }
        }
        if (!member) return res.redirect("/dashboard");
        if (!member.permissions.has("MANAGE_GUILD")) return res.redirect("/dashboard");
        var storedSettings = await GuildData.findOne({ guildId: guild.id });

        renderTemplate(res, req, "generalsettings.ejs", { guild, settings: storedSettings });

    }).post(checkAuth, async (req, res) => {
        // We validate the request, check if guild exists, member is in guild and if member has minimum permissions, if not, we redirect it back.
        const guild = client.guilds.cache.get(req.params.guildID);
        if (!guild) return res.redirect("/dashboard");
        const member = guild.members.cache.get(req.user.id);
        if (!member) return res.redirect("/dashboard");
        if (!member.permissions.has("MANAGE_GUILD")) return res.redirect("/dashboard");
        // We retrive the settings stored for this guild.
        var storedSettings = await GuildData.findOne({ guildId: guild.id });
        if (!storedSettings) {
            // If there are no settings stored for this guild, we create them and try to retrive them again.
            const newSettings = new GuildData({
                guildId: guild.id
            });
            await newSettings.save().catch(() => { });
            storedSettings = await GuildData.findOne({ guildId: guild.id });
        }

        // We set the prefix of the server settings to the one that was sent in request from the form.
        storedSettings.settings.prefix = req.body.prefix;
        storedSettings.settings.logchn = req.body.logchn
        // We save the settings.
        await storedSettings.save().catch(() => { });

        // We render the template with an alert text which confirms that settings have been saved.
        renderTemplate(res, req, "generalsettings.ejs", { guild, settings: storedSettings, alert: "Your settings have been saved." });
    })
    return index;

}