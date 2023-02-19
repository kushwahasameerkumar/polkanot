import axios from 'axios';

const colors = [
    1752220, 1146986, 5763719, 2067276, 3447003, 2123412,
    10181046, 7419530, 15277667, 11342935, 15844367, 12745742,
    15105570, 11027200, 15548997, 10038562, 9807270, 9936031,
    8359053, 12370112, 3426654, 2899536, 16776960
];

const randomColor = () => {
    function getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    }
    return colors[getRndInteger(1000, 10000) % colors.length];
}

const discordPushHandler = async ({discordWebhookUrl, channelId, payload}) => {
    try{
        const res = await axios.post(discordWebhookUrl, {
            username: 'PolkanotBot',
            embeds: [
                {
                    title: `[ChannelID] ${channelId}`,
                    description: `${payload}`,
                    color: randomColor()
                }
            ]
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })

        console.log(`discordPushHandler response:`, res.status, res.data)

    }catch(err) {
        console.error(`discordPushHandler error:`, err.response.status, err.response.data)
        throw new Error(`discordPushHandler error`)
    }
}

export {discordPushHandler}