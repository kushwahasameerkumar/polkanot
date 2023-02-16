import {createClient} from "@redis/client";

function RedisClient (redis_endpoint) {
    const client = createClient({
        url: `redis://${redis_endpoint}`
    })

    client.on('error', err => console.log('Redis client error', err));
    client.on('ready', () => console.log('Redis client is ready'));

    this.client = client;
};

RedisClient.prototype.connect = async function () {
    await this.client.connect();
}

RedisClient.prototype.publishCreateChannelEvent = function ({channelId, channelName}) {
    this.client.publish(
    'CHANNEL:CREATED',
        JSON.stringify({
            channelId,
            channelName,
        })
    );
}

RedisClient.prototype.publishNewNotificationEvent = function ({channelId, eventId, payload, author}) {
    this.client.publish(
        'NOTIFICATION:PUBLISHED',
        JSON.stringify({
            channelId,
            eventId,
            payload,
            author,
        })
    );
}

export default RedisClient;