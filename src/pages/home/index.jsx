import React, {useState, useEffect, useRef, Fragment} from "react"
import {Carousel} from "antd"
import usePlaylist from "../../customHook/usePlaylist"
import {connect} from "react-redux"
import {newSongTab} from "../../staticData/home"
import "./index.scss"

const Home = ({dispatch, tabState, playlistState,newSongState}) => {
  const {playTab = []} = tabState;
  const {playlist = []} = playlistState;
  const {newSong = []} = newSongState;
  const choosePlaylist = useRef(null);
  const chooseNewSong = useRef(null);
  const [tabColorIndexPlaylist, setTabColorIndexPlaylist] = useState(0);
  const [playlistCat, setPlaylistCat] = useState("");
  const [tabColorIndexNewSong, setTabColorIndexNewSong] = useState(0);
  const [newSongCat, setNewSongCat] = useState(0);
  useEffect(() => {
    dispatch({
      type: "home/getPlaylistTab"
    })
  }, [])

  usePlaylist({cat: playlistCat, index: 1, limit: 10, order: "hot", dispatch})
  usePlaylist({cat: newSongCat, index: 2, dispatch})

  const getPlaylist = (setColorName, setCatName, i, name) => {
    setColorName(i)
    setCatName(name)
  }


  // 第一部分遍历的歌单推荐内容
  const playTabCarousel = (start,end)=>{
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
              <p>播放量：{(value.playCount / 10000).toFixed(1)}万</p>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // 第二部分遍历的新歌内容
  const newSongCarousel = (start,end)=>{
    return (
      <div className="slide">
        {newSong.slice(start,end).map((value) =>
          <div  className="slideContent2" key={value.id}>
            <div className="slideContent-left">
              <div className="slide-keep">
                <span className="iconfont icon-ziyuan"> </span>
              </div>
              <img src={value.album.picUrl} alt=""/>
            </div>
            <div className="slideContent-right">
              <div className="right-detail">
                <p>
                  <a href="#">{value.name}</a>
                </p>
                <p>
                  {value.artists.map((artist,index)=>
                    <Fragment key={artist.id}>
                      <a href="">{artist.name}</a>
                      {index === value.artists.length - 1 ? "": <span>&nbsp;&nbsp;/&nbsp;&nbsp;</span>}
                    </Fragment>
                  )}
                </p>
              </div>
              <div className="song-time">{unitTime(value.duration)}</div>
            </div>
          </div>
        )}

      </div>
    )
  }


  const unitTime = time => {
    let minute = new Date(time).getMinutes();
    let second = new Date(time).getSeconds();
    minute = minute < 10 ? `0${minute}`: `${minute}` ;
    second = second < 10 ? `0${second}`: `${second}` ;
    return `${minute}:${second}`
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
        <div className="slide-container" style={{height: "410px"}}>
          <div className="prev-button">
            <span className="iconfont icon-shangyiye" onClick={() => choosePlaylist.current.prev()}/>
          </div>
          <div className="next-button">
            <span className="iconfont icon-xiayiye" onClick={() => choosePlaylist.current.next()}/>
          </div>
          <Carousel ref={choosePlaylist}>
            {playTabCarousel(0,5)}
            {playTabCarousel(5,10)}
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
        <div className="slide-container" >
          <div className="prev-button">
            <span className="iconfont icon-shangyiye" onClick={() => chooseNewSong.current.prev()}/>
          </div>
          <div className="next-button">
            <span className="iconfont icon-xiayiye" onClick={() => chooseNewSong.current.next()}/>
          </div>
          <Carousel ref={chooseNewSong}>
            {newSongCarousel(0,9)}
            {newSongCarousel(9,18)}
            {newSongCarousel(18,27)}
            {newSongCarousel(27,36)}
          </Carousel>

        </div>
      </div>
    </div>
  )
}

const mapState = ({
                    getPlaylistTab_Reducer: tabState,
                    getPlaylist_Reducer: playlistState,
                    getNewSong_Reducer:newSongState
                  }) => ({tabState, playlistState,newSongState})
//const mapState = (state) => (state)

export default connect(mapState)(Home)
