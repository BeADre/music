// 歌曲时长的时间戳转化函数
import React from "react";

const unitTime = time => {
  if(!time) return `00:00`
  let minute = new Date(time).getMinutes();
  let second = new Date(time).getSeconds();
  minute = minute < 10 ? `0${minute}` : `${minute}`;
  second = second < 10 ? `0${second}` : `${second}`;
  return `${minute}:${second}`
}

// 当前歌曲时长的秒数转换
const formatTime = time => {
  let integerTime = parseInt(time);
  let minute = Math.floor(integerTime/60);
  // 取得秒对60的余数，既得到秒数
  let second = integerTime % 60;
  //如果只有一位数，前面增加一个0
  minute = minute < 10 ? `0${minute}`: minute;
  second = second < 10 ? `0${second}`: second;
  return `${minute}:${second}`;
}

// 播放量转化函数
const unitCount = count => {
  const len = `${count}`.length;
  switch (true) {
    case len < 5: return count;
    case 5 <= len <= 7: return `${(count/10000).toFixed(1)}万`;
    case 7 < len : return `${(count/10000).toFixed()}万`
  }
};

const keywordFormat = (str = "", keyword) => {
  return str.includes(keyword) ?
    <span>{str.slice(0,str.indexOf(keyword))}
      <span style={{color: "#31c27c"}}>{keyword}</span>
      {str.slice(str.indexOf(keyword) + keyword.length)}</span> : str
}

export default {
  unitTime,
  formatTime,
  unitCount,
  keywordFormat
}
