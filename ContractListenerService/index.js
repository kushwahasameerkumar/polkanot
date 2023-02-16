import listener from "./listener.js";
import redisClient from "./redisClient.js";

listener().catch((error) => {
    console.error(error);
    process.exit(-1);
});

setInterval(() => {
    redisClient.publishNewNotificationEvent({
        channelId: 2,
        eventId: 12,
        payload: JSON.stringify({channelId: "Sampleid"}),
        author: "test",
    })

    redisClient.publishCreateChannelEvent({
        channelId: 2,
        channelName: "test_channel",
    })
}, 2000)