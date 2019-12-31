import React,{RefObject} from "react";
import "./index.scss";
import Carousel from "antd/lib/carousel"

type Props = {
  refEle: RefObject<Carousel>
}

const ChangeCarousel =  ({refEle}: Props) => {
  return (
    <>
      <div className="prev-button" onClick={() => (refEle.current as Carousel).prev()}>
        <span className="iconfont icon-shangyiye"/>
      </div>
      <div className="next-button" onClick={() => (refEle.current as Carousel).next()}>
        <span className="iconfont icon-xiayiye"/>
      </div>
    </>
  )
};

export default ChangeCarousel
