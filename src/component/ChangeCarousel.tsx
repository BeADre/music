import React from "react";
import "./index.scss";

type Props = {
  refEle: React.ReactNode
}

const ChangeCarousel: React.FunctionComponent<Props> =  ({refEle}) => {
  return (
    <>
      <div className="prev-button" onClick={() => (refEle as React.ReactNode).current.prev()}>
        <span className="iconfont icon-shangyiye"/>
      </div>
      <div className="next-button" onClick={() => refEle.current.next()}>
        <span className="iconfont icon-xiayiye"/>
      </div>
    </>
  )
}


export default ChangeCarousel
