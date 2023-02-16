const grpc = require('@grpc/grpc-js');
const {createClient} = require("@redis/client");
const fetch = require('node-fetch');
const protos = require('./protos');

const db = new protos.db.Database(process.env.DB_UTILITY_SERVICE_URL, grpc.credentials.createInsecure())
const redisClient = createClient({
    url: `redis://${process.env.REDIS_URL}`
})

redisClient.on('error', err => console.log('Redis client error', err));
redisClient.on('ready', () => console.log('Redis client is ready'));
redisClient.connect();

redisClient.subscribe('CHANNEL:CREATED', newChannelListener);
redisClient.subscribe('NOTIFICATION:PUBLISHED', newNotificationListener);


function newChannelListener(msg){
    const {channelId, channelName} = JSON.parse(msg)
    db.AddNewChannel({channelId: channelId?.toString(), channelName}, (err, res) => {
        if(err || res.isError){
            console.error("Error: newChannelListener:", err, res);
            return;
        }
        console.log(`Added new channel with channelId=${channelId} and channelName=${channelName} in the DB`);
    })
}

function newNotificationListener(msg){
    const {channelId, payload} = JSON.parse(msg);
    db.AddNewNotification({channelId, payload}, (err, res) => {
        if(err || res.isError){
            console.error(err, res);
            return;
        }
        console.log(`Added new notification with channelId=${channelId} and payload=${JSON.stringify(payload)} in the DB`);
    })

    db.GetWebhooksByChannelId({channelId}, (err, res) => {
        if(err || res.isError){
            console.error(err, res);
            return;
        }

        const {webhookEndpoints} = res;

        console.log(webhookEndpoints)
        webhookEndpoints?.forEach(endpoint => {
            console.log(`Calling webhook endpoint ${endpoint} for channedId ${channelId}`);
            callWebhookEndpointWithPayload(endpoint, payload)
        })
    })
}

async function callWebhookEndpointWithPayload(endpoint, jsonPayload) {
    try{
        const res = await fetch(endpoint, {
            method: 'POST',
            body: JSON.stringify(jsonPayload),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        res.ok
        ? console.log(`\[Status code: ${res.status}\]Successfully called webhook endpoint ${endpoint} with payload ${JSON.stringify(jsonPayload)}`)
        : console.log(`\[Status code: ${res.status}\]Failed calling webhook endpoint ${endpoint} with payload ${JSON.stringify(jsonPayload)}`)

    }catch (err){
        console.log("callWebhookEndpointWithPayload error:", err)
    }
}