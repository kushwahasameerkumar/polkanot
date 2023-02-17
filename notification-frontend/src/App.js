import logo from './logo.svg';
import './App.css';
import UpperPanel from './UpperPanel';
import LowerPanel from './LowerPanel';
import { useEffect, useState } from 'react';
// import { Button } from '@mui/material';
import { subscriber } from './mockData';
// import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import Connect from './Connect'
import "./index.css";

import {
  calls
} from './calls'

function App() {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState();
  const [allChannels, setAllChannels] = useState([]);

  const ConnectToWallet = ()=>{
    setIsOpen(true)
  }

  const getSubscriberInfo = async () => {
    const subsciberInfo = await calls.getSubscriberInfo()
    if(!subsciberInfo?.isError) {
      setUser(subsciberInfo?.info)
    }
  }

  const getAllChannels = async () => {
    const res = await calls.getChannels()
    if(!res?.isError) {
      setAllChannels(res?.channels)
    }
  }

  useEffect(() => {
    getSubscriberInfo()
    getAllChannels()
  }, [])

  return (
    <div>
      <div style={{display:"flex",flexDirection:"column"}}>
        <div style={{position:"relative", width:"80%",margin:"0 auto"}}>
          <h1 style={{textAlign:"center"}}> PolkaNotify
          <img src="/bell.png" style = {{width: "30px", height: "30px", marginLeft: "10px", }} alt = {"bell"}/>
          {/* <NotificationsActiveIcon sx={{color:"green",paddingLeft:"10px"}} /> */}
          </h1>
          <button
            style={{
              position:"absolute",
              right:"0px",
              top:"20px",
              border:"2px solid white"
            }} 
            class= "connectButton"        
            onClick ={ConnectToWallet}
          >
            Connect to Wallet
          </button>

          <Connect modalIsOpen = {modalIsOpen} setIsOpen = {setIsOpen}/>
        </div>
        <div style={{border:'2px solid white',width:"80%",margin:"0 auto"}}>
          <UpperPanel user={user}/>
        </div>
        <div style={{border:'2px solid white',width:"80%" ,margin:"0 auto"}}>
          <LowerPanel user={user} allChannels={allChannels}/>
        </div>
      </div>
    </div>
  );
}

export default App;
