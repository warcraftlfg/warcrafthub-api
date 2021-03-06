//Load dependencies
var HttpStatus = require('http-status-codes');
var async = require("async");
var applicationStorage = require("core/application-storage");


/**
 * @api {get} /characters/:region/:realm/:name?fields=:fields Request a character information
 * @apiVersion 1.0.0
 * @apiName GetCharacter
 * @apiGroup Character
 *
 * @apiParam {String="us","eu","kr","tw"} region Character region id
 * @apiParam {String} realm Character realm name
 * @apiParam {String} name Character name
 * @apiParam {String="items","progression"} [fields] Fields coma separated
 *
 * @apiSampleRequest /characters/:region/:realm/:name
 */

module.exports.getCharacter = function (req, res, next) {

    var logger = applicationStorage.logger;

    var region = req.params.region.toLowerCase();
    var realm = req.params.realm;
    var name = req.params.name;

    var fields = [];
    if (req.query.fields) {
        fields = req.query.fields.split(',');
    }

    async.waterfall([
        function (callback) {
            applicationStorage.mongo.collection("characters").findOne({
                region: region,
                realm: realm,
                name: name
            }, {_id: 0}, {sort: [["_id", "desc"]]}, function (error, character) {
                if (character)
                    callback(error, character)
                else
                    callback(true)
            });
        },
        function (character, callback) {
            async.parallel([
                function (callback) {
                    if (fields.indexOf("items") != -1) {
                        applicationStorage.mongo.collection("character_items").findOne({
                            region: region,
                            realm: realm,
                            name: name
                        }, {_id: 0}, function (error, result) {
                            if (result && result.items) {
                                character.items = result.items;
                            }
                            if (result && result.averageItemLevelEquipped){
                                character.averageItemLevelEquipped = result.averageItemLevelEquipped;
                            }
                            if (result && result.averageItemLevel){
                                character.averageItemLevel = result.averageItemLevel;
                            }
                            callback(error);
                        })
                    } else {
                        callback()
                    }
                },
                function (callback) {
                    if (fields.indexOf("progression") != -1) {
                        applicationStorage.mongo.collection("character_progressions").findOne({
                            region: region,
                            realm: realm,
                            name: name
                        }, {_id: 0}, function (error, result) {
                            if (result && result.progression) {
                                character.progression = result.progression;
                            }
                            callback(error);
                        })
                    } else {
                        callback()
                    }
                },
            ], function (error) {
                callback(error, character);
            });
        }
    ], function (error, character) {
        if (error && error != true) {
            logger.error(error);
            res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR).json({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR
                    )
                }
            );
        } else if (character) {
            res.json(character);
        } else {
            next();
        }
    });


};