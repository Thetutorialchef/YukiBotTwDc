"use strict";

exports.run = (client, message, args, callback) => {
    // message.react("✉");
    message.author.send(
        "Info Command"
    );

    return callback();
};

exports.description = "Listet informationen über diesen Bot";
