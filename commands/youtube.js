"use strict";

exports.run = (client, message, args, callback) => {
   // message.react("✉");
    message.channel.send(
       "Youtube Link: " +
       "https://youtube.com/c/TheTutorialChef"
    );

    return callback();
};

exports.description = "Listet informationen über diesen Bot";