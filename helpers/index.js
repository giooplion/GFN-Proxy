module.exports = {
    sendAppMetaData: function(gameInfo) {
        if (!gameInfo) return;
        return JSON.stringify({
            "data": {
                "apps": {
                    "items": [
                        {
                            "appStore": gameInfo.appStore,
                            "contentRatings": gameInfo.contentRatings,
                            "developerName": gameInfo.developerName,
                            "displaysOwnRatingDuringGameplay": false,
                            "id": gameInfo.id,
                            "genres": gameInfo.genres,
                            "images": gameInfo.images,
                            "nvidiaTech": {
                                "ANSEL": false,
                                "FREESTYLE": false,
                                "HIGHLIGHTS": true
                            },
                            "title": gameInfo.title,
                            "longDescription": gameInfo.longDescription,
                            "maxLocalPlayers": gameInfo.maxLocalPlayers,
                            "maxOnlinePlayers": gameInfo.maxOnlinePlayers,
                            "supportedControls": gameInfo.supportedControls,
                            "publisherName": gameInfo.publisherName,
                            "computedValues": gameInfo.computedValues,
                            "itemMetadata": {
                                "campaignIds": []
                            },
                            "variants": [
                                {
                                    "streetDate": gameInfo.computedValues.earliestStreetDate,
                                    "appStore": gameInfo.appStore,
                                    "id": gameInfo.cmsId,
                                    "shortName": gameInfo.shortName,
                                    "supportedControls": gameInfo.supportedControls,
                                    "storeUrl": null,
                                    "publisherName": gameInfo.publisherName,
                                    "developerName": gameInfo.developerName,
                                    "gfn": {
                                        "releaseDate": "2017-10-12T20:00:00.000000+0000",
                                        "status": "AVAILABLE",
                                        "features": [
                                            {
                                                "__typename": "GfnSubscriptionFeatureValue",
                                                "key": "RTX_ENABLED",
                                                "value": "true"
                                            },
                                            {
                                                "__typename": "GfnSubscriptionFeatureValue",
                                                "key": "REFLEX_ENABLED",
                                                "value": "true"
                                            },
                                        ]
                                    }
                                }
                            ]
                        }
                    ]
                }
            }
        }, null, 2);
    },
    sendGameInfoInCurrentFormat: (gameObject) => {
        return {
            "__typename": "GameItem",
                "app": {
                  "id": gameObject.id,
                  "images": {
                    "TV_BANNER": gameObject.images["TV_BANNER"],
                    "HERO_IMAGE": gameObject.images["HERO_IMAGE"]
                  },
                  "title": gameObject.title,
                  "itemMetadata": {
                    "campaignIds": []
                  },
                  "supportedControls": [
                    "DUALSENSE_GAMEPAD",
                    "DUALSHOCK4_GAMEPAD",
                    "GAMEPAD",
                    "KEYBOARD",
                    "MOUSE",
                    "TOUCHSCREEN"
                  ],
                  "maxLocalPlayers": 1,
                  "variants": [
                    {
                      "id": gameObject.cmsId,
                      "appStore": gameObject.appStore,
                      "publisherName": gameObject.publisherName,
                      "shortName": "",
                      "supportedControls": [
                        "DUALSENSE_GAMEPAD",
                        "DUALSHOCK4_GAMEPAD",
                        "GAMEPAD",
                        "KEYBOARD",
                        "MOUSE",
                        "TOUCHSCREEN"
                      ],
                      "gfn": {
                        "isInLibrary": true,
                        "status": "AVAILABLE"
                      }
                    }
                ]
            }
        }
    }
};