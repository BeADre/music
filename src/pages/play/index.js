import React, { useState } from "react";
import {Icon, Slider} from "antd";
import { connect } from "react-redux"
import "./index.scss"

const Play = () => {
  const [ isPause,changePause ] = useState(false);
  const [ isMute,changeMute ] = useState(false);
  return (
    <div className="play-container">
      <div className="lyrics-display-box">
        <div className="lyrics-content">
          <p>sdffffffffffsdfssssssssss</p>
          <p>sdffffffffffsdfssssssssss</p>
          <p>sdffffffffffsdfssssssssss</p>
          <p>sdffffffffffsdfssssssssss</p>
          <p>sdffffffffffsdfssssssssss</p>
          <p>sdffffffffffsdfssssssssss</p>
          <p>sdffffffffffsdfssssssssss</p>
          <p>sdffffffffffsdfssssssssss</p>
          <p>sdffffffffffsdfssssssssss</p>
          <p>sdffffffffffsdfssssssssss</p>
          <p>sdffffffffffsdfssssssssss</p>
          <p>sdffffffffffsdfssssssssss</p>
          <p>sdffffffffffsdfssssssssss</p>
          <p>sdffffffffffsdfssssssssss</p>
        </div>
      </div>
      <div className="player">
        <Icon type="step-backward" />
        {isPause ?
          <Icon type="caret-right" onClick={()=>changePause(false)}/> :
          <Icon type="pause" onClick={()=>changePause(true)} />}
        <Icon type="step-forward" />
        <div className="slider-container">
          <Slider defaultValue={30} disabled={false} tooltipVisible={false} />
        </div>
        <div className="time-container">
          <span>00:00/04:23</span>
        </div>
        <Icon type="download" />
        {isMute ?
          <i className="iconfont icon-jingyin" onClick={()=>changeMute(false)}/>:
          <i className="iconfont icon-shengyin" onClick={()=>changeMute(true)}/>
        }
        <div className="voice-container">
          <Slider defaultValue={30} disabled={false} />
        </div>
      </div>
    </div>
  )
}
export default Play