import React, {MouseEvent, DragEvent, useRef, useEffect, useState, RefObject} from "react";
import "./slider.scss";

type Props = {
  bufferTimeValue: number
  playWidth: string
  onChange: Function
  control: RefObject<HTMLDivElement>
}

function PlaySlider({bufferTimeValue, playWidth, onChange, control}: Props) {
  const [sliderState, setSliderState] = useState({
    blockLeft: 0,
    playWidth: 0,
    bufferWidth: 0
  });
  const block = useRef<HTMLDivElement>(null);
  const play = useRef<HTMLDivElement>(null);
  const buffer = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const minWidth = content.current ? content.current.offsetWidth / 100 : 0;

  useEffect(() => {
    setSliderState({
      blockLeft: isNaN(+playWidth * minWidth) ? 0 : +playWidth * minWidth,
      playWidth: isNaN(+playWidth * minWidth) ? 0 : +playWidth * minWidth,
      bufferWidth: isNaN(bufferTimeValue * minWidth) ? 0 : bufferTimeValue * minWidth,
    });
  }, [playWidth, bufferTimeValue]);

  const changeHandle = (distance: number): void => {
    const value = Math.ceil(distance / (+(content.current as HTMLDivElement).offsetWidth) * 100);
    setSliderState({
      ...sliderState,
      ...{
        blockLeft: distance,
        playWidth: distance,
      }
    });
    onChange(value)
  };

  const sliderClick = (e: MouseEvent): void => {
    const distance = e.clientX - e.currentTarget.getBoundingClientRect().left - 6;
    changeHandle(distance)
  };

  const sliderDown = (e: DragEvent): void => {
    if (e.clientX) {
      let {style} = (control.current as HTMLDivElement);
      style.visibility = "visible";
      style.opacity = "1";
      const distance = e.clientX - (content.current as HTMLDivElement).getBoundingClientRect().left - 6;
      changeHandle(distance)
    }
  };

  return (
    <div className="slider-container">
      <div className="slider-content" onClick={sliderClick} ref={content}>
        <div className="white-slider"/>
        <div className="play-slider" ref={play} style={{width: sliderState.playWidth}}/>
        <div className="buffer-slider" ref={buffer} style={{width: sliderState.bufferWidth}}/>
        <div className="slider-block"
             style={{left: sliderState.blockLeft}}
             ref={block}
             draggable={true} onDrag={sliderDown}/>
      </div>
    </div>
  )
}

export default PlaySlider
