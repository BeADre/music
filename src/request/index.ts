import axios from "axios"

const instance = axios.create({
  baseURL: "/local"
})

export default instance
