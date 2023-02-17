import React, { useEffect } from 'react'

function UpperPanel({user}) {
  return (
    <div style={{display:"flex",flexDirection:"column"}}>
      <div style={{position:"relative"}}>
          <h3 style={{textAlign:"center"}}>API Token
          <br/>
          <span style={{fontSize: '15px', color:"rgb(80, 207, 80)"}}>{user?.token}</span></h3>
      </div>
      <div>
          <h3 style={{textAlign:"center"}}>
            Usage
            <br/>
            <span style={{ontSize: '15px', color:"rgb(80, 207, 80)"}}>https://get-last-notification.enigma.com?channel=channel_id&token={user?.token}</span>
          </h3>
      </div>
    </div>
  )
}

export default UpperPanel