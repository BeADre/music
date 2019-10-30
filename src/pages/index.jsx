import React,{Suspense} from "react"
import { NavLink, Route, Switch, Redirect, withRouter} from "react-router-dom";
import "./index.scss"
import Router from "../router"
import {Input} from 'antd';

const {Search} = Input;
const searchHandel = (value,history) => {
  if(!value)return false
  history.push(`/search?s=${value}`);
}

const hiddenRouterArr = Router.reduce((pre,cur) => {
  if(cur.hidden){
    pre.push(cur.path);
  }
  return pre
},[]);

const Index = ({ location = {},history }) => {
  const {pathname} = location;
  return (

      <Suspense fallback={<div>loading.....</div>}>
        {hiddenRouterArr.includes(pathname) ? null :
          <div className="main-tab">
            <ul>
              {Router.map(value => {
                return value.hidden ? null : <li key={value.title}>
                  <NavLink exact to={value.path} activeStyle={{color: "#31c27c"}}>{value.title}</NavLink>
                </li>
              })}
            </ul>
            <div className="search">
              <Search
                placeholder="搜索"
                onSearch={value => searchHandel(value,history)}
              />
            </div>
          </div>}
        <Switch>
          <Route exact path="/" render={() => <Redirect to="/home" />}/>
          {Router.map(value => <Route path={value.path} key={value.title} exact component={value.component}/>)}
        </Switch>
      </Suspense>

  )
}
export default withRouter(Index)
