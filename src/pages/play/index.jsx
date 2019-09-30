import React, { useState,useEffect } from "react";
import {Icon, Slider} from "antd";
import { connect } from "react-redux"
import "./index.scss"

const formatLyric = lyric => {
  if(!lyric)return null;
  const lyricArr = [];
  lyric.split("\n").forEach(value => {
    if(value){
      const arr = value.split("] ");
      if(arr.length === 2){
        arr[0] = arr[0] + "]"
      }else {
        arr[1] = ""
      }
      lyricArr.push(arr)
    }
  })
  const lrcJSON = Object.fromEntries(lyricArr);
  console.log(lrcJSON)
}

const Play = ({ dispatch,songDetail, lyricObj }) => {
  const [ isPause,changePause ] = useState(false);
  const [ isMute,changeMute ] = useState(false);

  const id = window.location.search.split("=")[1];
  const {al = {}, ar = []} = songDetail;
  const {lyric} = lyricObj
  useEffect(()=>{
    dispatch({
      type:"playmusic/songDetail",
      payload:{
        ids: id
      }
    });
    dispatch({
      type:"playmusic/getLyric",
      payload:{
        id
      }
    });
  },[])
  return (
    <div className="play-container">
      <div className="artist-info-container">
        <div className="img">
          <img src={al.picUrl || ""} alt=""/>
        </div>
        <div className="info">
          <h2>{songDetail.name}</h2>
          <h3>
            {ar.map((value,index) =>
              (index + 1) === ar.length ?
                <span key={value.id}>{value.name}</span> :
                <span key={value.id}>{value.name}/</span>)}
          </h3>
        </div>
      </div>
      <div className="lyrics-display-box">
        <div className="lyrics-content">
          {formatLyric(lyric)}
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
          <Slider defaultValue={50} disabled={false} />
        </div>
      </div>
    </div>
  )
}

const mapState = ({
                    songDetail_Reducer: songDetail = {},
                    getLyric_Reducer: lyricObj = {}
                  })=>({songDetail,lyricObj})
export default connect(mapState)(Play);
