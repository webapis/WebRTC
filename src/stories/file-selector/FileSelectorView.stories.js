import React from 'react'
import FileSelectorView from '../../file-uploader/ui-components/file-selector-view'
import FileInfo from '../../file-uploader/ui-components/file-info-view'

const style ={
    root:{
        height:'100vh',
       
    }
}

export default {
    title: 'FileSelectorView'
}


export const initialState =()=>{

    return <div style ={style.root}><FileSelectorView /></div> 

}

export const withFileInfo =()=>{

    return <div style ={style.root}>
        
        <FileSelectorView />
        <FileInfo />
        </div> 

}