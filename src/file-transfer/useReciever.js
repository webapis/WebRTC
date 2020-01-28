import {useState,useEffect} from 'react'

export default function useReciever ({message}){
const [downloadProgress,setDownloadProgress]= useState(0);

    return {downloadProgress}
}
