const grpc = require("@grpc/grpc-js")

const protos = require('./protos/')
const Database = require('./database')

const server = new grpc.Server();

// TODO: move this port number to config file
server.bindAsync("0.0.0.0:8000", grpc.ServerCredentials.createInsecure(), async (err, port) => {
    console.log('Server started at port', port)
    server.start();
});

// TODO: move connection url to config/env file
const db = new Database('mongodb+srv://sameer:123765@cluster0.awu41h1.mongodb.net/polkanot?retryWrites=true&w=majority')

server.addService(protos.db.Database.service, {
    IsSubscriber,
    AuthenticateAddress,
    AddNewChannel,
    GetAllChannels,
    GetSubscriberInfo,
    SubscribeChannel,
    AddNewWebhook,
    AddNewNotification,
    GetNotifications,
})

async function IsSubscriber(call, callback) {
    // get request arguments
    let { address } = call.request

    // process request
    let  isFound = await db.isSubscriber(address)

    // return response
    callback(null, {
        isFound
    })
}

async function AuthenticateAddress(call, callback) {
    let { address, signature, token } = call.request
    let  response = await db.authenticateAddress(address, signature, token)
    callback(null, response)
}

async function AddNewChannel(call, callback) {
    let { channelId, channelName } = call.request
    let  response = await db.addNewChannel(channelId, channelName)
    callback(null, response)
}

async function GetAllChannels(call, callback) {
    let  response = await db.getAllChannels()
    callback(null, response)
}

async function GetSubscriberInfo(call, callback) {
    let { address } = call.request
    let  response = await db.getSubscriberInfo(address)
    callback(null, response)
}

async function SubscribeChannel(call, callback) {
    let { address, channelId } = call.request
    let  response = await db.subscribeChannel(address, channelId)
    callback(null, response)
}

async function AddNewWebhook(call, callback) {
    let { address, channelId, endpoint } = call.request
    let  response = await db.addNewWebhook(address, channelId, endpoint)
    callback(null, response)
}

async function AddNewNotification(call, callback) {
    let { channelId, payload } = call.request
    let  response = await db.addNewNotification(channelId, payload)
    callback(null, response)
}

async function GetNotifications(call, callback) {
    let { address, channelId, token } = call.request
    let  response = await db.getNewNotifications(channelId, address, token)
    callback(null, response)
}
