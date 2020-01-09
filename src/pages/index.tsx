import React, {Suspense} from "react";
import {NavLink, Route, Switch, Redirect, withRouter} from "react-router-dom";
import "./index.scss";
import Router from "../router";
import {Input, Spin} from 'antd';

const {Search} = Input;
const searchHandel = (value: string, history: Array<string>) => {
  if (!value) return false;
  history.push(`/search?s=${value}`);
};

const hiddenRouterArr = Router.reduce((pre: Array<string | undefined>, cur) => {
  if (cur.hidden) {
    pre.push(cur.path);
  }
  return pre
}, []);

const Index = ({location = {}, history}: any) => {
  const {pathname} = location;
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
      {hiddenRouterArr.includes(pathname) ? null :
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
              onSearch={value => searchHandel(value, history)}
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
