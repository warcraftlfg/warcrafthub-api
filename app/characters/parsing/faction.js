var characterFactionsModel = require("characters/character-factions-model");
var applicationStorage = require("core/application-storage");
var async = require("async");

module.exports.parse = function (bnetCharacter, callback) {

    var logger = applicationStorage.logger;

    if (bnetCharacter.faction !== null) {
        async.series([
            function (callback) {
                characterFactionsModel.findOne(bnetCharacter.region, bnetCharacter.realm, bnetCharacter.name, function (error, character) {
                    if (character && character.faction === bnetCharacter.faction) {
                        logger.silly("Character faction already exist, do nothing");
                        callback(true);
                    } else {
                        callback();
                    }
                });
            },
            function (callback) {
                characterFactionsModel.insertOne(bnetCharacter.region, bnetCharacter.realm, bnetCharacter.name, bnetCharacter.faction, function (error) {
                    logger.info("Insert faction %s for %s/%s/%s",bnetCharacter.faction,bnetCharacter.region,bnetCharacter.realm,bnetCharacter.name);
                    callback(error);
                })
            }
        ], function (error) {
            if (error === true) {
                callback()
            } else {
                callback(error)
            }
        });
    }
    else {
        logger.warning("Faction error in bnet json")
        callback();
    }
};