import React from 'react'
import ReactLoading from "react-loading";


const LoadingComponent = () => {
  return (
    <div style={{
        display:'flex',
        alignItems:'center',
        justifyContent:'center'
    }}>
        <ReactLoading type='spin' color='red'/>
    </div>
  )
}

export default LoadingComponent