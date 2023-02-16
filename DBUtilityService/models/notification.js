const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const NotificationSchema = new mongoose.Schema({
    payload: {
        type: String,
        required: true,
    },
    channelId: {
        type: String,
        required: true,
    },
    notificationId: {
        type: Number,
        unique: true
    }
});

NotificationSchema.plugin(AutoIncrement, { inc_field: 'notificationId' });

const Notification = mongoose.model("Notification", NotificationSchema);

module.exports = Notification;