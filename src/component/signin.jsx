import React, { useEffect, useRef } from 'react'
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import "./signin.css"
import { selectUserName } from '../store/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../store/userSlice';
import { selectPhoto } from '../store/userSlice';
import { outUser } from '../store/userSlice';

export const Signin = () => {
 
    const ref=useRef("anonymous")  
    const dispatch=useDispatch(); 
    const photoURL=useSelector(selectPhoto)
    const name=useSelector(selectUserName)
    console.log("NAme",name);
    
    
      
    function Siginin(){
        console.log("signing in");    
        const provider= new GoogleAuthProvider()
        const auth = getAuth();
        signInWithPopup(auth, provider)
       .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    console.log(user);
    ref.current=user.displayName;
    dispatch(setUser({
      displayName: user.displayName,
      email:user.email,
      photoURL:user.photoURL,
      uid:user.uid
    }))
    // IdP data available using getAdditionalUserInfo(result)
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(error.message);
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    alert("We are facing some issues for the moment .Please try again later")
    // ...
  });

}         
    

ref.current=name ? name : "anonymous"
    
  return (
    <div className='logo-container'>
       {photoURL ? <img className='google-icon' src={photoURL}/>  
       
       : <img onClick={Siginin} className='google-icon' src='https://cdn-icons-png.flaticon.com/128/300/300221.png'/>
             }
         <h5 className='login-name'>{ref.current}</h5>    
    </div>
  )
}
