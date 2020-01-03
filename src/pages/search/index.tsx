import React, {useState, useEffect} from "react";
import {Input, Tabs, Table, Spin, Avatar, Pagination, Icon} from "antd";
import {useSelector, useDispatch} from "react-redux";
import {searchTab} from "../../staticData/search";
import KeywordFormat from "../../component/KeywordFormat";
import moment from "moment";
import utils from "../../utils";
import "./index.scss";

const {TabPane} = Tabs;

function Search({history}: any) {
  const dispatch = useDispatch();
  const search = useSelector(({search}: any) => search);
  const {hots = [], pagination, list = [], isLoading} = search;
  const initSearch = decodeURI(window.location.search.split("=")[1]);
  const [keywordsState, setKeywordsState] = useState({
    keywords: initSearch,
    iptValue: initSearch
  });
  const [state, setState] = useState({
    limit: 10,
    offset: 0,
    type: 1,
  });

  useEffect(() => {
    dispatch({
      type: "search/hotList"
    });
  }, []);
  useEffect(() => {
    dispatch({
      type: "search/search",
      payload: {
        keywords: keywordsState.keywords,
        ...state
      }
    })
  }, [keywordsState.keywords, state.limit, state.offset, state.type]);

  const hotListClick = (title: string): void => {
    setState({
      limit: 10,
      offset: 0,
      type: 1
    });
    setKeywordsState({
      keywords: title,
      iptValue: title
    })
  };

  const changePagination = (pagination: any, isMv?: boolean): void => {
    if (!isMv) {
      const {current, pageSize} = pagination;
      setState({...state, ...{limit: pageSize, offset: current - 1}});
    } else {
      setState({...state, ...{limit: 12, offset: pagination - 1}});
    }
  };

  const changeTabs = (activeKey: string | number) => {
    const limitNum = +activeKey === 1004 ? 12 : 10;
    setState({
      type: +activeKey,
      limit: limitNum,
      offset: 0
    });
  };

  const tabPanel1 = (type: number) => {
    let columns;
    if (type === 1) {
      columns = [
        {
          title: "歌曲",
          dataIndex: "name",
          render: (text: string, record: any) =>
            <span className="hover-column" onClick={() => utils.jumpToPlay(history, record.id, true)}>
              <KeywordFormat text={text} keywords={keywordsState.keywords}/>
            </span>
        },
        {
          title: "歌手",
          dataIndex: "artists",
          render: (text: Array<any>) => {
            return <div>
              {text.map((v: any, i: number) => {
                return i === text.length - 1 ?
                  <span key={v.id} onClick={() => hotListClick(v.name)}>
                    <KeywordFormat text={v.name} keywords={keywordsState.keywords}/>
                  </span> :
                  <span
                    onClick={() => hotListClick(v.name)}
                    key={v.id}
                  >
                    <KeywordFormat text={v.name} keywords={keywordsState.keywords}/> /
                  </span>
              })}
            </div>
          }
        },
        {
          title: "专辑",
          dataIndex: "album.name",
          render: (text: any) =>
            <span className="hover-column"
                  onClick={() => {
                    setKeywordsState({
                      keywords: text,
                      iptValue: text
                    });
                    setState({...state, ...{type: 10}});
                  }}>
              {text}
            </span>
        }, {
          title: "时长",
          dataIndex: "duration",
          render: (text: number) => <span>{utils.unitTime(text)}</span>
        },
      ];
    } else if (type === 10) {
      columns = [
        {
          title: "专辑",
          dataIndex: "name",
          render: (text: string, record: any) => {
            return (
              <div className="hover-column" onClick={() => utils.jumpToPlay(history, record.id, false, true)}>
                <Avatar shape="square" src={record.picUrl}/>
                <span style={{marginLeft: 10}}>
                  <KeywordFormat text={text} keywords={keywordsState.keywords}/>
                </span>
              </div>
            )
          }
        },
        {
          title: "歌手",
          dataIndex: "artists",
          render: (text: Array<any>) => {
            return <div>
              {(text || []).map((v: any, i: number) => {
                return i === text.length - 1 ?
                  <span key={v.id}>
                    <KeywordFormat text={v.name} keywords={keywordsState.keywords}/>
                </span> :
                  <span className="hover-column" key={v.id}>
                    <KeywordFormat text={v.name} keywords={keywordsState.keywords}/> /
                </span>
              })}
            </div>
          }
        },
        {
          title: "发行时间",
          dataIndex: "publishTime",
          render: (text: number) => <span>{moment(text).format('YYYY-MM-DD')}</span>
        }
      ];
    } else if (type === 1000) {
      columns = [
        {
          title: "歌单",
          dataIndex: "name",
          render: (text: string, record: any) => {
            return <div className="hover-column">
              <Avatar shape="square" src={record.coverImgUrl}/>
              <span style={{marginLeft: 10}}>
                <KeywordFormat text={text} keywords={keywordsState.keywords}/>
              </span>
            </div>
          }
        },
        {
          title: "创建人",
          dataIndex: "creator.nickname",
        },
        {
          title: "收听",
          dataIndex: "playCount",
          render: (text: number) => <span>{utils.unitCount(text)}</span>
        }
      ];
    }

    return (
      <Spin spinning={isLoading}>
        <Table
          pagination={pagination}
          onChange={pagination => changePagination(pagination)}
          rowKey={rowData => rowData.id}
          columns={columns}
          dataSource={list}
        />
      </Spin>
    )
  };

  const searchHandle = (value: string) => {
    setState({
      type: 1,
      limit: 10,
      offset: 0
    });
    setKeywordsState({
      keywords: value,
      iptValue: value
    });
  };

  const mvContent = () => {
    return list.map((mv: any) => {
      return <div className="search-content-mv" key={mv.id}>
        <div className="slideContent-top">
          <div className="slide-keep">
            <span className="iconfont icon-ziyuan"/>
          </div>
          <img src={mv.cover} alt=""/>
        </div>
        <div className="slideContent-bot">
          <a>{mv.name}</a>
          <p>
            <KeywordFormat text={mv.artistName || ""} keywords={keywordsState.keywords}/>
          </p>
        </div>
      </div>
    })
  };

  return (
    <div className="search-container">
      <div className="banner">
        <div className="search-content">
          <Input.Search
            placeholder="搜索音乐、歌单、MV"
            value={keywordsState.iptValue}
            onChange={(e) => setKeywordsState({...keywordsState, ...{iptValue: e.target.value}})}
            style={{
              height: "50px",
              fontSize: "16px"
            }}
            onSearch={value => searchHandle(value)}
          />
          <div className="search-hot">
            <span>热门搜索：</span>
            <p>
              {hots.slice(0, 5).map((value: any) =>
                <span onClick={() => hotListClick(value.first)}
                      key={value.first}>
                  {value.first}
                </span>
              )}
            </p>

          </div>
        </div>
        <Icon type="left" className="return-home" onClick={() => history.push(`/home`)}/>
      </div>
      <div className="search-main-content">
        <Tabs
          size={"large"}
          defaultActiveKey="1"
          activeKey={`${state.type}`}
          onChange={(activeKey) => changeTabs(activeKey)}>
          {searchTab.map((value: any) =>
            <TabPane tab={value.name} key={value.id}>
              {state.type === 1004 ?
                <div style={{display: "flex", alignItems: "center", flexDirection: "column"}}>
                  <div className="search-container-mv">
                    {mvContent()}
                  </div>
                  <Pagination {...pagination} style={{padding: "30px 0 50px 0"}} showSizeChanger={false}
                              onChange={(pageNumber) => changePagination(pageNumber, true)}/>
                </div> : tabPanel1(state.type)}
            </TabPane>
          )}
        </Tabs>
      </div>
    </div>
  )
}

export default Search
