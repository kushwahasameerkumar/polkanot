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
        if(err || res.isError) {
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
            callWebhookEndpointWithPayload(endpoint, {channelId, payload})
        })
    })
}

async function callWebhookEndpointWithPayload(endpoint, {channelId, payload}) {
    try{
        const providedUrl = new URL(endpoint);
        if(providedUrl.hostname == "discord.com" && providedUrl.pathname.includes("/api/webhooks/")){
            // discord webhook is being passed
            const updatedUrl = new URL("http://polkanotify.ninja/messenger/webhook/discord");
            updatedUrl.searchParams.append("discordWebhookUrl", providedUrl.toString())
            endpoint = updatedUrl.toString()
        }

        const res = await fetch(endpoint, {
            method: 'POST',
            body: JSON.stringify({channelId, payload}),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        res.ok
        ? console.log(`\[Status code: ${res.status}\]Successfully called webhook endpoint ${endpoint} with payload ${JSON.stringify({channelId, payload})}`)
        : console.log(`\[Status code: ${res.status}\]Failed calling webhook endpoint ${endpoint} with payload ${JSON.stringify({channelId, payload})}`)

    }catch (err){
        console.log("callWebhookEndpointWithPayload error:", err)
    }
}