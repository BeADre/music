import React, {useState, useEffect, useRef, useMemo, SyntheticEvent, ReactNode} from "react";
import {Icon, Slider, message} from "antd";
import {useDispatch, useSelector} from "react-redux";
import utils from "../../utils";
import "./index.scss";


function Play({history}: any) {
  const dispatch = useDispatch();
  const playmusic = useSelector(({playmusic}: any) => playmusic);
  const {song = {}, playlist = []} = playmusic;
  const {lyric, detail: songDetail = {}, urlData = {}} = song;
  const [controlProps, setControlProps] = useState({
    isPause: false, // 是否暂停
    isMute: false // 是否静音
  });
  const [songProps, setSongProps] = useState({
    activeLine: "lyric0", //  当前正在播放的歌词的类名(行数)
    currentTime: 0, // 当前播放时间
  });
  const [songId, setSongId] = useState(""); // 播放歌曲的ID
  const audio = useRef<HTMLAudioElement>(null); // audio标签
  const lyricContent = useRef<HTMLDivElement>(null); // 歌词容器

  const {id, isSong, isAlbum} = history.location.state || {};
  const {al = {}, ar = []} = songDetail;
  const lrcTimeArr: Array<number> = []; // 存放歌词时间的数组
  const minUnitTime = audio.current ? audio.current.duration / 100 : 0; // 第一次渲染时audio标签并未绑定上

  const memorizedLyric = useMemo(() => {
    if (!lyric) return null;
    const lyricArr: Array<any> = [];
    lyric.split("\n").forEach((value: string) => {
      if (value) {
        const arr = value.split("]");
        if (arr.length === 2 && arr[1]) {
          arr[0] = arr[0] + "]";
          lyricArr.push(arr);
        }
      }
    });
    return Object.fromEntries(lyricArr);
  }, [lyric]); // 缓存歌词

  const throttledFn = useMemo(() => utils.throttle(message.error, 3000), []);

  useEffect(() => {
    if (audio.current) audio.current.volume = 0.1; // 设置初始播放器音量为50
    if (isSong) {
      setSongId(id);
    } else if(isAlbum || id) {
      const type = isAlbum ? 'albumList' : 'playlistDetail' ;
      dispatch({
        type: `playmusic/${type}`,
        payload: {
          id
        },
        getDataTrick: (id: string) => {
          setSongId(id)
        }
      })
    }
  }, []);
  
  useEffect(() => {
    if(songId){
      dispatch({
        type: "playmusic/getSong",
        payload: {
          id: songId
        },
        getDataTrick: () => {
          setControlProps({...controlProps, ...{isPause: false}});
          setSongProps({
            activeLine: "lyric0",
            currentTime: 0,
          });
          (lyricContent.current as HTMLDivElement).style.transform = `translateY(250px)`;
        },
      });
    }
   
  }, [songId]);

  // 格式化歌词
  const formatLyric = (): null | Array<ReactNode> => {
    if (!memorizedLyric) return null;
    return Object.keys(memorizedLyric).map((value, index) => {
      lrcTimeArr.push(parseFloat(value.substr(1, 3)) * 60 + parseFloat(value.substring(4, 10)));
      return (
        <p 
          id={index === 0 ? "pEl" : undefined}
          key={value}
          className={songProps.activeLine === `lyric${index}` ? "on" : ""}
        >
            {memorizedLyric[value]}
        </p>
      )
    })
  };

  // 改变播放时间
  const timeUpdate = (e: SyntheticEvent<HTMLAudioElement>): void => {
    const {currentTime} = e.currentTarget;
    if(currentTime < lrcTimeArr[0]){
      setSongProps({activeLine: `lyric0`, currentTime});
    } else if(currentTime > lrcTimeArr[lrcTimeArr.length - 1]){
      setSongProps({activeLine: `lyric${lrcTimeArr.length - 1}`, currentTime});
    } else {
      const pEl = document.getElementById("pEl");
      const { height, marginBottom } = getComputedStyle((pEl as HTMLParagraphElement));
      for(let i = 0; i < lrcTimeArr.length; i++){
        if ((currentTime > lrcTimeArr[i] && currentTime < lrcTimeArr[i + 1])) {
          const distanceNum = parseFloat(((parseFloat(height) + parseFloat(marginBottom)) * i).toFixed(2));
          (lyricContent.current as HTMLDivElement).style.transform = `translateY(${250 - distanceNum}px)`;
          setSongProps({activeLine: `lyric${i}`, currentTime});
          break;
        }
      }
    }
    
  };

  /**
   * @param controlType {String} 需要改变的control类型
   */
  const musicControl = (controlType: string): void | boolean => {
    if(!history.location.state) return false;
    const {current} = audio;
    if (controlType === "pause") {
      if (!urlData.playable) {
        throttledFn("亲爱的,暂无版权");
        return false
      }
      (current as HTMLAudioElement).paused ? (current as HTMLAudioElement).play() : (current as HTMLAudioElement).pause();
      setControlProps({...controlProps, ...{isPause: (current as HTMLAudioElement).paused}})
    } else {
      (current as HTMLAudioElement).muted = !(current as HTMLAudioElement).muted;
      setControlProps({...controlProps, ...{isMute: (current as HTMLAudioElement).muted}})
    }
  };

  // 改变音量大小
  const changeVoice = (value: number): void => {
    const {current} = audio;
    (current as HTMLAudioElement).volume = value / 100;
    (current as HTMLAudioElement).muted = false;
    setControlProps({...controlProps, ...{isMute: false}});
  };

  // 改变播放时间
  const changeTime = (value: number): void | boolean => {
    const {current} = audio;
    if (!urlData.playable || isNaN(minUnitTime)) {
      throttledFn("亲爱的,暂无版权");
      return false
    }
    (current as HTMLAudioElement).currentTime = parseInt(`${minUnitTime * value}`)
  };
  const chooseSong = (value: any): void => {
    (audio.current as HTMLAudioElement).pause();
    setControlProps({...controlProps, ...{isPause: true}});
    setSongId(value.id);
  }
  // 切换下一曲
  const checkSong = (order: string): void | false => {
    if(!history.location.state) return false;
    if (isSong) {
      const {current} = audio;
      (current as HTMLAudioElement).currentTime = 0;
      (current as HTMLAudioElement).play();
      return false
    }
    const playIndex = playlist.findIndex((value: any) => value.id === songId);
    if (order === "next") {
      if (playIndex === playlist.length - 1) {
        chooseSong(playlist[0])
      } else {
        chooseSong(playlist[playIndex + 1])
      }
    } else {
      if (playIndex === 0) {
        chooseSong(playlist[playlist.length - 1])
      } else {
        chooseSong(playlist[playIndex - 1])
      }
    }
  };
  const clickMenu = () => {
    const songListEl = document.getElementById("songList");
     (songListEl as HTMLDivElement).style.right = 
      (songListEl as HTMLDivElement).style.right === "0px" ? "-350px" : "0px";
  }

  return (
    <div className="play-main-container">
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
            {formatLyric()}
          </div>
        </div>
        <div className="player">
          <div className="music-ctrl-container">
            <Icon type="step-backward" onClick={() => checkSong("last")}/>
            {(controlProps.isPause || !urlData.playable) ?
              <Icon type="caret-right" onClick={() => musicControl("pause")}/> :
              <Icon type="pause" onClick={() => musicControl("pause")}/>}
            <Icon type="step-forward" onClick={() => checkSong("next")}/>
          </div>
          <div className="playing-container">
            <div className="slider-container">
              <Slider defaultValue={0}
                      value={Math.ceil(songProps.currentTime / minUnitTime)}
                      tooltipVisible={false}
                      onChange={value => changeTime(value as number)}/>
            </div>
            <div className="time-container">
              <span>
                {utils.formatTime(songProps.currentTime)} / 
                {urlData.freeTrialInfo? 
                  utils.unitTime(urlData.freeTrialInfo) : 
                  utils.unitTime(songDetail.dt)}
              </span>
            </div>
          </div>
          <div className="voice-ctrl-container">
            {controlProps.isMute ?
              <i className="iconfont icon-jingyin" onClick={() => musicControl("mute")}/> :
              <i className="iconfont icon-shengyin" onClick={() => musicControl("mute")}/>
            }
            <div className="voice-container">
              <Slider defaultValue={50} disabled={false} onChange={value => changeVoice(value as number)}/>
            </div>
          </div>
          {isSong ? null : <Icon type="menu-unfold" onClick={clickMenu} />}
        </div>
        <audio src={urlData.url}
               autoPlay={true}
               ref={audio}
               onEnded={() => checkSong("next")}
               onTimeUpdate={e => timeUpdate(e)}/>
        {isSong ? null : <div className="songList" id="songList">
          {playlist.map((value: any, index: number) =>
            <div className="songItem" key={value.id}
                 onClick={() => chooseSong(value)}
            >
              <div className="songItemLeft">
                <span style={{width: 33}}>{index + 1}</span>
                <div className="leftName">
                  <span style={{color: songId === value.id ? "#31c27c" : "white"}}>{value.name}</span>
                  <span>{value.ar.map((value1: any, index1: number) =>
                    // 判断是否为最后一个歌手
                    (index1 + 1) === value.ar.length ?
                      <span key={value1.id} style={{fontSize: 12, color: "#b9b8b8"}}>{value1.name}</span> :
                      <span key={value1.id} style={{fontSize: 12, color: "#b9b8b8"}}>{value1.name}/</span>)}</span>
                </div>
              </div>
              <div style={{marginLeft: 20}}>

                <img
                  src={require("../../asset/wave.gif")}
                  style={{marginRight: 10, visibility: songId === value.id ? "visible" : "hidden"}}
                  alt=""
                />
              </div>
            </div>
          )}
        </div>}
      </div>
      <div className="bg-play" style={{backgroundImage: `url(${al.picUrl})`}}/>
    </div>

  )
}

export default Play;
