import express from 'express';
import {discordPushHandler} from "./utils/discordPushHandler.js";

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.post('/webhook/discord', async (req, res) => {
    const {channelId, payload} = req.body;
    try {
        await discordPushHandler({channelId, payload})
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