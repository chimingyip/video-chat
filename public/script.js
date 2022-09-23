const socket = io("/");

const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
myVideo.muted = true;
navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
})
.then((stream) => {
    addVideoStream(myVideo, stream);
});

const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
       video.play();
       videoGrid.append(video);
    });
};