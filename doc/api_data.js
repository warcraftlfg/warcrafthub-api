define({ "api": [
  {
    "type": "get",
    "url": "/characters/:region/:realm/:name?fields=:fields",
    "title": "Request Character information",
    "sampleRequest": [
      {
        "url": "http://localhost:3002/api/v1/characters/:region/:realm/:name"
      }
    ],
    "version": "1.0.0",
    "name": "GetCharacter",
    "group": "Character",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "\"us\"",
              "\"eu\"",
              "\"kr\"",
              "\"tw\""
            ],
            "optional": false,
            "field": "region",
            "description": "<p>Character region id</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "realm",
            "description": "<p>Character realm name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Character name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "\"items\"",
              "\"averageItemLevel\"",
              "\"averageItemLevelEquipped\""
            ],
            "optional": true,
            "field": "fields",
            "description": "<p>Fields coma separated</p>"
          }
        ]
      }
    },
    "filename": "app/characters/character-controller.js",
    "groupTitle": "Character"
  }
] });