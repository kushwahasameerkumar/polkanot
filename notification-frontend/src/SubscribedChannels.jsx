import React,{useState,useEffect} from 'react'
import _map from 'lodash/map';
// import {Button, Tooltip}  from '@mui/material';
// import AddCircleIcon from '@mui/icons-material/AddCircle';
import ModalForShowAllChannels from './ModalForSubscribedChannels';
import { ListOfAllChannels } from './mockData';
import './index.css';

const SubscribedChannels =({user, setSelectedChannel, allChannels}) =>{
  const [subscribedChannels, setSubscribedChannels] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  useEffect(()=>{
    //logic to fetch list of all channels and set it so that if user want's to add then he can do it
  },[]);

  const renderChannels = (channel) => {
      return(
        <div key={channel.channelId}>
          <div tabIndex={1} className="channels" onClick={()=>setSelectedChannel(channel)} >
            {channel?.channelId}
          </div>
        </div>
      );
  };

  const openAllChannels = () => {
    setIsOpen(true);
  }

  useEffect(() => {
    setSubscribedChannels(user?.subscribedChannels)
  }, [user])

  return (
  <div>
  {/* <ModalForShowAllChannels modalIsOpen={modalIsOpen} setIsOpen={setIsOpen} allChannels = {ListOfAllChannels}/>   */}
  <div style={{display:"flex",flexDirection:"column"}}>
    <div>
      <h4>Subscribed Channels</h4>
    </div>
    <div style={{height:"200px",overflowY:"auto"}}>
      {_map(subscribedChannels, renderChannels)}
    </div>
    <div>
      <div style={{float:"right"}} onClick = {openAllChannels}>
        <div style={{display:"flex", flexDirection:"row"}}>
        +
        {/* <Tooltip placement="left" title="Subscribe to a channel"> */}
          {/* <AddCircleIcon  onClick={openAllChannels}/> */}
        {/* </Tooltip> */}
        </div>
      </div>
      <ModalForShowAllChannels modalIsOpen={modalIsOpen} setIsOpen={setIsOpen} allChannels={allChannels}/>
    </div>
  </div>
  </div>  
  );
}

export default SubscribedChannels;