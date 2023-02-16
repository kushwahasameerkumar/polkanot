const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const PROTO_PATH = './DBUtilityService.proto';

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

let dbUtilityServicePackage = grpc.loadPackageDefinition(packageDefinition).dbUtilityServicePackage;

const client = new dbUtilityServicePackage.DBUtilityService('')

