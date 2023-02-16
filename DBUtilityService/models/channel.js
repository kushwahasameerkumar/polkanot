const mongoose = require("mongoose");

const ChannelSchema = new mongoose.Schema({
    channelId: {
        type: String,
        required: true,
    },
    channelName: {
        type: String,
        required: true,
    },
    webhooks: [String],
    subscribers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subscriber' }]
});

const Channel = mongoose.model("Channel", ChannelSchema);

module.exports = Channel;