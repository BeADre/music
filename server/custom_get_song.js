module.exports = (query, request) => {
  // 歌曲详情
  const queryArr = query.id.split(/\s*,\s*/)
  const reqDetailData = {
    c: '[' + queryArr.map(id => ('{"id":' + id + '}')).join(',') + ']',
    ids: '[' + queryArr.join(',') + ']'
  }
  const reqLyricData={
    id: query.id
  }
  const reqUrlData = {
    ids: '[' + parseInt(query.id) + ']',
    br: parseInt(query.br || 999000)
  }
  const detailPromise =  request(
    'POST', `https://music.163.com/weapi/v3/song/detail`, reqDetailData,
    {crypto: 'weapi', cookie: query.cookie, proxy: query.proxy}
  );

  const lyricPromise =  request(
    'POST', `https://music.163.com/weapi/song/lyric?lv=-1&kv=-1&tv=-1`, reqLyricData,
    {crypto: 'linuxapi', cookie: query.cookie, proxy: query.proxy}
  );

  const urlPromise =  request(
    'POST', `https://music.163.com/weapi/song/enhance/player/url`, reqUrlData,
    {crypto: 'weapi', cookie: query.cookie, proxy: query.proxy}
  );
  return Promise.all([detailPromise, lyricPromise, urlPromise]).then(res => {
    let urlData = {
      playable: false, 
      url: '',
      freeTrialInfo: null
    };
    const response = {
      status: 200,
      cookie: [],
      body: {}
    }
    const { data } = res[2].body
    if (data.length && data[0].url) {
      const { url, freeTrialInfo } = data[0]
      urlData = { playable: true, url, freeTrialInfo };
    }
    
    response.body.detail = res[0].body.songs.length ? res[0].body.songs[0] : {}
    response.body.lyric = res[1].body.lrc ?  res[1].body.lrc.lyric || '' : ''
    response.body.urlData = urlData
    return response
  })
}