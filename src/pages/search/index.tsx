import React, { useState, useEffect } from "react";
import { Input, Tabs, Table, Spin, Avatar, Pagination, Icon } from "antd";
import { useSelector, useDispatch } from "react-redux";
import moment from "dayjs";
import { searchTab } from "../../staticData/search";
import KeywordFormat from "../../component/KeywordFormat";
import useWidth from "../../hook/useWidth";
import utils from "../../utils";
import "./index.less";

const { TabPane } = Tabs;

function Search({ history }: any) {
  const dispatch = useDispatch();
  const width = useWidth();
  const search = useSelector(({ search }: any) => search);
  const { hots = [], pagination, list = [], isLoading } = search;
  const initSearch = decodeURI(window.location.search.split("=")[1]);
  const [keywordsState, setKeywordsState] = useState({
    keywords: initSearch,
    iptValue: initSearch,
  });
  const [state, setState] = useState({
    limit: 10,
    offset: 0,
    type: 1,
  });
  const assignPagination = {
    ...pagination,
    showSizeChanger: !(width >= 577 && width <= 768),
    size: 577 <= width && width <= 1200 ? "small" : "default",
    simple: width < 577,
  };
  useEffect(() => {
    dispatch({
      type: "search/hotList",
    });
  }, []);
  useEffect(() => {
    dispatch({
      type: "search/search",
      payload: {
        keywords: keywordsState.keywords,
        ...state,
      },
    });
  }, [keywordsState.keywords, state.limit, state.offset, state.type]);

  const hotListClick = (title: string): void => {
    setState({
      limit: 10,
      offset: 0,
      type: 1,
    });
    setKeywordsState({
      keywords: title,
      iptValue: title,
    });
  };

  const changePagination = (pagination: any, isMv?: boolean): void => {
    if (!isMv) {
      const { current, pageSize } = pagination;
      setState({ ...state, ...{ limit: pageSize, offset: current - 1 } });
    } else {
      setState({ ...state, ...{ limit: 12, offset: pagination - 1 } });
    }
  };

  const changeTabs = (activeKey: string | number) => {
    const limitNum = +activeKey === 1004 ? 12 : 10;
    setState({
      type: +activeKey,
      limit: limitNum,
      offset: 0,
    });
  };

  const tabPanel1 = () => {
    let columns;
    if (state.type === 1) {
      columns = [
        {
          title: "歌曲",
          width: "30%",
          dataIndex: "name",
          render: (text: string, record: any) => (
            <span
              className="hover-column"
              onClick={() => utils.jumpToPlay(history, record.id, true)}
            >
              <KeywordFormat text={text} keywords={keywordsState.keywords} />
            </span>
          ),
        },
        {
          width: "30%",
          title: "歌手",
          dataIndex: "artists",
          render: (text: Array<any>) => {
            return (
              <div>
                {(text || []).map((v: any, i: number) => {
                  return i === text.length - 1 ? (
                    <span key={v.id} onClick={() => hotListClick(v.name)}>
                      <KeywordFormat
                        text={v.name}
                        keywords={keywordsState.keywords}
                      />
                    </span>
                  ) : (
                    <span onClick={() => hotListClick(v.name)} key={v.id}>
                      <KeywordFormat
                        text={v.name}
                        keywords={keywordsState.keywords}
                      />{" "}
                      /
                    </span>
                  );
                })}
              </div>
            );
          },
        },
        {
          title: "专辑",
          dataIndex: "album.name",
          width: "30%",
          render: (text: any) => (
            <span
              className="hover-column"
              onClick={() => {
                setKeywordsState({
                  keywords: text,
                  iptValue: text,
                });
                setState({ ...state, ...{ type: 10 } });
              }}
            >
              {text}
            </span>
          ),
        },
        {
          title: "时长",
          dataIndex: "duration",
          width: "10%",
          render: (text: number) => <span>{utils.unitTime(text)}</span>,
        },
      ];
    } else if (state.type === 10) {
      columns = [
        {
          title: "专辑",
          dataIndex: "name",
          width: "45%",
          render: (text: string, record: any) => {
            return (
              <div
                className="hover-column"
                onClick={() =>
                  utils.jumpToPlay(history, record.id, false, true)
                }
              >
                <Avatar shape="square" src={record.picUrl} />
                <span style={{ marginLeft: 10 }}>
                  <KeywordFormat
                    text={text}
                    keywords={keywordsState.keywords}
                  />
                </span>
              </div>
            );
          },
        },
        {
          title: "歌手",
          dataIndex: "artists",
          width: "40%",
          render: (text: Array<any>) => {
            return (
              <div>
                {(text || []).map((v: any, i: number) => {
                  return i === text.length - 1 ? (
                    <span key={v.id}>
                      <KeywordFormat
                        text={v.name}
                        keywords={keywordsState.keywords}
                      />
                    </span>
                  ) : (
                    <span className="hover-column" key={v.id}>
                      <KeywordFormat
                        text={v.name}
                        keywords={keywordsState.keywords}
                      />{" "}
                      /
                    </span>
                  );
                })}
              </div>
            );
          },
        },
        {
          title: "发行时间",
          dataIndex: "publishTime",
          width: "15%",
          render: (text: number) => (
            <span>{moment(text).format("YYYY-MM-DD")}</span>
          ),
        },
      ];
    } else if (state.type === 1000) {
      columns = [
        {
          title: "歌单",
          dataIndex: "name",
          width: "45%",
          render: (text: string, record: any) => {
            return (
              <div className="hover-column">
                <Avatar shape="square" src={record.coverImgUrl} />
                <span style={{ marginLeft: 10 }}>
                  <KeywordFormat
                    text={text}
                    keywords={keywordsState.keywords}
                  />
                </span>
              </div>
            );
          },
        },
        {
          title: "创建人",
          width: "45%",
          dataIndex: "creator.nickname",
        },
        {
          title: "收听",
          width: "10%",
          dataIndex: "playCount",
          render: (text: number) => <span>{utils.unitCount(text)}</span>,
        },
      ];
    }
    return (
      <Spin spinning={isLoading}>
        <Table
          pagination={assignPagination}
          onChange={(pagination) => changePagination(pagination)}
          rowKey={(rowData) => rowData.id}
          scroll={{ x: 768 }}
          columns={columns}
          dataSource={list}
        />
      </Spin>
    );
  };

  const searchHandle = (value: string) => {
    setState({
      type: 1,
      limit: 10,
      offset: 0,
    });
    setKeywordsState({
      keywords: value,
      iptValue: value,
    });
  };

  const mvContent = () => {
    return list.map((mv: any) => {
      return (
        <div className="search-content-mv" key={mv.id}>
          <div
            className="slideContent-top"
            onClick={() => utils.jumpToMv(history, mv.id)}
          >
            <div className="slide-keep">
              <span className="iconfont icon-ziyuan" />
            </div>
            <img src={mv.cover} alt="" />
          </div>
          <div className="slideContent-bot">
            <a onClick={() => utils.jumpToMv(history, mv.id)}>{mv.name}</a>
            <p>
              <KeywordFormat
                text={mv.artistName || ""}
                keywords={keywordsState.keywords}
              />
            </p>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="search-container">
      <div className="banner">
        <div className="search-content">
          <Input.Search
            placeholder="搜索音乐、歌单、MV"
            value={keywordsState.iptValue}
            onChange={(e) =>
              setKeywordsState({
                ...keywordsState,
                ...{ iptValue: e.target.value },
              })
            }
            style={{
              height: "40px",
              fontSize: "16px",
            }}
            onSearch={(value) => searchHandle(value)}
          />
          <div className="search-hot">
            <span>热门搜索：</span>
            <div>
              <p>
                {hots.map((value: any) => (
                  <span
                    onClick={() => hotListClick(value.first)}
                    key={value.first}
                  >
                    {value.first}
                  </span>
                ))}
              </p>
            </div>
          </div>
        </div>
        <Icon
          type="left"
          className="return-home"
          onClick={() => history.push(`/home`)}
        />
      </div>
      <div className="search-main-content">
        <Tabs
          size={"large"}
          defaultActiveKey="1"
          activeKey={`${state.type}`}
          onChange={(activeKey) => changeTabs(activeKey)}
        >
          {searchTab.map((value: any) => (
            <TabPane tab={value.name} key={value.id}>
              {state.type === 1004 ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <div style ={{overflowX: "auto", width: "100%"}}>
                    <div className="search-container-mv">{mvContent()}</div>
                  </div>
                  <Pagination
                    {...assignPagination}
                    style={{ margin: "16px 0" }}
                    showSizeChanger={false}
                    onChange={(pageNumber) =>
                      changePagination(pageNumber, true)
                    }
                  />
                </div>
              ) : (
                tabPanel1()
              )}
            </TabPane>
          ))}
        </Tabs>
      </div>
    </div>
  );
}

export default Search;
