import React, {useEffect} from "react"
import "./index.scss"
import {connect} from "react-redux";


const Singer = ({dispatch}) =>{

  useEffect(() => {
    dispatch({
      type: "singer/hotSinger"
    });
  }, []);

  return (
    <div className="singer-main">
      <div className="singer-container">
        <div className="hot-singer">
          <h3><span>热门歌手</span></h3>
          <div className="hot-singer-container">
            <div className="hot-singer-content">
              <img src={require("../home/300.jpg")} alt=""/>
              <p>周杰伦</p>
            </div><div className="hot-singer-content">
            <img src={require("../home/300.jpg")} alt=""/>
            <p>周杰伦</p>
          </div><div className="hot-singer-content">
            <img src={require("../home/300.jpg")} alt=""/>
            <p>周杰伦</p>
          </div><div className="hot-singer-content">
            <img src={require("../home/300.jpg")} alt=""/>
            <p>周杰伦</p>
          </div><div className="hot-singer-content">
            <img src={require("../home/300.jpg")} alt=""/>
            <p>周杰伦</p>
          </div><div className="hot-singer-content">
            <img src={require("../home/300.jpg")} alt=""/>
            <p>周杰伦</p>
          </div>
          </div>
        </div>
        <div className="singer-classify">
          <div></div>
          <div></div>
        </div>
        <div></div>
      </div>
    </div>
  )
}

const mapState = (state) => (state);

export default connect(mapState)(Singer)
