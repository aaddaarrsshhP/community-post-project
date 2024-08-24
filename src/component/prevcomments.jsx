import React, { useEffect, useRef, useState } from 'react'
import {collection, getDocs,getDoc,doc,setDoc } from "firebase/firestore";
import db from '../firebase/firebase';
import "./prevcomment.css"
import { useSelector } from 'react-redux';
import { selectUid } from '../store/userSlice';
import { query, orderBy,limit} from "firebase/firestore";
import { Reply } from './Reply';



export const Prevcomments = ({value}) => {
     
    const [likeref,setLikeref]=useState(false);
    const [viewall,setViewall]=useState(false)
    const [comments,setComments]=useState([])
  //  const [num,setNum]=useState(0);
    const uid=useSelector(selectUid)
    const [replyid,setReplyid]=useState(false) 

    async function Dislike(id)
    {
      setLikeref(true);
      console.log(id);
      const docRef = doc(db, "data", id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        const likes=docSnap.data().likes.filter(item=>item!==uid)
        const data={...docSnap.data(),likes}
        console.log("new data:",data);
        await setDoc(doc(db,"data",id),{...docSnap.data(),likes})
    //    setNum((prev)=>prev+1)
          getData()           

      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
    }
  }

    async function Like(id){
     
    setLikeref(true);
    console.log(id);
    const docRef = doc(db, "data", id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      let likes=docSnap.data().likes;
      likes.push(uid)
      await setDoc(doc(db,"data",id),{...docSnap.data(),likes})
    //  setNum((prev)=>prev+1)
    getData()

    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
  }
  }

    
  async function getData(){
    
    const ref=collection(db,"data"); 
    console.log(ref);
    const q =await query(ref, orderBy("timestamp","desc"));
    console.log(q);
    let data=[]
    const querySnapshot = await getDocs(q);
querySnapshot.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
      
  data=[...data,{data:doc.data(),id:doc.id}];  
});
    console.log("firstoredata: ",data);
    setComments(data)
    setLikeref(false)
  }

  function handleReply(id)
  {
    setReplyid(id)
  }

  function handleReplyClose(){

    setReplyid(false)
    getData();
  }

    useEffect(()=>{
           
          
      getData()
   
     },[value])
  
  
    return (
    <>
      <div>
        <h4 style={{marginLeft: '5px'}}>Comments...</h4>
        <div className='comments-exists'>
          {comments ? viewall ?   
            comments.map(item=>{
              console.log(item);
                return (
                    <div key={item.id} className='comment'>
                      <img className='photourl' src={`${item.data.photoURL}`} />
                      <span>{item.data.name}</span>
                      <div className='img-text'> 
                       <div>
                        {item.data.uploadImg ?<img className='uploaded-img' src={item.data.uploadImg} /> : <></>}
                        <p>{item.data.message}</p>
                       </div>
                       <div>
                         <small>Reply</small>
                        </div>   
                      </div>                       <div className='container-like-dislike'>
                      {item.data.likes ?.includes(uid) ?<button disabled={likeref} onClick={()=>Dislike(item.id)} > <img className='like-dislike' src='https://cdn-icons-png.flaticon.com/128/126/126504.png'/> </button> 
                      : <button disabled={likeref} onClick={()=>Like(item.id)} ><img className='like-dislike' src='https://cdn-icons-png.flaticon.com/128/126/126473.png' /> </button>}
                      <small className='like-count'>{item.data.likes.length}</small>
                      </div>
                    </div>
                )
            })
          : 
            comments.length < 8 ? comments.map(item=>{
              console.log(item);
                return (
                    <div key={item.id} className='comment'>
                      <img className='photourl' src={`${item.data.photoURL}`} />
                      <span>{item.data.name}</span>
                      <div className='img-text'> 
                        <div>
                        {item.data.uploadImg ?<img className='uploaded-img' src={item.data.uploadImg}/> : <></>}
                        <p>{item.data.message}</p>
                        </div>
                        <div>
                          <small>Reply</small>
                        </div>
                      </div> 
                      <div className='container-like-dislike'>
                      {item.data.likes ?.includes(uid) ?<button disabled={likeref} onClick={()=>Dislike(item.id)} > <img className='like-dislike' src='https://cdn-icons-png.flaticon.com/128/126/126504.png'/> </button> 
                      : <button disabled={likeref} onClick={()=>Like(item.id)} ><img className='like-dislike' src='https://cdn-icons-png.flaticon.com/128/126/126473.png' /> </button>}
                      <small className='like-count'>{item.data.likes.length}</small>
                      </div>
                    </div>
                )
            }) 
            
            
            :comments.slice(0,8).map(item=>{
              console.log(item);
                return (
                    <div key={item.id} className='comment'>
                      <img className='photourl' src={`${item.data.photoURL}`} />
                      <span>{item.data.name}</span>
                     <div className='img-text'> 
                        <div>
                         {item.data.uploadImg ?<img className='uploaded-img' src={item.data.uploadImg} /> : <></>}
                         <p>{item.data.message}</p>
                        </div>
                        <div>
                           <small onClick={()=>handleReply(item.id)} className='reply'>{item.data.replies.length > 0 ? `Replies(${item.data.replies.length})` : "Reply"}</small>
                           {replyid==item.id ? <Reply value={{handleReplyClose,item}}/>:<></>}
                        </div>
                      </div> 
                      <div className='container-like-dislike'>
                      {item.data.likes ?.includes(uid) ?<button disabled={likeref} onClick={()=>Dislike(item.id)} > <img className='like-dislike' src='https://cdn-icons-png.flaticon.com/128/126/126504.png'/> </button> 
                      : <button disabled={likeref} onClick={()=>Like(item.id)} ><img className='like-dislike' src='https://cdn-icons-png.flaticon.com/128/126/126473.png' /> </button>}
                      <small className='like-count'>{item.data.likes.length}</small>
                      </div>
                    </div>
                )
            }) :

            <h5>No Comments...</h5>
          
          }
        </div>
         {comments.length > 8 ? viewall ? <h5 onClick={()=>setViewall(prev=>!prev)} className='viewall'>(Hide few..)</h5>: 
             <h5 onClick={()=>setViewall(prev=>!prev)} className='viewall'>(View all.. {comments?.length})</h5>
            : <></>
            }
      </div>
    </>
  )
}
