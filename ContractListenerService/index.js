import listener from "./listener.js";
import redisClient from "./redisClient.js";

listener().catch((error) => {
    console.error(error);
    process.exit(-1);
});

setInterval(() => {
    redisClient.publishNewNotificationEvent({
        channelId: 1,
        eventId: 12,
        payload: JSON.stringify({name: "Sample Payload"}),
        author: "test",
    })

    redisClient.publishCreateChannelEvent({
        channelId: 312,
        channelName: "test_channel",
    })
}, 1000)