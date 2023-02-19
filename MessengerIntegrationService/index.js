import express from 'express';
import {discordPushHandler} from "./utils/discordPushHandler.js";

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.post('/webhook/discord', async (req, res) => {
    const defaultWebhookUrl = `https://discord.com/api/webhooks/1076154710731526297/lsRE1FpnPPNcnVLrk4Gyt3QN5mopSAvD41RaDasOMcdeCb7J7Cwtua6NNcX3hgTNLKLT`;

    const {channelId, payload} = req.body;
    const {discordWebhookUrl=defaultWebhookUrl} = req.query;
    console.log("Invoking", {discordWebhookUrl})
    try {
        await discordPushHandler({discordWebhookUrl, channelId, payload})
    }catch (err) {
        return res.status(400).json({success: false})
    }
    return res.status(200).json({success: true})
})

app.get('/', (req, res) => {
    res.json({msg: "Hello World!"})
})

app.listen(port, () => {
    console.log(`Server started at port ${port}`)
})