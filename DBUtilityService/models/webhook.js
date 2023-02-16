const mongoose = require("mongoose");

const WebhookSchema = new mongoose.Schema({
    endpoint: {
        type: String,
        required: true,
    },
    subscriberId: {
        type: String,
        required: true,
    },
    channelId: {
        type: String,
        required: true,
    }
});

const Webhook = mongoose.model("Webhook", WebhookSchema);

module.exports = Webhook;