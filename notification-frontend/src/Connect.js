import { useEffect, useState } from 'react'
import { web3Accounts, web3Enable, web3FromSource } from '@polkadot/extension-dapp';
import { stringToHex } from "@polkadot/util";
// import { Button } from '@mui/material';

import Modal from 'react-modal';

import {
    calls
} from './calls'

import './connect.css'
function Connect(props) {
  const [isConnected, setIsConnected] = useState(false)
  const [accounts, setAccounts] = useState([])
  const [signature, setSignature] = useState("")

  async function popup() {
    const extensions = await web3Enable('my cool dapp');

    // TODO: this sometimes give 0 length when reloaded
    if (extensions.length === 0) {
      setIsConnected(false)
      return;
    }

    setIsConnected(true)
    const allAccounts = await web3Accounts();
    setAccounts(allAccounts)
  }

  async function sign() {
    const account = accounts[0];

    // to be able to retrieve the signer interface from this account
    // we can use web3FromSource which will return an InjectedExtension type
    const injector = await web3FromSource(account.meta.source);

    // this injector object has a signer and a signRaw method
    // to be able to sign raw bytes
    const signRaw = injector?.signer?.signRaw;

    if (!!signRaw) {
        // after making sure that signRaw is defined
        // we can use it to sign our message
        const { signature } = await signRaw({
            address: account.address,
            data: stringToHex(account.address),
            type: 'bytes'
        });

        setSignature(signature)
    }
  }

  async function submit() {
    const res = await calls.auth(accounts[0]?.address, signature)
    window.location.reload()
  }

  return (
    <div>
        <Modal
            isOpen={props.modalIsOpen}
            overlayClassName="Overlay"
            className = "Content"
        >
            <span style = {{color: "white", float: "right", cursor: "pointer"}} onClick = {() => {props.setIsOpen(false)}}>X</span>

            <div style = {{ color: "black", textAlign: "center"}}>
                <b>Sign your address by clicking on Sign button</b>
                
                <br/>

                {isConnected ? accounts[0]?.address : "Not Connected"}
            </div>

            <br/><br/>

            {
                signature
                ?
                <div style = {{ color: "black", textAlign: "center"}}>
                    <b>You signature</b>

                    <br/>

                    {signature.slice(0, 64)}...

                    <br/><br/>

                    <button
                        style={{
                            border:"2px solid white",
                            cursor: "pointer"
                        }} 
                        class= "connectButton"        
                        onClick ={submit}
                    >
                        Submit
                    </button>
                </div>
                :
                <div style = {{display: "flex", justifyContent: "space-evenly"}}>
                    <button
                        style={{
                            border:"2px solid white",
                            cursor: "pointer"
                        }} 
                        class= "connectButton"        
                        onClick ={popup}
                    >
                        {
                            isConnected ? "Connected" : "Connect"
                        }
                    </button>

                        <button
                            style={{
                                border:"2px solid white",
                                cursor: "pointer"
                            }} 
                            class= "connectButton"        
                            onClick ={sign}
                        >
                            Sign
                        </button>
                </div>
            }
        </Modal>
    </div>
  );
}

export default Connect;
