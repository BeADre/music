import React, {useState, useEffect} from "react"
import {Input, Tabs, Table,Spin,Avatar,Pagination,Icon } from "antd";
import {connect} from "react-redux"
import {searchTab} from "../../staticData/search"
import moment from "moment"
import utils from "../../utils"
import "./index.scss"

const { TabPane } = Tabs;
const Search = ({search, dispatch, history}) => {
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
    setLimit(10);
    setOffset(0);
    setType(1);
    setKeywords(title);
    setIptValue(title);
  };

  const changePagination = (pagination,isMv) => {
    if(!isMv){
      const {current, pageSize} = pagination;
      setLimit(pageSize);
      setOffset(current - 1);
    }else {
      setLimit(12);
      setOffset(pagination - 1);
    }
  };

  const changeTabs = activeKey =>{
    const limitNum = +activeKey === 1004 ? 12 : 10;
    setType(+activeKey);
    setLimit(limitNum);
    setOffset(0);
  };

  const tabPanel1 = (type) => {
    let  columns;
    if(type === 1){
      columns =  [
        {
          title: "歌曲",
          dataIndex: "name",
          render: text => <span className="hover-column" onClick={() => {setIptValue(text);setKeywords(text)}}>
            {utils.keywordFormat(text,keywords)}
          </span>
        },
        {
          title: "歌手",
          dataIndex: "artists",
          render: text => {
            return <div>
              {text.map((v,i) =>{return i === text.length - 1 ?
                <span className="hover-column" key={v.id} onClick={()=>hotListClick(v.name)}>
                   {utils.keywordFormat(v.name,keywords)}
                </span>:
                <span
                  onClick={()=>hotListClick(v.name)}
                  className="hover-column" key={v.id}>{utils.keywordFormat(v.name,keywords)} /</span>})}
            </div>
          }
        },
        {
          title: "专辑",
          dataIndex: "album.name",
          render: text => <span className="hover-column"
                                onClick={() => {setIptValue(text);setType(10);setKeywords(text)}}>{text}</span>
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
              <span style={{marginLeft: 10}}>
                {utils.keywordFormat(text,keywords)}
              </span>
            </div>
          }
        },
        {
          title: "歌手",
          dataIndex: "artists",
          render: text => {
            return <div>
              {(text || []).map((v,i) =>{return i === text.length - 1 ?
                <span key={v.id}>
                 {utils.keywordFormat(v.name,keywords)}
                </span>:
                <span className="hover-column" key={v.id}>
                  {utils.keywordFormat(v.name,keywords)} /
                </span>})}
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
              <span style={{marginLeft: 10}}>
                {utils.keywordFormat(text,keywords)}
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
    setLimit(10);
    setOffset(0);
    setType(1);
    setKeywords(value);
    setIptValue(value)
  };

  const mvContent = () => {
    return list.map(mv => {
      return <div className="search-content-mv" key={mv.id}>
        <div className="slideContent-top">
          <div className="slide-keep">
            <span className="iconfont icon-ziyuan" />
          </div>
          <img src={mv.cover} alt=""/>
        </div>
        <div className="slideContent-bot">
          <a href="">{mv.name}</a>
          <p>{utils.keywordFormat(mv.artistName, keywords)}</p>
        </div>
      </div>
    })
  }

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
        <Icon type="left" className="return-home" onClick={ () => history.push(`/home`)}/>
      </div>
      <div className="search-main-content">
        <Tabs
          size={"large"}
          defaultActiveKey="1"
          activeKey={`${type}`}
          onChange={(activeKey)=>changeTabs(activeKey)}>
          {searchTab.map(value =>
             <TabPane tab={value.name} key={value.id}>
               {type === 1004 ?
                 <div style={{display: "flex",alignItems: "center",flexDirection: "column"}}>
                   <div className="search-container-mv">
                     {mvContent()}
                   </div>
                   <Pagination {...pagination} style={{padding: "30px 0 50px 0"}} showSizeChanger={false}
                               onChange={(pageNumber) => changePagination(pageNumber, true)} />
                 </div>:tabPanel1(type)}
            </TabPane>
          )}
        </Tabs>
      </div>
    </div>
  )
}

const mapState = (state) => (state);

export default connect(mapState)(Search)
