// Import the API
import { ApiPromise, WsProvider } from '@polkadot/api';
import { Abi } from '@polkadot/api-contract';

import ABI from './metadata.json' assert { type: "json" };
const MAIN_CONTRACT = '5Eo2VWrB3KXdZtC5jrQh6KQzGEVuudWvTCWvsmU9kqZqLXwN'

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

                /* Testing */

                console.log(`contract address ${contract_address}`)

                /* Testing end*/

                // decode for events from MAIN_CONTRACT
                if (contract_address.toString() === MAIN_CONTRACT) {
                    const decode = abi.decodeEvent(contract_event);
                    console.log("Decoded:", (decode.args.toString()));

                    // send event to queue
                }
            }
        });
    });
}

export default listener;