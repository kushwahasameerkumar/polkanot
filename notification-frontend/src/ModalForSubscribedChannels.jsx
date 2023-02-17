// import { lightBlue } from '@mui/material/colors'
import React, { useEffect, useState } from 'react'
import _map from 'lodash/map';
import Modal from 'react-modal';
// import CloseIcon from '@mui/icons-material/Close';
import './modalDesign.css';
import { remove } from 'lodash';
import { calls } from './calls';

const ModalForShowAllChannels=({modalIsOpen, setIsOpen, allChannels}) =>{

  // const [selectedChannel,setSelectedChannel] = useState('')
  const [hoverId,setHoverId] = useState(null);

  const addChannelToSubscribeChannel = async (channel) =>{
    const res = await calls.subscribeChannel(channel?.channelId)
    window.location.reload()
  }
  function changeBackground(id) {
    setHoverId(id)
  }

  function removeBackground() {
    setHoverId(null)
  }

  const showChannelName = (channel) =>{
    return(
      <div key={channel?.channelId}  
           style={hoverId===channel?.channelId?
                                    {border:"2px solid white",borderRadius: "5px",backgroundColor:"lightgreen",alignItems:"center",color:"white"}
                                    :{backgroundColor:"white",borderRadius: "5px",alignItems:"center",color:"black"}}
           onClick ={()=>{addChannelToSubscribeChannel(channel)}} 
           onMouseOver={()=>{changeBackground(channel?.channelId)}}
           onMouseDown={removeBackground}>
        <h4 style={{textAlign:"center"}}>{channel?.channelName}</h4>
      </div>
    )
  }

  function closeModal() {
    setIsOpen(false);
  }
  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose ={closeModal}
      ariaHideApp={false}
      className="Modal"
      overlayClassName="Overlay">
            <div onClick={closeModal} style={{color: "black", display:"flex",flexDirection:"row",position:"relative",alignItems:"center",justifyContent:"space-between"}}>
              <h3 style={{textAlign:"center",color:"black"}}>Subscribe new channel</h3>
              {/* <CloseIcon onClick={closeModal} sx={{color:"black"}}/> */}
              X
            </div>
            <div style={{display:"flex",flexDirection:"column",height:"300px",overflowY:"auto"}}>
              {_map(allChannels, showChannelName)}
            </div>
    </Modal> 
  )
}

export default ModalForShowAllChannels;