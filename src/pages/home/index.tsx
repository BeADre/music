import React, {useState, useEffect, useRef, Fragment} from "react";
import {Carousel, Icon} from "antd";
import {connect} from "react-redux";
import utils from "../../utils";
import {newSongTab, mvTab} from "../../staticData/home";
import ChangeCarousel from "../../component/ChangeCarousel";
import "./index.scss"

const Home = ({home = {}, history, dispatch}: any) => {
  const {playTab = [], playlist = [], newSong = [], newPlate = [], mv = []} = home;
  const choosePlaylist = useRef<HTMLElement | null>(null);
  const chooseNewSong = useRef<HTMLElement | null>(null);
  const chooseNewPlate = useRef<HTMLElement | null>(null);
  const chooseMV = useRef<HTMLElement | null>(null);
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

  const jumpToPlay = (id: string, isSong: boolean, isAlbum?: boolean): void => {
    history.push({
      pathname: "/playMusic",
      state: {
        isAlbum,
        isSong,
        id
      }
    })
  };

  // 第一部分遍历的歌单推荐内容
  const playTabCarousel = () => {
    const copyPlaylist = [...playlist];
    const slideElementArr = [];
    let key = 1;
    while (copyPlaylist.length) {
      key++;
      slideElementArr.push(
        <div className="slide" key={key}>
          {copyPlaylist.splice(0, 5).map((value, index) => (
            <div key={index} className="slideContent">
              <div className="slideContent-top" onClick={() => jumpToPlay(value.id, false)}>
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
  };

  // 第二部分遍历的新歌内容
  const newSongCarousel = () => {
    const copyNewSong = [...newSong].splice(0, 45);
    const slideElementArr = [];
    let key = 1;
    while (copyNewSong.length) {
      key++;
      slideElementArr.push(
        <div className="slide" key={key}>
          {copyNewSong.splice(0, 9).map((value) =>
            <div className="slideContent2" key={value.id}>
              <div className="slideContent-left" onClick={() => jumpToPlay(value.id, true)}>
                <div className="slide-keep">
                  <span className="iconfont icon-ziyuan"/>
                </div>
                <img src={value.album.picUrl} alt=""/>
              </div>
              <div className="slideContent-right">
                <div className="right-detail">
                  <p>
                    <span onClick={() => jumpToPlay(value.id, true)}>{value.name}</span>
                  </p>
                  <p>
                    {value.artists.map((artist: any, index: number) =>
                      <Fragment key={artist.id}>
                        <a href="">{artist.name}</a>
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
  };

  // 第三部分遍历的歌单推荐内容
  const newPlateCarousel = () => {
    const copyNewPlate = [...newPlate];
    const slideElementArr = [];
    let key = 1;
    while (copyNewPlate.length) {
      key++;
      slideElementArr.push(
        <div className="slide" key={key}>
          {copyNewPlate.splice(0, 10).map(value => (
            <div key={value.id} className="slideContent" style={{marginBottom: "20px"}}>
              <div className="slideContent-top" onClick={() => jumpToPlay(value.id, false, true)}>
                <div className="slide-keep">
                  <span className="iconfont icon-ziyuan"/>
                </div>
                <img src={value.picUrl} alt=""/>
              </div>
              <div className="slideContent-bot">
                <span
                  onClick={() => jumpToPlay(value.id, false, true)}
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
  };

  // 第四部分遍历的歌单推荐内容
  const mvCarousel = () => {
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
  };

  const slideContainer = (refEle: any, mapFn: Function) => {
    return <div className="slide-container">
      <ChangeCarousel refEle={refEle}/>
      <Carousel ref={refEle}>
        {mapFn()}
      </Carousel>
    </div>

  };
  return (
    <div className="home-container">
      <div className="recommend-playlist">
        <h1>歌单推荐</h1>
        {tab(playTab, ["tabColorIndexPlaylist", "playlistCat", "name"])}
        {slideContainer(choosePlaylist, playTabCarousel)}
      </div>

      <div className="new-song">
        <h1>新歌首发</h1>
        {tab(newSongTab, ["tabColorIndexNewSong", "newSongCat", "id"])}
        {slideContainer(chooseNewSong, newSongCarousel)}
      </div>

      <div className="new-plate">
        <h1>新碟首发</h1>
        {slideContainer(chooseNewPlate, newPlateCarousel)}
      </div>

      <div className="new-MV">
        <h1>MV</h1>
        {tab(mvTab, ["tabColorIndexMV", "mvCat", "name"])}
        {slideContainer(chooseMV, mvCarousel)}
      </div>
    </div>
  )
};

const mapState = (state: any) => (state);

export default connect(mapState)(Home);
