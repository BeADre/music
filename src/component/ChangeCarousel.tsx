import React from "react";
import "./index.scss";

export default function ({refEle}: any) {
  return (
    <>
      <div className="prev-button" onClick={() => refEle.current.prev()}>
        <span className="iconfont icon-shangyiye" />
      </div>
      <div className="next-button" onClick={() => refEle.current.next()}>
        <span className="iconfont icon-xiayiye" />
      </div>
    </>
  )
}
