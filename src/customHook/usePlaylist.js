import {useEffect} from "react"


const usePlaylist = (props) => {
  const {index, cat, limit, order,dispatch} = props
  useEffect(() => {
    if (index === 2) {
      dispatch({
        type: "home/getNewSong",
        payload: {
          cat,
          limit
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