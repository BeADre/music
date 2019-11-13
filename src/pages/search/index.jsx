import React, {useState, useEffect} from "react"
import {Input, Tabs, Table,Spin,Avatar } from "antd";
import {connect} from "react-redux"
import {searchTab} from "../../staticData/search"
import moment from "moment"
import utils from "../../utils"
import "./index.scss"

const { TabPane } = Tabs;
const Search = ({search, dispatch}) => {
  console.log(1111)
  console.log(222)
  const {hots = [], pagination, list = [], isLoading} = search
  const initSearch = decodeURI(window.location.search.split("=")[1]);
  const [keywords, setKeywords] = useState(initSearch);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [type, setType] = useState(1);
  const [iptValue, setIptValue] = useState(initSearch);

  useEffect(() => {
    dispatch({
      type: "search/hotList"
    });
  }, []);
  useEffect(() => {
    dispatch({
      type: "search/search",
      payload: {
        keywords,
        limit,
        offset,
        type
      }
    })
  }, [keywords,limit,offset,type]);

  const hotListClick = title => {
    setLimit(20);
    setOffset(0);
    setType(1);
    setKeywords(title);
    setIptValue(title);
  };

  const changePagination = pagination => {
    const {current, pageSize} = pagination;
    setLimit(pageSize);
    setOffset(current - 1);
  };

  const changeTabs = activeKey =>{
    setType(+activeKey);
    setLimit(10)
    setOffset(0)
  };

  const tabPanel1 = (type) => {
    let  columns;
    if(type === 1){
      columns =  [
        {
          title: "歌曲",
          dataIndex: "name",
          render: text => <span className="hover-column">{text}</span>
        },
        {
          title: "歌手",
          dataIndex: "artists",
          render: text => {
            return <div>
              {text.map((v,i) =>{return i === text.length - 1 ?
                <span className="hover-column" key={v.id}>{v.name}</span>:<span className="hover-column" key={v.id}>{v.name} /</span>})}
            </div>
          }
        },
        {
          title: "专辑",
          dataIndex: "album.name",
          render: text => <span className="hover-column">{text}</span>
        },{
          title: "时长",
          dataIndex: "duration",
          render: text => <span>{utils.unitTime(text)}</span>
        },
      ];
    }else if(type === 10){
      columns =  [
        {
          title: "专辑",
          dataIndex: "name",
          render: (text,record) => {
            return <div className="hover-column">
              <Avatar shape="square" src={record.picUrl}/>
              <span style={{marginLeft: 10}}>{text}</span>
            </div>
          }
        },
        {
          title: "歌手",
          dataIndex: "artists",
          render: text => {
            return <div>
              {(text || []).map((v,i) =>{return i === text.length - 1 ?
                <span className="hover-column" key={v.id}>{v.name}</span>:<span className="hover-column" key={v.id}>{v.name} /</span>})}
            </div>
          }
        },
        {
          title: "发行时间",
          dataIndex: "publishTime",
          render: text => <span>{moment(text).format('YYYY-MM-DD')}</span>
        }
      ];
    }else if(type === 1000){
      columns =  [
        {
          title: "歌单",
          dataIndex: "name",
          render: (text,record) => {
            return <div className="hover-column">
              <Avatar shape="square" src={record.coverImgUrl}/>
              <span style={{marginLeft: 10}}>{text}</span>
            </div>
          }
        },
        {
          title: "创建人",
          dataIndex: "creator.nickname",
          render: text => {
            return <div>
                <span className="hover-column">{text}</span>
            </div>
          }
        },
        {
          title: "收听",
          dataIndex: "playCount",
          render: text => <span>{utils.unitCount(text)}</span>
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
  const searchHandle = (value) => {
    setKeywords(value);
    setIptValue(value)
  };
  return (
    <div className="search-container">
      <div className="banner">
        <div className="search-content">
          <Input.Search
            placeholder="搜索音乐、歌单、MV"
            value={iptValue}
            onChange={(e)=>setIptValue(e.target.value)}
            style={{
              height: "50px",
              fontSize: "16px"
            }}
            onSearch={value => searchHandle(value)}
          />
          <div className="search-hot">
            <span>热门搜索：</span>
            <p>
              {hots.slice(0,5).map(value=> <span onClick={()=>hotListClick(value.first)} key={value.first}>{value.first}</span>)}
            </p>

          </div>
        </div>
      </div>
      <div className="search-main-content">
        <Tabs
          size={"large"}
          defaultActiveKey="1"
          onChange={(activeKey)=>changeTabs(activeKey)}>
          {searchTab.map(value =>
             <TabPane tab={value.name} key={value.id}>
               {tabPanel1(type)}
            </TabPane>
          )}
        </Tabs>
      </div>
    </div>
  )
}

const mapState = (state) => (state);

export default connect(mapState)(Search)
