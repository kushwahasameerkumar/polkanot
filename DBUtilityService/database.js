const mongoose = require("mongoose");
const util = require('util');

const { _isValidSignature } = require('./utils')

const { Subscriber, Channel, Webhook, Notification } = require('./models')

// all db read/write should be performed in Database class
// TODO: can have function implementations in separate files
class Database {
    constructor(connectionURL) {
        mongoose.set('strictQuery', true);
        mongoose.connect(connectionURL);

        const db = mongoose.connection;
        db.on("error", console.error.bind(console, "connection error: "));
        db.once("open", () => {console.log("Database connected successfully")});
    }

    // GET: true if subscriber already in db
    async isSubscriber(address) {
        const sub = await Subscriber.findOne({ address })
        if(sub) {
            return true
        }
        return false
    }

    // GET: does channel exist with given channelId
    async isChannel(channelId) {
        const channel = await Channel.findOne({channelId})
        if(channel) {
            return true
        }
        return false
    }

    // POST: authenticate address and save to db if valid and not saved
    async authenticateAddress(address, signature, token) {
        const response = {
            isError: false,
            message: "Successful!"
        }

        try {
            // verify signature
            let isValid = _isValidSignature(address, signature, address)
            if(!isValid) {
                throw { message: "Incorrect signature found!" }
            }

            // if not found, save to db
            if(!(await this.isSubscriber(address))) {
                const sub = new Subscriber({address, token});
                await sub.save();
            }
        } catch(err) {
            response.isError = true
            response.message = err.message
        }

        return response
    }

    // POST: add new channel
    async addNewChannel(channelId, channelName) {
        const channel = new Channel({ channelName, channelId })
        await channel.save()
    }

    // GET: list of all channels
    async getAllChannels() {
        const channels = await Channel.find({}, {channelId: 1, channelName: 1, _id: 0})
        return {channels}
    }

    // GET: subscriber info
    async getSubscriberInfo(address) {
        const subscriber = await Subscriber
        .findOne({ address })
        .populate('subscribedChannels.webhooks')
        .exec()

        return subscriber
    }

    // POST: subscribe channel
    async subscribeChannel(address, channelId) {
        let response = {
            isError: false,
            message: "Successful!"
        }

        const exist = await this.isChannel(channelId)
        if(!exist) {
            response.isError = true
            response.message = "Unknown channel!"
            return response
        }  

        const prom = new Promise((resolve, reject) => {
            Subscriber.updateOne({ address, 'subscribedChannels.channelId': {$ne: channelId} }, {
                $push: {
                    subscribedChannels: {
                        channelId: channelId
                    }
                }
            }, (err, sub) => {
                if(err) {
                    response.isError = true
                    response.message = err.message
                    reject(response)
                }

                resolve(response)
            })
        })

        try {
            response = await prom
        } catch(err) {
            response = err
        }

        return response
    }

    // POST: add channel webhook for subscriber
    async addNewWebhook(address, channelId, endpoint) {
        let response = {
            isError: false,
            message: "Successful!"
        }

        const exist = await this.isChannel(channelId)
        if(!exist) {
            response.isError = true
            response.message = "Unknown channel!"
            return response
        }  

        // TODO: not save when duplicate endpoints for same subscriber and channel
        const webhook = new Webhook({
            endpoint,
            channelId,
            subscriberId: address,
        })
        
        const prom = new Promise((resolve, reject) => {
            webhook.save((err, webhook) => {
                if(err) {
                    response.isError = true
                    response.message = err.message
                    return response
                }

                Subscriber.updateOne({ 'subscribedChannels.channelId': channelId }, {
                    $push: {
                        'subscribedChannels.$.webhooks': webhook._id
                    }
                }, (err, sub) => {
                    if(err) {
                        response.isError = true
                        response.message = err.message
                        reject(response)
                    }

                    Channel.updateOne({ channelId }, {
                        $push: {
                            webhooks: endpoint
                        }
                    }, (err, chan) => {
                        if(err) {
                            response.isError = true
                            response.message = err.message
                            reject(response)
                        }
                    })

                    resolve(response)
                })
            })
        })
        
        try {
            response = await prom
        } catch(err) {
            response = err
        }

        return response
    }

    // POST: add new notification
    async addNewNotification(channelId, payload) {
        let response = {
            isError: false,
            message: "Successful!"
        }

        const exist = await this.isChannel(channelId)
        if(!exist) {
            response.isError = true
            response.message = "Unknown channel!"
            return response
        }  

        const notification = new Notification({ channelId, payload })
        await notification.save()
    }

    // GET: notfications from last_read_message to latest
    async getNewNotifications(channelId, address, token) {
        let response = {
            isError: false,
            message: 'Successful!',
            notifications: [],
        }
        const subscriberInfo = await this.getSubscriberInfo(address)

        // validate token
        if(token != subscriberInfo.token) {
            response.isError = true
            response.message = 'Invalid token found!'
            return response
        }

        // get last read for channel
        const prom = new Promise(async (resolve, reject) => {
            let lastReadNotificationId

            for(let i = 0; i < subscriberInfo.subscribedChannels.length; i++) {
                let chan = subscriberInfo.subscribedChannels[i]
                if(chan.channelId == channelId) {
                    lastReadNotificationId = chan.lastReadMessage ?? 0

                    const notifications = await Notification.find({ notificationId : {$gt: lastReadNotificationId}}, {
                        payload: 1, channelId: 1, notificationId: 1, _id: 0
                    })

                    if(notifications.length > 0) {
                        try {
                            const sub = await Subscriber.updateOne({ 'subscribedChannels.channelId': channelId }, {
                                'subscribedChannels.$.lastReadMessage': notifications[notifications.length-1].notificationId
                            })
    
                            response.notifications = notifications
                            resolve(response)
                        } catch(err) {
                            response.isError = true
                            response.message = err.message
                            reject(response)
                        }
                    }
                }
            }
            resolve(response)
        })

        try {
            response = await prom
        } catch(err) {
            response = err
        }

        return response
    }

    // GET: subscriber info
    async getWebhooksByChannelId(channelId) {
        const channel = await Channel
            .findOne({ channelId })
            .exec()
        return {webhookEndpoints: channel.webhooks};
    }
}

module.exports = Database
