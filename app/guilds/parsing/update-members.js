var async = require("async");
var updateModel = require("updates/update-model");
var applicationStorage = require("core/application-storage");

module.exports.parse = function (bnetGuild, callback) {
    var logger = applicationStorage.logger;
    var config = applicationStorage.config;
    async.each(bnetGuild.members, function (member, callback) {
        if (member.character && member.character.realm && member.character.name && member.character.level >= config.maxLevel){
            updateModel.insert("c", bnetGuild.region, member.character.realm, member.character.name, 10, function (error) {
                logger.verbose("Insert character %s/%s/%s to update ", bnetGuild.region, member.character.realm, member.character.name);
                callback(error);
            })
        } else {
            logger.warn("Members error in bnet json")
            callback();
        }
    }, function (error) {
        callback(error);
    });
};