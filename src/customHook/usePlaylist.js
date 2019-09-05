import {useEffect} from "react"


const usePlaylist = (props) => {
  const {index, cat, limit, order,dispatch,} = props
  useEffect(() => {
    if (index === 2) {
      dispatch({
        type: "home/getNewSong",
        payload: {
          cat,
          limit
        }
      })
    } else if(index === 3){
      dispatch({
        type: "home/getMv",
        payload: {
          cat,
        }
      })
    } else {
      dispatch({
        type: "home/getPlaylist",
        payload: {
          cat,
          order,
          limit
        }
      })
    }

  }, [cat])
}

export default usePlaylist
