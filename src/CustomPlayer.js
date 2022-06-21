// import FastRewindIcon from "@mui/icons-material/FastRewind";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
// import FastForwardIcon from "@mui/icons-material/FastForward";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import PauseIcon from "@mui/icons-material/Pause";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import DoneIcon from "@mui/icons-material/Done";

import "./customPlayer.scss";
import { useEffect, useRef, useState } from "react";
import { useIdleTimer } from "react-idle-timer";

const CustomPlayer = () => {
  const ref = useRef(null);
  const [openPopover, setOpenPopover] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoTime, setVideoTime] = useState(0);
  const [currentVolume, setCurrentVolume] = useState(1);
  const [mute, setMute] = useState(false);
  const [playBackSpeed, setPlayBackSpeed] = useState(1);
  const [mouseIdle, setMouseIdle] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);

  const speedList = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
  const keys = {
    SPACE: 32,
    RIGHT_ARROW: 39,
    LEFT_ARROW: 37,
    UP_ARROW: 38,
    DOWN_ARROW: 40,
  };

  useEffect(() => {
    if (currentTime === videoTime) {
      ref.current.currentTime = 0;
      handlePlayer("pause");
    }
  }, [currentTime, videoTime]);

  const handlePopover = () => {
    setOpenPopover((prev) => !prev);
  };

  const handlePlayer = (control) => {
    if (control === "play") {
      ref.current.play();
      setPlaying(true);
      setVideoTime(ref.current.duration);
    } else if (control === "pause") {
      ref.current.pause();
      setPlaying(false);
    }
  };

  const handleMute = (control) => {
    if (control === "unmute") {
      ref.current.muted = false;
      setMute(false);
    } else if (control === "mute") {
      ref.current.muted = true;
      setMute(true);
    }
  };

  const handleTimerDrag = (event) => {
    ref.current.currentTime = event.target.value;
  };

  const handleVolume = (event) => {
    ref.current.volume = event.target.value / 100;
    if (ref.current.volume === 0) {
      handleMute("mute");
    } else if (ref.current.volume !== 0) {
      handleMute("unmute");
    }
    setCurrentVolume(ref.current.volume);
  };

  setInterval(function () {
    setCurrentTime(ref.current?.currentTime);
  }, 1000);

  const handlePlayBackSpeed = (value) => {
    ref.current.playbackRate = value;
    setPlayBackSpeed(value);
  };

  const handleKeyDownEvent = (event) => {
    switch (event.keyCode) {
      case keys.SPACE:
        if (playing) {
          handlePlayer("pause");
        } else {
          handlePlayer("play");
        }
        break;
      case keys.RIGHT_ARROW:
        ref.current.currentTime += 5;
        break;
      case keys.LEFT_ARROW:
        ref.current.currentTime -= 5;
        break;
      case keys.UP_ARROW:
        handleMute("unmute");
        if (ref.current.volume >= 0.9) {
          ref.current.volume = 1;
        } else {
          ref.current.volume += 0.1;
        }
        setCurrentVolume(ref.current.volume);
        break;
      case keys.DOWN_ARROW:
        if (ref.current.volume <= 0.1) {
          ref.current.volume = 0;
          handleMute("mute");
        } else {
          ref.current.volume -= 0.1;
        }
        setCurrentVolume(ref.current.volume);
        break;
      default:
        break;
    }
  };

  const handleOnIdle = () => {
    setMouseIdle(true);
  };

  const handleOnActive = () => {
    setMouseIdle(false);
  };

  const handleOnAction = () => {
    setMouseIdle(false);
  };

  useIdleTimer({
    timeout: 1500,
    onIdle: handleOnIdle,
    onActive: handleOnActive,
    onAction: handleOnAction,
  });

  const handleMouseClick = () => {
    if (playing) {
      handlePlayer("pause");
    } else {
      handlePlayer("play");
    }
  };

  const fullScreenMode = () => {
    setFullScreen(true);
    ref.current.requestFullscreen();
  };

  const closeFullScreen = () => {
    setFullScreen(true);
    ref.current.exitFullscreen();
  };

  return (
    <div className="video">
      <video
        src="https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4"
        ref={ref}
        className="video__player"
      ></video>
      <div
        className={`video__controls ${mouseIdle && "hide-control"}`}
        tabIndex={0}
        onKeyDown={handleKeyDownEvent}
      >
        <div className="title">My Video</div>
        <div className="secondary-control" onClick={handleMouseClick}>
          {/* <div className={`secondary-icon-wrapper `}>
            <FastRewindIcon className="icon secondary-icon" />
          </div> */}
          <div className={`secondary-icon-wrapper`}>
            {playing ? (
              <PauseIcon className="icon secondary-icon" />
            ) : (
              <PlayArrowIcon className="icon secondary-icon" />
            )}
          </div>
          {/* <div className="secondary-icon-wrapper">
            <FastForwardIcon className={`secondary-icon-wrapper`} />
          </div> */}
        </div>
        <div className="primary-control">
          <div className={`popover-wrapper ${openPopover && "show-popover"}`}>
            <h6>Playback Speed</h6>
            <hr />
            <div className="popover-content">
              {speedList.map((v) => {
                return (
                  <div
                    key={v}
                    className="speed-wrapper"
                    onClick={() => handlePlayBackSpeed(v)}
                  >
                    <div className="tick-icon-wrapper">
                      {v === playBackSpeed && (
                        <DoneIcon className="icon tick-icon" />
                      )}
                    </div>
                    <p value={v} className="speed-item">
                      {v}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="progress-wrapper">
            <input
              type="range"
              min={0}
              max={videoTime}
              value={currentTime}
              onChange={handleTimerDrag}
              className="time-slider"
            />
          </div>
          <div className="controls">
            <div className="left-controls">
              {playing ? (
                <PauseIcon
                  className="icon"
                  onClick={() => handlePlayer("pause")}
                />
              ) : (
                <PlayArrowIcon
                  className="icon"
                  onClick={() => handlePlayer("play")}
                />
              )}
              <div className="volume-control">
                {mute ? (
                  <VolumeOffIcon
                    className="icon"
                    onClick={() => handleMute("unmute")}
                  />
                ) : (
                  <VolumeUpIcon
                    className="icon"
                    onClick={() => handleMute("mute")}
                  />
                )}
                <input
                  type="range"
                  className="volume-slider"
                  min={0}
                  max={100}
                  value={currentVolume * 100}
                  onChange={handleVolume}
                />
              </div>
              <p>
                {`${Math.floor(currentTime / 60)} : ${Math.floor(
                  currentTime % 60
                ).toLocaleString(undefined, { minimumIntegerDigits: 2 })}`}{" "}
                /{" "}
                {`${Math.floor(videoTime / 60)} : ${Math.floor(
                  videoTime % 60
                ).toLocaleString(undefined, { minimumIntegerDigits: 2 })}`}{" "}
              </p>
            </div>
            <div className="right-controls">
              <div className="video-speed">
                <p onClick={handlePopover}>{playBackSpeed}x</p>
              </div>
              <FullscreenIcon className="icon" />
              {/* {fullScreen ? (
                <FullscreenExitIcon
                  className="icon"
                  onClick={closeFullScreen}
                />
              ) : (
                <FullscreenIcon className="icon" onClick={fullScreenMode} />
              )} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomPlayer;
