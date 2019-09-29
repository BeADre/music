import React from "react"
import {BrowserRouter, NavLink, Route, Switch, Redirect} from "react-router-dom";
import "./index.scss"
import Router from "../router"
import {Input} from 'antd';

const {Search} = Input;

const Index = () => {
  const {pathname} = window.location;

  return (
    <BrowserRouter>
      {pathname.includes("/playMusic") ? null :
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
              onSearch={value => console.log(value)}
            />
          </div>
        </div>}
      <Switch>
        <Route exact path="/" render={() => <Redirect to="/home"/>}/>
        {Router.map(value => <Route path={value.path} key={value.title} exact component={value.component}/>)}
      </Switch>
    </BrowserRouter>
  )
}
export default Index
