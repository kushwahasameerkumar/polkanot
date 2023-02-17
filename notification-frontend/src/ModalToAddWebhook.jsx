// import { Button ,TextField} from '@mui/material';
import React, { useState } from 'react';
import Modal from 'react-modal';
import _get from 'lodash/get';
// import CloseIcon from '@mui/icons-material/Close';
import './index.css'

import { calls } from './calls'

function ModalToAddWebhook({channel, modalIsOpen, setIsOpen}) {
  const [webhookValue, setWebhookValue] = useState("");
  const AddNewWebhook = async () =>{
    //logic to add the webhook
    const res = await calls.addWebhook(channel?.channelId, webhookValue)
    window.location.reload()
  }

  const onValueChange = (event) =>{
    const value = _get(event, 'target.value');
    setWebhookValue(value)
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <Modal
      isOpen={modalIsOpen}
      className="ModalWebhook"
      overlayClassName="OverlayWebhook">
        <div style={{display:"flex",flexDirection:"column"}}>
          <div onClick = {closeModal} style = {{color: "black", float: "right"}}>
            X
            {/* <CloseIcon onClick={closeModal} sx={{color:"black",float:"right"}}/> */}
          </div>
          <div style={{display:"flex",flexDirection:"row"}}>
            <div style={{display:"flex",flexDirection:"column",color:"black",justifyContent:"space-around"}}>
              <h1>
                Add Webhook Endpoint:
              </h1>
              <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between"}}>
                <input onChange={onValueChange} />
                {/* <TextField variant="outlined" onChange={onValueChange} sx={{width:"75%"}}/> */}
                  <div>
                  <button class="AddButton" onClick= {AddNewWebhook} >Add</button>
              </div>
              </div>
            </div>
          </div>
        </div>
    </Modal>
  )
}

export default ModalToAddWebhook