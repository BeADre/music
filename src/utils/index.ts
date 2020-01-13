import { History, LocationState } from "history"

// 歌曲时长的时间戳转化函数
const unitTime = (time: number): string => {
  if (!time) return `00:00`;
  let minute: string | number = new Date(time).getMinutes();
  let second: string | number = new Date(time).getSeconds();
  minute = minute < 10 ? `0${minute}` : `${minute}`;
  second = second < 10 ? `0${second}` : `${second}`;
  return `${minute}:${second}`
};

// 当前歌曲时长的秒数转换
const formatTime = (time: number | string): string => {
  let integerTime = parseInt(time as string);
  let minute: string | number = Math.floor(integerTime / 60);
  // 取得秒对60的余数，既得到秒数
  let second: string | number = integerTime % 60;
  //如果只有一位数，前面增加一个0
  minute = minute < 10 ? `0${minute}` : minute;
  second = second < 10 ? `0${second}` : second;
  return `${minute}:${second}`;
};

// 播放量转化函数
const unitCount = (count: number): string | number => {
  const len = `${count}`.length;
  switch (true) {
    case len < 5:
      return count;
    case 5 <= len && len <= 7:
      return `${(count / 10000).toFixed(1)}万`;
    case 7 < len :
      return `${(count / 10000).toFixed()}万`;
    default:
      return count
  }
};

// 跳转到播放页
const jumpToPlay = (history: History<LocationState>, id: string, isSong: boolean, isAlbum?: boolean): void => {
  history.push({
    pathname: "/playMusic",
    state: {
      isAlbum,
      isSong,
      id
    }
  });
};

// 跳转到MV页
const jumpToMv = (history: History<LocationState>, mvid: number) => {
  history.push({
    pathname: "/mv",
    state: {
      mvid
    }
  });
};

export default {
  unitTime,
  formatTime,
  unitCount,
  jumpToPlay,
  jumpToMv
}
