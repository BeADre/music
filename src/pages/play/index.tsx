import React, {useState, useEffect, useRef, useMemo, SyntheticEvent, ReactNode} from "react";
import {Icon, Slider, message} from "antd";
import {connect} from "react-redux"
import utils from "../../utils"
import "./index.scss"

const Play = ({dispatch, playmusic = {}, history}: any) => {
  const {songDetail = {}, lyric = "", playlist = []} = playmusic; // lyric 歌词文本
  const [controlProps, setControlProps] = useState({
    isPause: false, // 是否暂停
    isMute: false // 是否静音
  });
  const [songProps, setSongProps] = useState({
    activeLine: "lyric0", //  当前正在播放的歌词的类名(行数)
    currentTime: 0, // 当前播放时间
  });
  const [songId, setSongId] = useState(""); // 播放歌曲的ID
  const [hasCopyright, setHasCopyright] = useState(undefined); // 播放歌曲是否有版权
  const audio = useRef<HTMLAudioElement>(null); // audio标签
  const lyricContent = useRef<HTMLDivElement>(null); // 歌词容器

  const {id, isSong} = history.location.state;
  const {al = {}, ar = []} = songDetail;
  const lrcTimeArr: Array<number> = []; // 存放歌词时间的数组
  const minUnitTime = audio.current ? audio.current.duration / 100 : 0; // 第一次渲染时audio标签并未绑定上

  const memoizedLyric = useMemo(() => {
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

  useEffect(() => {
    if (audio.current) audio.current.volume = 0.5; // 设置初始播放器音量为50
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
      if (hasCopyright === undefined) {
        dispatch({
          type: "playmusic/check",
          payload: {
            id: songId
          },
          setState: setHasCopyright
        });
      }
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

  // 格式化歌词
  const formatLyric = (): null | Array<ReactNode> => {
    if (!memoizedLyric) return null;
    return Object.keys(memoizedLyric).map((value, index) => {
      lrcTimeArr.push(parseFloat(value.substr(1, 3)) * 60 + parseFloat(value.substring(4, 10)));
      return <p key={value} className={songProps.activeLine === `lyric${index}` ? "on" : ""}>{memoizedLyric[value]}</p>;
    })
  };

  // 改变播放时间
  const timeUpdate = (e: SyntheticEvent<HTMLAudioElement>): void => {
    const {currentTime} = e.currentTarget;
    lrcTimeArr.forEach((value, index, arr) => {
      if ((currentTime > value && currentTime < arr[index + 1]) || currentTime > arr[arr.length - 1]) {
        (lyricContent.current as HTMLDivElement).style.transform = `translateY(${250 - 75 * index}px)`;
        setSongProps({activeLine: `lyric${index}`, currentTime});
      }
    });
  };

  /**
   *
   * @param controlType {String} 需要改变的control类型
   * @param hasCopyright {boolean} 歌曲是否授权
   */
  const musicControl = (controlType: string, hasCopyright?: boolean): void | boolean => {
    const {current} = audio;
    if (controlType === "pause") {
      if (!hasCopyright) {
        message.error("亲爱的,暂无版权");
        return false
      }
      (current as HTMLAudioElement).paused ? (current as HTMLAudioElement).play() : (current as HTMLAudioElement).pause();
      setControlProps({...controlProps, ...{isPause: (current as HTMLAudioElement).paused}})
    } else {
      if ((current as HTMLAudioElement).muted) {
        (current as HTMLAudioElement).volume = 0.5
      } else {
        (current as HTMLAudioElement).volume = 0
      }
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
    if (!hasCopyright) {
      message.error("亲爱的,暂无版权");
      return false
    }
    let minUnitTime: number = (current as HTMLAudioElement).duration / 100;
    if (isNaN(minUnitTime)) minUnitTime = 0;
    (current as HTMLAudioElement).currentTime = parseInt(`${minUnitTime * value}`)
  };

  // 切换下一曲
  const checkSong = (order: string): void | false => {
    if (isSong) {
      setSongProps({...songProps, ...{currentTime: 0}});
      const {current} = audio;
      (current as HTMLAudioElement).currentTime = 0;
      (current as HTMLAudioElement).play();
      return false
    }
    const playIndex = playlist.findIndex((value: any) => value.id === songId);
    if (order === "next") {
      if (playIndex === playlist.length - 1) {
        setSongId(playlist[0].id)
      } else {
        setSongId(playlist[playIndex + 1].id)
      }
    } else {
      if (playIndex === 0) {
        setSongId(playlist[playlist.length - 1].id)
      } else {
        setSongId(playlist[playIndex - 1].id)
      }
    }

  };


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
          {formatLyric()}
        </div>
      </div>
      <div className="player">
        <Icon type="step-backward" onClick={() => checkSong("last")}/>
        {(controlProps.isPause || !hasCopyright) ?
          <Icon type="caret-right" onClick={() => musicControl("pause", hasCopyright)}/> :
          <Icon type="pause" onClick={() => musicControl("pause", hasCopyright)}/>}
        <Icon type="step-forward" onClick={() => checkSong("next")}/>
        <div className="slider-container">
          <Slider defaultValue={0}
                  disabled={hasCopyright === false}
                  value={Math.ceil(songProps.currentTime / minUnitTime)}
                  tooltipVisible={false}
                  onChange={value => changeTime(value as number)}/>
        </div>
        <div className="time-container">
          <span>{utils.formatTime(songProps.currentTime)} / {utils.unitTime(songDetail.dt)}</span>
        </div>
        {controlProps.isMute ?
          <i className="iconfont icon-jingyin" onClick={() => musicControl("mute")}/> :
          <i className="iconfont icon-shengyin" onClick={() => musicControl("mute")}/>
        }
        <div className="voice-container">
          <Slider defaultValue={50} disabled={false} onChange={value => changeVoice(value as number)}/>
        </div>
      </div>
      <audio src={`https://music.163.com/song/media/outer/url?id=${songId}.mp3`}
             autoPlay={true}
             ref={audio}
             onEnded={() => checkSong("next")}
             onTimeUpdate={e => timeUpdate(e)}/>
      <div className="songList">
        <div style={{height: 84}}/>
        {playlist.map((value: any, index: number) =>
          <div className="songItem" key={value.id}
               onClick={() => {
                 setSongId(value.id);
                 setSongProps({...songProps, ...{currentTime: 0}})
               }}
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
              {/*<Icon type="delete" className="songItemDelete"/>*/}
            </div>
          </div>
        )}
        <div style={{height: 84}}/>
      </div>
    </div>
  )
};

const mapState = (state: any) => (state);

export default connect(mapState)(Play);
