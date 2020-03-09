"use strict";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

// Dependencies
let request = require("request");
let cron = require("node-cron");

// Utils
let log = require("../utils/logger");
let config = require("../utils/configParser").getConfig();

class TwitchWatcher {
    /**
     * Creates an instance of TwitchWatcher.
     * @param {*} client
     * @memberof TwitchWatcher
     */
    constructor(client){
        this.client = client;
    }

    /**
     * Fetch data from the twitch API
     *
     * @returns {Promise}
     * @memberof TwitchWatcher
     */
    checkStream(){
        const options = {
            uri: "https://api.twitch.tv/helix/streams?user_login=" + config.twitch.twitch_username,
            method: "GET",
            headers: {
                "Client-ID": config.twitch.twitch_api_client_id
            }
        };

        return new Promise((resolve, reject) => {
            request(options, function(err, res, body){
                if (err) reject(err);
                resolve(JSON.parse(body));
            });
        });
    }

    /**
     * Check if there are streams and send a notification
     *
     * @param {object} body
     * @returns
     * @memberof TwitchWatcher
     */
    checkData(body){
        if (!(body.data).length) return;

        // Hier die logik wenn ein stream gefunden wurde!
        // body.data[0] beinhaltet alle daten zum stream.
        //
        // Beispiel:
        // {"id":"37109857008","user_id":"23161357","user_name":"LIRIK","game_id":"27127","type":"live","title":"First Playthrough","viewer_count":23474,"started_at":"2020-03-09T16:08:53Z","language":"en","thumbnail_url":"https://static-cdn.jtvnw.net/previews-ttv/live_user_lirik-{width}x{height}.jpg","tag_ids":["6ea6bca4-4712-4ab9-a906-e3336a9d8039"]}

        log.info("New stream is online!");
        this.client.channels.get(config.twitch.announcement_channel_id).send("ER STREAMT!!!1");
    }

    /**
     * Launch a cron to fire a function every 5 minutes
     *
     * @param {Function} callback
     * @returns {Function} callback
     * @memberof TwitchWatcher
     */
    startWatcher(callback){
        // eslint-disable-next-line space-before-function-paren
        cron.schedule("* * * * *", async () => {
            log.info("Watcher is requesting data...");

            this.checkStream()
                .then((data) => this.checkData(data))
                .catch(err => log.error("Watcher Error: " + err));
        }, { scheduled: true });
        return callback();
    }
}

module.exports = TwitchWatcher;
