
import { useEffect, useRef, useState } from 'react'
import "./App.css"
import { Signin } from './component/signin'
import { Prevcomments } from './component/prevcomments'
import {collection,addDoc } from "firebase/firestore";
import db from './firebase/firebase'
import { selectUserName,selectEmail,selectPhoto,selectUid} from "./store/userSlice";
import { useDispatch, useSelector } from 'react-redux';
import "./givecomment.css"
import { outUser } from './store/userSlice';
import EmojiPicker from 'emoji-picker-react';
import { serverTimestamp } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { v4 } from 'uuid';
import { fileStorage } from './firebase/firebase';

function App() {
  
  const dispatch=useDispatch();
  const [key,setKey]=useState(0);
  const userName=useSelector(selectUserName);
  const email=useSelector(selectEmail);
  const uid=useSelector(selectUid)
  const photoURL=useSelector(selectPhoto);
  const [text,setText]=useState('')
  const [emoji,setEmoji]=useState(false);
  const [strong,setStrong]=useState(true)
  const [uploadImgfile,setUploadImgfile]=useState("");
  const uploadimgURL=useRef(null) 
  const fileValue=useRef()
  console.log(fileValue.current);

  function handlechange(e){
      
      setText(e.target.value)
      
  }

  async function handleSubmit(){
      if(text || uploadImgfile)
      {
        console.log("submitting");
        console.log("stateImg",uploadImgfile);
    try {
      if(uploadImgfile)
      {
      const img=await ref(fileStorage,`Imgs/${v4()}`)
      console.log(img);
      await uploadBytes(img,uploadImgfile).then(async (data)=>
        {console.log(data)
        await getDownloadURL(data.ref).then(data=>uploadimgURL.current=data)
    
      })
    }
      console.log(uploadimgURL.current);
      const docRef = await addDoc(collection(db, "data"), {
        message: text,
        likes: [],
        uid: uid ? uid: "",
        email: email ? email:"",
        name: userName ? userName : "Anonymous",
        photoURL: photoURL ? photoURL : "https://cdn-icons-png.flaticon.com/128/1144/1144760.png",
        uploadImg: uploadimgURL.current,
        replies: [],
        timestamp: serverTimestamp(),
      });
      console.log("Document written with ID: ", docRef.id);
      setText('')
      setUploadImgfile("");
      fileValue.current.value="";
      uploadimgURL.current=null;
      setKey(prev=>prev+1);
      setEmoji(prev=>emoji ? false : false)
    } catch (e) {
      console.error("Error adding document: ", e);
    }

  }
  else return ;
  }
   
  function logOut(){

    console.log("loging out");
    dispatch(outUser())
  }

  function onEmojiClick(emoji)
  {
     console.log(emoji);
     setText(prev=>prev+emoji.emoji)
     
  }

  async function handleFile(e){

    console.log(e.target.files[0]);
    setUploadImgfile(e.target.files[0]);
         
  }

  

  

 return (
    <>
      <div id='outerContainer' className='outer-container'>
        
        <div className='signin'>
          <Signin />
          
        </div>
         <div className='logout-container'>
          { uid ? <button onClick={()=>logOut()} className='log-out'>Log out</button>
                : <></>
          }
        </div>
        
        <div> 
        
         
         <textarea id='texting' placeholder='Your opinion is invaluable to our community....' value={text} onChange={(e)=>handlechange(e)} className='textarea' maxLength="250" cols="50" rows="10"></textarea><br></br>
           <small>Maximum 250 words</small>
           <div className='submit-container'><button  onClick={()=>handleSubmit()} disabled={text || uploadImgfile ? false: true}>Submit</button></div>
      
        </div>
        <div>
           <div className='emoji-file'>
             <img onClick={()=>setEmoji(!emoji)} className='emoji' src='https://cdn-icons-png.flaticon.com/128/1023/1023656.png'/>
             <input type='file' ref={fileValue} onChange={(e)=>handleFile(e)}/>
             
           </div>
             {emoji ?  <EmojiPicker onEmojiClick={onEmojiClick} /> : <></>}
        </div>
          <div>
            <Prevcomments value={key}/>
          </div>
      </div>
    </>
  )
}

export default App