"use strict";
let Discord = require("discord.js");

let conf = require("./handler/configHandler");
let log = require("./util/logger");





let messageHandler = require("./handler/msgHandler");
//let reactionHandler = require("./handler/reactionHandler");



let version = conf.getVersion();
let appname = conf.getName();
let devname = conf.getAuthor();

let splashPadding = 12 + appname.length + version.toString().length;



console.log(
    "\n" +
    ` #${"-".repeat(splashPadding)}#\n` +
    ` # Started ${appname} v${version} #\n` +
    ` #${"-".repeat(splashPadding)}#\n\n` +
    ` Copyright (c) ${(new Date()).getFullYear()} ${devname}\n`
);

log.done("Started.");

const config = conf.getConfig();
const client = new Discord.Client();

//Twitch Connection

let TwitchWebHookListener = require('twitch-webhooks').default;
let TwitchClient = require('twitch').default;
let twitchClient = TwitchClient.withCredentials(config.twitch.twitch_client_id, config.twitch.twitch_client_secret);

let streamer = "The_Tutorial_Chef"

async function isStreamLive(userName) {
	const user = await twitchClient.helix.users.getUserByName(userName);
	if (!user) {
		return false;
	}
	return await twitchClient.helix.streams.getStreamByUserId(user.id) !== null;
}

//let live = isStreamLive("The_Tutorial_Chef");




process.on("unhandledRejection", (err, promise) => log.error(`Unhandled rejection (promise: ${promise}, reason: ${err})`));

client.on("ready", () => {
    log.info("Running...");
    log.info(`Got ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds`);
    client.user.setActivity(config.bot_settings.status);


    if(isStreamLive("The_Tutorial_Chef")){



    }

});

client.on("guildCreate", guild => log.info(`New guild joined: ${guild.name} (id: ${guild.id}) with ${guild.memberCount} members`));

client.on("guildDelete", guild => log.info(`Deleted from guild: ${guild.name} (id: ${guild.id}).`));

client.on("message", (message) => messageHandler(message, client));

client.on("error", log.error);

//client.on("raw", async event => reactionHandler(event, client));

client.login(config.auth.bot_token).then(() => {
    log.done("Token login was successful!");
}, (err) => {
    log.error(`Token login was not successful: "${err}"`);
    log.error("Shutting down due to incorrect token...\n\n");
    process.exit(1);
});



