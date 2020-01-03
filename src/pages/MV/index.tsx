import React, {useState, useEffect} from "react"
import {useSelector, useDispatch} from "react-redux";
import {Slider, Icon} from "antd";
import "./index.scss"

function Mv() {
  const dispatch = useDispatch();
  return (
    <div className="mv-container">
      <div className="mv-bg" />
      <div className="video-box" />
      <video
        src="http://vodkgeyttp8.vod.126.net/cloudmusic/MjQ3NDQ3MjUw/89a6a279dc2acfcd068b45ce72b1f560/533e4183a709699d566180ed0cd9abe9.mp4?wsSecret=0dfe767baf2cf1d93bd411a84111be6c&wsTime=1578045503"/>
    </div>
  )
}

export default Mv
