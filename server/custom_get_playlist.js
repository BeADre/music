// 歌单详情

module.exports = async (query, request) => {
  const data = {
    id: query.id,
    n: 100000,
    s: query.s || 8
  }
  const getData = await request(
    'POST', `https://music.163.com/weapi/v3/playlist/detail`, data,
    {crypto: 'linuxapi', cookie: query.cookie, proxy: query.proxy}
  );
  const {status, body} = getData;
  if(status == 200 && body.playlist && Array.isArray(body.playlist.trackIds)){
    const trackIds = body.playlist.trackIds.slice(0, 50);
    let idArr = [];
    for(let i = 0; i < trackIds.length; i++){
      idArr.push(`${trackIds[i].id}`);
    }
    const data = {
      c: '[' + idArr.map(id => ('{"id":' + id + '}')).join(',') + ']',
      ids: '[' + idArr.join(',') + ']'
    }
    return request(
      'POST', `https://music.163.com/weapi/v3/song/detail`, data,
      {crypto: 'weapi', cookie: query.cookie, proxy: query.proxy}
    )
  }else{
    return {
      status: 404,
      statusText: 'resource not found',
      body: {
        status: 404,
        statusText: 'resource not found',
      }
    }
  }
}