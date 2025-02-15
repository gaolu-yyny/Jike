import { request } from "@/utils";
import { getToken,setToken } from "@/utils/token";


import { createSlice } from '@reduxjs/toolkit'

const userStore=createSlice({
  name:"user",
  initialState:{
    token:getToken||''
  },
  reducers:{
    setUserInfo(state,action){
      state.token=action.payload
      setToken(action.payload)
    }
  }
})

const fetchLogin=(LoginForm)=>{
  return async(dispatch)=>{
    const re=await request.post('/authorizations',LoginForm)
    dispatch(setUserInfo(re.data.token))
  }
}
const{setUserInfo}=userStore.actions
const userReducer=userStore.reducer

export{fetchLogin,setToken}
export default userReducer