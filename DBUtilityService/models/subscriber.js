const mongoose = require("mongoose");

const SubscriberSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    subscribedChannels: [{
        channelId: {
            type: String,
            required: true
        },
        channelName: {
            type: String,
            required: true
        },
        webhooks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Webhook' }],
        lastReadMessage: {
            type: String,
            Default: 0
        },
    }],
});

const Subscriber = mongoose.model("Subscriber", SubscriberSchema);

module.exports = Subscriber;