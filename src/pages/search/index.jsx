import React, {useState, useEffect} from "react"
import {Input, Tabs, Table } from "antd";
import {connect} from "react-redux"
import {searchTab} from "../../staticData/search"
import utils from "../../utils"
import "./index.scss"

const { TabPane } = Tabs;

const Search = ({search, dispatch}) => {
  const {hots = [],pagination} = search

  const initSearch = window.location.search.split("=")[1];
  const [searchContent, setSearch] = useState(initSearch);

  useEffect(() => {
    dispatch({
      type: "search/hotList"
    });
  }, []);

  const changeTab = activeKey => {
    console.log(activeKey)
  }

  const tabPane1 = () => {
    const columns = [
      {
        title: "歌曲",
        dataIndex: "name",
      },
      {
        title: "歌手",
        dataIndex: "artists",
        render: text => {
          return <div>
            {text.map((v,i) =>{return i === text.length - 1 ? <span>{v.name}</span>:<span>{v.name} /</span>})}
          </div>
        }
      },
      {
        title: "专辑",
        dataIndex: "album.name",

      },{
        title: "时长",
        dataIndex: "duration",
        render: text => <span>{utils.unitTime(text)}</span>
      },
    ];
    return (
      <Table
        pagination={false}
        onChange={_pagination => this.getHighestScoreReq(undefined, undefined, _pagination)}
        rowKey={rowData => rowData._id}
        columns={columns}
        dataSource={[]}
      />
    )
  }

  return (
    <div className="search-container">
      <div className="banner">
        <div className="search-content">
          <Input.Search
            placeholder="搜索音乐、歌单、MV"
            defaultValue={searchContent}
            style={{
              height: "50px",
              fontSize: "16px"
            }}
            onSearch={value => setSearch(value)}
          />
          <div className="search-hot">
            <span>热门搜索：</span>
            <p>
              {/*{hots.slice(0,5).map(value=> <a key={value.first}>{value.first}</a>)}*/}
              <a>该死的温柔</a>
              <a>不能说的秘密</a>
              <a>盗将行</a>
              <a>学到老爱到老</a>
              <a>林俊杰</a>
            </p>

          </div>
        </div>
      </div>
      <div className="search-main-content">
        <Tabs
          size={"large"}
          defaultActiveKey="1"
          onChange={activeKey => changeTab(activeKey)}>
          {searchTab.map(value =>
             <TabPane tab={value.name} key={value.id}>
              Content of Tab Pane {value.id}
            </TabPane>
          )}
        </Tabs>
      </div>
    </div>
  )
}

const mapState = (state) => (state);

export default connect(mapState)(Search)
