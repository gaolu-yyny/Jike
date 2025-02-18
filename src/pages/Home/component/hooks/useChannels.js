import { useEffect, useState } from 'react'
import { getChannelAPI } from '@/api/article'

function useChannels(){
  const[channels,setChannels]=useState([])

  useEffect(()=>{
    async function fetchChannels(){
      const re=await getChannelAPI()
      setChannels(re.data.channels)
    }
    fetchChannels()
  },[])
  return {
    channels
  }
}
export {useChannels}