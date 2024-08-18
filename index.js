const express = require("express");
const request = require("request-promise");
const fs = require("fs");

const helpers = require("./helpers");

const leakedDb = JSON.parse(fs.readFileSync("db.json"));
const proxy = express();

console.clear();
console.log("GFN Proxy (for method) created by @Mast3rGamers on GitHub\n");

proxy.disable("x-powered-by");

proxy.options("*", (req, res)=>{
    console.log(req.originalUrl);
    console.log("REQUESTED OPTIONS");
    return request.post("https://games.geforce.com/graphql", {resolveWithFullResponse: true})
    .catch((err)=>{
        res.set({
            "Access-Control-Allow-Headers": "authorization,content-type,nv-browser-type,nv-client-id,nv-client-streamer,nv-client-type,nv-client-version,nv-device-os,nv-device-type,ot-tracer-sampled,ot-tracer-spanid,ot-tracer-traceid,traceparent,x-request-id,x-sw-cachebypass",
            "Access-Control-Allow-Methods": "DELETE, GET, HEAD, OPTIONS, PATCH, POST, PUT",
            "Allow": "HEAD, OPTIONS, GET, POST",
            "content-type": "application/json",
            "date": err.response.headers.date,
            "etag": err.response.headers.etag,
            "access-control-allow-origin": "*",
            "server": err.response.headers.server,
            "ot-tracer-traceid": err.response.headers["ot-tracer-traceid"],
            "via": err.response.headers.via,
            "x-amz-cf-pop": err.response.headers["x-amz-cf-pop"],
            "x-amz-cf-id": err.response.headers["x-amz-cf-id"]
        })
        .end();
    });
});

proxy.get("/graphqlProxy", (req, res)=>{
    const operation = req.query.requestType;
    console.log({operation});
    console.log("HEADERS");
    console.log(req.headers);
    console.log("QUERY");
    console.log(req.query);

    switch (true) {
        case operation == "appMetaData":
            var appId = "";
            var isAppId = false;
            try {
                appId = req.query.variables.split('"appIds":["')[1].split('"')[0];
                isAppId = true;
            } catch {
                appId = parseInt(req.query.variables.split('"cmsIds":[')[1].split("]")[0]);
            }
            console.log({appId});
            var gameInfo;
            gameInfo = isAppId ? leakedDb.find(game => game.id == appId) : leakedDb.find(game => game.cmsId == appId);
            if (!gameInfo) return;
            console.log(`===GAME NAME: ${gameInfo.title}===`);
            const data = helpers.sendAppMetaData(gameInfo);
            console.log(data);
            res.set({
                "content-type": "application/json",
                "access-control-allow-origin": "*"
            }).send(data).end();
            break;
        case operation.toLocaleLowerCase().includes("library"):
            const libraryItems = JSON.parse('{"data": {"panels": [{"id": "cb0a59495dfabbf78b33afa5ea3aa341","name": "LIBRARY","sections": [{"id": "section-ml-1234","telemetryName": "My_Library","type": "MY_LIBRARY","title": "hahahahahh","seeMoreInfo": {"filterTileId": "filter-my-library-seemore","title": "VER TODOS","filterIds": ["my_library"],"minTiles": 5},"items": []}]}]}}', "utf-8");
            leakedDb.map((game) => libraryItems.data.panels[0].sections[0].items.push(helpers.sendGameInfoInCurrentFormat(game)));
            res.set({
                "Access-Control-Allow-Headers": "authorization,content-type,nv-browser-type,nv-client-id,nv-client-streamer,nv-client-type,nv-client-version,nv-device-os,nv-device-type,ot-tracer-sampled,ot-tracer-spanid,ot-tracer-traceid,traceparent,x-request-id",
                "Access-Control-Allow-Methods": "DELETE, GET, HEAD, OPTIONS, PATCH, POST, PUT",
                "Access-Control-Allow-Origin": "*",
                "Allow": "HEAD, OPTIONS, GET, POST",
                "Content-Type": "text/plain; charset=utf-8",
                "Ot-Tracer-Traceid": "4553227558129399077",
                "X-Amz-Cf-Id": "7s_DFQ6u-KNJEzqOWyW_sUkdHHj4bi65Au156GDsryQtiZNxNHQLTg=="
            }).send(libraryItems).status(200).end();
            break;
        default:
            request({
                url: `https://games.geforce.com/graphql?requestType=${req.query.requestType}&extensions=${encodeURIComponent(req.query.extensions)}&huId=${req.query.huId}&variables=${encodeURIComponent(req.query.variables)}`,
                method: "GET",
                headers: {
                    "Authorization": req.headers.authorization,
                    "Content-Type": "application/graphql",
                    "nv-client-id": req.headers["nv-client-id"],
                    "nv-client-streamer": req.headers["nv-client-streamer"],
                    "nv-client-type": req.headers["nv-client-type"],
                    "nv-client-version": req.headers["nv-client-version"],
                    "nv-device-os": req.headers["nv-device-os"],
                    "nv-device-type": req.headers["nv-device-type"],
                    "Origin": req.headers.origin,
                    "User-Agent": req.headers["user-agent"],
                    "x-request-id": req.headers["x-request-id"]
                },
                resolveWithFullResponse: true
            })
            .then((response)=>{
                res.set({
                    "content-type": "application/json",
                    "content-length": response.headers["content-length"],
                    "date": response.headers.date,
                    "etag": response.headers.etag,
                    "access-control-allow-origin": "*",
                    "server": response.headers.server,
                    "ot-tracer-traceid": response.headers["ot-tracer-traceid"],
                    "x-cache": response.headers["x-cache"],
                    "via": response.headers.via,
                    "x-amz-cf-pop": response.headers["x-amz-cf-pop"],
                    "x-amz-cf-id": response.headers["x-amz-cf-id"]
                }).send(response.body).status(200).end();
            })
            .catch((err)=>{
                console.error(err);
                console.log("FUCKING FAILED");
            });
            break;
    }
});

proxy.listen(8080, ()=>{
    console.log("[LOG] GFN PROXY STARTED LISTENING ON PORT 8080!");
});