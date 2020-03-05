"use strict";
let fs = require('fs');
let path = require("path");

let log = require('../util/logger');

const packagefile = require(path.resolve("package.json"));
const config = path.resolve("config.json");

let validJson = function(obj) {
    try {
        JSON.parse(obj);
    } catch(e){
        return false;
    }
    return true;

};

let getconfig = function() {
    if(!fs.existsSync(config)){
        log.error("Config does not exist! Make sure you copy config.template.json and paste it as 'config.json'. Then configure it.");
        process.exit(1);
    }
    let jsondata ="";
    try {
        jsondata = String(fs.readFileSync(config));
    }catch(e){
        log.error(`Cannot read config gile : ${e}`);
        process.exit(1);
    }
    if (validJson(jsondata)) return JSON.parse(jsondata);

    log.error("Config is not valid JSON. Stopping...");
    return process.exit(1);
};

let getVersion = function(){
    return packagefile.version;
};

let getName = function(){
    return packagefile.name;
};

let getAuthor = function(){
    return packagefile.author;
};

let getDescription = function(){
    return packagefile.description;
};

module.exports = {
    getConfig: getconfig,
    getVersion: getVersion,
    getName: getName,
    getAuthor: getAuthor,
    getDescription: getDescription
};