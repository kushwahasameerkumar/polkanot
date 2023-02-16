// Import the API
import { ApiPromise, WsProvider } from '@polkadot/api';
import { Abi } from '@polkadot/api-contract';

import redisClient from "./redisClient.js";
import ABI from './metadata.json' assert { type: "json" };
const MAIN_CONTRACT = '5CToanamVescAGHRrWy8GAcrz1kM59ybc1bQDncdV68dFe3b'

async function listener() {
    const abi = new Abi(ABI)
    const wsProvider = new WsProvider('wss://ws.test.azero.dev');

    const api = await ApiPromise.create({ provider: wsProvider });

    // listen for events
    api.query.system.events((events) => {
        events.forEach((record) => {
            const { event } = record;
            if (event.section === "contracts" && event.method === "ContractEmitted") {
                const [contract_address, contract_event] = event.data;

                // decode for events from MAIN_CONTRACT
                if (contract_address.toString() === MAIN_CONTRACT) {
                    const decode = abi.decodeEvent(contract_event);

                    // TODO: convert channelId from hex to integer
                    if(decode.event.identifier === 'ChannelCreated') {
                        redisClient.publishCreateChannelEvent({
                            channelId: decode.args[0],
                            channelName: decode.args[1],
                        })
                    } else if(decode.event.identifier === 'NewNotification') {
                        redisClient.publishNewNotificationEvent({
                            channelId: decode.args[0],
                            author: decode.args[1],
                            payload: decode.args[2],
                        })
                    }
                }
            }
        });
    });
}

export default listener;