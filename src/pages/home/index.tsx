import React, { useState, useEffect, Fragment, useMemo } from "react";
import { Icon, Select } from "antd";
import { useSelector, useDispatch } from "react-redux";
import utils from "../../utils";
import { newSongTab, mvTab, albumTab } from "../../staticData/home";
import "./index.scss";

const { Option } = Select;

function Home({ history }: any) {
  const dispatch = useDispatch();
  const home = useSelector(({ home }: any) => home);
  const {
    playTab = [],
    playlist = [],
    newSong = [],
    newPlate = [],
    mv = [],
  } = home;
  const [state, setState]: any = useState({
    newSongCat: 0,
    albumCat: "ALL",
    playlistCat: "全部",
    mvCat: "全部",
  });
  useEffect(() => {
    dispatch({
      type: "home/getPlaylistTab",
    });
  }, []);
  useEffect(() => {
    dispatch({
      type: "home/getPlaylist",
      payload: {
        cat: state.playlistCat,
        order: "hot",
        limit: 10,
      },
    });
  }, [state.playlistCat]);
  useEffect(() => {
    dispatch({
      type: "home/getNewSong",
      payload: {
        cat: state.newSongCat,
      },
    });
  }, [state.newSongCat]);
  useEffect(() => {
    dispatch({
      type: "home/getNewPlate",
      payload: {
        type: state.albumCat,
        limit: 10,
      },
    });
  }, [state.albumCat]);

  useEffect(() => {
    dispatch({
      type: "home/getMv",
      payload: {
        cat: state.mvCat,
      },
    });
  }, [state.mvCat]);

  const getPlaylist = (catName: string, name: string): void => {
    setState({
      ...state,
      ...{
        [catName]: name,
      },
    });
  };

  const tab = (
    tabName: Array<any>,
    stateProps: Array<string>,
    isFirst?: boolean
  ) => {
    return (
      <div className="tab" id={isFirst ? "tab" : ""}>
        {tabName.map((value) => (
          <span
            key={value.id}
            onClick={() => getPlaylist(stateProps[0], value[stateProps[1]])}
            style={{
              color:
                value[stateProps[1]] === state[stateProps[0]] ? "#31c27c" : "",
            }}
          >
            {value.name}
          </span>
        ))}
      </div>
    );
  };
  const selectTab = (tabName: Array<any>, stateProps: Array<string>) => {
    return (
      <Select
        value={state.playlistCat}
        className="select-tab"
        onChange={(value: any) => getPlaylist(stateProps[0], value)}
      >
        {tabName.map((value) => (
          <Option value={value[stateProps[1]]} key={value.id}>
            {value.name}
          </Option>
        ))}
      </Select>
    );
  };

  const handleScroll = (e: any) => {
    const {scrollLeft} = e.target;
    const slideContentNodeList = document.getElementsByClassName("slide-content2");
    const {width} = getComputedStyle(slideContentNodeList[0]);
    const slideBlockCol = Math.ceil(scrollLeft / parseFloat(width));
    const simplifyCol = slideBlockCol % 3;
    const slideBlock = slideBlockCol > 3 ? 3 : 2;
    const imgOrderArr = simplifyCol === 1 ? [1, 4, 7, 10] : 
      simplifyCol === 2 ? [2, 5, 8, 11] : [3, 6, 9, 12];
    imgOrderArr.forEach(value => {
      const imgEl = document.getElementById(`${slideBlock}${value}`);
      (imgEl as HTMLImageElement).src = 
        (imgEl as HTMLImageElement).getAttribute('data-src') || "";
    })
  }
  
  const throttleScroll = utils.throttle(handleScroll, 500);
  const printScroll = (e: React.UIEvent<HTMLDivElement>) => {
      e.persist();
      throttleScroll(e);
  };
  
  // 第二部分遍历的新歌内容
  const memorizedSong = useMemo(() => {
    const copyNewSong = [...newSong].splice(0, 36);
    const slideElementArr = [];
    let key = 0;
    while (copyNewSong.length) {
      key++;
      const element = (
        <div
          style={{ display: "inline-block", whiteSpace: "nowrap" }}
          key={key}
        >
          <div className="slide">
            {/* eslint-disable-next-line no-loop-func */}
            {copyNewSong.splice(0, 12).map((value,index) => (
              <div className="slide-content2" key={value.id}>
                <div
                  className="slide-content-left"
                  onClick={() => utils.jumpToPlay(history, value.id, true)}
                >
                  <div className="slide-keep">
                    <span className="iconfont icon-ziyuan" />
                  </div>
                  <img 
                    src={key === 1 ? value.album.picUrl : ""} 
                    id={`${key}${index + 1}`}
                    data-src={value.album.picUrl}
                    alt="" 
                  />
                </div>
                <div className="slide-content-right">
                  <div className="right-detail">
                    <p>
                      <span
                        onClick={() =>
                          utils.jumpToPlay(history, value.id, true)
                        }
                      >
                        {value.name}
                      </span>
                    </p>
                    <p>
                      {value.artists.map((artist: any, index: number) => (
                        <Fragment key={artist.id}>
                          <a>{artist.name}</a>
                          {index === value.artists.length - 1 ? (
                            ""
                          ) : (
                            <span>&nbsp;&nbsp;/&nbsp;&nbsp;</span>
                          )}
                        </Fragment>
                      ))}
                    </p>
                  </div>
                  <div className="song-time">
                    {utils.unitTime(value.duration)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
      slideElementArr.push(element);
    }
    return slideElementArr;
  }, [JSON.stringify(newSong)]);

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
            <div key={index} className="slide-content">
              <div
                className="slide-content-top"
                onClick={() => utils.jumpToPlay(history, value.id, false)}
              >
                <div className="slide-keep">
                  <span className="iconfont icon-ziyuan" />
                </div>
                <img src={value.coverImgUrl} alt="" />
              </div>
              <div className="slide-content-bot">
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
        <div 
          className="slide-container slide-container-2"
          onScroll={printScroll}
        >
          {memorizedSong}
        </div>
      </div>

      <div className="new-plate">
        <div className="sm-tab-container">
          <h3>新碟首发</h3>
          {selectTab(albumTab, ["albumCat", "id"])}
        </div>
        <div className="lg-tab-container">
          <h1>新碟首发</h1>
          {tab(albumTab, ["albumCat", "id"])}
        </div>
        <div className="slide-container">
          {newPlate.map((value: any) => (
            <div
              key={value.id}
              className="slide-content"
              style={{ marginBottom: "20px" }}
            >
              <div
                className="slide-content-top"
                onClick={() => utils.jumpToPlay(history, value.id, false, true)}
              >
                <div className="slide-keep">
                  <span className="iconfont icon-siouan" />
                </div>
                <img src={value.picUrl} alt="" />
              </div>
              <div className="slide-content-bot">
                <span
                  onClick={() =>
                    utils.jumpToPlay(history, value.id, false, true)
                  }
                  className="section-three-name"
                >
                  {value.name}
                </span>
                <div className="section-three-art">
                  {value.artists.map((artist: any, index: number) => (
                    <Fragment key={artist.id}>
                      {index === value.artists.length - 1 ? (
                        <p>{artist.name}</p>
                      ) : (
                        <p>{artist.name}/</p>
                      )}
                    </Fragment>
                  ))}
                </div>
              </div>
            </div>
          ))}
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
          {mv.map((value: any) => (
            <div
              className="slide-content slide-content-mv"
              key={value.id}
              style={{ marginBottom: "20px" }}
            >
              <div
                className="slide-content-top"
                onClick={() => utils.jumpToMv(history, value.id)}
              >
                <div className="slide-keep">
                  <span className="iconfont icon-ziyuan" />
                </div>
                <img src={value.cover} alt="" />
              </div>
              <div className="slide-content-bot">
                <span
                  className="section-four-name"
                  onClick={() => utils.jumpToMv(history, value.id)}
                >
                  {value.name}
                </span>
                <p className="section-four-art">{value.artistName}</p>
                <p style={{ marginTop: 20 }}>
                  <Icon type="video-camera" />
                  <span
                    style={{
                      marginLeft: "5px",
                      display: "inline",
                      cursor: "auto",
                      color: "#999",
                    }}
                  >
                    {utils.unitCount(value.playCount)}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
