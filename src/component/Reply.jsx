import React from 'react'
import './reply.css'

export const Reply = ({value}) => {
   
    console.log(value);
    
  return (
    <div onClick={()=>value.setReply(false)} className='reply-container'>
        <div className='reply-inner'>
         <div className='original-message'>
            <img src={value.item.data.photoURL} width="20px" height="20px"/>
            <h4>{value.item.data.name}</h4>
            <h4>{value.item.data.message}</h4>
         </div>
        </div>
    </div>
  )
}
