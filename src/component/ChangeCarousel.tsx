import React, {RefObject, memo} from "react";
import "./index.scss";
import {Carousel} from "antd";


type Props = {
  refEle: RefObject<Carousel>
}

function ChangeCarousel({refEle}: Props) {
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
}

export default memo(ChangeCarousel)
