import React, {useState, useEffect, useRef} from "react"
import {useSelector, useDispatch} from "react-redux";
import {Slider, Icon, message} from "antd";
import "./index.scss"

function Mv() {
  const dispatch = useDispatch();
  const [videoState, setVideoState] = useState({
    isMute: false,
    isPause: false,
    isFullscreen: false
  })
  const video = useRef<HTMLVideoElement>(null); // audio标签

  // 改变播放时间
  const changeTime = (value: number): void | boolean => {
    const {current} = video;


  };

  const videoControl = (controlType: string): void => {
    const {current} = video;
    if (controlType === "pause") {
      (current as HTMLVideoElement).paused ? (current as HTMLVideoElement).play() : (current as HTMLVideoElement).pause();
      setVideoState({...videoState, ...{isPause: (current as HTMLVideoElement).paused}})
    } else if(controlType === "mute"){
      (current as HTMLVideoElement).muted = !(current as HTMLVideoElement).muted;
      setVideoState({...videoState, ...{isMute: (current as HTMLVideoElement).muted}})
    }else {
      (current as HTMLVideoElement).muted = !(current as HTMLVideoElement).muted;
      if(videoState.isFullscreen){
        (current as HTMLVideoElement).webkitExitFullScreen();
      }else {
        (current as HTMLVideoElement).webkitEnterFullscreen();
      }
      setVideoState({...videoState, ...{isFullscreen: !videoState.isFullscreen}})
    }
  };

  // 改变音量大小
  const changeVoice = (value: number): void => {

  };

  return (
    <div className="mv-container">
      <div className="mv-bg"/>
      <video
        ref={video}
        autoPlay={true}
        src="http://vodkgeyttp8.vod.126.net/cloudmusic/obj/core/984441863/43f11466aba6dd787f367b0c0155fe6c.mp4?wsSecret=e796a761d951a135bdfde6f4bdc7b907&wsTime=1578473979"/>
      <div className="control-container">
        <h2 className="title">One and Only - 木村拓哉</h2>
        <div className="slider-container">
          <Slider defaultValue={0}
            // value={Math.ceil(songProps.currentTime / minUnitTime)}
                  value={0}
                  tooltipVisible={false}
                  onChange={value => changeTime(value as number)}/>
        </div>
        <div className="content">
          {videoState.isPause ?
            <Icon type="caret-right" className="pause" onClick={() => videoControl("pause")}/> :
            <Icon type="pause" className="pause" onClick={() => videoControl("pause")}/>
          }

          <span className="time">02:38/04:25</span>
          {videoState.isMute ?
            <i className="iconfont icon-jingyin" onClick={() => videoControl("mute")}/> :
            <i className="iconfont icon-shengyin" onClick={() => videoControl("mute")}/>
          }
          <div className="voice-container">
            <Slider defaultValue={50} disabled={false} onChange={value => changeVoice(value as number)}/>
          </div>
          {videoState.isFullscreen ?
            <Icon type="fullscreen-exit" className="fullscreen"
                  onClick={() => videoControl("fullscreen")}
            /> :
            <Icon type="fullscreen" className="fullscreen"
                  onClick={() => videoControl("fullscreen")}
            />
          }

        </div>
      </div>
    </div>
  )
}

export default Mv
