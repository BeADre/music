import React,{ useState,useEffect } from "react"
import "./index.scss"
const Home = () => {
  useEffect(() => {

  })
  return (
    <div className="homeContainer">
      <h1>歌单推荐</h1>
      <div className="tab">
        <span>为你推荐</span>
        <span>官方歌单</span>
        <span>情歌</span>
        <span>网络歌曲</span>
        <span>经典</span>
        <span>KTV热歌</span>
      </div>
    </div>
  )
}

const mapState = ()=>{}

export default Home
