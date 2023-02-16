const grpc = require("@grpc/grpc-js")
const protoLoader = require("@grpc/proto-loader")
const path = require('path')

const protos = require('./config.json')

let protoObjects = {} 

Object.keys(protos).forEach((id) => {
    let packageDefination = protoLoader.loadSync(path.join(__dirname, protos[id]), {})
    let grpcObject = grpc.loadPackageDefinition(packageDefination)
    protoObjects[id] = grpcObject[id]
})

module.exports = protoObjects
