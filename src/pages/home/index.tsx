import React, {useState, useEffect, useRef, Fragment, useMemo, ReactNode, RefObject} from "react";
import {Carousel, Icon} from "antd";
import {useSelector, useDispatch} from "react-redux";
import utils from "../../utils";
import {newSongTab, mvTab} from "../../staticData/home";
import ChangeCarousel from "../../component/ChangeCarousel";
import "./index.scss";

function Home({history}: any) {
  const dispatch = useDispatch();
  const home = useSelector(({home}: any) => home);
  const {playTab = [], playlist = [], newSong = [], newPlate = [], mv = []} = home;
  const choosePlaylist = useRef<Carousel>(null);
  const chooseNewSong = useRef<Carousel>(null);
  const chooseNewPlate = useRef<Carousel>(null);
  const chooseMV = useRef<Carousel>(null);
  const [state, setState]: any = useState({
    tabColorIndexPlaylist: 0,
    tabColorIndexNewSong: 0,
    tabColorIndexMV: 0,
    newSongCat: 0,
    playlistCat: "",
    mvCat: "全部",
  });

  useEffect(() => {
    dispatch({
      type: "home/getPlaylistTab"
    });
    dispatch({
      type: "home/getNewPlate",
      payload: {
        offset: 0,
        limit: 50
      }
    });
  }, []);
  useEffect(() => {
    dispatch({
      type: "home/getPlaylist",
      payload: {
        cat: state.playlistCat,
        order: "hot",
        limit: 10
      }
    })
  }, [state.playlistCat]);
  useEffect(() => {
    dispatch({
      type: "home/getNewSong",
      payload: {
        cat: state.newSongCat,
      }
    })
  }, [state.newSongCat]);
  useEffect(() => {
    dispatch({
      type: "home/getMv",
      payload: {
        cat: state.mvCat,
      }
    })
  }, [state.mvCat]);

  const getPlaylist = (colorName: string, catName: string, i: number, name: string): void => {
    setState({
      ...state,
      ...{
        [colorName]: i,
        [catName]: name
      }
    })
  };

  const tab = (tabName: Array<any>, stateProps: Array<string>) => {
    return <div className="tab">
      {tabName.map((value, index) =>
        <span
          key={value.id || index}
          onClick={() => getPlaylist(stateProps[0], stateProps[1], index, value[stateProps[2]])}
          style={{color: index === state[stateProps[0]] ? "#31c27c" : ""}}
        >
            {value.name || value.title}
          </span>)
      }
    </div>
  };

  // 第一部分遍历的歌单推荐内容
  const memorizedPlay = useMemo(() => {
    const copyPlaylist = [...playlist];
    const slideElementArr = [];
    let key = 1;
    while (copyPlaylist.length) {
      key++;
      slideElementArr.push(
        <div className="slide" key={key}>
          {copyPlaylist.splice(0, 5).map((value, index) => (
            <div key={index} className="slideContent">
              <div className="slideContent-top" onClick={() => utils.jumpToPlay(history, value.id, false)}>
                <div className="slide-keep">
                  <span className="iconfont icon-ziyuan"/>
                </div>
                <img src={value.coverImgUrl} alt=""/>
              </div>
              <div className="slideContent-bot">
                <span>{value.name}</span>
                <p>播放量：{utils.unitCount(value.playCount)}</p>
              </div>
            </div>
          ))}
        </div>
      )
    }
    return slideElementArr
  }, [JSON.stringify(playlist)]);

  // 第二部分遍历的新歌内容
  const memorizedSong = useMemo(() => {
    const copyNewSong = [...newSong].splice(0, 45);
    const slideElementArr = [];
    let key = 1;
    while (copyNewSong.length) {
      key++;
      slideElementArr.push(
        <div className="slide" key={key}>
          {copyNewSong.splice(0, 9).map((value) =>
            <div className="slideContent2" key={value.id}>
              <div className="slideContent-left" onClick={() => utils.jumpToPlay(history, value.id, true)}>
                <div className="slide-keep">
                  <span className="iconfont icon-ziyuan"/>
                </div>
                <img src={value.album.picUrl} alt=""/>
              </div>
              <div className="slideContent-right">
                <div className="right-detail">
                  <p>
                    <span onClick={() => utils.jumpToPlay(history, value.id, true)}>{value.name}</span>
                  </p>
                  <p>
                    {value.artists.map((artist: any, index: number) =>
                      <Fragment key={artist.id}>
                        <a>{artist.name}</a>
                        {index === value.artists.length - 1 ? "" : <span>&nbsp;&nbsp;/&nbsp;&nbsp;</span>}
                      </Fragment>
                    )}
                  </p>
                </div>
                <div className="song-time">{utils.unitTime(value.duration)}</div>
              </div>
            </div>
          )}
        </div>
      )
    }
    return slideElementArr
  }, [JSON.stringify(newSong)]);

  // 第三部分遍历的歌单推荐内容
  const memorizedPlate = useMemo(() => {
    const copyNewPlate = [...newPlate];
    const slideElementArr = [];
    let key = 1;
    while (copyNewPlate.length) {
      key++;
      slideElementArr.push(
        <div className="slide" key={key}>
          {copyNewPlate.splice(0, 10).map(value => (
            <div key={value.id} className="slideContent" style={{marginBottom: "20px"}}>
              <div className="slideContent-top" onClick={() => utils.jumpToPlay(history, value.id, false, true)}>
                <div className="slide-keep">
                  <span className="iconfont icon-ziyuan"/>
                </div>
                <img src={value.picUrl} alt=""/>
              </div>
              <div className="slideContent-bot">
                <span
                  onClick={() => utils.jumpToPlay(history, value.id, false, true)}
                  className="section-three-name"
                >
                  {value.name}
                </span>
                <div className="section-three-art">
                  {value.artists.map((artist: any, index: number) =>
                    <Fragment key={artist.id}>
                      {index === value.artists.length - 1 ? <p>{artist.name}</p> : <p>{artist.name}/</p>}
                    </Fragment>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )
    }
    return slideElementArr
  }, [JSON.stringify(newPlate)]);

  // 第四部分遍历的歌单推荐内容
  const memorizedMv = useMemo(() => {
    const copyMv = [...mv];
    const slideElementArr = [];
    let key = 1;
    while (copyMv.length) {
      key++;
      slideElementArr.push(<div className="slide" key={key}>
        {copyMv.splice(0, 10).map(value =>
          <div className="slideContent" key={value.id} style={{marginBottom: "20px"}}>
            <div className="slideContent-top">
              <div className="slide-keep">
                <span className="iconfont icon-ziyuan"/>
              </div>
              <img src={value.cover} alt=""/>
            </div>
            <div className="slideContent-bot">
              <span className="section-four-name">{value.name}</span>
              <p className="section-four-art">{value.artistName}</p>
              <p style={{marginTop: 20}}>
                <Icon type="video-camera"/>
                <span
                  style={{
                    marginLeft: "5px",
                    display: "inline",
                    cursor: "auto",
                    color: "#999"
                  }}
                >
                  {utils.unitCount(value.playCount)}
                </span>
              </p>
            </div>
          </div>
        )}
      </div>)
    }
    return slideElementArr
  }, [JSON.stringify(mv)]);

  const slideContainer = (refEle: RefObject<Carousel>, mapArr: Array<ReactNode | null>) => {
    return <div className="slide-container">
      <ChangeCarousel refEle={refEle}/>
      <Carousel ref={refEle}>
        {mapArr}
      </Carousel>
    </div>
  };

  return (
    <div className="home-container">
      <div className="recommend-playlist">
        <h1>歌单推荐</h1>
        {tab(playTab, ["tabColorIndexPlaylist", "playlistCat", "name"])}
        {slideContainer(choosePlaylist, memorizedPlay)}
      </div>

      <div className="new-song">
        <h1>新歌首发</h1>
        {tab(newSongTab, ["tabColorIndexNewSong", "newSongCat", "id"])}
        {slideContainer(chooseNewSong, memorizedSong)}
      </div>

      <div className="new-plate">
        <h1>新碟首发</h1>
        {slideContainer(chooseNewPlate, memorizedPlate)}
      </div>

      <div className="new-MV">
        <h1>MV</h1>
        {tab(mvTab, ["tabColorIndexMV", "mvCat", "name"])}
        {slideContainer(chooseMV, memorizedMv)}
      </div>
    </div>
  )
}

export default Home;
