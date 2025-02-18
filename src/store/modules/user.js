import { getProfileAPI, loginAPI } from "@/api/user";
import {setToken,clearToken } from "@/utils/token";


import { createSlice } from '@reduxjs/toolkit'

const userStore=createSlice({
  name:"user",
  initialState:{
    token:localStorage.getItem('token_key')||'',
    userInfo: {}
  },
  reducers:{
    setUserToken(state,action){
      state.token=action.payload
      setToken(action.payload)
    },
    setUserInfo(state,action){
      state.userInfo=action.payload
    },
    clearUserInfo (state) {
      state.token = ''
      state.userInfo = {}
      clearToken()
    }
  }
})


const{setUserToken,setUserInfo,clearUserInfo}=userStore.actions
const userReducer=userStore.reducer


const fetchLogin=(LoginForm)=>{
  return async(dispatch)=>{
    const re=await loginAPI(LoginForm)
    dispatch(setUserToken(re.data.token))
  }
}
const fetchUserInfo=()=>{
  return async(dispatch)=>{
    const re=await getProfileAPI()
    dispatch(setUserInfo(re.data))
  }
}


export{fetchLogin,fetchUserInfo,clearUserInfo}
export default userReducer