const socket = io('/', {
    transports: ['websocket', 'polling'],
    path: "./"
});

// const socket = io('/');

let myVideoStream;
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
myVideo.muted = true;

const peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '3000',
});

socket.emit("custom-event", 105, "Hi", { a: "a"});

navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
})
.then((stream) => {
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
});

const connectToNewUser = (userId, stream) => {
    const call = peer.call(userId, stream);
    const video = document.createElement('video');
    call.on('stream', (userVideoStream) => {
        addVideoStream(video, userVideoStream);
    });
};

peer.on('open', (id) => {
    console.log("id "+ id);
    console.log("room id "+ ROOM_ID);
    console.log("peer connection open");
    socket.emit('join-room', ROOM_ID, id);
});

const addVideoStream = (video, stream) => {
    console.log("video obj " + stream);
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
        video.play();
        videoGrid.append(video);
    });
};