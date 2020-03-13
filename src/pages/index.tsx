import React, {Suspense} from "react";
import {NavLink, Route, Switch, Redirect, withRouter} from "react-router-dom";
import Router from "../router";
import {Input, Spin} from 'antd';
import "./index.scss";


const {Search} = Input;

const Index = ({location = {}, history}: any) => {
  const {pathname} = location;
  const hiddenRouterArr = Router.reduce((pre: Array<string | undefined>, cur) => {
    if (cur.hidden) {
      pre.push(cur.path);
    }
    return pre
  }, []);

  const searchHandel = (value: string) => {
    if (!value) return false;
    history.push(`/search?s=${value}`);
  };

  return (
    <Suspense
      fallback={
        <div style={{
          width:"100%",
          height:"100vh",
          display:"flex",
          justifyContent:"center",
          alignItems:"center"
        }}>
          <Spin size="large" />
        </div>
      }
    >
      {hiddenRouterArr.includes(pathname) || hiddenRouterArr.includes("*") ? null :
        <div className="main-tab">
          {/*<ul>*/}
          {/*  {Router.map(value => {*/}
          {/*    return value.hidden ? null : <li key={value.title}>*/}
          {/*      <NavLink exact to={value.path} activeStyle={{color: "#31c27c"}}>{value.title}</NavLink>*/}
          {/*    </li>*/}
          {/*  })}*/}
          {/*</ul>*/}
          <div className="search">
            <Search
              placeholder="搜索"
              onSearch={value => searchHandel(value)}
            />
          </div>
        </div>}
      <Switch>
        <Route exact path="/" render={() => <Redirect to="/home"/>}/>
        {Router.map(value => <Route path={value.path} key={value.title} exact component={value.component}/>)}
      </Switch>
    </Suspense>
  )
};
export default withRouter(Index)
