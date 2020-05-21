import React, {useState, useEffect, Fragment, useMemo} from "react";
import {Icon, Select} from "antd";
import {useSelector, useDispatch} from "react-redux";
import utils from "../../utils";
import {newSongTab, mvTab} from "../../staticData/home";
import "./index.scss";

const {Option} = Select;

function Home({history}: any) {
  const dispatch = useDispatch();
  const home = useSelector(({home}: any) => home);
  const {playTab = [], playlist = [], newSong = [], newPlate = [], mv = []} = home;
  const [state, setState]: any = useState({
    newSongCat: 0,
    playlistCat: "全部",
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

  const getPlaylist = (catName: string, name: string): void => {
    setState({
      ...state,
      ...{
        [catName]: name
      }
    })
  };

  const tab = (tabName: Array<any>, stateProps: Array<string>, isFirst?: boolean) => {
    return <div className="tab" id={isFirst ? "tab" : ""}>
      {tabName.map(value =>
        <span
          key={value.id}
          onClick={() => getPlaylist(stateProps[0], value[stateProps[1]])}
          style={{color: value[stateProps[1]] === state[stateProps[0]] ? "#31c27c" : ""}}
        >
            {value.name}
          </span>)
      }
    </div>
  };
  const selectTab = (tabName: Array<any>, stateProps: Array<string>) => {
    return(
      <Select 
        value={state.playlistCat} 
        className="select-tab" 
        onChange={(value: any) => getPlaylist(stateProps[0], value)}
      >
        {tabName.map(value => 
          <Option value={value[stateProps[1]]} key={value.id}>{value.name}</Option>
        )}
      </Select>
    )};

  // 第二部分遍历的新歌内容
  const memorizedSong = useMemo(() => {
    const copyNewSong = [...newSong].splice(0, 30);
    const slideElementArr = [];
    let key = 1;
    while (copyNewSong.length) {
      key++;
      slideElementArr.push(
        <div style={{display: "inline-block", whiteSpace: 'nowrap'}} key={key}>
          <div className="slide">
            {copyNewSong.splice(0, 6).map((value) =>
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
        <div style={{display: "inline-block", whiteSpace: 'nowrap'}} key={key}>
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
      slideElementArr.push(
        <div style={{display: "inline-block", whiteSpace: 'nowrap'}} key={key}>
          <div className="slide" key={key}>
            {copyMv.splice(0, 10).map(value =>
              <div className="slideContent" key={value.id} style={{marginBottom: "20px"}}>
                <div className="slideContent-top" onClick={() => utils.jumpToMv(history, value.id)}>
                  <div className="slide-keep">
                    <span className="iconfont icon-ziyuan"/>
                  </div>
                  <img src={value.cover} alt=""/>
                </div>
                <div className="slideContent-bot">
                  <span className="section-four-name" onClick={() => utils.jumpToMv(history, value.id)}>{value.name}</span>
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
          </div>
        </div>
      )
    }
    return slideElementArr
  }, [JSON.stringify(mv)]);

  return (
    <div className="home-container">
      <div className="recommend-playlist">
        <div className="sm-tab-container">
          <h3>歌单推荐</h3>
          {selectTab(playTab, ["playlistCat", "name"])}
        </div>
        <div className="lg-tab-container">
          <h1>歌单推荐</h1>
          {tab(playTab, ["playlistCat", "name"], true)}
        </div>
        <div className="slide-container">
          {playlist.map((value: any, index: number) => (
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
      </div>

      <div className="new-song">
        <div className="sm-tab-container">
          <h3>新歌首发</h3>
          {selectTab(newSongTab, ["newSongTab", "id"])}
        </div>
        <div className="lg-tab-container">
          <h1>新歌首发</h1>
          {tab(newSongTab, ["newSongTab", "id"])}
        </div>
        <div className="slide-container">
          {memorizedSong}
        </div>
      </div>

      <div className="new-plate">
        <h1>新碟首发</h1>
        <div className="slide-container">
          {memorizedPlate}
        </div>
      </div>

      <div className="new-MV">
        <div className="sm-tab-container">
          <h3>MV</h3>
          {selectTab(mvTab, ["mvCat", "name"])}
        </div>
        <div className="lg-tab-container">
          <h1>MV</h1>
          {tab(mvTab, ["mvCat", "name"])}
        </div>
        <div className="slide-container">
          {memorizedMv}
        </div>
      </div>
    </div>
  )
}

export default Home;
