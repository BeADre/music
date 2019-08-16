import initState from "../state"
import { reducerAction } from "../actions"


export default function (state = initState,action) {
  if(action.type === reducerAction.FIRST_ACTION_REDUCER){
    return {
      ...initState,
      ...{num: initState.num + action.length}
    }
  }else {
    return  initState
  }

}
