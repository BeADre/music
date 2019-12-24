import React, {useState, useEffect, useRef} from "react";
import {Icon, Slider, message} from "antd";
import {connect} from "react-redux"
import utils from "../../utils"
import "./index.scss"

/**
 *
 * @param lyric  {String} 歌词文本
 * @param lrcTimeArr {Array} 存放歌词时间的数组
 * @param activeLine  {Number} 当前展示的行数
 * @returns {null|*[]}
 */
const formatLyric = (lyric: string, lrcTimeArr: Array<number>, activeLine: string) => {
  if (!lyric) return null;
  const lyricArr: Array<any> = [];
  lyric.split("\n").forEach(value => {
    if (value) {
      const arr = value.split("]");
      if (arr.length === 2 && arr[1]) {
        arr[0] = arr[0] + "]";
        lyricArr.push(arr);
      }
    }
  });
  const lrcJSON = Object.fromEntries(lyricArr);
  return Object.keys(lrcJSON).map((value, index) => {
    lrcTimeArr.push(parseFloat(value.substr(1, 3)) * 60 + parseFloat(value.substring(4, 10)));
    return <p key={value} className={activeLine === `lyric${index}` ? "on" : ""}>{lrcJSON[value]}</p>;
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
const timeUpdate =
  (
    e: any,
    lrcTimeArr: Array<number>,
    lyricContentRef: any,
    setActiveLine: any,
    setCurrentTime: any
  ): void => {
    const {currentTime} = e.currentTarget;
    setCurrentTime(currentTime);
    lrcTimeArr.some((value, index, arr) => {
      if ((currentTime > value && currentTime < arr[index + 1]) || currentTime > arr[arr.length - 1]) {
        lyricContentRef.current.style.transform = `translateY(${250 - 75 * index}px)`;
        setActiveLine(`lyric${index}`);
      }
    });
  };

/**
 *
 * @param audio {Object} audio标签的ref
 * @param setState {Function} 改变state的函数
 * @param controlType {String} 需要改变的control类型
 * @param hasCopyright {boolean} 歌曲是否授权
 */
const musicControl = (audio: any, setState: any, controlType: string, hasCopyright?: boolean): void|boolean => {
  const {current} = audio;
  if (controlType === "pause") {
    if(!hasCopyright){
      message.error("亲爱的,暂无版权");
      return false
    }
    current.paused ? current.play() : current.pause();
    setState(current.paused)
  } else {
    current.muted = !current.muted;
    setState(current.muted);
  }
};

// 改变音量大小
const changeVoice = (value: any, audio: any, setMute: any): void => {
  audio.current.volume = value / 100;
  audio.current.muted = false;
  setMute(false)
};

// 改变播放时间
const changeTime = (value: number, audio: any, hasCopyright: boolean | undefined): void | boolean => {
  if (!hasCopyright) {
    message.error("亲爱的,暂无版权");
    return false
  }
  const minUnitTime: number = audio.current.duration / 100;
  audio.current.currentTime = parseInt(`${minUnitTime * value}`)
};

const Play = ({dispatch, playmusic = {}, history}: any) => {
  const {songDetail = {}, lyric = "", playlist = []} = playmusic;
  const [isPause, setPause] = useState(false); // 控制播放器是否暂停的state
  const [isMute, setMute] = useState(false); // 控制播放器是否静音的state
  const [activeLine, setActiveLine] = useState("lyric0"); // 当前正在播放的歌词的类名
  const [currentTime, setCurrentTime] = useState(0); // 当前播放时间
  const [songId, setSongId] = useState(""); // 播放歌曲的ID
  const [hasCopyright, setHasCopyright] = useState(undefined); // 播放歌曲是否有版权
  const audio: any = useRef(null); // audio标签
  const lyricContent: any = useRef(null); // 歌词容器

  const {id, isSong} = history.location.state;
  const {al = {}, ar = []} = songDetail;
  const lrcTimeArr: Array<any> = [];
  const minUnitTime = audio.current ? audio.current.duration / 100 : 0; // 第一次渲染时audio标签并未绑定上

  useEffect(() => {
    audio.current.volume = 0.5; // 设置初始播放器音量为50
    if (isSong) {
      setSongId(id);
    } else {
      dispatch({
        type: "playmusic/playlistDetail",
        payload: {
          id
        },
        setState: setSongId
      })
    }
  }, []);
  useEffect(() => {
    // 请求歌曲详情
    if (hasCopyright === false) {
      message.error("亲爱的,暂无版权");
    }
    if (songId) {
      dispatch({
        type: "playmusic/check",
        payload: {
          id: songId
        },
        setState: setHasCopyright
      });
      if (hasCopyright) {
        dispatch({
          type: "playmusic/songDetail",
          payload: {
            ids: songId
          }
        });
        // 请求歌词
        dispatch({
          type: "playmusic/getLyric",
          payload: {
            id: songId
          }
        });
      }
    }
  }, [songId, hasCopyright]);
  return (
    <div className="play-container">
      <div className="artist-info-container">
        <Icon type="left" className="return" onClick={history.goBack}/>
        <div className="img">
          <img src={al.picUrl || ""} alt=""/>
        </div>
        <div className="info">
          <h2>{songDetail.name}</h2>
          <h3>
            {ar.map((value: any, index: number) =>
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
        <Icon type="step-backward"/>
        {(!isPause || !hasCopyright) ?
          <Icon type="caret-right" onClick={() => musicControl(audio, setPause, "pause", hasCopyright)}/> :
          <Icon type="pause" onClick={() => musicControl(audio, setPause, "pause", hasCopyright)}/>}
        <Icon type="step-forward"/>
        <div className="slider-container">
          <Slider defaultValue={0}
                  value={Math.ceil(currentTime / minUnitTime)}
                  tooltipVisible={false}
                  onChange={value => changeTime(value as number, audio, hasCopyright)}/>
        </div>
        <div className="time-container">
          <span>{utils.formatTime(currentTime)} / {utils.unitTime(songDetail.dt)}</span>
        </div>
        <a className="download-tag"
           href={`https://music.163.com/song/media/outer/url?id=${songId}.mp3`}>
          <Icon type="download"/>
        </a>
        {isMute ?
          <i className="iconfont icon-jingyin" onClick={() => musicControl(audio, setMute, "mute")}/> :
          <i className="iconfont icon-shengyin" onClick={() => musicControl(audio, setMute, "mute")}/>
        }
        <div className="voice-container">
          <Slider defaultValue={50} disabled={false} onChange={value => changeVoice(value, audio, setMute)}/>
        </div>
      </div>
      <audio src={`https://music.163.com/song/media/outer/url?id=${songId}.mp3`}
             autoPlay
             ref={audio}
             onTimeUpdate={e => timeUpdate(e, lrcTimeArr, lyricContent, setActiveLine, setCurrentTime)}/>
    </div>
  )
};

const mapState = (state: any) => (state);

export default connect(mapState)(Play);
