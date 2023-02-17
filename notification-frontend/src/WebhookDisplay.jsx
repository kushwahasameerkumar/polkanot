import React, { useState,useEffect } from 'react'
import _map from 'lodash/map';
// import AddCircleIcon from '@mui/icons-material/AddCircle';
import ModalToAddWebhook from './ModalToAddWebhook';
import { webhooksToDisplay } from './mockData';
// import { Tooltip } from '@mui/material';
import './index.css'
const WebhookDisplay = ({channel})=> {
  const [webhooks, setWebhook] = useState(webhooksToDisplay);
  const [modalIsOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    //logic to find webhook of a user based on the channel selecetef
  }, [])
  
  const renderWebhook = (webhook) => {
    return(
      <div>
        <div tabIndex={1} className="channels">{webhook?.endpoint} </div>
      </div>
    );
  };

  const AddNewWebhook= () =>{
    setIsOpen(true);
  }

   
  return (
    <div>
        <ModalToAddWebhook channel={channel} modalIsOpen={modalIsOpen} setIsOpen={setIsOpen} />
      <div style={{display:"flex",flexDirection:"column"}}>
        <div>
          <h4>Channel Webhooks</h4>
        </div>
        <div style={{height:"200px",overflowY:"auto"}}>
         {_map(channel?.webhooks, renderWebhook)}
        </div>
        <div>
          <div style={{float:"right"}} onClick={AddNewWebhook}>
            +
            {/* <Tooltip placement="left" title="Add a new webhook">
              <AddCircleIcon />
            </Tooltip> */}
          </div>
        </div>
      </div>
      </div>
  );
}

export default WebhookDisplay