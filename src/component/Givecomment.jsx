import React, { useState } from 'react'
import { useEffect } from 'react';
import {collection,addDoc } from "firebase/firestore";
import db from '../firebase/firebase';
import { selectUserName,selectEmail,selectPhoto,selectUid } from '../store/userSlice';
import { useSelector } from 'react-redux';


export const Givecomment = () => {
   
  const userName=useSelector(selectUserName);
  const email=useSelector(selectEmail);
  const uid=useSelector(selectUid)
  const photoURL=useSelector(selectPhoto);
  const [text,setText]=useState('Please write your comment...')

  function handlechange(e){
      
      setText(e.target.value)
      console.log(e.target.value);
  }

  async function handleSubmit(){
       
    try {
      const docRef = await addDoc(collection(db, "data"), {
        message: text,
        likes: [],
        uid: uid ? uid: null,
        email: email ? email:null,
        name: userName ? userName : "Anonymous",
        photoURL: photoURL ? photoURL : "https://cdn-icons-png.flaticon.com/128/1144/1144760.png"
      });
      console.log("Document written with ID: ", docRef.id);
      setText("Please write your comment...")
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  
    return (
      <>
         
         <textarea value={text} onChange={(e)=>handlechange(e)} className='textarea' maxLength="250" cols="50" rows="10"></textarea><br></br>
           <small>Maximum 250 words</small>
           <div className='submit-container' onClick={handleSubmit}><button>Submit</button></div>
      </>
  )
}
