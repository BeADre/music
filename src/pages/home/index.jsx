import React, {useState, useEffect, useRef, Fragment} from "react"
import {Carousel,Icon} from "antd"
import usePlaylist from "../../customHook/usePlaylist"
import {connect} from "react-redux"
import utils from "../../utils"
import {newSongTab, mvTab} from "../../staticData/home"
import "./index.scss"

const Home = ({dispatch, history, tabState, playlistState, newSongState, newPlateState, mvState}) => {
  const {playTab = []} = tabState;
  const {playlist = []} = playlistState;
  const {newSong = []} = newSongState;
  const {newPlate = []} = newPlateState;
  const {mv = []} = mvState;
  const choosePlaylist = useRef(null);
  const chooseNewSong = useRef(null);
  const chooseNewPlate = useRef(null);
  const chooseMV = useRef(null);
  const [tabColorIndexPlaylist, setTabColorIndexPlaylist] = useState(0);
  const [playlistCat, setPlaylistCat] = useState("");
  const [tabColorIndexNewSong, setTabColorIndexNewSong] = useState(0);
  const [newSongCat, setNewSongCat] = useState(0);
  const [tabColorIndexMV, setTabColorIndexMV] = useState(0);
  const [mvCat, setMVCat] = useState("全部");

  useEffect(() => {
    dispatch({
      type: "home/getPlaylistTab"
    })
  }, [])

  // 自定义hook，切换不同的tab时请求数据
  usePlaylist({cat: playlistCat, index: 1, limit: 10, order: "hot", dispatch})

  usePlaylist({cat: newSongCat, index: 2, dispatch})

  usePlaylist({cat: mvCat, index: 3, dispatch})

  useEffect(() => {
    dispatch({
      type: "home/getNewPlate",
      payload: {
        offset: 0,
        limit: 50
      }
    })
  }, [])

  // 改变state从而触发自定义HOOK请求数据
  const getPlaylist = (setColorName, setCatName, i, name) => {
    setColorName(i)
    setCatName(name)
  }

  const goToPlayMusic = id => {
    history.push(`/playMusic?ids=${id}`);
  }

  const changeCarousel = ref => {
    return (
      <Fragment>
        <div className="prev-button">
          <span className="iconfont icon-shangyiye" onClick={() => ref.current.prev()}/>
        </div>
        <div className="next-button">
          <span className="iconfont icon-xiayiye" onClick={() => ref.current.next()}/>
        </div>
      </Fragment>
    )
  }

  // 第一部分遍历的歌单推荐内容
  const playTabCarousel = (start, end) => {
    return (
      <div className="slide">
        {playlist.slice(start, end).map(value => (
          <div key={value.id} className="slideContent">
            <div className="slideContent-top">
              <div className="slide-keep">
                <span className="iconfont icon-ziyuan"> </span>
              </div>
              <img src={value.coverImgUrl} alt=""/>
            </div>
            <div className="slideContent-bot">
              <a href="">{value.name}</a>
              <p>播放量：{unitCount(value.playCount)}</p>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // 第二部分遍历的新歌内容
  const newSongCarousel = (start, end) => {
    return (
      <div className="slide">
        {newSong.slice(start, end).map((value) =>
          <div className="slideContent2" key={value.id}>
            <div className="slideContent-left" onClick={()=>{goToPlayMusic(value.id)}}>
              <div className="slide-keep">
                <span className="iconfont icon-ziyuan"> </span>
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

  // 第三部分遍历的歌单推荐内容
  const newPlateCarousel = (start, end) => {
    return (
      <div className="slide">
        {newPlate.slice(start, end).map(value => (
          <div key={value.id} className="slideContent" style={{marginBottom: "20px"}}>
            <div className="slideContent-top">
              <div className="slide-keep">
                <span className="iconfont icon-ziyuan"> </span>
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

  // 第四部分遍历的歌单推荐内容
  const mvCarousel = (start, end) => {
    return (
      <div className="slide">
        {mv.slice(start, end).map(value =>
          <div className="slideContent" key={value.id} style={{marginBottom: "20px"}}>
            <div className="slideContent-top">
              <div className="slide-keep">
                <span className="iconfont icon-ziyuan"> </span>
              </div>
              <img src={value.cover} alt=""/>
            </div>
            <div className="slideContent-bot">
              <a href=""
                 title={value.name}
                 className="section-four-name">{value.name}</a>
              <p className="section-four-art">{value.artistName}</p>
              <p>
                <Icon type="video-camera" />
                <span style={{marginLeft:"5px"}}>{unitCount(value.playCount)}</span>
              </p>
            </div>
          </div>
        )}
      </div>
    )
  }

  const unitCount = count => {
    const len = `${count}`.length;
    switch (true) {
      case len < 5: return count;
      case 5 <= len <= 7: return `${(count/10000).toFixed(1)}万`;
      case 7 < len : return `${(count/10000).toFixed()}万`
    }
  }

  return (
    <div className="home-container">
      <div className="recommend-playlist">
        <h1>歌单推荐</h1>
        <div className="tab">
          {playTab.map((value, index) =>
            <span
              key={value.id || index}
              onClick={() => getPlaylist(setTabColorIndexPlaylist, setPlaylistCat, index, value.name)}
              style={{color: index === tabColorIndexPlaylist ? "#31c27c" : "#000"}}
            >
            {value.name || value.title}
          </span>)
          }
        </div>
        <div className="slide-container">
          {changeCarousel(choosePlaylist)}
          <Carousel ref={choosePlaylist}>
            {playTabCarousel(0, 5)}
            {playTabCarousel(5, 10)}
          </Carousel>
        </div>
      </div>

      <div className="new-song">
        <h1>新歌首发</h1>
        <div className="tab">
          {newSongTab.map((value, index) =>
            <span
              key={value.id || index}
              onClick={() => getPlaylist(setTabColorIndexNewSong, setNewSongCat, index, value.id)}
              style={{color: index === tabColorIndexNewSong ? "#31c27c" : "#000"}}
            >
            {value.name}
          </span>)
          }
        </div>
        <div className="slide-container">
          {changeCarousel(chooseNewSong)}
          <Carousel ref={chooseNewSong}>
            {newSongCarousel(0, 9)}
            {newSongCarousel(9, 18)}
            {newSongCarousel(18, 27)}
            {newSongCarousel(27, 36)}
          </Carousel>
        </div>
      </div>

      <div className="new-plate">
        <h1>新碟首发</h1>
        <div className="slide-container" style={{marginBottom: "20px"}}>
          {changeCarousel(chooseNewPlate)}
          <Carousel ref={chooseNewPlate}>
            {newPlateCarousel(0, 10)}
            {newPlateCarousel(10, 20)}
            {newPlateCarousel(20, 30)}
            {newPlateCarousel(30, 40)}
            {newPlateCarousel(40, 50)}
          </Carousel>
        </div>
      </div>

      <div className="new-MV">
        <h1>MV</h1>
        <div className="tab">
          {mvTab.map((value, index) =>
            <span
              key={value.id || index}
              onClick={() => getPlaylist(setTabColorIndexMV, setMVCat, index, value.name)}
              style={{color: index === tabColorIndexMV ? "#31c27c" : "#000"}}
            >
            {value.name}
          </span>)
          }
        </div>
        <div className="slide-container">
          {changeCarousel(chooseMV)}
          <Carousel ref={chooseMV}>
            {mvCarousel(0, 10)}
            {mvCarousel(10, 20)}
            {mvCarousel(20, 30)}
            {mvCarousel(30, 40)}
            {mvCarousel(40, 50)}
          </Carousel>
        </div>
      </div>
    </div>
  )
}

const mapState = ({
                    getPlaylistTab_Reducer: tabState,
                    getPlaylist_Reducer: playlistState,
                    getNewSong_Reducer: newSongState,
                    getNewPlate_Reducer: newPlateState,
                    getMv_Reducer: mvState
                  }) => ({tabState, playlistState, newSongState, newPlateState, mvState})

export default connect(mapState)(Home)
