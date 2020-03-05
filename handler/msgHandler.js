"use strict";

let config = require('./configHandler').getConfig();
let cmdHandler = require('./cmdHandler');
   

module.exports = function(message, client){
    let nonBiased = message.content
        .replace(config.bot_settings.prefix.command_prefix, "")
        .replace(config.bot_settings.prefix.mod_prefix, "")
        .replace(/\s/g, "");

    if (message.author.bot || nonBiased === "" || message.channel.type === "dm") return;

    if (message.content.indexOf(config.bot_settings.prefix.command_prefix) === 0){
        cmdHandler(message, client, false, (err) => {
            if (err) message.channel.send(err);
        });
    }

    else if (message.content.indexOf(config.bot_settings.prefix.mod_prefix) === 0){
        cmdHandler(message, client, true, (err) => {
            if (err) message.channel.send(err);
        });
    }
};