import { createSlice } from "@reduxjs/toolkit";

const initialState={
    displayName: null,
    email: null,
    photoURL: null,
    uid: null

}


const userSlice=createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state,action)=>{
               
            state.displayName=action.payload.displayName;
            state.email=action.payload.email;
            state.photoURL=action.payload.photoURL;
            state.uid=action.payload.uid
        }

        ,outUser: (state)=>{
             
            state.displayName=null,
            state.email=null,
            state.photoURL=null,
            state.uid=null
        }
    },

})


export const {setUser,outUser} =userSlice.actions;
export const selectUserName=(state)=>state.user.displayName;
export const selectEmail=(state)=>state.user.email;
export const selectPhoto=(state)=>state.user.photoURL;
export const selectUid=(state)=>state.user.uid;

export default userSlice.reducer;
