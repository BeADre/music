import React, {useState, useEffect, useRef} from "react"
import {Carousel} from "antd"
import usePlaylist from "../../customHook/usePlaylist"
import {connect} from "react-redux"
import {newSongTab} from "../../staticData/home"
import "./index.scss"

const Home = ({dispatch, tabState, playlistState}) => {
  const {playTab = []} = tabState;
  const {playlist = []} = playlistState;
  const chooseIndex = useRef(null);
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

  return (
    <div className="homeContainer">
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
            <span className="iconfont icon-shangyiye" onClick={() => chooseIndex.current.prev()}/>
          </div>
          <div className="next-button">
            <span className="iconfont icon-xiayiye" onClick={() => chooseIndex.current.next()}/>
          </div>

          <Carousel ref={chooseIndex}>
            <div className="slide">
              {playlist.slice(0, 5).map(value => (
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
            <div className="slide">
              {playlist.slice(5, 10).map(value => (
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
          </Carousel>
        </div>
      </div>
      <div className="new-song">
        <h1>新歌首发</h1>
        <div className="tab">
          {newSongTab.map((value, index) =>
            <span
              key={value.id}
              onClick={() => getPlaylist(setTabColorIndexNewSong, setNewSongCat, index, value.id)}
              style={{color: index === tabColorIndexNewSong ? "#31c27c" : "#000"}}
            >
            {value.name}
          </span>)
          }
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
