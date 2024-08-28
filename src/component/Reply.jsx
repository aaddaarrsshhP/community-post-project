import React, { useRef } from 'react'
import './reply.css'
import { doc,updateDoc,arrayUnion, serverTimestamp } from 'firebase/firestore';
import db from '../firebase/firebase';
import { selectUserName,selectEmail,selectPhoto,selectUid } from '../store/userSlice';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { v4 } from 'uuid';
import { ref } from 'firebase/storage';
import { fileStorage } from '../firebase/firebase';
import { uploadBytes } from 'firebase/storage';
import { getDownloadURL } from 'firebase/storage';

export const Reply = ({value}) => {


  const userName=useSelector(selectUserName);
  const email=useSelector(selectEmail);
  const uid=useSelector(selectUid)
  const photoURL=useSelector(selectPhoto); 
  const [text,setText]=useState("");
  const replyContainer=useRef();
  const fileValue=useRef()
  const [emoji,setEmoji]=useState(false)
  const [uploadImgfile,setUploadImgfile]=useState("");
  const uploadimgURL=useRef(null);
  const extensiontype=useRef(null);
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
    if(text || uploadImgfile)
    {
      console.log("submitting");
      console.log("stateImg",uploadImgfile); 
       console.log("submiting");
      
    try{
      if(uploadImgfile)
      {
      const img=await ref(fileStorage,`Imgs/${v4()}`)
      console.log(img);
      await uploadBytes(img,uploadImgfile).then(async (data)=>
        {console.log(data)
        await getDownloadURL(data.ref).then(data=>uploadimgURL.current=data)
    
      })
    }
      console.log("replyImage: ",uploadimgURL.current);

    const documentRef = doc(db, "data", value.item.id);
      
      await updateDoc(documentRef, {
      replies: arrayUnion({
        name: userName ? userName : "Anonymous",
        photoURL: photoURL ? photoURL : "https://cdn-icons-png.flaticon.com/128/1144/1144760.png",
        email: email,
        message: text,
        uid: uid,
        uploadImg: uploadimgURL.current,
        extensionType: extensiontype.current
      })
      });
      fileValue.current.value="";
      value.handleReplyClose()

    }
    catch(e){
      alert("Something went wrong while taking your reply")
      value.handleReplyClose();
      console.log("error updating replies",e.message);
    }
  }
  else return ; 
      
  }

  function onEmojiClick(emoji)
  {
    setText(prev=>prev+emoji.emoji)
  }

  function handleFile(e){

    console.log(e.target.files[0]);
    setUploadImgfile(e.target.files[0]);
    extensiontype.current=e.target.files[0].type     
  }
    
  return (<>
    <div ref={replyContainer} className='reply-container' >
        <div className='reply-inner'>
          <div className='your-reply'>
          <textarea id='reply-text' placeholder='' value={text} onChange={(e)=>handlechange(e)} className='reply-textarea' maxLength="250" cols="90" rows="5"></textarea><br></br>
           <small>Maximum 250 words</small>
           <div className='submit-container'><button  onClick={()=>handleSubmit()} disabled={text || uploadImgfile ? false: true}>Submit</button></div>
          
           <div className='emoji-file'>
             <img onClick={()=>setEmoji(!emoji)} className='emoji' src='https://cdn-icons-png.flaticon.com/128/1023/1023656.png'/>
             <input type='file' ref={fileValue} onChange={(e)=>handleFile(e)}/>
             
           </div>

           {emoji ?  <EmojiPicker onEmojiClick={onEmojiClick} /> : <></>}

          </div>
         <div className='original-message'>
            <img src={value.item.data.photoURL} width="20px" height="20px"/>
            <h4 className='original-name'>{value.item.data.name}</h4>
           <div className='original-img-txt'> 
             {value.item.data.uploadImg ? value.item.data.extensionType.includes("mp4") ? <video autoPlay loop muted className='uploaded-img' >
                        <source src={value.item.data.uploadImg} type="video/mp4" />
                        </video>  :<img src={value.item.data.uploadImg} className='uploaded-img-original' width="" height=""/> : <></>}
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
            <div className='previous-reply-img'>
              {item.uploadImg ? item.extensionType.includes("mp4") ? <video autoPlay loop muted className='uploaded-img' >
                        <source src={item.uploadImg} type="video/mp4" />
                        </video>
               :<img src={item.uploadImg} width="100px" height="100px"/> : <></>}
               <h5 className='previous-message'>{item.message}</h5>
            </div>
          </div>
        }) }
         </div> </>}
        </div>
    </div>
    </>)
}
