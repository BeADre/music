import React from "react"
import { Result, Button, Icon } from 'antd';
import "./index.less";

const MyIcon = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1357705_wepgs1oohf.js',
});
function NotFind() {

  const toHome = () => {
    window.location.href = window.location.origin
  }
  return (
    <div className={"not-found-container"}>
      <Result
        style={{color: "#1DA57A"}}
        status="info"
        icon={<MyIcon type="icon-icon-test" />}
        subTitle={<h1 style={{color:"#1DA57A", marginTop: -60}}>"哥们，你地址填错了吧-_-!"</h1>}
        extra={<Button type="primary" onClick={toHome}>回到首页</Button>}
      />
    </div>

  )
}

export default NotFind
