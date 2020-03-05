"use strict";
let fs = require("fs");
let path = require("path");
let log = require("../util/logger");
let config = require("./configHandler").getConfig();

let commandHandler = function(message, client, isModCommand, callback){
    let cmdPrefix = isModCommand ? config.bot_settings.prefix.mod_prefix : config.bot_settings.prefix.command_prefix;
    let args = message.content.slice(cmdPrefix.length).trim().split(/ +/g);
    let command = args.shift().toLowerCase();

    let commandArr = [];
    let commandDir = isModCommand ? path.resolve("./commands/modcommands") : path.resolve("./commands");

    fs.readdirSync(commandDir).forEach(file => {
        let cmdPath = path.resolve(commandDir, file);
        let stats = fs.statSync(cmdPath);
        if (!stats.isDirectory()) commandArr.push(file.toLowerCase());
    });

    if (!commandArr.includes(command.toLowerCase() + ".js")){
        log.warn(
            `User "${message.author.tag}" (${message.author}) performed an unknown command: ${cmdPrefix}${command}`
        );
        return callback();
    }

    if (isModCommand && !message.member.roles.some(r => config.bot_settings.moderator_roles.includes(r.name))){
        log.warn(`User "${message.author.tag}" (${message.author}) tried mod command "${cmdPrefix}${command}" and was denied`);

        return callback(
            `Tut mir leid, ${message.author}. Du hast nicht genügend Rechte um dieses Command zu verwenden =(`
        );
    }

    log.info(
        `User "${message.author.tag}" (${message.author}) performed ${(isModCommand ? "mod-" : "")}command: ${cmdPrefix}${command}`
    );

    let cmdHandle = require(path.join(commandDir, command));

    try {
        cmdHandle.run(client, message, args, function(err){
            // Non-Exception Error returned by the command (e.g.: Missing Argument)
            if (err) callback(err);
        });
    }

    // Exception returned by the command handler
    catch (err){
        callback(
            "Sorry, irgendwas ist schief gegangen! =("
        );
        log.error(err);
    }

    return callback();
};

module.exports = commandHandler;