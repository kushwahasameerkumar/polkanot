import React, { useEffect, useState } from "react";
import SubscribedChannels from "./SubscribedChannels";
import WebhookDisplay from "./WebhookDisplay";
export const UserContext = React.createContext();

const LowerPanel = ({user, allChannels}) => {
  // const [listOfWebHook,setListOfWebhook] = useState([]);
  const [selectedChannel,setSelectedChannel] = useState(); 

return(
  <div style={{display:"flex",justifyContent:"space-around",flexDirection:"row", alignItems:"center",padding:"20px 0"}}>
    <div style={{position:"relative",border:'2px solid white',width:'250px',height:"300px",padding:"20px"}}>
      <SubscribedChannels user={user} setSelectedChannel={setSelectedChannel} allChannels={allChannels}/>
    </div>
    <div style={{position:"relative",border:'2px solid white',width:'250px',height:"300px",padding:"20px",overflowY:"auto"}}>
      <WebhookDisplay channel={selectedChannel} />
    </div>
  </div>
);

  
}

export default LowerPanel;
