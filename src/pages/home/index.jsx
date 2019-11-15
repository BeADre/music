import React, {useState, useEffect, useRef, Fragment} from "react";
import {Carousel, Icon} from "antd";
import {connect} from "react-redux";
import utils from "../../utils";
import {newSongTab, mvTab} from "../../staticData/home";
import ChangeCarousel from "../../component/ChangeCarousel";
import "./index.scss"

const Home = ({home, history, dispatch}) => {
  const {playTab = [], playlist = [], newSong = [], newPlate = [], mv = []} = home
  const choosePlaylist = useRef(null);
  const chooseNewSong = useRef(null);
  const chooseNewPlate = useRef(null);
  const chooseMV = useRef(null);
  const [state, setState] = useState({
    tabColorIndexPlaylist: 0,
    tabColorIndexNewSong: 0,
    tabColorIndexMV: 0,
    newSongCat: 0,
    playlistCat: "",
    mvCat: "全部",
  })

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
  }, [])
  useEffect(() => {
    dispatch({
      type: "home/getPlaylist",
      payload: {
        cat: state.playlistCat,
        order: "hot",
        limit: 10
      }
    })
  }, [state.playlistCat])
  useEffect(() => {
    dispatch({
      type: "home/getNewSong",
      payload: {
        cat: state.newSongCat,
      }
    })
  }, [state.newSongCat])
  useEffect(() => {
    dispatch({
      type: "home/getMv",
      payload: {
        cat: state.mvCat,
      }
    })
  }, [state.mvCat])

  const getPlaylist = (colorName, catName, i, name) => {
    setState({
      ...state,
      ...{
        [colorName]: i,
        [catName]: name
      }
    })
  }

  const tab = (tabName, stateProps, valueProps) => {
    return <div className="tab">
      {tabName.map((value, index) =>
        <span
          key={value.id || index}
          onClick={() => getPlaylist(stateProps[0], stateProps[1], index, value[valueProps])}
          style={{color: index === state[stateProps[0]] ? "#31c27c" : ""}}
        >
            {value.name || value.title}
          </span>)
      }
    </div>
  }

  // 第一部分遍历的歌单推荐内容
  const playTabCarousel = () => {
    const copyPlaylist = [...playlist];
    const slideElementArr = [];
    let key = 1;
    while (copyPlaylist.length) {
      key++
      slideElementArr.push(
        <div className="slide" key={key}>
          {copyPlaylist.splice(0, 5).map(value => (
            <div key={value.id} className="slideContent">
              <div className="slideContent-top">
                <div className="slide-keep">
                  <span className="iconfont icon-ziyuan"/>
                </div>
                <img src={value.coverImgUrl} alt=""/>
              </div>
              <div className="slideContent-bot">
                <a href="">{value.name}</a>
                <p>播放量：{utils.unitCount(value.playCount)}</p>
              </div>
            </div>
          ))}
        </div>
      )
    }
    return slideElementArr
  }

  // 第二部分遍历的新歌内容
  const newSongCarousel = () => {
    const copyNewSong = [...newSong].splice(0, 45);
    const slideElementArr = [];
    let key = 1;
    while (copyNewSong.length) {
      key++
      slideElementArr.push(
        <div className="slide" key={key}>
          {copyNewSong.splice(0, 9).map((value) =>
            <div className="slideContent2" key={value.id}>
              <div className="slideContent-left" onClick={() => {
                history.push(`/playMusic?ids=${value.id}`)
              }}>
                <div className="slide-keep">
                  <span className="iconfont icon-ziyuan"/>
                </div>
                <img src={value.album.picUrl} alt=""/>
              </div>
              <div className="slideContent-right">
                <div className="right-detail">
                  <p>
                    <a href="#" title={value.name}>{value.name}</a>
                  </p>
                  <p>
                    {value.artists.map((artist, index) =>
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
  }

  // 第三部分遍历的歌单推荐内容
  const newPlateCarousel = () => {
    const copyNewPlate = [...newPlate];
    const slideElementArr = [];
    let key = 1;
    while (copyNewPlate.length) {
      key++
      slideElementArr.push(
        <div className="slide" key={key}>
          {copyNewPlate.splice(0, 10).map(value => (
            <div key={value.id} className="slideContent" style={{marginBottom: "20px"}}>
              <div className="slideContent-top">
                <div className="slide-keep">
                  <span className="iconfont icon-ziyuan"/>
                </div>
                <img src={value.picUrl} alt=""/>
              </div>
              <div className="slideContent-bot">
                <a href="" title={value.name} className="section-three-name">{value.name}</a>
                <div className="section-three-art">
                  {value.artists.map((artist, index) =>
                    <Fragment key={artist.id}>
                      <p>{artist.name}</p>
                      {index === value.artists.length - 1 ? "" : <span>&nbsp;&nbsp;/&nbsp;&nbsp;</span>}
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
  }

  // 第四部分遍历的歌单推荐内容
  const mvCarousel = () => {
    const copyMv = [...mv];
    const slideElementArr = [];
    let key = 1;
    while (copyMv.length) {
      key++
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
              <a href=""
                 title={value.name}
                 className="section-four-name">{value.name}</a>
              <p className="section-four-art">{value.artistName}</p>
              <p>
                <Icon type="video-camera"/>
                <span style={{marginLeft: "5px"}}>{utils.unitCount(value.playCount)}</span>
              </p>
            </div>
          </div>
        )}
      </div>)
    }
    return slideElementArr
  }

  const slideContainer = (refEle, mapFn) => {
    return <div className="slide-container">
      <ChangeCarousel refEle={refEle}/>
      <Carousel ref={refEle}>
        {mapFn()}
      </Carousel>
    </div>

  }
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
}

const mapState = (state) => (state);

export default connect(mapState)(Home);
