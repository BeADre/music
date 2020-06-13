import React, {useState, useEffect, useRef} from "react"
import {useSelector, useDispatch} from "react-redux";
import {Slider, Icon, Modal, Spin} from "antd";
import "./index.less"
import PlaySlider from "../../component/PlaySlider"
import utils from "../../utils";

const mobileFullscreenStyle = {
  transform: "rotate(90deg)",
  width: "80vh",
  display: "none"
};
const mobileNormalStyle = {
  transform: "rotate(0deg)",
  width: "90%",
  display: "block"
};
function Mv({history}: any) {
  const dispatch = useDispatch();
  const mv = useSelector(({mv}: any) => mv);
  const {mvDetail = {}} = mv;
  const {artists = [], brs = {}} = mvDetail;
  const [controlState, setControlState] = useState({
    isMute: false,
    isPause: true,
    isFullscreen: false
  });
  const [videoState, setVideoState] = useState({
    currentTime: 0,
    isWaiting: false,
    bufferTimeValue: 0 // 缓冲时长比例
  });
  const video = useRef<HTMLVideoElement>(null); // video标签
  const control = useRef<HTMLDivElement>(null); // video控制器标签
  const videoContainer = useRef<HTMLDivElement>(null); // control-container
  const {mvid = null} = history.location.state ? history.location.state : {};
  const minUnitTime = video.current ? video.current.duration / 100 : 0; // 最小段的播放时间
  useEffect(() => {
    if (video.current) video.current.volume = 0.5; // 设置初始播放器音量为50
    if (mvid) {
      dispatch({
        type: "mv/getDetail",
        payload: {
          mvid
        }
      });
    } else {
      Modal.error({
        title: '提示',
        content: '求求惹了，别直接从url地址跳过来，拿不到id',
      });
    }
  }, []);

  useEffect(() => {
    if (mvid) {
      const changeScreenState = (): void => {
        setControlState({...controlState, ...{isFullscreen: !!document.fullscreenElement}});
      };
      document.addEventListener("fullscreenchange", changeScreenState);
      return () => {
        document.removeEventListener("fullscreenchange", changeScreenState);
      };
    }
  }, [controlState.isMute, controlState.isPause, controlState.isFullscreen]);

  const handleClick = (event: any): void => {
    if(event.target.className) return;
    let {style} = (control.current as HTMLDivElement);
    style.visibility = style.visibility === "visible" ? "hidden" : "visible";
    style.opacity = style.opacity === "1" ? "0" : "1";
  };

  const setSpin = (state: string): void => {
    const isWaiting = state === "waiting";
    setVideoState({...videoState, ...{isWaiting}});
  };

  // 改变播放时间
  const changeTime = (value: number): void => {
    const {current} = video;
    (current as HTMLVideoElement).currentTime = parseInt(`${minUnitTime * value}`);
  };
  const fullScreen = (): void => {
    const width = document.body.offsetWidth;
    const {current} = videoContainer;

    if (width <= 768) {
      const returnEl = document.querySelector(".anticon-left");
      const style = controlState.isFullscreen ? mobileNormalStyle : mobileFullscreenStyle;
      (current as HTMLDivElement).style.transform = style.transform;
      (current as HTMLDivElement).style.width = style.width;
      (returnEl as HTMLBaseElement).style.display = style.display;
      setControlState({...controlState, ...{isFullscreen: !controlState.isFullscreen}});
    } else {
      if (controlState.isFullscreen) {
        document.exitFullscreen();
      } else {
        (current as HTMLDivElement).requestFullscreen && (current as HTMLDivElement).requestFullscreen();
      }
    }
  }
  const videoControl = (controlType: string): void => {
    const {current} = video;
    const {current: current1} = videoContainer;
    if (current && current1) {
      if (controlType === "pause") {
        current.paused ? current.play() : current.pause();
        setControlState({...controlState, ...{isPause: current.paused}});
      } else if (controlType === "mute") {
        current.muted = !current.muted;
        setControlState({...controlState, ...{isMute: current.muted}});
      } else {
        fullScreen()
      }
    }
  };

  // 改变音量大小
  const changeVoice = (value: number): void => {
    const {current} = video;
    if (current) {
      current.volume = value / 100;
      current.muted = false;
      setControlState({...controlState, ...{isMute: false}});
    }
  };

  const bufferEvent = () => {
    const {current} = video;
    if (current) {
      try {
        const bufferTimeValue = Math.ceil(current.buffered.end(0) / current.duration * 100);
        setVideoState({...videoState, ...{bufferTimeValue}});
      } catch (e) {

      }
    }
  };

  return (
    <div className="mv-container" onDragOver={(e) => e.preventDefault()}>
      <div className="mv-bg" style={{backgroundImage: `url(${mvDetail.cover})`}}/>
      <Icon type="left" className="return" onClick={history.goBack} />
      <div className="video-container" ref={videoContainer} onClick={handleClick}>
        <Spin spinning={videoState.isWaiting} tip={"加载中..."}>
          <video
            ref={video}
            onWaiting={() => setSpin("waiting")}
            playsInline={true}
            preload={"auto"}
            onProgress={() => bufferEvent()}
            onPlaying={() => setSpin("playing")}
            onEnded={() => setControlState({...controlState, ...{isPause: true}})}
            onTimeUpdate={e => {
              setVideoState({...videoState, ...{currentTime: e.currentTarget.currentTime}})
            }}
            src={brs["1080"] || brs["720"] || brs["480"] || brs["240"]}
          />
        </Spin>
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
              {controlState.isPause ?
                <Icon type="caret-right" className="pause" onClick={() => videoControl("pause")}/> :
                <Icon type="pause" className="pause" onClick={() => videoControl("pause")}/>
              }
              <span
                className="time">{utils.formatTime(videoState.currentTime)} / {utils.unitTime(mvDetail.duration)}</span>
            </div>
            <div className="control-container-right">
              {controlState.isMute ?
                <i className="iconfont icon-jingyin" onClick={() => videoControl("mute")}/> :
                <i className="iconfont icon-shengyin" onClick={() => videoControl("mute")}/>
              }
              <div className="voice-container">
                <Slider defaultValue={50} disabled={false} onChange={value => changeVoice(value as number)}/>
              </div>
              {controlState.isFullscreen ?
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
            <PlaySlider
              bufferTimeValue={videoState.bufferTimeValue}
              playWidth={(videoState.currentTime / minUnitTime).toFixed(2)}
              onChange={changeTime}
              video={video.current}
              isFullscreen={controlState.isFullscreen}
              control={control}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Mv
