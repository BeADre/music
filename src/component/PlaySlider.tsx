import React, {MouseEvent, DragEvent, useRef, useEffect, useState, RefObject} from "react";
import "./slider.less";

type Props = {
  bufferTimeValue: number
  playWidth: string
  onChange: Function
  control: RefObject<HTMLDivElement>,
  isFullscreen: boolean,
  video: HTMLVideoElement | null
}

function PlaySlider(
  {
    bufferTimeValue,
    playWidth,
    onChange,
    control,
    isFullscreen,
    video
  }: Props
) {
  const [sliderState, setSliderState] = useState({
    blockLeft: 0,
    playWidth: 0,
    bufferWidth: 0
  });
  const [isTouch, setIsTouch] = useState(false);
  const block = useRef<HTMLDivElement>(null);
  const play = useRef<HTMLDivElement>(null);
  const buffer = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const distanceRef = useRef(0);
  const minWidth = content.current ? content.current.offsetWidth / 100 : 0;

  useEffect(() => {
    if(isTouch) return;
    setSliderState({
      blockLeft: isNaN(+playWidth * minWidth) ? 0 : +playWidth * minWidth,
      playWidth: isNaN(+playWidth * minWidth) ? 0 : +playWidth * minWidth,
      bufferWidth: isNaN(bufferTimeValue * minWidth) ? 0 : bufferTimeValue * minWidth,
    });
  }, [playWidth, bufferTimeValue, isTouch]);

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
    const {offsetWidth} = document.body;
    const distance = offsetWidth <= 768 && isFullscreen ?
      e.clientY - e.currentTarget.getBoundingClientRect().top - 6 :
      e.clientX - e.currentTarget.getBoundingClientRect().left - 6;
    changeHandle(distance)
  };

  const sliderDown = (event: DragEvent): void => {
    if (event.clientX) {
      let {style} = (control.current as HTMLDivElement);
      style.visibility = "visible";
      style.opacity = "1";
      const distance = event.clientX - (content.current as HTMLDivElement).getBoundingClientRect().left - 6;
      changeHandle(distance)
    }
  };

  const handleTouch = (event: any): void => {
    setIsTouch(true);
    (video as HTMLVideoElement).pause()
    const {clientX, clientY} = event.touches[0];
    const {left, width, height, top} = (content.current as HTMLDivElement).getBoundingClientRect()
    let distance = isFullscreen ? clientY - top - 6 : clientX - left - 6;
    if (distance < 0) {
      distance = 0;
    }
    if (isFullscreen && distance > height) {
      distance = height - 12;
    } else if (!isFullscreen && distance > width) {
      distance = width - 12;
    }
    distanceRef.current = distance;
    event.target.style.left = distance + "px";
    setSliderState({
      ...sliderState,
      ...{
        playWidth: distance,
      }
    });
  }
  const handleTouchEnd = (): void => {
    (video as HTMLVideoElement).play();
    changeHandle(distanceRef.current);
    setIsTouch(false)
  }
  return (
    <div className="slider-container">
      <div className="slider-content" onClick={sliderClick} ref={content}>
        <div className="white-slider"/>
        <div className="play-slider" ref={play} style={{width: sliderState.playWidth}}/>
        <div className="buffer-slider" ref={buffer} style={{width: sliderState.bufferWidth}}/>
        <div
          className="slider-block"
          style={{left: sliderState.blockLeft}}
          ref={block}
          draggable={true}
          onTouchMove={handleTouch}
          onTouchEnd={handleTouchEnd}
          onDrag={sliderDown}
        />
      </div>
    </div>
  )
}

export default PlaySlider
