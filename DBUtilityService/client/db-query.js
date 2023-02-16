const grpc = require("@grpc/grpc-js");

const protos = require('../protos/')

// TODO: move db service endpoint to config file
const dbClient = new protos.db.Database(`localhost:8000`, grpc.credentials.createInsecure())

dbClient.IsSubscriber({
    address: "5GTF3vctE3SLWbReirK9q6vt5g45632k8eVPQDnkZVonrr1H"
}, (err, res) => {
    console.log("Response from server:", res)
})

// dbClient.AuthenticateAddress({
//     address: "5GTF3vctE3SLWbReirK9q6vt5g45632k8eVPQDnkZVonrr1H",
//     signature: "0x6a8f26ece30ce792f6c3bd124905ec97db96b2fdb461ae7dca86831342e58b4f48616229b259a42ba410fab68288cc2fe04f2e03175d57a72ceb36742be69782",
//     token: "random"
// }, (err, res) => {
//     console.log("Response from server:", res)
// })

// dbClient.AddNewChannel({
//     channelId: 2,
//     channelName: "Hola Channel"
// }, (err, res) => {
//     console.log("Response from server:", res)
// })

// dbClient.GetAllChannels({}, (err, res) => {
//     console.log("Response from server:", res)
// })

// dbClient.GetSubscriberInfo({
//     address: '5GTF3vctE3SLWbReirK9q6vt5g45632k8eVPQDnkZVonrr1H',
// }, (err, res) => {
//     console.log("Response from server:", res)
// })

// dbClient.SubscribeChannel({
//     address: '5GTF3vctE3SLWbReirK9q6vt5g45632k8eVPQDnkZVonrr1H',
//     channelId: '1',
// }, (err, res) => {
//     console.log("Response from server:", res)
// })

// dbClient.AddNewWebhook({
//     address: '5GTF3vctE3SLWbReirK9q6vt5g45632k8eVPQDnkZVonrr1H',
//     channelId: 1,
//     endpoint: "http://www.test.com"
// }, (err, res) => {
//     console.log("Response from server:", res)
// })

// dbClient.AddNewChannel({
//     channelId: 2,
//     channelName: "Hola Channel"
// }, (err, res) => {
//     console.log("Response from server:", res)
// })

// dbClient.AddNewNotification({
//     channelId: 2,
//     payload: "Hola Notification"
// }, (err, res) => {
//     console.log("Response from server:", res)
// })

// dbClient.GetNotifications({
//     address: '5GTF3vctE3SLWbReirK9q6vt5g45632k8eVPQDnkZVonrr1H',
//     channelId: 2,
//     token: 'random123',
// }, (err, res) => {
//     console.log("Response from server:", res)
// })