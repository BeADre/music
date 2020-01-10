import React, {useState, useEffect, useRef} from "react"
import {useSelector, useDispatch} from "react-redux";
import {Slider, Icon, Modal, Spin} from "antd";
import "./index.scss"
import utils from "../../utils";

function Mv({history}: any) {
  const dispatch = useDispatch();
  const mv = useSelector(({mv}: any) => mv);
  const {mvDetail = {}} = mv;
  const {artists = [], brs = {}} = mvDetail;
  const [controlState, setControlState] = useState({
    isMute: false,
    isPause: false,
    isFullscreen: false
  });
  const [videoState, setVideoState] = useState({
    currentTime: 0,
    isWaiting: false
  });
  const timer = useRef<number>(); // timeout的id
  const video = useRef<HTMLVideoElement>(null);
  const control = useRef<HTMLDivElement>(null); // audio标签
  const videoContainer = useRef<HTMLDivElement>(null);
  const {mvid = null} = history.location.state ? history.location.state : {};
  const minUnitTime = video.current ? video.current.duration / 100 : 0; // 第一次渲染时video标签并未绑定上


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
      const mouseMove = (): void => {
        let {style} = (control.current as HTMLDivElement);
        if (timer.current) {
          window.clearTimeout(timer.current);
          if (!style.opacity || style.opacity === "0") {
            style.opacity = "1";
          }
        }
        timer.current = window.setTimeout((): void => {
          style.opacity = "0";
        }, 1500);
      };

      const setSpin = (state: string): void => {
        const isWaiting = state === "waiting";
        setVideoState({...videoState, ...{isWaiting}});
      };

      document.addEventListener("fullscreenchange", changeScreenState);
      (videoContainer.current as HTMLDivElement).addEventListener("mousemove", mouseMove);
      (video.current as HTMLVideoElement).addEventListener('waiting', () => {
        setSpin("waiting");
      });
      (video.current as HTMLVideoElement).addEventListener('playing', () => {
        setSpin("playing");
      });
      return () => {
        document.removeEventListener("fullscreenchange", changeScreenState);
        (videoContainer.current as HTMLDivElement).removeEventListener("mousemove", mouseMove);
        (video.current as HTMLVideoElement).removeEventListener('waiting', () => {
          setSpin("waiting");
        });
        (video.current as HTMLVideoElement).removeEventListener('playing', () => {
          setSpin("playing");
        });
      };
    }
  }, [controlState.isFullscreen]);

  // 改变播放时间
  const changeTime = (value: number): void => {
    const {current} = video;
    (current as HTMLVideoElement).currentTime = parseInt(`${minUnitTime * value}`);
  };

  const videoControl = (controlType: string): void => {
    const {current} = video;
    const {current: current1} = videoContainer;
    if (current && current1) {
      console.log(current.buffered.end(0))
      if (controlType === "pause") {
        current.paused ? current.play() : current.pause();
        setControlState({...controlState, ...{isPause: current.paused}})
      } else if (controlType === "mute") {
        current.muted = !current.muted;
        setControlState({...controlState, ...{isMute: current.muted}})
      } else {
        if (controlState.isFullscreen) {
          document.exitFullscreen();
        } else {
          if (current1.requestFullscreen) {
            current1.requestFullscreen();
          }
        }
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

  return (
    <div className="mv-container">
      <div className="mv-bg" style={{backgroundImage: `url(${mvDetail.cover})`}}/>
      <Icon type="left" className="return" onClick={history.goBack}/>
      <div className="video-container" ref={videoContainer}>
        <Spin spinning={videoState.isWaiting} tip={"加载中..."}>
          <video
            ref={video}
            autoPlay={true}
            onEnded={() => setControlState({...controlState, ...{isPause: true}})}
            onTimeUpdate={e => setVideoState({...videoState, ...{currentTime: e.currentTarget.currentTime}})}
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
            <Slider defaultValue={0}
                    value={Math.ceil(videoState.currentTime / minUnitTime)}
                    tooltipVisible={false}
                    onChange={value => changeTime(value as number)}/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Mv
