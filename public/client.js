const socket = io('/');

let myVideoStream;
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
myVideo.muted = true;

const peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '3000',
});

peer.on('open', (id) => {
    console.log("id "+ id);
    console.log("room id "+ ROOM_ID);
    console.log("peer connection open");
    socket.emit('join-room', ROOM_ID, id);
});

var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

getUserMedia({
    audio: true,
    video: true,
}, (stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on('call', (call) => {
        call.answer(stream);
        const video = document.createElement('video');
        call.on('stream', (userVideoStream) => {
            addVideoStream(video, userVideoStream);
        });
    });

    socket.on('user-connected', (userId) => {
        console.log('another user connected');
        connectToNewUser(userId, stream);
    });
}, (err) => {
    console.log('Failed to get local stream', err);
});

const connectToNewUser = (userId, stream) => {
    const call = peer.call(userId, stream);
    const video = document.createElement('video');
    call.on('stream', (userVideoStream) => {
        addVideoStream(video, userVideoStream);
    });
};

const addVideoStream = (video, stream) => {
    console.log("video obj " + stream);
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
        video.play();
        videoGrid.append(video);
    });
};