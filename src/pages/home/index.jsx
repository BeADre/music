import React, {useState, useEffect,createRef} from "react"
import { Carousel } from 'antd';
import {connect} from "react-redux"
import "./index.scss"

const Home = ({dispatch, tabState,playlistState}) => {
  const {playTab = []} = tabState;
  const {playlist  = []} = playlistState;
  const chooseIndex = createRef();
  const [tabColorIndex, setTabColorIndex] = useState(0);
  const [cat, setCat] = useState("");
  useEffect(() => {
    dispatch({
      type: "home/getPlaylistTab"
    })
  }, [])

  useEffect(() => {
    dispatch({
      type: "home/getPlaylist",
      payload: {
        cat
      }
    })
  }, [cat])
  const getPlaylist = (i,name) => {
    setTabColorIndex(i)
    setCat(name)
  }


  return (
    <div className="homeContainer">
      <h1>歌单推荐</h1>
      <div className="tab">
        {playTab.map((value, index) =>
          <span
            key={value.id || index}
            onClick={() => getPlaylist(index,value.name)}
            style={{color: index === tabColorIndex ? "#31c27c" : "#000"}}
          >
            {value.name || value.title}
          </span>)
        }
      </div>
      <div className="slide-container" style={{height:"410px"}}>
        <div className="prev-button">
          <span className="iconfont icon-shangyiye" onClick={() => chooseIndex.current.prev()}/>
        </div>
        <div className="next-button">
          <span className="iconfont icon-xiayiye" onClick={() => chooseIndex.current.next()}/>
        </div>

        <Carousel  ref={chooseIndex}>
          <div className="slide">
            {playlist.slice(0,5).map(value=>(
              <div  key={value.id} className="slideContent">
                <div className="slideContent-top">
                  <div className="slide-keep">
                    <span className="iconfont icon-ziyuan"> </span>
                  </div>
                  <img src={value.coverImgUrl} alt=""/>
                </div>
                <div className="slideContent-bot">
                  <a href="">{value.name}</a>
                  <p>播放量：{(value.playCount/10000).toFixed(1)}万</p>
                </div>
              </div>
            ))}
          </div>
          <div className="slide">
            {playlist.slice(5,10).map(value=>(
              <div  key={value.id} className="slideContent">
                <div className="slideContent-top">
                  <div className="slide-keep">
                    <span className="iconfont icon-ziyuan"> </span>
                  </div>
                  <img src={value.coverImgUrl} alt=""/>
                </div>
                <div className="slideContent-bot">
                  <a href="">{value.name}</a>
                  <p>播放量：{(value.playCount/10000).toFixed(1)}万</p>
                </div>
              </div>
            ))}
          </div>
        </Carousel>
      </div>
    </div>
  )
}

const mapState = ({getPlaylistTab_Reducer: tabState,getPlaylist_Reducer:playlistState}) => ({tabState,playlistState})
//const mapState = (state) => (state)

export default connect(mapState)(Home)
