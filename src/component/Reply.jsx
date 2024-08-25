import React, { useRef } from 'react'
import './reply.css'
import { doc,updateDoc,arrayUnion, serverTimestamp } from 'firebase/firestore';
import db from '../firebase/firebase';
import { selectUserName,selectEmail,selectPhoto,selectUid } from '../store/userSlice';
import { useSelector } from 'react-redux';
import { useState } from 'react';

export const Reply = ({value}) => {


  const userName=useSelector(selectUserName);
  const email=useSelector(selectEmail);
  const uid=useSelector(selectUid)
  const photoURL=useSelector(selectPhoto); 
  const [text,setText]=useState("");
  const replyContainer=useRef();
  console.log("value",value);
  window.addEventListener("click",(e)=>{
    
    
    if(e.target==replyContainer.current)
    {
      value.handleReplyClose()
    }
    else return ;
  })
  
  function handlechange(e){
    setText(e.target.value)
    console.log(text);
  }

   async function handleSubmit(){
       
       console.log("submiting");
    try{
    const documentRef = doc(db, "data", value.item.id);
      
      await updateDoc(documentRef, {
      replies: arrayUnion({
        name: userName ? userName : "Anonymous",
        photoURL: photoURL ? photoURL : "https://cdn-icons-png.flaticon.com/128/1144/1144760.png",
        email: email,
        message: text,
        uid: uid,
      })
      });
      value.handleReplyClose()
    }
    catch(e){
      console.log("error updating replies",e.message);
    } 
      
  }
    
  return (<>
    <div ref={replyContainer} className='reply-container'>
        <div className='reply-inner'>
          <div className='your-reply'>
          <textarea id='reply-text' placeholder='' value={text} onChange={(e)=>handlechange(e)} className='reply-textarea' maxLength="250" cols="90" rows="5"></textarea><br></br>
           <small>Maximum 250 words</small>
           <div className='submit-container'><button  onClick={()=>handleSubmit()} disabled={text ? false: true}>Submit</button></div>
          </div>
         <div className='original-message'>
            <img src={value.item.data.photoURL} width="20px" height="20px"/>
            <h4 className='original-name'>{value.item.data.name}</h4>
           <div className='original-img-txt'> 
             {value.item.data.uploadImg ? <img src={value.item.data.uploadImg} className='uploaded-img-original' width="" height=""/> : <></>}
             <h4 className='original-mess'>{value.item.data.message}</h4>
           </div> 
         </div>
        {value.item.data.replies.length==0 ? <div className='replies-tag'><h3>No Replies</h3></div>
        : <><div className='replies-tag'><h3>Replies</h3></div>
        <div className='previous-replies'>
           { value.item.data.replies.map((item,key)=>{
          return<div className='previous-replies-inner' key={key}>
            <img src={item.photoURL} className='previous-replies-url'/> 
            <h5 className='previous-name'>{item.name}</h5>
            <h5 className='previous-message'>{item.message}</h5>
          </div>
        }) }
         </div> </>}
        </div>
    </div>
    </>)
}
