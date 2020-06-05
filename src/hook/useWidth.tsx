import React, {useState, useEffect, useMemo} from "react"
import utils from "../utils";

export default function (){
  const { clientWidth } = document.body;
  const [width, setWidth] = useState(clientWidth);

  const resize = () => {
    const { clientWidth } = document.body;
    setWidth(clientWidth);
  };
  const memorizeResize: any = useMemo(() => utils.throttle(resize, 500), []);
  
  useEffect(() => {
    window.addEventListener("resize", memorizeResize);
    return () => {
      window.removeEventListener("resize", memorizeResize)
    }
  }, []);

  return width
}