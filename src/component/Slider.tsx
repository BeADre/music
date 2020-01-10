import React, {MouseEvent,DragEvent, RefObject, useRef} from "react";
import "./slider.scss";

type Props = {
  distance: number,
  bufferTime: number
  playTime: number
}

function Slider() {
  const block = useRef<HTMLDivElement>(null);
  const play = useRef<HTMLDivElement>(null);
  const buffer = useRef<HTMLDivElement>(null);
  const sliderClick = (e: MouseEvent) => {
    (block.current as HTMLDivElement).style.left = `${e.clientX - 12}px`;
    (play.current as HTMLDivElement).style.width = `${e.clientX - 12}px`;

  }
  const sliderDown = (e: DragEvent) => {
    if(e.clientX){
      (block.current as HTMLDivElement).style.left = `${e.clientX - 12}px`;
      (play.current as HTMLDivElement).style.width = `${e.clientX - 12}px`;
    }
  }
  return (
    <div className="slider-container">
      <div className="slider-content" onClick={sliderClick}>
        <div className="white-slider" />
        <div className="play-slider" ref={play} />
        <div className="buffer-slider" ref={buffer} />
        <div className="slider-block" ref={block} draggable={true} onDrag={sliderDown}  />
      </div>
    </div>
  )
}

export default Slider
