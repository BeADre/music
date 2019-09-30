import React, { useState,useEffect,useRef } from "react";
import {Icon, Slider} from "antd";
import { connect } from "react-redux"
import utils from "../../utils"
import "./index.scss"

/**
 *
 * @param lyric  {String} 歌词文本
 * @param lrcTimeArr {Array} 存放歌词时间的数组
 * @param activeLine  {Number} 当前展示的行数
 * @returns {null|*[]}
 */
const formatLyric = (lyric, lrcTimeArr, activeLine) => {
  if(!lyric)return null;
  const lyricArr = [];
  lyric.split("\n").forEach(value => {
    if(value){
      const arr = value.split("]");
      if(arr.length === 2 && arr[1]){
        arr[0] = arr[0] + "]";
        lyricArr.push(arr);
      }
    }
  });
  const lrcJSON = Object.fromEntries(lyricArr);
  return Object.keys(lrcJSON).map((value,index) =>{
    lrcTimeArr.push(parseFloat(value.substr(1,3)) * 60 + parseFloat(value.substring(4,10)));
    return <p key={value} className={activeLine === `lyric${index}` ? "on" : "" }>{lrcJSON[value]}</p>;
  })
};

/**
 *
 * @param e  {Object} 当前事件对象
 * @param lrcTimeArr  {Array} 存放歌词时间的数组
 * @param lyricContentRef {Object} 歌词容器DOM的Ref
 * @param setActiveLine  {Function} 改变state的函数
 * @param setCurrentTime {Function} 改变state的函数
 */
const timeUpdate = (e, lrcTimeArr, lyricContentRef, setActiveLine, setCurrentTime)=>{
  const { currentTime } = e.currentTarget;
  setCurrentTime(currentTime);
  lrcTimeArr.some((value, index, arr) => {
    if((currentTime > value && currentTime < arr[index + 1]) || currentTime > arr[arr.length - 1]){
      lyricContentRef.current.style.transform = `translateY(${250 - 75 * index }px)`;
      setActiveLine(`lyric${index}`);
    }
  });
};

/**
 *
 * @param audio {Object} audio标签的ref
 * @param setState {Function} 改变state的函数
 * @param controlType {String} 需要改变的control类型
 */
const musicControl = (audio, setState, controlType) => {
  const { current } = audio;
  if(controlType === "pause"){
    current.paused ? current.play() : current.pause();
    setState(current.paused)
  }else {
    current.muted = !current.muted;
    setState(current.muted);
  }
};

const changeVoice = (value, audio, setMute) =>{
  audio.current.volume = value / 100;
  audio.current.muted = false;
  setMute(false)
};

const changeTime = (value, audio) =>{
  const minUnitTime = audio.current.duration / 100;
  audio.current.currentTime = parseInt(minUnitTime * value)
};

const Play = ({ dispatch,songDetail, lyricObj }) => {
  const [ isPause, setPause ] = useState(false); // 控制播放器是否暂停的state
  const [ isMute, setMute ] = useState(false); // 控制播放器是否静音的state
  const [ activeLine, setActiveLine ] = useState("lyric0"); // 当前正在播放的歌词的类名
  const [ currentTime, setCurrentTime ] = useState(0); // 当前播放时间
  const audio = useRef(null); // audio标签
  const lyricContent = useRef(null); // 歌词容器

  const id = window.location.search.split("=")[1];
  const {al = {}, ar = []} = songDetail;
  const {lyric} = lyricObj;
  const lrcTimeArr  = [];
  const minUnitTime = audio.current ? audio.current.duration / 100 : 0; // 第一次渲染时audio标签并未绑定上

  useEffect(()=>{
    audio.current.volume = 0.5; // 设置初始播放器音量为50
    // 请求歌曲详情
    dispatch({
      type:"playmusic/songDetail",
      payload:{
        ids: id
      }
    });
    // 请求歌词
    dispatch({
      type:"playmusic/getLyric",
      payload:{
        id
      }
    });
  },[]);
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
              // 判断是否为最后一个歌手
              (index + 1) === ar.length ?
                <span key={value.id}>{value.name}</span> :
                <span key={value.id}>{value.name}/</span>)}
          </h3>
        </div>
      </div>
      <div className="lyrics-display-box">
        <div className="lyrics-content" ref={lyricContent}>
          {formatLyric(lyric, lrcTimeArr, activeLine)}
        </div>
      </div>
      <div className="player">
        <Icon type="step-backward" />
        {isPause ?
          <Icon type="caret-right" onClick={()=>musicControl(audio, setPause, "pause")}/> :
          <Icon type="pause" onClick={()=>musicControl(audio, setPause, "pause")} />}
        <Icon type="step-forward" />
        <div className="slider-container">
          <Slider defaultValue={0}
                  value={Math.ceil(currentTime / minUnitTime)}
                  tooltipVisible={false}
                  onChange={value => changeTime(value, audio)} />
        </div>
        <div className="time-container">
          <span>{utils.formatTime(currentTime)} / {utils.unitTime(songDetail.dt)}</span>
        </div>
        <Icon type="download" />
        {isMute ?
          <i className="iconfont icon-jingyin" onClick={()=>musicControl(audio, setMute, "mute")}/>:
          <i className="iconfont icon-shengyin" onClick={()=>musicControl(audio, setMute, "mute")}/>
        }
        <div className="voice-container">
          <Slider defaultValue={50} disabled={false} onChange={ value => changeVoice(value, audio, setMute)} />
        </div>
      </div>
      <audio src={`https://music.163.com/song/media/outer/url?id=${id}.mp3`}
             autoPlay
             ref={audio}
             onTimeUpdate={e =>timeUpdate(e, lrcTimeArr, lyricContent, setActiveLine, setCurrentTime)}/>
    </div>
  )
};

const mapState = ({
                    songDetail_Reducer: songDetail = {},
                    getLyric_Reducer: lyricObj = {}
                  })=>({songDetail,lyricObj})
export default connect(mapState)(Play);
