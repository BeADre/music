import React, {useState, useEffect, useRef, MutableRefObject} from "react"
import {useSelector, useDispatch} from "react-redux";
import {Slider, Icon} from "antd";
import "./index.scss"
import utils from "../../utils";

function Mv() {
  const dispatch = useDispatch();
  const mv = useSelector(({mv}: any) => mv);
  const {mvDetail = {}} = mv;
  const {artists = []} = mvDetail
  console.log(mvDetail)
  const [videoState, setVideoState] = useState({
    isMute: false,
    isPause: false,
    isFullscreen: false
  })
  const timer = useRef<any>(null);
  const video = useRef<HTMLVideoElement>(null);
  const control = useRef<HTMLDivElement>(null); // audio标签
  const videoContainer: any = useRef(null);
  const mvid = 10910157

  useEffect(() => {
    if (video.current) video.current.volume = 0.5; // 设置初始播放器音量为50
    dispatch({
      type: "mv/getDetail",
      payload: {
        mvid
      }
    })
  }, []);

  useEffect(() => {
    const changeScreenState = (): void => {
      setVideoState({...videoState, ...{isFullscreen: !!document.fullscreenElement}})
    }

    const mouseMove = (): void => {
      if (timer.current !== null) {
        window.clearTimeout(timer.current);
        (control.current as HTMLDivElement).style.opacity = "1";
      }
      timer.current = window.setTimeout((): void => {
        (control.current as HTMLDivElement).style.opacity = "0";
      }, 1500);
    }

    document.addEventListener("fullscreenchange", changeScreenState);
    videoContainer.current.addEventListener("mousemove", mouseMove);
    return () => {
      document.removeEventListener("fullscreenchange", changeScreenState);
      videoContainer.current.removeEventListener("mousemove", mouseMove);
    };
  }, [videoState.isFullscreen]);


  // 改变播放时间
  const changeTime = (value: number): void | boolean => {
    const {current} = video;


  };

  const videoControl = (controlType: string): void => {
    const {current} = video;
    if (controlType === "pause") {
      (current as HTMLVideoElement).paused ? (current as HTMLVideoElement).play() : (current as HTMLVideoElement).pause();
      setVideoState({...videoState, ...{isPause: (current as HTMLVideoElement).paused}})
    } else if (controlType === "mute") {
      (current as HTMLVideoElement).muted = !(current as HTMLVideoElement).muted;
      setVideoState({...videoState, ...{isMute: (current as HTMLVideoElement).muted}})
    } else {
      if (videoState.isFullscreen) {
        document.exitFullscreen();
        // console.log(window)
      } else {
        if (videoContainer.current.requestFullscreen) {
          videoContainer.current.requestFullscreen();
        } else if (videoContainer.current.webkitRequestFullScreen) {
          videoContainer.current.webkitRequestFullScreen();
        } else if (videoContainer.current.mozRequestFullScreen) {
          videoContainer.current.mozRequestFullScreen();
        } else {
          videoContainer.current.msRequestFullscreen();
        }
      }
    }
  };

  // 改变音量大小
  const changeVoice = (value: number): void => {
    const {current} = video;
    (current as HTMLVideoElement).volume = value / 100;
    (current as HTMLVideoElement).muted = false;
    setVideoState({...videoState, ...{isMute: false}});
  };

  return (
    <div className="mv-container">
      <div className="mv-bg" style={{backgroundImage: `url(${mvDetail.cover})`}}/>
      <div className="video-container" ref={videoContainer}>
        <video
          ref={video}
          autoPlay={true}
          src="http://vodkgeyttp8.vod.126.net/cloudmusic/obj/core/984441863/43f11466aba6dd787f367b0c0155fe6c.mp4?wsSecret=e386f9118449508340382e296bf5226d&wsTime=1578490939"/>
        <div className="control-container" ref={control}>
          <h2 className="title">
            {mvDetail.name}
            <span style={{margin: "0 8px"}}>-</span>
            {artists.map((value: any, index: number) =>
              // 判断是否为最后一个歌手
              (index + 1) === artists.length ?
                <span key={value.id}>{value.name}</span> :
                <span key={value.id}>{value.name}/</span>)}
          </h2>
          <div className="content">
            <div className="control-container-left">
              {videoState.isPause ?
                <Icon type="caret-right" className="pause" onClick={() => videoControl("pause")}/> :
                <Icon type="pause" className="pause" onClick={() => videoControl("pause")}/>
              }

              <span className="time">02:38 / {utils.unitTime(mvDetail.duration)}</span>
            </div>
            <div className="control-container-right">
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
          <div className="slider-container">
            <Slider defaultValue={0}
              // value={Math.ceil(songProps.currentTime / minUnitTime)}
                    value={0}
                    tooltipVisible={false}
                    onChange={value => changeTime(value as number)}/>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Mv
