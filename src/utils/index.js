// 歌曲时长的时间戳转化函数
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

export default {
  unitTime,
  formatTime,
  unitCount
}
