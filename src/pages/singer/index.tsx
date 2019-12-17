import React, {useEffect, useRef, useState} from "react";
import ChangeCarousel from "../../component/ChangeCarousel";
import {Carousel} from "antd";
import {connect} from "react-redux";
import {letterArr, playerTab} from "../../staticData/singer";
import "./index.scss";

const Singer = ({dispatch, singer = {}}:any) => {
  const {hotSinger = [], list = []} = singer;
  const [letter, setLetter] = useState("");
  const [type, setType] = useState(1001);

  const chooseHotSinger = useRef(null);
  useEffect(() => {
    dispatch({
      type: "singer/hotSinger",
    });
  }, []);
  useEffect(() => {
    dispatch({
      type: "singer/singerList",
      payload: {
        cat: type,
        initial: letter
      }
    })
  }, [letter, type]);

  const hotSingerCarousel = () => {
    const copyHotSinger = [...hotSinger];
    const slideElementArr = [];
    let key = 1;
    while (copyHotSinger.length) {
      key++;
      slideElementArr.push(
        <div className="hot-singer-container" key={key}>
          {copyHotSinger.splice(0, 10).map(value => (
            <div className="hot-singer-content" key={value.id}>
              <img src={value.img1v1Url} alt=""/>
              <p>{value.name}</p>
            </div>
          ))}
        </div>
      )
    }
    return slideElementArr
  };

  return (
    <div className="singer-main">
      <div className="singer-container">
        <div className="hot-singer">
          <h1><span>热门歌手</span></h1>
          <div className="slide-container">
            <ChangeCarousel refEle={chooseHotSinger}/>
            <Carousel ref={chooseHotSinger}>
              {hotSingerCarousel()}
            </Carousel>
          </div>
        </div>
        <div className="singer-classify">
          <div className="letter-container">
            <span className="title">歌手姓名首字母</span>
            {letterArr().map(value =>
              <span style={{color: letter === value ? "#31c27c" : "rgba(0, 0, 0, 0.65)"}}
                    onClick={() => setLetter(value)} className="letter" key={value}>{value}</span>)
            }
          </div>
          <div className="singer-type-container">
            <span className="title">歌手类型</span>
            {playerTab.map(value =>
              <span className="singer"
                    style={{color: type === value.id ? "#31c27c" : "rgba(0, 0, 0, 0.65)"}}
                    onClick={() => setType(value.id)} key={value.id}>{value.name}</span>)
            }
          </div>
        </div>
        <div className="singer-name-list">
          {list.map((value:any) => <div key={value.id}><span>{value.name}</span></div>)}
        </div>
      </div>
    </div>
  )
};

const mapState = (state:any) => (state);

export default connect(mapState)(Singer)
