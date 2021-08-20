const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenIcon = fullScreenBtn.querySelector("i");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");

let controlsTimeout = null;
let controlsMovementTimeout = null;
let volumeValue = 0.5;
video.volume = volumeValue;

const handlePlayClick = () => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};

const handleMuteClick = (e) => {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
  muteBtnIcon.classList = video.muted
    ? "fas fa-volume-mute"
    : "fas fa-volume-up";
  volumeRange.value = video.muted ? 0 : volumeValue;
};

const handleVolumeChange = (event) => {
  const {
    target: { value },
  } = event;
  if (video.muted) {
    video.muted = false;
    muteBtn.innerText = "Mute";
  }
  volumeValue = value;
  video.volume = value;
};

const formatTime = (seconds) =>
  new Date(seconds * 1000).toISOString().substr(14, 5);

const handleLoadedMetadata = () => {
  totalTime.innerText = formatTime(Math.floor(video.duration));
  timeline.max = Math.floor(video.duration);
};

const handleTimeUpdate = () => {
  currentTime.innerText = formatTime(Math.floor(video.currentTime));
  timeline.value = Math.floor(video.currentTime);
};

const hideControls = () => videoControls.classList.remove("showing");

const handleMouseMove = () => {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  if (controlsMovementTimeout) {
    clearTimeout(controlsMovementTimeout);
    controlsMovementTimeout = null;
  }
  videoControls.classList.add("showing");
  controlsMovementTimeout = setTimeout(hideControls, 3000);
};

const handleMouseLeave = () => {
  controlsTimeout = setTimeout(hideControls, 3000);
};

const handleKeydown = (event) => {
  const { code } = event;
  if (code === "Space") {
    handlePlayClick();
  } else if (code === "Enter") {
    handleFullscreen();
  } else if (code === "ArrowRight") {
    video.currentTime = video.currentTime + 3;
  } else if (code === "ArrowLeft") {
    video.currentTime = video.currentTime - 3;
  }

  try {
    if (code === "ArrowUp") {
      video.volume = video.volume + 0.1;
      volumeRange.value = video.volume;
    } else if (code === "ArrowDown") {
      video.volume = video.volume - 0.1;
      volumeRange.value = video.volume;
    }
  } catch {
    console.log("Can't Up/Down Volume.");
  }
};
const handleTimelineChange = (event) => {
  const {
    target: { value },
  } = event;
  video.currentTime = value;
};

const handleFullscreen = () => {
  const fullscreen = document.fullscreenElement;
  if (fullscreen) {
    document.exitFullscreen();
    fullScreenIcon.classList = "fas fa-expand";
  } else {
    videoContainer.requestFullscreen();
    fullScreenIcon.classList = "fas fa-compress";
  }
};

const handleEnded = () => {
  const { id } = videoContainer.dataset;
  fetch(`/api/videos/${id}/view`, { method: "POST" });
};

if (video.readyState == 4) {
  handleLoadedMetadata();
}

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMuteClick);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("click", handlePlayClick);
video.addEventListener("loadeddata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("ended", handleEnded);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
document.addEventListener("keydown", handleKeydown);
timeline.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handleFullscreen);
video.addEventListener("dblclick", handleFullscreen);
